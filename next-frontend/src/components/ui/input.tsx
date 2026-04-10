import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  type?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number" && onChange) {
        const value = e.target.value;
        // Si el campo está vacío, pasar cadena vacía
        if (value === "") {
          onChange(e);
          return;
        }
        // Convertir a numero
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          // Crear un evento sintético con el valor numérico
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: numValue as any,
            },
          };
          onChange(syntheticEvent as any);
        } else {
          onChange(e);
        }
      } else {
        onChange?.(e);
      }
    };

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }