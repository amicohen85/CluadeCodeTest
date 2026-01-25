import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidDiagram, WireframeDisplay, CodeBlock } from './DiagramRenderer';

// Extract and identify diagram types
function extractDiagramType(code) {
  const firstLine = code.trim().split('\n')[0].toLowerCase();

  if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'תרשים זרימה';
  if (firstLine.includes('sequencediagram') || firstLine.includes('sequence')) return 'תרשים רצף';
  if (firstLine.includes('erdiagram') || firstLine.includes('er')) return 'תרשים ERD';
  if (firstLine.includes('gantt')) return 'תרשים גאנט';
  if (firstLine.includes('classDiagram') || firstLine.includes('class')) return 'תרשים מחלקות';
  if (firstLine.includes('c4')) return 'תרשים C4';
  if (firstLine.includes('pie')) return 'תרשים עוגה';
  if (firstLine.includes('journey')) return 'מסע משתמש';

  return 'תרשים';
}

// Check if content looks like a wireframe
function isWireframe(code) {
  return code.includes('+--') || code.includes('|  ') || code.includes('[') && code.includes(']') && code.includes('|');
}

// Custom code block renderer
function CodeRenderer({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  // Handle Mermaid diagrams
  if (language === 'mermaid') {
    const diagramType = extractDiagramType(code);
    return <MermaidDiagram chart={code} title={diagramType} />;
  }

  // Handle wireframes
  if (!language && isWireframe(code)) {
    return <WireframeDisplay wireframe={code} />;
  }

  // Handle SQL, YAML, JSON, etc.
  if (language) {
    return <CodeBlock code={code} language={language} />;
  }

  // Default code block
  return (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-auto">
      <code className="text-sm font-mono text-gray-800" {...props}>
        {children}
      </code>
    </pre>
  );
}

// Custom table renderer
function TableRenderer({ children }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  );
}

function TheadRenderer({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

function TbodyRenderer({ children }) {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
}

function TrRenderer({ children }) {
  return <tr className="hover:bg-gray-50 transition-colors">{children}</tr>;
}

function ThRenderer({ children }) {
  return (
    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );
}

function TdRenderer({ children }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
      {children}
    </td>
  );
}

// Custom heading renderers
function H1Renderer({ children }) {
  return (
    <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">
      {children}
    </h1>
  );
}

function H2Renderer({ children }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 flex items-center gap-2">
      <span className="w-1 h-6 bg-blue-500 rounded-full" />
      {children}
    </h2>
  );
}

function H3Renderer({ children }) {
  return (
    <h3 className="text-lg font-medium text-gray-700 mt-5 mb-2">
      {children}
    </h3>
  );
}

function H4Renderer({ children }) {
  return (
    <h4 className="text-base font-medium text-gray-600 mt-4 mb-2">
      {children}
    </h4>
  );
}

// Custom blockquote renderer
function BlockquoteRenderer({ children }) {
  return (
    <blockquote className="border-r-4 border-yellow-400 bg-yellow-50 px-4 py-3 my-4 text-gray-700 italic rounded-l-lg">
      {children}
    </blockquote>
  );
}

// Custom list renderers
function UlRenderer({ children }) {
  return <ul className="list-disc list-inside space-y-1 my-3 mr-4">{children}</ul>;
}

function OlRenderer({ children }) {
  return <ol className="list-decimal list-inside space-y-1 my-3 mr-4">{children}</ol>;
}

function LiRenderer({ children, className }) {
  // Handle task list items
  const isTaskItem = className === 'task-list-item';

  if (isTaskItem) {
    return (
      <li className="flex items-start gap-2 list-none">
        {children}
      </li>
    );
  }

  return <li className="text-gray-700">{children}</li>;
}

// Checkbox renderer for task lists
function InputRenderer({ type, checked, disabled }) {
  if (type === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        readOnly
      />
    );
  }
  return null;
}

// Horizontal rule
function HrRenderer() {
  return <hr className="my-6 border-gray-200" />;
}

// Paragraph
function PRenderer({ children }) {
  return <p className="text-gray-700 leading-relaxed my-3">{children}</p>;
}

// Strong/Bold
function StrongRenderer({ children }) {
  return <strong className="font-semibold text-gray-900">{children}</strong>;
}

// Link
function LinkRenderer({ href, children }) {
  return (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeRenderer,
          table: TableRenderer,
          thead: TheadRenderer,
          tbody: TbodyRenderer,
          tr: TrRenderer,
          th: ThRenderer,
          td: TdRenderer,
          h1: H1Renderer,
          h2: H2Renderer,
          h3: H3Renderer,
          h4: H4Renderer,
          blockquote: BlockquoteRenderer,
          ul: UlRenderer,
          ol: OlRenderer,
          li: LiRenderer,
          input: InputRenderer,
          hr: HrRenderer,
          p: PRenderer,
          strong: StrongRenderer,
          a: LinkRenderer,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
