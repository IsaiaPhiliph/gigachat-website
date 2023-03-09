"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateConversationButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateConversation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const json = await response.json();
      router.refresh();
      router.push(`/conversations/${json.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creando conversación");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleCreateConversation}
      className="flex gap-2 items-center px-4 py-2 hover:bg-blue-300 dark:hover:bg-gray-800"
      disabled={loading}
    >
      <span className="whitespace-nowrap ">Crear conversación</span>
      {loading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
          >
            <path
              stroke-dasharray="60"
              stroke-dashoffset="60"
              stroke-opacity=".3"
              d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="1.3s"
                values="60;0"
              />
            </path>
            <path
              stroke-dasharray="15"
              stroke-dashoffset="15"
              d="M12 3C16.9706 3 21 7.02944 21 12"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.3s"
                values="15;0"
              />
              <animateTransform
                attributeName="transform"
                dur="1.5s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4Zm1 5q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
          />
        </svg>
      )}
    </button>
  );
}
