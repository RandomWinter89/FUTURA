import { NavLink as RouterNavLink } from 'react-router-dom';

import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import React from 'react';

const LinkVariation = cva (
    'text-2xl max-lg:text-xl max-sm:text-sm transition-all duration-300',
    {
        variants: {
            variant: {
                homepage: "p-4 text-6xl font-bold max-lg:text-4xl max-sm:text-xl",
                icon: "hover:text-star",
                base: "",
                auth: "px-4 py-1 border border-black",
            },
            type: {
                base: "bg-transparent hover:p-4 hover:bg-black hover:text-white",
                homepage: "",
                positive: "hover:bg-gray-300",
                negative: "bg-red-700 hover:bg-red-950 hover:text-white"
            }
        },
        defaultVariants: {
            variant: "base",
            type: "base"
        }
    }
)

const NavLink = (({path, children, variant, type, className, ...props}) => {
    return (
        <RouterNavLink 
            to={`${path}`} 
            className={({isActive}) => 
                twMerge(
                    LinkVariation({variant, type}), 
                    className,
                    isActive ? 'pointer-events-none' : ''
                )
            }
            end
            {...props}
        >
            {children}
        </RouterNavLink>
    )
});

export default NavLink;