import { useNavigate } from "react-router-dom";
import React from "react";

import { Category } from "../../database/category";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { updateWishlistToggle, toggleWishlist } from "../../features/wishlistSlice";

import heart from '../../assets/svg/heart_outline.svg';
import heart_filled from '../../assets/svg/heart_filled.svg'
import star from '../../assets/svg/star_filled.svg';

import { IconHeart, IconStar } from "../../components/icon";

const ProductCard = ({data, showToast, showFeedback}) => {
    const { wishlists, wishlistActionStatus } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onNavigateProduct = () => navigate(`/Shop/Product/${data.id}`);

    const addToWishlist = (e) => {
        e.stopPropagation();

        if (wishlistActionStatus == "loading")
            return;

        dispatch(toggleWishlist({product_id: data.id}));
        dispatch(updateWishlistToggle({uid: currentUser.uid, product_id: data.id}));

        if (wishlists.find(data => data.product_id == data.id)) {
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
                ? <img 
                    src={`${data.imageUrl}`} 
                    className="object-cover w-full aspect-[3/4] rounded-xl skeleton border border-gray-200"
                    />
                : <span className="bg-orange-300 w-full aspect-[3/4]" />
            }

            <div className="flex-1 flex flex-col gap-2 p-2 bg-white">
                <p className="body2 opacity-60">{productCat}</p>
                <div className="flex justify-between gap-4 items-start">
                    <p className="subtitle1">{data.name}</p>
                    <button onClick={addToWishlist} className="flex-shrink-0 size-6">
                        <IconHeart filled={wishlists.find((prev) => prev.product_id == data.id)} />
                    </button>
                </div>

                <p className="subtitle2">RM {data.base_price}</p>
                {data.average_rating != null && (
                    <div className="flex items-end gap-2 max-sm:gap-1 max-sm:items-center">
                        <IconStar filled={true} className="max-sm:size-4" />
                        <div className="flex items-end gap-1 max-sm:gap-0.5">
                            <p className="body2">{parseFloat(data.average_rating).toFixed(1)} </p>
                            <p className="body2">({data.number_of_reviews})</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard;
