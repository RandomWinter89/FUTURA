import { twMerge } from "tailwind-merge";

const IconMenu = ({className}) => {

    return (
        <svg 
            className={twMerge("size-6", className)}
            viewBox="0 0 26 26" 
            stroke="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3 6H21M3 12H21M3 18H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default IconMenu;