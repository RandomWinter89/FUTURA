import { cva } from 'class-variance-authority';
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
    'border transition-all duration-300 hover:scale-105 hover:rounded-lg',
    {
        variants: {
            variant: {
                primary_outline: "border-black text-black dark:border-white dark:text-white",
                primary_filled: "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black",
                secondary_outline: "border-red-500 text-red-500",
                secondary_filled: "border-red-500 bg-red-500 text-white",
            },
            state: {
                fit: "w-fit h-fit",
                full: "flex-1 flex-grow-0 w-full"
            },
            size: {
                sm: "px-6 py-2",
                md: "px-8 py-4",
                lg: "px-10 py-6"
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