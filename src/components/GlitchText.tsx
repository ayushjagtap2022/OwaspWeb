import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export function GlitchText({ text, className, as: Tag = 'h1' }: GlitchTextProps) {
  return (
    <Tag
      className={cn('relative inline-block font-cyber animate-glitch-text', className)}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
