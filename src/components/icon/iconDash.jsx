import { twMerge } from "tailwind-merge";

const IconDash = ({className}) => {

    return (
        <svg 
            className={twMerge("size-6", className)}
            viewBox="0 0 26 26" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 12.998H5V10.998H19V12.998Z" fill="#444444"/>
        </svg>
    )
}

export default IconDash;