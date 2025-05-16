import { useNavigate } from "react-router-dom";
import React from "react";

import { Category } from "../../database/category";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist_item } from "../../features/wishlistSlice";

import heart from '../../assets/svg/heart_outline.svg';
import star from '../../assets/svg/star_filled.svg';

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
                cursor-pointer hover:scale-105 hover:transition-transform
            "
        >
            {data.imageUrl != "NONE"
                ? <img src={`${data.imageUrl}`} className="object-cover w-full aspect-[3/4] rounded-xl border border-gray-200"/>
                : <span className="bg-orange-300 w-full aspect-[3/4]" />
            }

            <div className="flex-1 flex flex-col gap-2 p-2 bg-white">
                <p>{productCat}</p>
                <div className="flex justify-between gap-4 items-start">
                    <p className="text-xl font-bold">{data.name}</p>
                    <button onClick={addToWishlist}>
                        <img src={heart}/>
                    </button>
                </div>

                <p className="text-lg font-semibold">RM {data.base_price}</p>
                {data.average_rating != null && (
                    <div className="flex items-end gap-2 font-medium">
                        <img src={star} className="size-6"/>
                        <div className="flex items-end gap-1">
                            <p>{parseFloat(data.average_rating)} </p>
                            <p className="text-sm ">({data.number_of_reviews})</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard;
