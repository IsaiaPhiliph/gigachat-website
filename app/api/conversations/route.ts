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
  const response = await prisma?.conversation.create({
    data: {
      userId: session.user.id,
      name: json.name,
    },
  });
  return new Response(JSON.stringify(response));
}
