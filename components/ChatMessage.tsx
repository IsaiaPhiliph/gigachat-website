import { useSession } from "next-auth/react";
import Image from "next/image";
import type { ChatCompletionRequestMessageRoleEnum } from "openai/dist/api";

export default function ChatMessage(props: {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
}) {
  const { data: session } = useSession();
  function getContentArray(content: string) {
    let firstText = false;
    const result = content.split("\n").filter((line) => {
      if (!line && !firstText) {
        return false;
      } else {
        firstText = true;
        return true;
      }
    });
    return result;
  }
  return (
    <div className="flex gap-4 items-start bg-blue-100 dark:bg-gray-600 p-2 rounded-md">
      {props.role === "assistant" ? (
        <Image
          src="/robot.png"
          alt="imagen del asistente"
          width={40}
          height={40}
        />
      ) : (
        <Image
          src={session?.user?.image || "/user.png"}
          alt="imagen del usuario"
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        {getContentArray(props.content).map((line, index) => {
          return line ? <span key={index}>{line}</span> : <br />;
        })}
      </div>
    </div>
  );
}
