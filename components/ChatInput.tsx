"use client";

import { useRef, useState } from "react";

export default function ChatInput(props: {
  onSubmit: (message: string) => void;
  disabled: boolean;
}) {
  const [message, setMessage] = useState("");
  const textArea = useRef<HTMLTextAreaElement>(null);
  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!props.disabled) {
          setMessage("");
          if (textArea.current) {
            textArea.current.style.height = "0px";
          }
          props.onSubmit(message);
        }
      }}
      className="bg-blue-400 dark:bg-gray-700 shadow-md p-4 flex gap-4 rounded-lg"
    >
      <textarea
        value={message}
        ref={textArea}
        onChange={(e) => {
          e.target.style.height = "0px";
          e.target.style.height = e.target.scrollHeight + "px";
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            if (e.shiftKey) {
              return;
            }
            e.preventDefault();
            form.current?.requestSubmit();
          }
        }}
        placeholder="Dile algo a Gigachat"
        className="flex-1 resize-none min-h-[56px] px-2 py-1 bg-blue-100 dark:bg-gray-600 rounded-sm focus-visible:outline-none focus-visible:ring-2 dark:ring-gray-400 ring-blue-900"
      ></textarea>
      <button
        className="py-2 px-4 bg-white dark:ring-gray-400 dark:bg-gray-600 rounded-sm focus:ring-0 focus-visible:outline-none focus-visible:ring-2 ring-blue-900"
        disabled={props.disabled}
        type="submit"
      >
        Enviar
      </button>
    </form>
  );
}
