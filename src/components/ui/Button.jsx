import { cva } from 'class-variance-authority';
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
    'text-2xl max-lg:text-xl max-sm:text-sm hover:rounded-sm transition-all duration-300',
    {
        variants: {
            variant: {
                base: "px-3 py-1 border",
                auth: "",
                icon: "",
            },
            state: {
                base: "bg-white hover:bg-gray-300",
                positive: "bg-green-500 hover:bg-green-950 hover:text-white",
                negative: "bg-red-500 hover:bg-red-950 hover:text-white"
            }
        },
        defaultVariants: {
            variant: "base",
            state: "base",
        }
    }
);

// Version 1
const Button = ({variant, state, className, children, ...props}) => {
    return (
        <button 
            className={twMerge(buttonVariants({variant, state}), className)}
            {...props} 
        >
            {children}
        </button>
    );
}

export default Button;