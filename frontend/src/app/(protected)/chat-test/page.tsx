"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatTestPage() {
  const [postId, setPostId] = useState("");
  const router = useRouter();

  async function handleStart() {
    const res = await fetch("/api/chat/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
    "postId" : "884c1816-f1be-4272-91bb-f4a93278a18c" , 
    "participantId" : "user_2xBLWgsnhtDsHo7q1VS4oJyBLRJ" // replace with real current user id
      }),
    });

    const data = await res.json();
    console.log("initiate response →", data);

    if (res.ok) {
      alert(`Chat created/found! id = ${data.chatId}`);
      router.push(`/chat/${data.chatId}`); // optional redirect
    } else {
      alert(`Error: ${data.error || res.statusText}`);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Chat Initiate Tester</h1>

      <input
        className="border rounded w-full p-2"
        value={postId}
        onChange={e => setPostId(e.target.value)}
        placeholder="enter postId"
      />

      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start / Get Chat
      </button>
    </main>
  );
}