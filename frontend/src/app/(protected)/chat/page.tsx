'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface Post {
  id: string;
  title: string;
  price?: number;
  coverImage?: string;
}

interface Chat {
  id: string;
  postId: string;
  ownerId: string;
  participantId: string;
  updatedAt: string;
  post: Post;
  owner: User;
  participant: User;
  messages: Message[];
}

export default function ChatListPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'selling' | 'buying'>('buying');

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch chats');
        }
        
        setChats(data.chats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // Group chats by post for selling view
  const groupedChats = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    if (chat.ownerId === user?.id) { // Only group selling chats
      if (!acc[chat.postId]) {
        acc[chat.postId] = [];
      }
      acc[chat.postId].push(chat);
    }
    return acc;
  }, {});

  const buyingChats = chats.filter(chat => chat.participantId === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Chats</h1>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${view === 'buying' ? 'text-gray-600' : 'text-gray-400'}`}>Buying</span>
          <button
            onClick={() => setView(view === 'buying' ? 'selling' : 'buying')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                view === 'selling' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${view === 'selling' ? 'text-gray-600' : 'text-gray-400'}`}>Selling</span>
        </div>
      </div>

      {view === 'selling' ? (
        // Selling view - grouped by product
        <div className="space-y-6">
          {Object.entries(groupedChats).map(([postId, postChats]) => {
            const firstChat = postChats[0];
            return (
              <div key={postId} className="bg-white rounded-lg shadow">
                {/* Product Header */}
                <div className="p-4 border-b">
                  <div className="flex items-start gap-4">
                    {firstChat.post.coverImage && (
                      <img 
                        src={firstChat.post.coverImage} 
                        alt={firstChat.post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg">{firstChat.post.title}</h2>
                      {firstChat.post.price && (
                        <p className="text-gray-600">${firstChat.post.price}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Chats for this product */}
                <div className="divide-y">
                  {postChats.map((chat) => {
                    const otherUser = chat.participant;
                    const lastMessage = chat.messages[0];
                    return (
                      <Link 
                        href={`/chat/${chat.id}`}
                        key={chat.id}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-600">
                              Chat with {otherUser.firstName} {otherUser.lastName}
                            </p>
                            {lastMessage && (
                              <p className="text-gray-500 mt-1 text-sm">
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {Object.keys(groupedChats).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No selling chats yet.
            </div>
          )}
        </div>
      ) : (
        // Buying view - current layout
        <div className="space-y-4">
          {buyingChats.map((chat) => {
            const otherUser = chat.owner;
            const lastMessage = chat.messages[0];

            return (
              <Link 
                href={`/chat/${chat.id}`}
                key={chat.id}
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-lg">
                        {chat.post.title}
                      </h2>
                      <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                        Buying
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      Chat with {otherUser.firstName} {otherUser.lastName}
                    </p>
                    {lastMessage && (
                      <p className="text-gray-500 mt-2 text-sm">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </Link>
            );
          })}
          {buyingChats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No buying chats yet. Start a conversation by showing interest in a post!
            </div>
          )}
        </div>
      )}
    </div>
  );
} 