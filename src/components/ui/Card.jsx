import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const CardImageVariants = cva(
    'flex-1 size-10 aspect-[3/4] object-cover',
    { 
        variants: {
            variant: {
                surface: "my-2",
                full: "rounded-md"
            }
        },
        defaultVariants: {
            variant: "surface",
        }
    }
)

// Prototype - Reusable Element
const CardImage = React.forwardRef(({imageUrl, className, variant, ...prop}) => {
    return (
        < >
            {imageUrl == undefined 
                ? <span className={twMerge(CardImageVariants(variant) + "s-10 bg-blue-300", className)} /> 
                : <img src={imageUrl} className={twMerge(CardImageVariants(variant), className)} {...prop}/>
            }
        </>
    );
})

// Text Area

// Action Area

const CardVariants = cva(
    'flex-1 flex',
    {
        variants: {
            variant: {
                horizontal: "flex-row gap-2",
                vertical: "flex-col gap-2"
            }
        },
        defaultVariants: {
            variant: "horizontal"
        }
    }
)

const Card = ({ children, variant, className }) => {
    return (
        <div className={twMerge(CardVariants(variant), className)}>
            {children}
        </div>
    )
}


Card.Image = CardImage;

export default Card;
