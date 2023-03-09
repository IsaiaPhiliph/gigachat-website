import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.canUseChat) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  const json = await request.json();
  const response = await prisma?.chatMessage.createMany({
    data: json.messages?.map((msg: any) => ({
      content: msg.content,
      role: msg.role,
      conversationId: json.conversationId,
      userId: session.user.id,
    })),
  });
  return new Response(JSON.stringify(response));
}
