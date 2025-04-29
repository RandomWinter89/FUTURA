import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchProducts, fetchProductItem } from "../features/productSlice";

const Homepage = () => {
    const { products, productItem }  = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Hello");

        if (products.highlight.length == 0)
            dispatch(fetchProducts());
    }, [dispatch, products.highlight])

    return (
        <section className="mx-9">
            <h1>Homepage</h1>
            
        </section>
    )
}

export default Homepage;