import { Outlet } from "react-router-dom"
import { Header } from "../shop";

import { useEffect } from "react";

import { fetchProducts, fetchImageProduct } from "../../features/productSlice";
import { fetchAddress } from "../../features/addressSlice";
import { fetchWishlistId } from "../../features/wishlistSlice";
import { fetchCartId } from "../../features/cartsSlice";
import { fetchOrder } from "../../features/orderedSlice";

import { useDispatch, useSelector } from "react-redux";


const GeneralLayout = ({data_user}) => {
    const { products } = useSelector((state) => state.products);
    const { address } = useSelector((state) => state.address);
    const { carts } = useSelector((state) => state.carts);
    const { wishlists } = useSelector((state) => state.wishlists);
    const { order } = useSelector((state) => state.orders);

    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0) {
            dispatch(fetchProducts()).then(() => {
                dispatch(fetchImageProduct());
            });
        }

    }, [dispatch])

    // Order

    useEffect(() => {
        if (data_user) {
            if (address.length == 0)
                dispatch(fetchAddress(data_user.uid));

            if (carts.length == 0)
                dispatch(fetchCartId(data_user.uid));

            if (wishlists.length == 0)
                dispatch(fetchWishlistId(data_user.uid));

            if (order.length == 0)
                dispatch(fetchOrder(data_user.uid));
        }

    }, [dispatch, data_user])
    
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