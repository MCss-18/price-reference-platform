import { Input } from "./input";
import { cn } from "@/lib/utils";

function InputWithIcon({
  icon: Icon,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) {
  return (
    <div className="relative w-full">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <Input
        className={cn(
          Icon && "pl-10", // Añadir padding si hay ícono
          className
        )}
        {...props}
      />
    </div>
  );
}

export default InputWithIcon;