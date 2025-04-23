import Image from 'next/image';
import bg from '../../../public/bg.png';
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Image
        src={bg}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white p-6 rounded-md shadow-md">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
