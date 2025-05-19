import { Outlet } from "react-router-dom"
import { Header, Footer } from ".";
import { memo } from "react";

import { useEffect } from "react";

import { fetchProducts, fetchImageProduct } from "../../features/productSlice";
import { fetchAddress } from "../../features/addressSlice";
import { fetchWishlistId, fetchWishlist_item } from "../../features/wishlistSlice";
import { fetchCartId, fetchCart_item } from "../../features/cartsSlice";
import { fetchOrder } from "../../features/orderedSlice";

import { useDispatch, useSelector } from "react-redux";


const GeneralLayout = memo(({data_user}) => {
    const { products } = useSelector((state) => state.products);
    const { address } = useSelector((state) => state.address);
    const { cart_id, carts } = useSelector((state) => state.carts);
    const { wishlists, wishlist_id } = useSelector((state) => state.wishlists);
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
        if (!data_user) return;

        if (address.length == 0)
            dispatch(fetchAddress(data_user.uid));

        if (cart_id == null)
            dispatch(fetchCartId(data_user.uid))
                .then(() => dispatch(fetchCart_item(cart_id)));

        if (cart_id != null && carts.length === 0)
            dispatch(fetchCart_item(cart_id));

        if (wishlist_id == null)
            dispatch(fetchWishlistId(data_user.uid))
                .then(() => dispatch(fetchWishlist_item(data_user.uid)));

        if (wishlist_id != null && wishlists.length === 0)
            dispatch(fetchWishlist_item(data_user.uid));

        if (order.length == 0)
            dispatch(fetchOrder(data_user.uid));

    }, [dispatch, data_user])
    
    return (
        < >
            <Header />
            {/*  gap-16 my-10 */}
            <main className="flex flex-col min-h-svh">
                <Outlet />
            </main>
            <Footer />
        </>
    )
});

export default GeneralLayout;