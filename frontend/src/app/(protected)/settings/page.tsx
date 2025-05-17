'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    upiId: '',
  });
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user data from our API
        const response = await fetch('/api/get-user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
        
        // Initialize form with current data
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          upiId: data.upiId || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({
          text: 'Failed to load user data. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [user, isLoaded]);

  // Check password strength
  useEffect(() => {
    if (passwordData.newPassword) {
      // Check password strength
      const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
      const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
      const hasNumber = /[0-9]/.test(passwordData.newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);
      const isLongEnough = passwordData.newPassword.length >= 8;
      
      const criteria = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough];
      const metCriteria = criteria.filter(Boolean).length;
      
      if (metCriteria <= 2) {
        setPasswordStrength('weak');
      } else if (metCriteria <= 4) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    } else {
      setPasswordStrength(null);
    }
    
    // Check if passwords match
    if (passwordData.confirmPassword && passwordData.newPassword) {
      setPasswordsMatch(passwordData.newPassword === passwordData.confirmPassword);
    } else {
      setPasswordsMatch(true); // Reset when fields are empty
    }
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      // Update in Clerk
      if (user) {
        await user.update({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }
      
      // Update in our database
      const response = await fetch('/api/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          upiId: formData.upiId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      
      const updatedData = await response.json();
      setUserData(updatedData.data);
      
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        text: 'New passwords do not match.',
        type: 'error'
      });
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      // Update password in Clerk
          if (user) {
        // Direct password update without attempting first factor
        await user.updatePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        setMessage({
          text: 'Password updated successfully!',
          type: 'success'
        });
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      // Check if the error is related to verification requirements
      if (error.message && error.message.includes('additional verification')) {
        setMessage({
          text: 'Additional verification required. Please use the "Forgot password" flow or contact support.',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Failed to update password. Please check your current password and try again.',
          type: 'error'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Get border color based on password strength
  const getPasswordBorderColor = () => {
    if (!passwordStrength) return 'border-gray-300';
    
    switch (passwordStrength) {
      case 'weak':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'strong':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  // Get border color for confirm password
  const getConfirmPasswordBorderColor = () => {
    if (!passwordData.confirmPassword) return 'border-gray-300';
    return passwordsMatch ? 'border-green-500' : 'border-red-500';
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="username@upi"
              />
              <p className="text-sm text-gray-500 mt-1">Used for receiving payments</p>
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        {/* Password Change Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10 transition-colors ${getPasswordBorderColor()}`}
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordStrength && (
                <div className="flex items-center mt-1 space-x-1">
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <span className="text-xs text-gray-500 ml-1">
                    {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10 transition-colors ${getConfirmPasswordBorderColor()}`}
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!passwordsMatch && passwordData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={saving || !passwordsMatch}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}