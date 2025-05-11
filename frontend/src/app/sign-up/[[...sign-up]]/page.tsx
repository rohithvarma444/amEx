"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bg from "../../../../public/bg.png"

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Debug Clerk loading state
  useEffect(() => {
    console.log("🔍 Clerk loaded state:", isLoaded);
    console.log("🔍 SignUp object exists:", !!signUp);
  }, [isLoaded, signUp]);

  // Set up timer for code resend
  useEffect(() => {
    if (step !== 3) return;
    
    console.log("⏱️ Starting verification code timer");
    setTimeLeft(30);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [step]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("📩 Checking email:", email);
    
    if (!email.endsWith("@am.students.amrita.edu")) {
      toast("👋 We're happy to see you here! Currently, this portal is available for Amrita Amritapuri campus students only. Stay tuned!", {
        icon: '📍',
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: '#333',
        },
      });
      return;
    }
    
    setStep(2);
    console.log("✅ Email valid, proceeding to details step");
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Submitting signup details...");

    if (!isLoaded) {
      console.error("❗ Clerk not loaded yet. Cannot proceed with signup.");
      toast.error("Authentication service not loaded. Please try again.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("❌ Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    setIsSubmitting(true);

    try {
      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ") || "Amrita";

      console.log("📧 Creating account with:", email);
      console.log("👤 Name parts:", { firstName, lastName });

      // Create the user account
      const createResponse = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      console.log("✅ Account creation response:", createResponse);

      // Extra check before preparing email verification
      if (
        signUp?.emailAddress === email &&
        signUp?.status === "missing_requirements"
      ) {
        console.warn("⚠️ Sign-up missing requirements, verification might fail.");
      }

      // Prepare email verification
      console.log("📤 Preparing email verification...");
      const verificationResponse = await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });

      console.log("📨 Email verification preparation response:", verificationResponse);

      // Check if the verification status indicates successful email sending
      if (
        verificationResponse?.verifications?.emailAddress?.status === "unverified" &&
        verificationResponse?.verifications?.emailAddress?.nextAction === "needs_attempt"
      ) {
        toast.success("Verification code sent to your email!");
        setStep(3);
      } else {
        toast.error("Unexpected verification response. Please try again.");
        console.error("❌ Verification preparation unexpected:", verificationResponse);
      }
    } catch (err) {
      console.error("🚨 Error during sign-up:", err);
      
      // More detailed error logging
      if (err.errors) {
        err.errors.forEach(error => {
          console.error(`Error code: ${error.code}, message: ${error.message}`);
          toast.error(error.message || "Sign-up failed.");
        });
      } else {
        toast.error(err.message || "Sign-up failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Submitting verification code...");
    
    if (!isLoaded || !signUp) {
      console.error("❗ Clerk not loaded yet or signup not initialized");
      toast.error("Authentication service not loaded. Please try again.");
      return;
    }
    
    const code = verificationCode.join("");
    console.log("📝 Verification code entered:", code);
    
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("🔍 Attempting to verify email with code:", code);
      const response = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      console.log("✅ Verification response:", response);
      
      if (response.status !== "complete") {
        console.error("⚠️ Verification not complete:", response.status);
        toast.error("Verification failed. Please check the code and try again.");
        return;
      }
      
      console.log("🎉 Email verified successfully!");
      
      if (response.createdSessionId) {
        console.log("🔐 Setting active session with ID:", response.createdSessionId);
        
        // Set the user's session as active
        await setActive({ session: response.createdSessionId });
        console.log("✅ User session activated");
        toast.success("Account created successfully!");
        router.push("/sync-user");
      } else {
        console.error("❌ No session ID in verification response");
        toast.error("Account created but unable to sign in automatically. Please log in.");
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("🚨 Error during verification:", err);
      
      if (err.errors) {
        err.errors.forEach(error => {
          console.error(`Error code: ${error.code}, message: ${error.message}`);
          toast.error(error.message || "Verification failed.");
        });
      } else {
        toast.error(err.message || "Verification failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    console.log(`Code digit ${index} set to: ${value}`);
    
    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
    
    // Auto-submit if all digits are filled
    if (value && index === 5 && newCode.every(digit => digit.length === 1)) {
      setTimeout(() => {
        document.getElementById("verification-submit-button").click();
      }, 500);
    }
  };

  const handleResendCode = async () => {
    console.log("📤 Requesting new verification code...");
    
    if (!isLoaded || !signUp) {
      console.error("❗ Clerk not loaded or signup not initialized");
      toast.error("Authentication service not loaded. Please try again.");
      return;
    }
    
    try {
      const response = await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      console.log("📨 New verification code sent, response:", response);
      
      toast.success("New verification code sent to your email!");
      setTimeLeft(30); // Reset timer
    } catch (err) {
      console.error("🚨 Error resending verification code:", err);
      
      if (err.errors) {
        err.errors.forEach(error => {
          console.error(`Error code: ${error.code}, message: ${error.message}`);
        });
      }
      
      toast.error("Failed to resend verification code. Please try again.");
    }
  };

  const renderTimer = () => {
    if (timeLeft > 0) {
      return <span>({timeLeft}s)</span>;
    }
    return (
      <button 
        type="button" 
        className="text-black font-medium underline" 
        onClick={handleResendCode}
      >
        Resend code
      </button>
    );
  };

  // Debug current state
  useEffect(() => {
    console.log("Current step:", step);
    console.log("Current email:", email);
  }, [step, email]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="relative w-full h-full">
          <Image 
            src={bg} 
            alt="Amrita University Campus" 
            layout="fill" 
            objectFit="cover"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-500 mb-6">Enter your Amrita student email to sign up</p>
            
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="rollnumber@am.students.amrita.edu"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <button 
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium"
              >
                Continue
              </button>
            </form>
            
            <div className="mt-6 text-gray-600">
              Already have an account? <a href="/sign-in" className="text-gray-600 hover:text-gray-800 font-medium">Log in</a>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 flex justify-center items-center">
              Secured by 
              <span className="ml-2 flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="currentColor" />
              <path d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" />
              </svg>
                clerk
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Almost there!</h1>
            <p className="text-gray-500 mb-6">Just need a few more details</p>
            
            <form onSubmit={handleDetailsSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <button 
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            
            <div className="mt-6 text-sm text-gray-600">
              By clicking Sign Up, you agree to our <a href="#" className="font-medium">Terms of Use</a> and
              <br /><a href="#" className="font-medium">Privacy Policy</a>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 flex justify-center items-center">
              Secured by 
              <span className="ml-2 flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#000000"/>
                </svg>
                clerk
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Verify your email</h1>
            <p className="text-gray-500 mb-6">
              Enter the verification code sent to your email ID
              <br />
              <span className="font-medium text-black">{email}</span>
              <svg className="inline-block ml-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </p>
            
            <form onSubmit={handleVerificationSubmit}>
              <div className="flex justify-between mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg"
                    value={verificationCode[index]}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
              
              <div className="mb-6 text-sm text-gray-500">
                Didn't receive a code? {renderTimer()}
              </div>
              
              <button 
                id="verification-submit-button"
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Continue"}
              </button>
            </form>
            
            <div className="mt-6 text-sm text-gray-500 flex justify-center items-center">
              Secured by 
              <span className="ml-2 flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#000000"/>
                </svg>
                clerk
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}