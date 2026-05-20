'use client'

import { useEffect, useRef } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Simple markdown-to-HTML conversion
    // In production, you'd want to use a proper markdown library like 'marked' or 'react-markdown'
    const htmlContent = convertMarkdownToHtml(content)
    contentRef.current.innerHTML = htmlContent
  }, [content])

  return (
    <div 
      ref={contentRef}
      className="markdown-content prose prose-lg dark:prose-invert max-w-none
        prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-a:text-emerald-600 dark:prose-a:text-emerald-400
        prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-code:text-emerald-600 dark:prose-code:text-emerald-400
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800
        prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
        prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
        prose-blockquote:border-l-emerald-500 dark:prose-blockquote:border-l-emerald-400
        prose-li:text-gray-700 dark:prose-li:text-gray-300"
    />
  )
}

// Simple markdown-to-HTML converter
// Note: This is a basic implementation. For production use, consider using:
// - react-markdown with remark/rehype plugins
// - marked with DOMPurify for security
// - @next/mdx for MDX support
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')

  // Bold and Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text'
    return `<pre class="language-${language}"><code>${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Line breaks and paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  
  // Wrap in paragraph tags if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<pre')) {
    html = '<p>' + html + '</p>'
  }

  // Lists
  html = html.replace(/^\* (.+$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
  
  html = html.replace(/^\d+\. (.+$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>')

  // Blockquotes
  html = html.replace(/^> (.+$)/gm, '<blockquote>$1</blockquote>')

  return html
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
