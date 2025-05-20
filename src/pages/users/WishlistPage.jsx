/* eslint-disable react-hooks/exhaustive-deps */
import { AuthContext } from "../../Context/AuthProvider";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWishlistId, readUserWishlists, toggleWishlist } from "../../features/wishlistSlice";
import star_filled from "../../assets/svg/star_filled.svg";
import framer from "../../assets/svg/Frame.svg";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
    const { wishlist_id, wishlists, wishlistStatus } = useSelector((state) => state.wishlists);
    const { products } = useSelector((state) => state.products);
    const { currentUser } = useContext(AuthContext) || null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const wishlist_item = products.filter(product => 
        wishlists.some(data => data.product_id === product.id)
    );

    useEffect(() => {
        if (wishlist_id == null){
            const uid = currentUser.uid;
            dispatch(fetchWishlistId(uid));
        }
        
    }, [dispatch])

    useEffect(() => {
        if (wishlist_id != null && wishlists.length === 0)
            dispatch(readUserWishlists(currentUser.uid));
    }, [dispatch, wishlist_id])

    // ==== Function ===================>

    const onRemove_WishlistItem = (product_id) => {
        dispatch(toggleWishlist({product_id: product_id}));
    }

    // ==== Return Content ============>

    return (
        < >
            <section className="flex flex-col gap-11">
                <div className="body2 w-fit flex gap-2">
                    <span onClick={() => navigate("/Shop/Homepage")} className="text-gray-500 cursor-pointer">
                        Home
                    </span>

                    <img src={framer} className="flex-1 aspect-square"/>

                    <span>Wishlist</span>
                </div>

                <h2>Wishlist Collection</h2>

                <div className="grid grid-cols-4 gap-10">
                    {(wishlist_item.length != 0) && wishlist_item.map((data, index) => 
                        <div key={index} className="flex flex-col gap-4">
                            <img className="aspect-[3/4] bg-red-300"/>

                            <div className="flex justify-between items-start gap-2"> 
                                <div className="my-auto flex flex-col gap-2">
                                    <p className="subtitle1">{data.name}</p>
                                    <p className="subtitle2">RM{parseFloat(data.base_price)}</p>
                                </div>

                                <button 
                                    onClick={() => onRemove_WishlistItem(data.id)} 
                                    className="w-6 aspect-square"
                                >
                                    <img src={star_filled} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default WishlistPage;