/* eslint-disable react-hooks/exhaustive-deps */
import { AuthContext } from "../../Context/AuthProvider";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchWishlistId, fetchWishlist_item, removeWishlist_item } from "../../features/wishlistSlice";


const WishlistPage = () => {
    const { wishlist_id, wishlists, loading } = useSelector((state) => state.wishlists);
    const { products } = useSelector((state) => state.products);
    const { currentUser } = useContext(AuthContext) || null;
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
            dispatch(fetchWishlist_item(wishlist_id));

        console.log("Wishlist", wishlists);
    }, [dispatch, wishlist_id])

    // ==== Function ===================>

    const onRemove_WishlistItem = (product_id) => {
        const uid = currentUser.uid;
        dispatch(removeWishlist_item({uid, product_id, wishlist_id}))
    }

    const onAdd_Cart = (product_id) => { 
        console.log("Product_id: ", product_id);
    }

    // ==== Return Content ============>

    return (
        <div className="flex flex-col gap-6 my-6">
            <section>
                <h2>Wishlist Collection</h2>
                <p>Here's your wishlist collect: You can add at category or product</p>
            </section>
            
            <section>
                {loading && <p>Loading</p>}
                {(!loading || wishlists.length == 0) && <p>No item in wishlist</p>}
                <table className="bg-gray-100 w-full text-left">
                    <thead>
                        <tr>
                            <th className="w-[5%] border-y-2 border-black px-4">#</th>
                            <th className="border-y-2 border-black px-2">Product</th>
                            <th className="w-[20%] border-y-2 border-black px-2">Price</th>
                            <th className="w-[25%] border-y-2 border-black px-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {(!loading || wishlist_item.length != 0) && wishlist_item.map((data, index) => 
                        <tr key={index} className="h-32">
                            <td className="px-4">{index + 1}</td>
                            <td className="flex gap-2 px-2 py-4">
                                <img className="size-32 bg-slate-500" />
                                <div className="my-auto">
                                    <p className="text-xl">{data.name}</p>
                                    <p className="">SDK: {data.sku}</p>
                                </div>
                            </td>

                            <td className="px-2">
                                MYR {data.base_price}
                            </td>

                            <td className="px-2">
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => onAdd_Cart(data.id)} className="px-4 py-1 border-2 border-green-400 bg-green-400">Add to Cart</button>
                                    <button onClick={() => onRemove_WishlistItem(data.id)} className="px-4 py-1 border-2 border-red-600 bg-red-600 text-white">Remove</button>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export default WishlistPage;