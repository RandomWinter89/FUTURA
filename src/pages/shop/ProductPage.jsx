import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchProducts, fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";
import { createReview, fetch_productReviews } from "../../features/reviewSlice";
import { fetchAllUser } from "../../features/usersSlice";
import { addCart_item, updateItem_quantity } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";
import { addWishlist_item } from "../../features/wishlistSlice";

import { Card } from "../../components/ui";

const ProductPage  = () => {
    const { products, productItem, itemVariation } = useSelector((state) => state.products);
    const { productReviews, productReviews_loading } = useSelector((state) => state.reviews);
    const { users, users_loading } = useSelector((state) => state.users);
    const { wishlist_id, wishlists } = useSelector((state) => state.wishlists);
    const { carts, cart_id } = useSelector((state) => state.carts);

    const { currentUser } = useContext(AuthContext) || null;

    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(0);

    const [selectCharge, setSelectCharge] = useState(0);
    const { id } = useParams();

    const finalPrice = parseFloat(selectCharge) + parseFloat(product?.base_price);

    const dispatch = useDispatch();

    useEffect(() => {
        if (productItem.length === 0)
            dispatch(fetchProductItem(parseInt(id)));

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());

        if (productReviews.length === 0)
            dispatch(fetch_productReviews(id));

        if (users.length === 0)
            dispatch(fetchAllUser());
    }, [dispatch])

    useEffect(() => {
        if (products.length !== 0)
            setProduct(products.find(item => item.id === parseInt(id)));
    }, [products])


    const onAddCart = () => {

        if (!carts.some((data) => data.product_id == id && data.product_variation_id == selectedVariation)){
            dispatch(addCart_item({
                cart_id: cart_id, 
                product_id: id, 
                product_variation_id: selectedVariation, 
                quantity: quantity
            }));
        } else {
            const item = carts.find(data => data.product_id == id && data.product_variation_id == selectedVariation);
            dispatch(updateItem_quantity({
                cart_id: cart_id, 
                product_id: id, 
                product_variation_id: selectedVariation, 
                quantity: parseInt(item) + 1
            }))
        }
    }

    const onAddWishlist = (e) => {
        e.preventDefault();

        if (wishlist_id === null)
            return;

        if (wishlists.length === 0 || !wishlists.some((data) => data.product_id === id))
            return dispatch(addWishlist_item({uid: currentUser.uid, wishlist_id, id}));
    }

    // Section Comment:
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0.0);
    const onAddComment = (e) => {
        e.preventDefault();

        dispatch(createReview({
            uid: currentUser.uid, 
            product_id: parseInt(id), 
            comment: review, 
            rating_value: rating
        }))
    }

    return (
        <main className="flex flex-col gap-14 my-14">
            {/* Product Interaction */}
            <section className="flex gap-10 max-sm:flex-col">
                <img src={product.imageUrl} className="flex-1 bg-purple-300 w-full aspect-[3/4]" />

                {/* Product Showcase */}
                {product != null && (
                    <div className="flex-1 flex flex-col gap-3 justify-center">
                        <div className="flex flex-col gap-1">
                            <h2>{product.name}</h2>
                            <p className="flex gap-4 font-light">
                                <strong className="font-semibold">Product Number</strong> 
                                {product.sku}
                            </p>
                            <p>{product.description}</p>

                            {product.average_rating != 0 && (
                                <p className="my-3 text-lg">
                                    Rating: {parseFloat(product.average_rating)} 
                                    <strong className="font-normal text-sm"> / 5 ({product.number_of_reviews} reviews)</strong>
                                </p>
                            )}
                        </div>

                        <hr className="border-gray-400" />

                        {/* Pricing */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-4xl leading-none font-semibold">
                                    RM {finalPrice}
                                </p>
                                <p className="text-gray-600 italic text-sm leading-none">
                                    Including consumption tax
                                </p>
                            </div>

                            {/* Variation Option */}
                            <select 
                                className="bg-white border border-black p-3 rounded-lg" 
                                onChange={(e) => {
                                    setSelectedVariation(e.target.selectedOptions[0].dataset.id); 
                                    setSelectCharge(e.target.selectedOptions[0].dataset.extra);
                                }}
                            >
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

                            <input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)} 
                                className="border border-black py-2 px-4"
                            />

                            <div className="flex gap-2">
                                <button onClick={onAddCart} className="flex-1 bg-slate-700 text-white text-lg font-semibold py-2 rounded-lg">
                                    Add Cart
                                </button>

                                <button onClick={onAddWishlist} className="flex-[0.2] border border-black py-2 rounded-lg">
                                    Liked
                                </button>
                            </div>
                            
                            {/* {(product.created_date != undefined) && <p>Created Date: {product.created_date.split("T")[0].split("-").join("/")}</p>} */}
                        </div>
                    </div>
                )}
            </section>

            <section className="my-4">
                <hr className="border-gray-400" />
            </section>

            {/* Customer Review */}
            <section className="flex flex-col gap-4" onSubmit={onAddComment}>
                <h2>Customer Review</h2>
                <div className="flex gap-4">
                    <form className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="flex gap-2 items-center">
                                <p>PLEASE ENTER YOUR RATING</p> 
                                <span className="text-2xl">{rating}</span>
                            </label>

                            <input type="range" min="0" max="5.0" step="0.1"
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)}
                                className="w-fit"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>COMMENT</label>
                            <textarea 
                                onChange={(e) => setReview(e.target.value)}
                                className="border border-black min-h-fit py-2"
                            />
                        </div>

                        <button 
                            className="border border-black py-2 rounded-lg"
                            type="submit"
                        >Add comment</button>
                    </form>

                    <hr className="border-r border-gray-400 mx-2 h-auto" />

                    {(!productReviews_loading && !users_loading) && 
                        <div className="flex-[0.6] h-fit overflow-y-auto grid gap-4 grid-cols-1">
                            {productReviews.map((data, index) => 
                                <div key={index} className="border border-black rounded-lg p-4 h-fit">
                                    <p>Date: {data.created_datetime.split("T")[0].split("-").join("/")}</p>
                                    <p>Comment: {data.comment}</p>
                                    <p>Rating: {data.rating_value}</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </section>


            <section className="my-4">
                <hr className="border-gray-400" />
            </section>

            {/* Product Random in Same Category */}
            <section className="flex flex-col gap-4">
                <h2>Other Product under same Category</h2>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-4 max-sm:grid-cols-2">
                    {products
                        .filter((data) => (data.id != id && data.category_id == product.category_id))
                        .map((data) => 
                        
                        <Card 
                            key={data.id} 
                            product={data} 
                            imageUrl={data.imageUrl} 
                            onAddWishlist={() => console("Hello")}
                        />
                    )}
                </div>
            </section>
        </main>
    )
}

// onWishlistProduct({id: data.id})

export default ProductPage;