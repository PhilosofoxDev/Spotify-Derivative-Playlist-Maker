import Image from "next/image";
import { LoginButton } from "./loginButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-2 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-6 px-5 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">Next.js</span> App
        </h1>
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={16}
          height={16}
        />
        Deploy Now
        <a
          className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <LoginButton />
      </main >
    </div >
  );
}
