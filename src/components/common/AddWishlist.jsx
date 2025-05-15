import { addWishlist_item } from "../../features/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from "react";

const AddWishlist = ({product_id}) => {
    const { wishlist_id,  wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();


    const onAction_Wishlist = (e) => {
        e.preventDefault();

        if (wishlists.length == 0 || !wishlists.some((data) => data.product_id == product_id)) { 
            return dispatch(addWishlist_item({
                uid: currentUser.uid,
                wishlist_id,
                product_id
            }))
        }
    }
    
    return (
        <button onClick={onAction_Wishlist}>
            Liked
        </button>
    )
}

export default AddWishlist;