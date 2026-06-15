export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
        </div>
        <p className="text-sm text-slate-400 animate-pulse">Loading...</p>
      </div>
    </main>
  );
}
