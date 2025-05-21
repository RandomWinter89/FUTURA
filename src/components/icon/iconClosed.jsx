import { twMerge } from "tailwind-merge";

const IconClosed = ({className}) => {

    return (
        <svg 
            className={twMerge("size-6", className)}
            viewBox="0 0 26 26" 
            stroke="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 20L4 4M20 4L4 20" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
}

export default IconClosed;