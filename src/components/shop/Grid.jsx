import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ToastOverlay } from "../ui";
import ProductCard from "./ProductCard";

const GridVariants = cva(
    'flex-1 grid gap-10',
    {
        variants: {
            variant: {
                showcase: "grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2",
                detail: "grid-cols-4 max-lg:grid-cols2",
                category: "grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1"
            }
        },
        defaultVariants: {
            variant: "showcase"
        }
    }
)

const Grid = ({collection, isLoading, header, variant, className}) => {
    const [open, setOpen] = useState(false);
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    return (
        < >
            {header &&
                <div className="flex justify-between">
                    <h2 className="text-4xl leading-[2.875rem] font-bold">{header}</h2>
                    <button onClick={() => navigate("/Shop/Category")} className="text-2xl leading-[2.875rem] font-medium underline">View all</button>
                </div>
            }
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