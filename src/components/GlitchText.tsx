import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  enableGlitch?: boolean;
}

export function GlitchText({ text, className, as: Tag = 'h1', enableGlitch = true }: GlitchTextProps) {
  return (
    <Tag
      className={cn(
        'relative inline-block font-cyber',
        enableGlitch && 'animate-glitch-text',
        className
      )}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
