import { cva } from 'class-variance-authority';
import { twMerge } from "tailwind-merge";
import { forwardRef } from 'react';

const buttonVariants = cva(
    'h-fit w-fit text-2xl max-lg:text-xl max-sm:text-sm hover:rounded-sm transition-all duration-300',
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
                negative: "bg-black text-white hover:bg-red-950"
            }
        },
        defaultVariants: {
            variant: "base",
            state: "base",
        }
    }
);

// const buttonVariants = cva(
//     'py-2 transition-all duration-300',
//     {
//         variants: {
//             variant: {
//                 primary_outline: "border border-black text-black",
//                 primary_filled: "bg-black text-white",
//                 secondary_outline: "border border-red-500 text-red-500",
//                 secondary_filled: "bg-red-500 text-white",
//             },
//             state: {
//                 fit: "w-fit px-11",
//                 full: "w-full"
//             }
//         },
//         defaultVariants: {
//             variant: "primary_filled",
//             state: "full",
//         }
//     }
// );

// Version 1
const Button = forwardRef(({variant, state, className, children, ...props}) => {
    return (
        <button 
            className={twMerge(buttonVariants({variant, state}), className)}
            {...props} 
        >
            {children}
        </button>
    );
});

export default Button;