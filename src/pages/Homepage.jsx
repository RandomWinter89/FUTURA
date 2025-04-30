import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchProducts, fetchProductItem } from "../features/productSlice";

const Homepage = () => {
    const { products }  = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Hello");

        if (products.length == 0)
            dispatch(fetchProducts());
    }, [dispatch, products])

    return (
        <section className="mx-9">
            <h1>Homepage</h1>
            {products.map((data, index) => 
                <div key={index}>
                    <p>name: {data.name}</p>
                    {/* Add Cart */}
                    {/* Add Wishlist */}
                </div>
            )}
            
        </section>
    )
}

export default Homepage;