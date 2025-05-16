import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

import { ToastOverlay } from "../ui";
import ProductCard from "./ProductCard";

const GridVariants = cva(
    'flex-1 grid gap-2',
    {
        variants: {
            variant: {
                showcase: "grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2",
                category: "grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-1"
            }
        },
        defaultVariants: {
            variant: "showcase"
        }
    }
)

const Grid = ({collection, isLoading, variant, className}) => {
    const [open, setOpen] = useState(false);
    const [desc, setDesc] = useState("");

    return (
        < >
            <div className={twMerge(GridVariants({variant}), className)}>
                {!isLoading && collection.map(item => 
                    <ProductCard 
                        key={item.id} 
                        data={item} 
                        showToast={() => setOpen(true)}
                        showFeedback={(info) => setDesc(info)}
                    />)
                }
            </div>
            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={desc}/>
        </>
    )
}

export default Grid;