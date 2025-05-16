import { useNavigate } from "react-router-dom";
import React from "react";

import { Category } from "../../database/category";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist_item } from "../../features/wishlistSlice";


    // const onWishlistProduct = ({id}) => {
    //     console.log(id);

    //     if (currentUser) {
    //         onAction_Wishlist(id);
    //     } else {
    //         navigate("/Auth/Login");
    //     }
    // }


const ProductCard = ({data, showToast, showFeedback}) => {
    const { wishlist_id, wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onNavigateProduct = () => navigate(`/Shop/Product/${data.id}`);

    const addToWishlist = (e) => {
        e.stopPropagation();

        if (wishlist_id == null)
            return;

        if (!wishlists.length || !wishlists.some((info) => info.product_id == data.id)) {
            dispatch(addWishlist_item({
                uid: currentUser.uid, 
                wishlist_id: wishlist_id, 
                product_id: data.id
            }));

            showFeedback("Added to wishlist");
            showToast();
        } else {
            showFeedback("This item is in wishlist already");
            showToast();
        }
    }

    const productCat = Category.find(prev => prev.id == data.category_id).category_name;

    //Grid or Row
    return (
        <div 
            onClick={onNavigateProduct} 
            className="
                flex-1 flex flex-col 
                border border-black 
                cursor-pointer hover:scale-105 hover:transition-transform
            "
        >
            {data.imageUrl != "NONE"
                ? <img src={`${data.imageUrl}`} className="object-cover w-full aspect-[3/4]"/>
                : <span className="bg-orange-300 w-full aspect-[3/4]" />
            }


            <div className="flex-1 flex flex-col gap-2 p-2 bg-white">
                <div className="flex justify-between items-center">
                    {/* <p>COLOR</p> */}
                    <button 
                        onClick={addToWishlist} 
                        className="
                            border border-black px-2 rounded-lg 
                            hover:bg-red-500 hover:transition-colors
                        "
                    >
                        Liked
                    </button>
                </div>

                <hr className="border-t border-black"/>

                <div className="flex justify-between text-gray-700">
                    <p>{productCat}</p>
                    <p>Size</p>
                </div>

                <hr className="border-t border-black"/>

                <div className="flex-1 flex flex-col justify-between gap-2">
                    <p className="text-lg">{data.name}</p>
                
                    <div className="flex items-end justify-between">
                        <p className="font-semibold">RM {data.base_price}</p>
                        {data.average_rating != null && (
                            <p>Rating: {parseFloat(data.average_rating)} ({data.number_of_reviews})</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
