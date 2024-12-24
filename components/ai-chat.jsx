"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AIChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const chatContainerRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ]

    setMessages(newMessages)
    setInput("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await response.json()
      setMessages([...newMessages, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>AI Chat Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={chatContainerRef}
          className="space-y-4 max-h-64 overflow-y-auto p-2 border rounded-md"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)} />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
