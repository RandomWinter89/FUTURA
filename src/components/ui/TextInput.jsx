import React from "react";

import { twMerge } from "tailwind-merge";

const Input = React.forwardRef(({className, type, ...props}, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            className={twMerge(
                "border border-black rounded-md", 
                className
            )}
            {...props}
        />
    );
})

export default Input;