import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

// Initialize mermaid with better settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  themeVariables: {
    primaryColor: '#3B82F6',
    primaryTextColor: '#1F2937',
    primaryBorderColor: '#93C5FD',
    lineColor: '#6B7280',
    secondaryColor: '#F3F4F6',
    tertiaryColor: '#EFF6FF',
    background: '#FFFFFF',
    mainBkg: '#FFFFFF',
    nodeBorder: '#3B82F6',
    clusterBkg: '#F8FAFC',
    clusterBorder: '#E2E8F0',
    titleColor: '#1F2937',
    edgeLabelBackground: '#FFFFFF',
    nodeTextColor: '#1F2937',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15,
    nodeSpacing: 50,
    rankSpacing: 50,
  },
  er: {
    layoutDirection: 'TB',
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 30,
    barGap: 8,
    topPadding: 50,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 14,
    sectionFontSize: 14,
  }
});

export function MermaidDiagram({ chart, title }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    if (chart && containerRef.current) {
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      mermaid.render(id, chart)
        .then(({ svg }) => {
          setSvgContent(svg);
          setError(null);
        })
        .catch((err) => {
          console.error('Mermaid render error:', err);
          setError('שגיאה ברינדור התרשים');
        });
    }
  }, [chart]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  const handleDownload = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'diagram'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="diagram-container bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          {title || 'תרשים'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="הקטן"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="הגדל"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="איפוס"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="הורד SVG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div
        className="p-4 overflow-auto bg-white"
        style={{ maxHeight: '500px' }}
      >
        <div
          ref={containerRef}
          className="mermaid-diagram flex justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
        />
      </div>
    </div>
  );
}

export function WireframeDisplay({ wireframe }) {
  return (
    <div className="wireframe-container bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-gray-400 text-sm mr-4">Wireframe</span>
      </div>
      <pre className="p-4 text-green-400 font-mono text-sm overflow-auto whitespace-pre">
        {wireframe}
      </pre>
    </div>
  );
}

export function CodeBlock({ code, language, title }) {
  return (
    <div className="code-block bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-sm mr-4">{title || language}</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
          {language}
        </span>
      </div>
      <pre className="p-4 text-gray-100 font-mono text-sm overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default MermaidDiagram;
