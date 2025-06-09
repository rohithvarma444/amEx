"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Pusher from "pusher-js";
import axios from "axios";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toDateString(); // e.g. "Mon May 20 2025"
}

export default function ChatPage() {
  const { user } = useUser();
  const rawChatId = useParams().chatId;
  const chatId = Array.isArray(rawChatId) ? rawChatId[0] : rawChatId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load messages
  useEffect(() => {
    async function loadMessages() {
      const res = await axios.get(`/api/chat/${chatId}/messages`);
      setMessages(res.data);
    }
    loadMessages();
  }, [chatId]);

  // Pusher setup
  useEffect(() => {
  if (!user || !chatId) return;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: "ap2",
  });

  const channel = pusher.subscribe(`chat-${chatId}`);

  channel.bind("new-message", (message: Message) => {
    setMessages((prev) => {
    const exists = prev.some((msg) => msg.id === message.id);
    return exists ? prev : [...prev, message];
    });
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  };
}, [chatId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await axios.post("/api/chat/send", {
      chatId,
      content: input,
    });
    
    setInput("");
  };

  // Group messages by date
  const groupedMessages = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    const date = formatDate(msg.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="animate-fadeIn">
                <div className="sticky top-0 z-10 bg-gray-50 py-2">
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 text-sm font-medium text-gray-600 bg-white rounded-full shadow-sm">
                      {date}
                    </span>
                  </div>
                </div>
                {msgs.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className={`text-[10px] mt-1 ${isMe ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px] max-h-[120px]"
                style={{
                  height: 'auto',
                  overflow: 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-[44px] flex items-center"
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}