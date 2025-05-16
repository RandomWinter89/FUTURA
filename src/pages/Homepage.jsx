import { useSelector } from "react-redux";
import { useMemo } from "react";

// UI Import
import { Grid } from "../components/shop";

// Asset Import
import SHOWCASE from "../assets/SHOWCASE.png";

import { CollectionCard } from '../components/shop';

const Homepage = () => {
    const { products, products_loading } = useSelector((state) => state.products);

    const sortedNewProducts = useMemo(() => {
        return products.slice()
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
            .slice(0, 5);
    }, [products]);

    const sortedPopularProducts = useMemo(() => {
        return products.slice()
            .sort((a, b) => b.average_rating - a.average_rating)
            .slice(0, 5);
    }, [products]);

    const randomizedProducts = useMemo(() => {
        return products.slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
    }, [products]);
    
    return (
        < >
            <section>
                <h2 className="mb-2">New Product</h2>
                <Grid collection={sortedNewProducts} isLoading={products_loading}/>
            </section>

            <section>
                <h2 className="mb-2">Most Popular</h2>
                <Grid collection={sortedPopularProducts} isLoading={products_loading}/>
            </section>

            <section>
                <h2 className="mb-2">Recommendation</h2>
                <Grid collection={randomizedProducts} isLoading={products_loading} />
            </section>
        </>
    )
}

export default Homepage;