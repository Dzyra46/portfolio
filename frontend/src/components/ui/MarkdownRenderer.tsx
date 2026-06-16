import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-purple max-w-none 
                    prose-h2:text-4xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-10 prose-h3:mb-4
                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-li:text-slate-300 prose-li:text-lg
                    prose-ul:list-none prose-ul:pl-0
                    [&>ul>li]:relative [&>ul>li]:pl-8
                    [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-3 [&>ul>li::before]:w-3 [&>ul>li::before]:h-3 [&>ul>li::before]:bg-purple-500 [&>ul>li::before]:rounded-full
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:my-8 prose-pre:p-4"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
