import Image from "next/image";
import Link from "next/link";
import {ExternalLink} from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">

      <div className="flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.4} stroke="currentColor" className="size-24 mb-8 animate-pulse">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
        </svg>

        <h1 className="z-20 relative text-2xl font-bold">Coming Soon™</h1>
        <p className="z-20 relative mt-4">In the meantime, you can visit my
          <a href="https://eliahilse.com" className="inline-flex items-center justify-center cursor-pointer">
            <span className="underline ml-1 mr-1">old website</span>
            <ExternalLink className="w-5 h-5"/>.
          </a>
        </p>
      </div>


    </main>
  );
}
