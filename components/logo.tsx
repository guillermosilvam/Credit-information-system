'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  animated?: boolean;
}

export function Logo({ 
  className, 
  iconClassName,
  textClassName,
  showText = true,
  animated = true
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-lg bg-primary flex items-center justify-center relative overflow-hidden",
        animated && "group",
        iconClassName || "w-9 h-9"
      )}>
        {/* Wheat/Corn Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "w-5 h-5 text-primary-foreground transition-transform duration-300",
            animated && "group-hover:scale-110"
          )}
        >
          {/* Tallo principal */}
          <path 
            d="M12 22V8" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            className={cn(animated && "origin-bottom")}
          />
          {/* Hojas izquierdas */}
          <path 
            d="M12 18C10 18 8 16 8 14C10 14 12 16 12 18Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500",
              animated && "group-hover:translate-x-[-2px]"
            )}
          />
          <path 
            d="M12 14C10 14 7 12 7 9C9 9 12 11 12 14Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500 delay-75",
              animated && "group-hover:translate-x-[-2px]"
            )}
          />
          <path 
            d="M12 10C10 10 8 8 8 5C10 5 12 7 12 10Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500 delay-100",
              animated && "group-hover:translate-x-[-2px]"
            )}
          />
          {/* Hojas derechas */}
          <path 
            d="M12 18C14 18 16 16 16 14C14 14 12 16 12 18Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500",
              animated && "group-hover:translate-x-[2px]"
            )}
          />
          <path 
            d="M12 14C14 14 17 12 17 9C15 9 12 11 12 14Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500 delay-75",
              animated && "group-hover:translate-x-[2px]"
            )}
          />
          <path 
            d="M12 10C14 10 16 8 16 5C14 5 12 7 12 10Z" 
            fill="currentColor"
            className={cn(
              "transition-all duration-500 delay-100",
              animated && "group-hover:translate-x-[2px]"
            )}
          />
          {/* Punta superior */}
          <path 
            d="M12 6C12 4 12 2 12 2C12 2 14 4 14 6C14 8 12 8 12 8C12 8 10 8 10 6C10 4 12 2 12 2" 
            fill="currentColor"
            className={cn(
              "transition-transform duration-300",
              animated && "group-hover:scale-110 origin-bottom"
            )}
          />
        </svg>
      </div>
      {showText && (
        <span className={cn(
          "font-bold tracking-tight",
          textClassName || "text-xl"
        )}>
          Agrofinanciamiento
        </span>
      )}
    </div>
  );
}

export function LogoIcon({ className, animated = true }: { className?: string; animated?: boolean }) {
  return (
    <div className={cn(
      "rounded-lg bg-primary flex items-center justify-center overflow-hidden",
      animated && "group transition-transform duration-300 hover:scale-105",
      className || "w-9 h-9"
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-5 h-5 text-primary-foreground transition-transform duration-300",
          animated && "group-hover:scale-110"
        )}
      >
        <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 18C10 18 8 16 8 14C10 14 12 16 12 18Z" fill="currentColor" />
        <path d="M12 14C10 14 7 12 7 9C9 9 12 11 12 14Z" fill="currentColor" />
        <path d="M12 10C10 10 8 8 8 5C10 5 12 7 12 10Z" fill="currentColor" />
        <path d="M12 18C14 18 16 16 16 14C14 14 12 16 12 18Z" fill="currentColor" />
        <path d="M12 14C14 14 17 12 17 9C15 9 12 11 12 14Z" fill="currentColor" />
        <path d="M12 10C14 10 16 8 16 5C14 5 12 7 12 10Z" fill="currentColor" />
        <path d="M12 6C12 4 12 2 12 2C12 2 14 4 14 6C14 8 12 8 12 8C12 8 10 8 10 6C10 4 12 2 12 2" fill="currentColor" />
      </svg>
    </div>
  );
}
