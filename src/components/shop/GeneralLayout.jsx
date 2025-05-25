import { Outlet } from "react-router-dom"
import { Header, Footer } from ".";

import { useEffect } from "react";

import { fetchProducts, fetchImageProduct } from "../../features/productSlice";
import { fetchAddress } from "../../features/addressSlice";
import { fetchWishlistId, readUserWishlists } from "../../features/wishlistSlice";
import { fetchCartId, fetchCart_item } from "../../features/cartsSlice";
import { fetchOrder } from "../../features/orderedSlice";
import { readCurrentUserPicture } from "../../features/usersSlice";

import { useDispatch, useSelector } from "react-redux";


const GeneralLayout = ({auth_user}) => {
    const { products } = useSelector((state) => state.products);
    const { addressStatus } = useSelector((state) => state.address);
    const { cart_id } = useSelector((state) => state.carts);
    const { wishlists, wishlist_id } = useSelector((state) => state.wishlists);
    const { order } = useSelector((state) => state.orders);
    const { currentDBUserPicture } = useSelector((state) => state.users);

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
        if (!auth_user) 
            return;

        if (addressStatus == "idle")
            dispatch(fetchAddress(auth_user.uid));

        if (cart_id == null)
            dispatch(fetchCartId(auth_user.uid))
                .then(() => dispatch(fetchCart_item(cart_id)));

        if (wishlist_id == null)
            dispatch(fetchWishlistId(auth_user.uid))
                .then(() => dispatch(readUserWishlists(auth_user.uid)));

        if (wishlist_id != null && wishlists.length === 0)
            dispatch(readUserWishlists(auth_user.uid));

        if (order.length == 0)
            dispatch(fetchOrder(auth_user.uid));

        if (currentDBUserPicture == null && auth_user)
            dispatch(readCurrentUserPicture(auth_user.uid));

    }, [dispatch, auth_user])
    
    return (
        <div className="flex flex-col min-h-svh">
            <Header />
            {/*  gap-16 my-10 */}
            <main className="flex flex-col flex-1 bg-white dark:bg-black">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
};

export default GeneralLayout;