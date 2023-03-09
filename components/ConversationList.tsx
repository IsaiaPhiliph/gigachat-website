"use client";

import type { Conversation } from "@prisma/client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import CreateConversationButton from "./CreateConversationButton";

export default function ConversationList(props: {
  conversations: Conversation[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col py-2 bg-blue-400 dark:bg-gray-900">
      <CreateConversationButton />
      {props.conversations.map((conversation) => (
        <Link
          href={`/conversations/${conversation.id}`}
          className={`whitespace-nowrap hover:bg-blue-300 ${
            pathname?.split("/").includes(conversation.id)
              ? "bg-blue-300 dark:bg-gray-800"
              : ""
          } dark:hover:bg-gray-800 px-4 py-2 text-ellipsis overflow-hidden`}
          key={conversation.id}
        >
          {conversation.name}
        </Link>
      ))}
    </div>
  );
}
