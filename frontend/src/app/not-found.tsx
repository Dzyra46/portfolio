import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-[8rem] font-bold leading-none bg-gradient-to-b from-slate-600 to-slate-800 bg-clip-text text-transparent select-none">
          404
        </h1>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>
      <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
        Page Not Found
      </h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </main>
  );
}
