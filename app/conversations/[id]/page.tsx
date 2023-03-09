import Chat from "@/components/Chat";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    redirect("/");
  }
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: params.id, userId: session.user.id },
  });

  return (
    <main className="w-full">
      <Chat initialMessages={messages || []} conversationId={params.id} />
    </main>
  );
}
