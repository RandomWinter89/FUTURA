import { useSelector } from "react-redux";
import { useMemo } from "react";

// UI Import
import { Grid } from "../components/shop";

// Asset Import
import SHOWCASE02 from "../assets/SHOWCASE02.png";

import { CollectionCard } from '../components/shop';

const Homepage = () => {
    const { products, products_loading } = useSelector((state) => state.products);

    const sortedNewProducts = useMemo(() => {
        return products.slice()
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
            .slice(0, 5);
    }, [products]);

    const randomizedProducts = useMemo(() => {
        return products.slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
    }, [products]);
    
    return (
        < >
            <div 
                className="h-[55svh] skeleton flex flex-col gap-4 justify-center p-24 bg-cover bg-right" 
                style={{ 
                    backgroundImage: `url(${SHOWCASE02})`, 
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <h1 className="w-[20ch] text-white">Step Into the Future of Fashion</h1>
                <p className="w-[54ch] text-white font-medium text-lg leading-9">Discover trendsetting styles designed to inspire. Shop the latest looks that match your vibe—bold, fresh, and unmistakably you</p>
            </div>

            <div className="bg-black text-white flex flex-col justify-center gap-6 px-44 -mt-16 h-[50ch]">
                <h2 className="text-4xl leading-[2.875rem] font-bold">About Us</h2>
                <p className="font-medium text-lg leading-9">At Futura, we're all about  staying ahead of the curve. We curate the freshest, most stylish trends  in fashion, bringing you clothing that’s as bold and dynamic as you are. From runway-inspired looks to streetwear must-haves, every piece in our collection is handpicked to keep you effortlessly on-trend. Whether  you’re dressing up or keeping it casual, we've got the fits that turn  heads and spark confidence.</p>
            </div>

            <section className="flex flex-col gap-6">
                <Grid 
                    collection={sortedNewProducts} 
                    isLoading={products_loading} 
                    header={"New Products"}
                />
            </section>

            <section className="flex flex-col gap-6">
                <Grid 
                    collection={randomizedProducts} 
                    isLoading={products_loading} 
                    header={"Recommend"}
                />
            </section>
        </>
    )
}

export default Homepage;