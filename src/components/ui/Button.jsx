import { cva } from 'class-variance-authority';
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
    'border transition-all duration-300',
    {
        variants: {
            variant: {
                primary_outline: "border-black text-black",
                primary_filled: "border-black bg-black text-white",
                secondary_outline: "border-red-500 text-red-500",
                secondary_filled: "border-red-500 bg-red-500 text-white",
            },
            state: {
                fit: "w-fit px-11",
                full: "w-full flex-1"
            },
            size: {
                sm: "py-2",
                md: "py-4",
                lg: "py-6"
            }
        },
        defaultVariants: {
            variant: "primary_filled",
            state: "full",
            size: "md"
        }
    }
);

// Version 1
const Button = (({variant, state, size, className, children, ...props}) => {
    return (
        <button 
            className={twMerge(buttonVariants({variant, state, size}), className)}
            {...props} 
        >
            {children}
        </button>
    );
});

export default Button;