import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchProducts, fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";
import { createReview, fetch_productReviews } from "../../features/reviewSlice";
import { fetchAllUser } from "../../features/usersSlice";
import { fetchCartId, addCart_item } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";
import { fetchWishlistId, addWishlist_item } from "../../features/wishlistSlice";

const ProductPage  = () => {
    const { products, productItem, itemVariation } = useSelector((state) => state.products);
    const { productReviews, productReviews_loading } = useSelector((state) => state.reviews);
    const { users, users_loading } = useSelector((state) => state.users);
    const { wishlist_id } = useSelector((state) => state.wishlists);
    const { cart_id } = useSelector((state) => state.carts);

    const { currentUser } = useContext(AuthContext) || null;

    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(0);

    const [selectCharge, setSelectCharge] = useState(0);
    const { id } = useParams();

    const finalPrice = parseFloat(selectCharge) + parseFloat(product?.base_price);

    const [finalRating, setFinalRating] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Product . Product Variation . Variation
    //User

    useEffect(() => {
        if (products.length === 0)
            dispatch(fetchProducts());

        if (productItem.length === 0)
            dispatch(fetchProductItem(parseInt(id)));

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());

        if (productReviews.length === 0)
            dispatch(fetch_productReviews(id));

        if (users.length === 0)
            dispatch(fetchAllUser());

        if (cart_id == null || cart_id.length == 0)
            dispatch(fetchCartId(currentUser.uid));

        if (wishlist_id == null)
            dispatch(fetchWishlistId(currentUser.uid));
    }, [dispatch])

    useEffect(() => {
        if (products.length !== 0)
            setProduct(products.find(item => item.id === parseInt(id)));
    }, [products])

    useEffect(() => {
        if (productReviews.length !== 0) {
            const total = productReviews.reduce((total, item) => total + item.rating_value, 0);
            const average = total / productReviews.length;
            setFinalRating(average);
        }

    }, [productReviews])

    const onReturn = () => navigate(-1);

    const onAddCart = () => {
        dispatch(addCart_item({
            cart_id: cart_id, 
            product_id: id, 
            product_variation_id: selectedVariation, 
            quantity: quantity
        }));
    }

    const onAddWishlist = () => {
        if (wishlist_id != null) {
            dispatch(addWishlist_item({
                uid: currentUser.uid, 
                wishlist_id: wishlist_id, 
                product_id: id
            }));
        }
    }

    // Section Comment:
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0.0);
    const onAddComment = (e) => {
        e.preventDefault();
        console.log("Review:", review);
        dispatch(createReview({
            uid: currentUser.uid, 
            product_id: parseInt(id), 
            comment: review, 
            rating_value: rating
        }))
    }

    return (
        <main className="my-4">
            {/* Return Button & Title */}
            <section>
                <button onClick={onReturn} className="border border-black py-2 px-6 w-fit hover:bg-black hover:text-white">{`<<`}</button>
                <h1>Product #{id}</h1>
                <p>Here's the preview of the product</p>
            </section>

            {/* Product Showcase */}
            {product != null && (
                <section className="bg-yellow-100 my-4">
                    <h2>Name: {product.name}</h2>
                    <p>Category ID: {product.category_id}</p>
                    <p>Description: {product.description}</p>
                    <p>Base Price: MYR{product.base_price}</p>
                    <p>SKU: {product.sku}</p>
                    {(product.created_date != undefined) && <p>Created Date: {product.created_date.split("T")[0].split("-").join("/")}</p>}
                </section>
            )}

            {/* Product Options */}
            <section className="flex flex-col gap-2 bg-slate-200 my-4 p-4">
                <select 
                    className="bg-slate-600 text-white py-4 px-4 rounded-lg" 
                    onChange={(e) => {
                        setSelectedVariation(e.target.selectedOptions[0].dataset.id); 
                        setSelectCharge(e.target.selectedOptions[0].dataset.extra);
                    }}>

                    {productItem
                        .filter(item => item.product_id == id)
                        .map((item) => {
                            const color = itemVariation.find(data => data.variation_option_id == item.variation_option_id)?.value;
                            const size = itemVariation.find(data => data.variation_option_id == item.variation_option_2_id)?.value;
                            const extra = parseFloat(item.extra_charge) > 0 ? ` | Extra Charge: ${item.extra_charge}` : "";

                            return (
                                <option key={item.id} value={item.id} data-id={item.id} data-extra={item.extra_charge}>
                                    COLOR: {color} | SIZE: {size} | Stock: {item.quantity} {extra}
                                </option>
                            )
                        }
                    )} 
                </select>
            </section>

            {/* Quantity and Add Cart */}
            <section className="flex flex-col gap-4 my-4">
                <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)} 
                    className="min-w-fit w-60 border border-black py-2 px-4"
                />

                <button 
                    onClick={onAddCart}
                    className="min-w-fit w-60 border border-black py-2 px-4 rounded-lg"
                >
                    Add Cart
                </button>
            </section>

            {/* Wishlist */}
            <section>
                <button 
                    onClick={onAddWishlist}
                    className="border border-black py-2 px-6 w-fit"
                >Add Wishlist</button>
            </section>

            {/* Pricing and Rating */}
            <section>
                <p>MYR {finalPrice}</p>
                {finalRating != 0 && <p>Rating {finalRating}</p>}
            </section>

            <hr className="border-black my-4"/>

            <section className="flex flex-col gap-4" onSubmit={onAddComment}>
                <h2>Customer Review</h2>
                <form className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label>Rating: {rating}</label>
                        <input type="range" min="0" max="5.0" step="0.1"
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)} 
                            className="w-fit"
                        />
                    </div>

                    <textarea 
                        onChange={(e) => setReview(e.target.value)}
                        className="border border-black min-h-fit px-2 w-fit"
                    />

                    <button 
                        className="w-fit border-2 border-black py-2 px-6 rounded-xl"
                        type="submit"
                    >Add comment</button>
                </form>

                {(!productReviews_loading && !users_loading) && 
                    <div className="flex flex-wrap gap-4">
                    {productReviews.map((data, index) => 
                            <div key={index} className="border border-black rounded-xl w-fit p-4">
                                <p>ID: {data.product_id}</p>
                                <p>Date: {data.created_datetime.split("T")[0].split("-").join(" / ")}</p>
                                <p>Comment: {data.comment}</p>
                                <p>Rating: {data.rating_value}</p>
                            </div>
                    )}
                    </div>
                }
            </section>

            <hr className="border-black my-4" />

            {/* Product Random in Same Category */}
            <section className="flex flex-col gap-4">
                <h2>Other Product under same Category</h2>
                <div className=" flex flex-wrap gap-2">
                    {products
                        .filter((data) => (data.id != id && data.category_id == product.category_id))
                        .map((data) => 
                        <div 
                            onClick={() => navigate(`/Product/${data.id}`)}
                            className="border-2 border-black p-4 bg-red-100 cursor-pointer">
                            <p>Product Name: {data.name}</p>
                            <p>Price: {data.base_price}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default ProductPage;