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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-6 mb-4 overflow-y-auto max-h-[80vh]">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-sm text-gray-500 mb-2">{date}</div>
            {msgs.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`mb-1 max-w-[70%] p-2 rounded-lg text-sm ${
                    isMe
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black mr-auto"
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-[10px] text-right opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
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
        className="flex-1 border p-2 rounded resize-none"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
    </div>
  );
}