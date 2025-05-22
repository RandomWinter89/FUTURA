import { twMerge } from "tailwind-merge";

const IconTheme = ({darkMode, className, ...props}) => {

    return (
        <svg 
            className={twMerge("size-6", className)}
            viewBox="0 0 26 26" 
            stroke="currentColor"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props} 
        >
            {darkMode 
                ? (< > 
                    <path d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C15.314 22 18 17.523 18 12C18 6.477 15.314 2 12 2M11 7H11.009M10 14.5C10 14.8978 9.84196 15.2794 9.56066 15.5607C9.27936 15.842 8.89782 16 8.5 16C8.10218 16 7.72064 15.842 7.43934 15.5607C7.15804 15.2794 7 14.8978 7 14.5C7 14.1022 7.15804 13.7206 7.43934 13.4393C7.72064 13.158 8.10218 13 8.5 13C8.89782 13 9.27936 13.158 9.56066 13.4393C9.84196 13.7206 10 14.1022 10 14.5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </>)
                : (< >
                    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" strokeWidth="1.5"/>
                    <path d="M12 2V3M12 21V22M22 12H21M3 12H2M19.07 4.93L18.678 5.323M5.322 18.678L4.929 19.071M19.07 19.07L18.678 18.677M5.322 5.322L4.929 4.929" strokeWidth="1.5" strokeLinecap="round"/>
                </>)
            }
        </svg>
    )
}

export default IconTheme;