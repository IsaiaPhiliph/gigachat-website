import AuthProvider from "@/components/AuthProvider";
import ConversationList from "@/components/ConversationList";
import Header from "@/components/Header";
import { roboto } from "@/lib/fonts";
import prisma from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Conversation } from "@prisma/client";
import { getServerSession } from "next-auth";
import "./globals.css";

export const metadata = {
  title: "Gigachat",
  description: "Gigachat, el mejor chat",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user.id;
  const chatAvailable = !!session?.user.canUseChat;
  let conversations: Conversation[] = [];
  if (isLoggedIn) {
    conversations = await prisma.conversation.findMany({
      where: { userId: { equals: session?.user.id } },
    });
  }

  return (
    <html lang="es">
      <AuthProvider>
        <body
          className={`bg-gray-50 flex flex-col min-h-screen dark:bg-gray-800 transition-colors ${roboto.className}`}
        >
          <Header />
          <div className="flex flex-1">
            {isLoggedIn && chatAvailable && (
              <ConversationList conversations={conversations} />
            )}
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
