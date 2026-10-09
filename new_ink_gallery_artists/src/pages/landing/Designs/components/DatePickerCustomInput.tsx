import { forwardRef } from "react";

// Tailwind-compatible custom input
export const CustomInput = forwardRef(({ value, onClick, disabled }: any, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    disabled={disabled}
    className={`w-full text-left bg-yellow-50 border shadow px-4 py-2 rounded ${disabled ? "bg-black/10" : "bg-white"}`}
  >
    {value || "Select a date"}
  </button>
));
