"use client";

import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ChatCompletionRequestMessage } from "openai";
import { useEffect, useState } from "react";
import GPT3Tokenizer from "gpt3-tokenizer";
import { useSession } from "next-auth/react";
import type { ChatMessage as Message } from "@prisma/client";
import { useRouter } from "next/navigation";

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });

export default function Chat({
  initialMessages,
  conversationId,
}: {
  initialMessages: Message[];
  conversationId: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>(
    initialMessages.map((msg) => ({ content: msg.content, role: msg.role }))
  );
  const [totalTokens, setTotalTokens] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const encoded = tokenizer.encode(
      messages.map((msg) => `${msg.role}-${msg.content}`).join("")
    );
    setTotalTokens(encoded.text.length);
  }, [messages]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [receivingMessage, setReceivingMessage] = useState(false);

  const onMessageSubmit = async (message: string) => {
    const newMessage = { role: "user", content: message } as const;
    setMessages((prev) => [...prev, newMessage]);
    let responseContent = "";
    await fetchEventSource("/api/completions", {
      method: "POST",
      body: JSON.stringify([...messages, newMessage]),
      onopen: async function (res) {
        console.log("Connection to sse open");
        setReceivingMessage(true);
      },

      onmessage: function (ev) {
        const { data } = ev;

        if (data === "[DONE]") {
          console.log("done");
          return;
        }
        const json = JSON.parse(data);
        console.log(json);
        responseContent += json.choices[0].delta.content || "";
        setCurrentMessage(responseContent);
      },

      onclose: async function () {
        console.log("Connection closed");
        setReceivingMessage(false);
        if (responseContent) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: responseContent },
          ]);
          const response = await fetch("/api/chatMessages", {
            method: "POST",
            body: JSON.stringify({
              messages: [
                newMessage,
                { role: "assistant", content: responseContent },
              ],
              conversationId,
            }),
          });
          if (messages.length === 0) {
            await fetch("/api/summarizeConversation", {
              method: "POST",
              body: JSON.stringify({
                messages: [
                  newMessage,
                  { role: "assistant", content: responseContent },
                ],
                conversationId,
              }),
            });
            router.refresh();
          }
        }
        if (!responseContent) {
          alert(
            "Error, no se ha obtenido respuesta, es posible que no estés autorizado"
          );
        }
      },
    });
  };
  return (
    <div className={`container mx-auto p-4`}>
      {session?.user && (
        <div className="flex flex-col gap-4">
          {messages.length > 0 && (
            <div className="bg-blue-300 dark:bg-gray-700 shadow-md rounded-lg p-4 flex flex-col gap-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {receivingMessage && (
                <ChatMessage role="assistant" content={currentMessage} />
              )}
              <span className="bg-blue-100 dark:bg-gray-600 px-4 rounded-sm self-center">
                Tokens: {totalTokens}/4096
              </span>
            </div>
          )}
          <ChatInput disabled={receivingMessage} onSubmit={onMessageSubmit} />
        </div>
      )}
    </div>
  );
}
