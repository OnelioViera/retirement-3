import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, placeholder = "0", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    // Update display value when value prop changes
    React.useEffect(() => {
      if (!isFocused) {
        if (value === 0 && placeholder === "0") {
          setDisplayValue("");
        } else {
          setDisplayValue(
            value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        }
      }
    }, [value, placeholder, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);

      // Remove dollar sign and parse as number
      const numericValue = parseFloat(inputValue.replace(/[$,]/g, "")) || 0;
      onChange(numericValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
      // Show raw number when focused for easier editing
      if (value > 0) {
        setDisplayValue(value.toString());
      } else {
        setDisplayValue("");
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Format the value when losing focus
      if (value === 0 && placeholder === "0") {
        setDisplayValue("");
      } else {
        setDisplayValue(
          value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
      }
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
