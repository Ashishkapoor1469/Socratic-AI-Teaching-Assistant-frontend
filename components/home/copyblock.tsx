import { Copy, Check } from "lucide-react"
import { useState } from "react"

 export const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false)

  const codeText = String(children).replace(/\n$/, "")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (inline) {
    return (
      <code className="rounded bg-muted px-1 py-0.5">
        {children}
      </code>
    )
  }

  return (
    <div className="relative group">

      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white p-1 rounded"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>

      <pre className="overflow-x-auto rounded-lg bg-black p-3 text-white">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}