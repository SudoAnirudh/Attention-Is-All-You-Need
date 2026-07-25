'use client';

import React, { useState, useEffect } from 'react';

interface KatexBlockProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KatexBlock: React.FC<KatexBlockProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    import('katex').then((katexModule) => {
      if (!isMounted) return;
      const katex = katexModule.default || katexModule;
      try {
        const html = katex.renderToString(math, {
          displayMode: block,
          throwOnError: false,
        });
        setRenderedHtml(html);
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [math, block]);

  if (renderedHtml !== null) {
    return (
      <span
        className={`katex-wrapper ${block ? 'block text-center my-2' : 'inline-block'} ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`katex-wrapper font-mono ${block ? 'block text-center my-2' : 'inline-block'} ${className}`}
    >
      {math}
    </span>
  );
};

export default KatexBlock;
