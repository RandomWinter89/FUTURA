import { useDispatch } from "react-redux";
import { addWishlist_item } from "../../features/wishlistSlice";

const AddWishlist = ({product_id, currentUser}) => {
    const { wishlist_id,  wishlists } = useSelector((state) => state.wishlists);
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
        < >
        
        </>
    )
}

export default AddWishlist;