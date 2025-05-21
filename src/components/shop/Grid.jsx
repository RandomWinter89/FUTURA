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
                detail: "grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1",
                category: "grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1"
            }
        },
        defaultVariants: {
            variant: "showcase"
        }
    }
)

const LoadingCard = () => {

    return (
        < >
            <div className="flex-1 aspect-[3/4] flex flex-col border border-gray-300">
                <span className="flex-1 skeleton" />

                <div className="flex-1 flex flex-col gap-2 p-2 bg-white">
                    <span className="flex-1 skeleton" />
                    <div className="flex-1 flex justify-between gap-2">
                        <span className="flex-1 skeleton" />
                        <span className="w-6 skeleton" />
                    </div>

                    <span className="flex-1 skeleton" />
                </div>
            </div>
        </>
    )
}

const Grid = ({collection, isLoading, header, enableMore=true, variant, className}) => {
    const [open, setOpen] = useState(false);
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    if (isLoading) return (
        < >
            <span className="h-8 w-52 skeleton"/>

            <div className={twMerge(GridVariants({variant}), className)}>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
            </div>
        </>
    )

    return (
        < >
            {header &&
                <div className="flex justify-between">
                    <h2>{header}</h2>
                    {enableMore && 
                        <button 
                            onClick={() => navigate("/Shop/Category")} 
                            className="text-2xl leading-[2.875rem] font-medium underline"
                        >
                            View all
                        </button>
                    }
                </div>
            }
            <div className={twMerge(GridVariants({variant}), className)}>
                {collection.map(item => 
                    <ProductCard 
                        key={item.id} 
                        data={item} 
                        showToast={() => setOpen(true)}
                        showFeedback={(info) => setDesc(info)}
                    />
                )}
            </div>
            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={desc}/>
        </>
    )
}

export default Grid;