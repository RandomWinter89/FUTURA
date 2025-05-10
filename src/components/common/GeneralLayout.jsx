import { Outlet } from "react-router-dom"
import { Header } from "../shop";

import { useEffect } from "react";

import { fetchProducts, fetchImageProduct } from "../../features/productSlice";
import { useDispatch, useSelector } from "react-redux";


const GeneralLayout = () => {
    const { products } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0) {
            dispatch(fetchProducts()).then(() => {
                dispatch(fetchImageProduct())
            });
        }

    }, [dispatch, products])
    
    return (
        < >
            <Header />
            <main className="flex flex-col gap-20 my-10">
                <Outlet />
            </main>
        </>
    )
}

export default GeneralLayout;