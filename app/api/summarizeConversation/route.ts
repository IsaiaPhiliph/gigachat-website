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

  //Resume esta conversación muy brevemente, en 2 o 3 palabras como mucho

  const openai_key = process.env.OPENAI_KEY;

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        ...json.messages,
        {
          role: "user",
          content:
            "Resume esta conversación muy brevemente, en 2 o 3 palabras como mucho",
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${openai_key}`,
      "Content-Type": "application/json",
    },
  });

  const completionResponse = await completion.json();
  const name = completionResponse.choices[0].message.content;

  const response = await prisma?.conversation.update({
    where: {
      id: json.conversationId,
    },
    data: {
      name,
    },
  });
  return new Response(JSON.stringify(response));
}
