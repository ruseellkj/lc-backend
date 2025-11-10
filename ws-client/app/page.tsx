"use client";
import { submitProblem } from "@/lib/actions/route";
import { useEffect, useState } from "react";

export default function Home() {
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('Connection established');
    }

    newSocket.onmessage = (message) => {
      setLatestMessage(message.data.toString()) // server will send
      console.log('Message received:', message.data);
    }
    return () => newSocket.close();
  }, [])

  const handleSubmit = async () => {
    await submitProblem()
  };

  if (!latestMessage) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Problem Result from Leetcode</h1>
      <div className="p-4 border rounded">
        <strong>Leetcode Result:</strong> {latestMessage}
      </div>

      <div className="flex gap-20 border rounded p-2 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="border rounded p-2">Problem ID: 1</div>
          <div className="border rounded p-2">User ID: 1</div>
          <div className="border rounded p-2">Code:asd</div>
          <div className="border rounded p-2">Language: cpp</div>
        </div>
        <div className="flex items-center justify-center">
          <strong>LC</strong>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
      >
        Submit Problem
      </button>
    </div>
  );
}
