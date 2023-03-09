"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className={`container mx-auto p-4`}>
      <div className="mt-4">
        {session ? (
          <>
            Sesión iniciada como <b>{session.user?.email}</b> ✅ <br />
            Chat permitido? {session.user.canUseChat ? "✅" : "❌"} <br />
            <button
              className="text-blue-700 dark:text-blue-400 font-bold"
              onClick={() => signOut()}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            Sesión no iniciada <br />
            <button
              className="text-blue-700 dark:text-blue-400 font-bold"
              onClick={() => signIn()}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </main>
  );
}
