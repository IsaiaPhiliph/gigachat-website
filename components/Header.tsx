"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState<Boolean>();

  useEffect(() => {
    setDark(Boolean(localStorage.getItem("darkMode")));
  }, []);

  useEffect(() => {
    if (dark) {
      document.querySelector("html")!.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else if (dark === false) {
      document.querySelector("html")!.classList.remove("dark");
      localStorage.setItem("darkMode", "");
    }
  }, [dark]);

  return (
    <header className="bg-blue-500 flex items-center justify-center">
      <Link href="/">
        <h1 className="text-center  text-3xl leading-normal py-2 text-blue-100">
          Gigachat
        </h1>
      </Link>
      <div className="absolute right-4">
        {dark ? (
          <button
            onClick={() => {
              setDark(false);
            }}
            className="flex gap-2 items-center px-4 py-1 rounded-sm bg-blue-100 dark:bg-gray-700"
          >
            <span>Light</span>
            <Image
              src="/light.svg"
              alt="icono modo oscuro"
              width={24}
              height={24}
            />
          </button>
        ) : (
          <button
            onClick={() => {
              setDark(true);
            }}
            className="flex gap-2 items-center px-4 py-1 rounded-sm bg-blue-100 dark:bg-gray-700"
          >
            <span>Dark</span>
            <Image
              src="/dark.svg"
              alt="icono modo oscuro"
              width={24}
              height={24}
            />
          </button>
        )}
      </div>
    </header>
  );
}
