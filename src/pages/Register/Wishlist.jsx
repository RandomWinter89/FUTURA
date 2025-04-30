import { AuthContext } from "../../Context/AuthProvider";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistId, fetchWishlist_item, removeWishlist_item } from "../../features/wishlistSlice";


const WishlistPage = () => {
    const { wishlist_id, wishlists, loading } = useSelector((state) => state.wishlists);
    const { products, productItem } = useSelector((state) => state.products);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();

    const [highlightIndex, setHighlightIndex] = useState(0);
    const [wishlist_product, setWishlist_product] = useState([]);

    useEffect(() => {
        if (wishlist_id == null) {
            const uid = currentUser.uid;
            dispatch(fetchWishlistId(uid));
        }
            
    }, [])

    useEffect(() => {
        if (wishlist_id != null && wishlists.length === 0)
            dispatch(fetchWishlist_item(wishlist_id));
    }, [dispatch, wishlist_id])

    // ==== Function ===================>

    const onHandle_RemoveWishlist_item = ({product_item_id, wishlist_id}) => {
        const uid = currentUser.uid;
        dispatch(removeWishlist_item({uid, product_item_id, wishlist_id}))
    }

    // ==== Return Content ============>

    return (
        < >
            {loading && <p>Loading</p>}
            {(!loading && wishlist_product.length != 0) && wishlist_product.map((data, index) => 
                <section key={data.uid}>
                    <p>Index: {index + 1}</p>
                </section>
            )}

            {(!loading && wishlist_product.length == 0) && <p>No item in wishlist</p>}
        </>
    )
}

export default WishlistPage;