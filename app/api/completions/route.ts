import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  console.log(session?.user);
  if (!session?.user || !session.user.canUseChat) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  return new Response(JSON.stringify({ hola: "Hola!" }));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.canUseChat) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }

  const json = await request.json();
  console.log(json);

  const openai_key = process.env.OPENAI_KEY;
  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: json,
      stream: true,
    }),
    headers: {
      Authorization: `Bearer ${openai_key}`,
      "Content-Type": "application/json",
    },
  });

  return new Response(completion.body, {
    headers: {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}
