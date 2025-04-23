import { cva } from 'class-variance-authority';
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
    'flex items-center justify-center transition-colors',
    {
        variants: {
            variant: {
                base: "border border-black bg-green-200 hover:bg-green-400",
            },
            size: {
                sm: "gap-1 text-base rounded px-4 py-3",
                md: "gap-2 text-xl   rounded px-4 py-4",
                lg: "gap-3 text-2xl  rounded px-6 py-5",
                icon: "rounded-full w-20 h-20 p-2.5",
            }
        },
        defaultVariants: {
            variant: "base",
            size: "sm",
        }
    }
);

// Version 1
const Button = ({variant, size, className, ...props}) => {
    return (
        <button 
            {...props} 
            className={twMerge(buttonVariants({variant, size}), className)}  
        />
    );
}

export default Button;