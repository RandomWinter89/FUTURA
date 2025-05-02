// import { fetchProducts, fetchCategory } from "../features/productSlice";
// import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";

const Homepage = () => {
    const { products } = useSelector((state) => state.products);


    return (
        <main className="flex flex-col gap-6">
            <div className="h-[60svh] flex justify-center items-center text-center bg-slate-600 text-white">
                <h1 className="w-[32ch]">UNLOCK CREATIVITY . BECOME PART OF THEM . BE WILD</h1>
            </div>

            {/* Carousel */}

            <section>
                <h2>New Product</h2>
                {/* Product 01 */}
            </section>

            <section>
                <h2>Most Popular</h2>
                {/* Product 02 */}
            </section>

            <section>
                <h2>Recommendation</h2>
                {/* Random Product */}
            </section>
        </main>
    )
}

export default Homepage;