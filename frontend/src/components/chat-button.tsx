'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface ChatButtonProps {
  postId: string;
  participantId: string;
  className?: string;
  buttonText?: string;
}

export default function ChatButton({
  postId,
  participantId,
  className = "w-full bg-white text-black border border-black py-3 rounded-lg hover:bg-gray-100 transition-colors",
  buttonText = "Message Seller"
}: ChatButtonProps) {
  const router = useRouter();
  const { user } = useUser();

  const handleChatClick = async () => {
    if (!user) {
      alert('Please sign in to start a chat');
      return;
    }

    try {
      const response = await fetch('/api/chat/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          participantId,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to initiate chat');
      }

      const data = await response.json();
      if (data.chatId) {
        router.push(`/chat/${data.chatId}`);
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className={className}
    >
      {buttonText}
    </button>
  );
} 