import { useEffect, useState, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";
import { createReview, fetch_productReviews } from "../../features/reviewSlice";
import { addCart_item, updateItem_quantity } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";
import { toggleWishlist, updateWishlistToggle } from "../../features/wishlistSlice";

import { ToastOverlay } from "../../components/ui";
import { Grid } from "../../components/shop";

import arrow_left from "../../assets/svg/arrow-left.svg";
import arrow_right from "../../assets/svg/arrow-right.svg";
import framer from "../../assets/svg/Frame.svg";

import dash from "../../assets/svg/dash.svg";
import plus from "../../assets/svg/plus.svg";

import { Button } from "../../components/ui";


import { StarRating } from "../../components/common";
import { IconArrowLeft, IconArrowRight, IconHeart, IconFramer } from "../../components/icon";

//==============================

const ITEMS_PER_PAGE = 4;

// PRODUCT HAS 3 STUFF
// 1. Product itself
// 2. Product Variation
// 3. Product Reviews 

// 4. Product Wishlist and Cart

const ProductPage  = () => {
    const { products, productItem, products_loading } = useSelector((state) => state.products);
    const { productReviews, productReviews_loading } = useSelector((state) => state.reviews);
    const { wishlists, wishlistActionStatus } = useSelector((state) => state.wishlists);
    const { carts, cart_id } = useSelector((state) => state.carts);

    const { currentUser } = useContext(AuthContext) || null;

    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(0);

    const [selectCharge, setSelectCharge] = useState(0);
    const { id } = useParams();

    const finalPrice = parseFloat(selectCharge) + parseFloat(product?.base_price);

    const isWishlist = useMemo(() => {
        return wishlists.find(info => info.product_id == id)
    }, [wishlists, id])

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [desc, setDesc] = useState("");

    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const maximumPage = useMemo(() => {
        if (productReviews.length != 0)
            return Math.ceil(productReviews.length / ITEMS_PER_PAGE)

        return 0;
    }, [productReviews]);

    const handleNext = () => setPage((p) => Math.min(p + 1, maximumPage - 1));
    const handlePrev = () => setPage((p) => Math.max(p - 1, 0));


    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    const uniqueColors = useMemo(() => {
        if (productItem.length != 0)
            return [...new Set(productItem.map(item => item.value1))];
        return [];
    }, [productItem])

    const availableSizes = useMemo(() => {
        if (productItem.length != 0 && selectedColor != null)
            return [...new Set(
                productItem.filter(item => item.value1 === selectedColor)
            )];

        return []
    }, [selectedColor])

    const currentItem = useMemo(() => {
        if (productReviews.length != 0)
            return productReviews.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
        return [];
    }, [page, productReviews]);

    //Modified Number
    const incrementQuantity = () => {
        setQuantity(prev => {
            if (prev + 1 >= 100)
                return 99;

            return prev + 1;
        })
    }

    const decrementQuantity = () => {
        setQuantity(prev => {
            if (prev - 1 <= 0)
                return 1;

            return prev - 1;
        })
    }
    
    //USE EFFECT
    useEffect(() => {
        dispatch(fetchProductItem(parseInt(id)));
        dispatch(fetch_ProductVariation());
        dispatch(fetch_productReviews(id));
    }, [dispatch, id])

    useEffect(() => {
        if (products.length !== 0)
            setProduct(products.find(item => item.id === parseInt(id)));
    }, [products, id])

    useEffect(() => {
        if (productItem.length != 0)
            setSelectedVariation(productItem[0].id)
    }, [productItem])

    //ACTION

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

        setDesc("Added Cart");
        setOpen(true);
    }

    const onAddWishlist = (prodId) => {
        if (wishlistActionStatus == "loading")
            return;

        if (!wishlists.find(data => data.product_id == data.id)) {
            setDesc("Added to wishlist");
        } else {
            setDesc("This item is in wishlist already");
        }
        setOpen(true);

        dispatch(toggleWishlist({product_id: prodId}));
        dispatch(updateWishlistToggle({uid: currentUser.uid, product_id: prodId}));
    }

    //REVIEW
    const [reviewMode, setReviewMode] = useState(false);
    const [review, setReview] = useState(""); 
    const [rating, setRating] = useState(0);
    const onAddComment = () => {
        if (!productReviews.find(rev => rev.created_by_userid == currentUser.uid)) { 
            dispatch(createReview({
                uid: currentUser.uid, 
                product_id: parseInt(id), 
                comment: review, 
                rating_value: rating
            }))

            setDesc("Your review is added");
            setOpen(true);
        } else {
            setDesc("You already review it");
            setOpen(true);
        }
    }


    const productRate = useMemo(() => {
        return Math.round(product.average_rating);
    }, [product])

    //Optimized Category
    const sameCategoryProducts = useMemo(() => {
        return products.slice().filter((info) => info.id != id && info.category_id == product.category_id);
    }, [id, product.category_id, products]);

    return (
        <>
            {/* ROW 1 - DETAIL */}
            <section className="flex flex-col gap-12">
                {/* CAN MAKE IT INTO ELEMENT */}
                <div className="body2 w-fit flex gap-2">
                    <span onClick={() => navigate("/Shop/Homepage")} className="text-gray-500 cursor-pointer">
                        Home
                    </span>
                    <img src={framer} className="flex-1 aspect-square"/>

                    <span onClick={() => navigate("/Shop/Category")} className="text-gray-500 cursor-pointer">
                        Category
                    </span>
                    <img src={framer} className="flex-1 aspect-square"/>

                    <p>{product.name}</p>
                </div>
                
                {/* DETAIL CONTAINER */}
                <div className="flex gap-10 max-sm:flex-col">
                    <img 
                        src={product.imageUrl} 
                        className="flex-[0.5] w-full aspect-[3/4] object-cover" 
                    />

                    {/* Product Showcase */}
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {/* R1 - Content */}
                        <div className="flex flex-col gap-6">
                            {/* TITLE AND DESCRIPTION */}
                            <div className="flex flex-col gap-1">
                                <h1>{product.name}</h1>
                                <p className="mt-2 body1 opacity-65">{product.description}</p>
                            </div>

                            {/* PRICE AND CAPTION */}
                            <div className="flex items-end gap-3">
                                <h2 className="leading-none">RM{finalPrice}</h2>
                                <p className="link opacity-65">Including consumption tax</p>
                            </div>
                        </div>

                        <hr className="border-gray-400" />

                        {/* R2 - Variation */}
                        <div className="flex flex-col gap-3">
                            {/* Variation Option */}
                            <select
                                className="bg-white border border-black p-3 body2"
                                onChange={(e) => {
                                    setSelectedColor(e.target.value);
                                    setSelectedSize(null);
                                }}
                            >
                                <option value={null}>Select Color</option>
                                {uniqueColors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>

                            {selectedColor && (
                                <select 
                                    className="bg-white border border-black p-3 body2"
                                    onChange={(e) => {
                                        setSelectedSize(e.target.value);
                                    }}
                                >
                                    <option value={null}>Select Size</option>
                                    {availableSizes.map(data => (
                                        <option key={data.id} value={data.id}>{data.value2}</option>
                                    ))}
                                </select>
                            )}

                            <div className="w-fit flex border border-black">
                                <button onClick={decrementQuantity} className="px-5 py-4 hover:bg-slate-200">
                                    <img src={dash} />
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity}
                                    onChange={(e) => {
                                        if (e.target.value >= 100)
                                            return setQuantity(99)

                                        if (e.target.value <= 0)
                                            return setQuantity(1)

                                        setQuantity(e.target.value);
                                    }}
                                    className="border-none text-center w-16"
                                />
                                <button onClick={incrementQuantity} className="px-5 py-4">
                                    <img src={plus} />
                                </button>
                            </div>
                        </div>
                            
                        {/* R3 - ACTION BUTTON */}
                        <div className="flex gap-2">
                            <button onClick={onAddCart} className="flex-1 bg-black text-white py-4">
                                Add to Cart
                            </button>

                            <button onClick={() => onAddWishlist(id)} className="aspect-square flex justify-center items-center border border-black py-2">
                                <IconHeart filled={isWishlist} className={"text-black"} />
                            </button>
                        </div>
                    </div>

                    <span className="flex-[0.3] max-lg:hidden"/>
                </div>
            </section>

            {/* REVIEW */}
            <section className="flex flex-col gap-8">
                {/* HEADER */}
                <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-4">
                    {/* TITLE */}
                    <div className="flex gap-6 max-sm:flex-col max-sm:gap-2 max-sm:w-full">
                        <h2>Reviews</h2>
                        {/* Star Rating */}
                        <div className="flex gap-4 items-center">
                            {/* ICON */}
                            <StarRating rate={productRate} />

                            {/* VALUE */}
                            <p className="body2">
                                {parseFloat(product.average_rating).toFixed(1)} ({product.number_of_reviews})
                            </p>
                        </div>
                    </div>
                    
                    {/* ACTION BUTTON */}
                    <div className="flex gap-3 max-sm:w-full">
                        {reviewMode &&
                            <Button onClick={() => setReviewMode(false)} size={"sm"}>
                                Cancel Review
                            </Button>
                        }

                        <Button 
                            onClick={() => {
                                if (reviewMode) {
                                    onAddComment()
                                } else {
                                    setReviewMode(true);
                                }  
                            }}
                            variant={"primary_outline"}
                            size={"sm"}
                        >
                           {!reviewMode ? "Write a Review" : "Submit Review"}
                        </Button>
                    </div>
                </div>

                {/* FORM */}
                {reviewMode && 
                    <div className="flex flex-col gap-6 max-sm:gap-3">
                        <label className="flex gap-4 body2 max-sm:items-center">
                            Rating: 
                            <div className="flex gap-1">
                                <StarRating preview={false} rate={rating} setRate={(value) => setRating(value)} />
                            </div>
                        </label>

                        <label className="flex flex-col gap-5 body2 max-sm:gap-3">
                            Comments
                            <textarea 
                                placeholder={"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."}
                                onChange={(e) => setReview(e.target.value)}
                                className="border border-black min-h-fit p-8"
                            />
                        </label>
                    </div>
                }

                <hr className="border-gray-300" />

                {/* REVIEW */}
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                        {(!productReviews_loading) && 
                            currentItem.map((data, index) => 
                                <div key={index} className="border border-black p-9 flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <StarRating rate={Math.round(data.rating_value)} />
                                        <p className="subtitle1">{data.username} : {data.rating_value}</p>
                                        <p className="body2 opacity-60">"{data.comment}"</p>
                                    </div>
                                    
                                    
                                    <p className="body2 opacity-60">Posted on: {data.created_datetime.split("T")[0].split("-").join("/")}</p>
                                </div>
                            )
                        }
                    </div>

                    {/* Arrow Head */}
                    <div className="flex gap-4">
                        <button onClick={handlePrev} disabled={page === 0}>
                            <img src={arrow_left} />
                        </button>

                        <p className="body2">{page}</p>

                        <button onClick={handleNext} disabled={page >= maximumPage - 1}>
                            <img src={arrow_right} />
                        </button>
                    </div>
                </div>
            </section>
            
            {/* MORE PRODUCT */}
            <section className="flex flex-col gap-4">
                <h2>You May Also Like</h2>
                <Grid collection={sameCategoryProducts} isLoading={products_loading} variant={"detail"}/>
            </section>

            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={desc}/>
        </>
    )
}

export default ProductPage;