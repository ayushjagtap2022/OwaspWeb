import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode;
    delay?: number;
}

const CyberCard = ({ children, className, title, icon, delay = 0 }: CyberCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "relative group overflow-hidden rounded-xl border border-primary/20 bg-black/40 backdrop-blur-sm p-6",
                "hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:bg-primary/5 transition-all duration-300",
                "group-hover:shadow-[inset_0_0_20px_rgba(var(--primary),0.2)]",
                className
            )}
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />

            {/* Background grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

            {/* Header if title/icon provided */}
            {(title || icon) && (
                <div className="flex items-center gap-3 mb-4 border-b border-primary/10 pb-3">
                    {icon && <span className="text-primary group-hover:animate-pulse">{icon}</span>}
                    {title && (
                        <h3 className="font-cyber text-xl text-primary tracking-wide group-hover:text-neon-cyan transition-colors">
                            {title}
                        </h3>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 font-terminal text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>

            {/* Hover visual effect (scanline) */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
};

export default CyberCard;
