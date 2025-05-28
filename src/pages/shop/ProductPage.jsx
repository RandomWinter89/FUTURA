import { useEffect, useState, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";
import { createReview, fetch_productReviews } from "../../features/reviewSlice";
import { addCart_item, updateItem_quantity } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";
import { toggleWishlist, updateWishlistToggle } from "../../features/wishlistSlice";


import { IconFramer, IconHeart } from "../../components/icon";
import { ToastOverlay, InputForm } from "../../components/ui";
import { Grid } from "../../components/shop";


import { ReviewContainer } from "../../components/shop";

//==============================

const ProductPage  = () => {
    const { products, productItem, productStatus } = useSelector((state) => state.products);
    const { productReviews, productReviewStatus } = useSelector((state) => state.reviews);
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

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    const uniqueColors = useMemo(() => {
        if (productItem.length != 0)
            return [...new Set(productItem.map(item => item.value1))];
        return null;
    }, [productItem])

    const availableSizes = useMemo(() => {
        if (selectedColor == null || selectedColor.trim().length == 0)
            return null;

        if (productItem.length != 0 && productItem.find(item => item.value1 === selectedColor).value2 != null)
            return [...new Set(
                productItem.filter(item => item.value1 === selectedColor)
            )];

        return null;
    }, [productItem, selectedColor])

    useEffect(() => {
        const result = productItem.find(item => {
            if (item.value2) 
                return item.value1 == selectedColor && item.id == selectedSize;

            return item.value1 == selectedColor;
        })

        if (result) {
            setSelectedVariation(result.id);
            setSelectCharge(parseFloat(result?.extra_charge).toFixed(2) || 0)
        }

    }, [productItem, selectedColor, selectedSize])

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
        if (selectedColor == null || selectedColor.trim().length == 0) 
            return;

        if (!carts.some((data) => data.product_id == id && data.product_variation_id == selectedVariation)){
            dispatch(addCart_item({
                cart_id: cart_id, 
                product_id: id, 
                product_variation_id: selectedVariation, 
                quantity: parseInt(quantity)
            }));
        } else {
            const item = carts.find(data => data.product_id == id && data.product_variation_id == selectedVariation);
            const newQuantity = parseInt(item.quantity) + parseInt(quantity);
            dispatch(updateItem_quantity({
                cart_id: cart_id, 
                product_id: id, 
                product_variation_id: selectedVariation, 
                quantity: newQuantity
            }))
        }

        setDesc("Added Cart");
        setOpen(true);
    }

    const onAddWishlist = (e) => {
        e.stopPropagation();

        if (!currentUser)
            return navigate("/Auth/Login");

        if (wishlistActionStatus == "loading")
            return;

        if (wishlists.find(data => data.product_id == data.id)) {
            setDesc("Remove from wishlist");
        } else {
            setDesc("Added to wishlist");
        }
        setOpen(true);

        dispatch(toggleWishlist({product_id: parseInt(id)}));
        dispatch(updateWishlistToggle({uid: currentUser.uid, product_id: id}));
    }

    const onAddComment = ({review, rating}) => {
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
                    <IconFramer />

                    <span onClick={() => navigate("/Shop/Category")} className="text-gray-500 cursor-pointer">
                        Category
                    </span>
                    <IconFramer />

                    <p>{product.name}</p>
                </div>
                
                {/* DETAIL CONTAINER */}
                <div className="flex gap-10 max-md:flex-col max-md:gap-6">
                    <div className="basis-1/2 max-lg:w-full">
                        <img 
                            src={product.imageUrl} 
                            className="w-full h-full object-cover aspect-[3/4]" 
                        />
                    </div>

                    {/* Product Showcase */}
                    <div className="max-lg:grow-0 grow w-full flex flex-col justify-center gap-6">
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
                                <option value={""}>Select Color</option>
                                {uniqueColors && uniqueColors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>

                            {(selectedColor != null && availableSizes != null) &&
                                <select 
                                    className="bg-white border border-black p-3 body2"
                                    onChange={(e) => {
                                        setSelectedSize(e.target.value);
                                    }}
                                >   
                                    <option value={""}>Select Size</option>
                                    {availableSizes.map(data => (
                                        <option key={data.id} value={data.id}>{data.value2}</option>
                                    ))}
                                </select>
                            }

                            <InputForm.Number 
                                onDecrement={decrementQuantity}
                                onIncrement={incrementQuantity}
                                quantity={quantity}
                                setQuantity={({value}) => setQuantity(value)}
                            />
                        </div>
                            
                        {/* R3 - ACTION BUTTON */}
                        <div className="flex gap-2">
                            <button onClick={onAddCart} className="flex-1 bg-black text-white py-4">
                                Add to Cart
                            </button>

                            <button onClick={onAddWishlist} className="size-auto aspect-square flex justify-center items-center border border-black">
                                <IconHeart filled={isWishlist} className={"text-black"} />
                            </button>
                        </div>
                    </div>

                    <span className="block basis-[30%] max-lg:hidden"/>
                </div>
            </section>

            <ReviewContainer 
                avgRating={product.average_rating}
                maxNumReview={product.number_of_reviews}
                reviewStatus={productReviewStatus}
                productReviews={productReviews}
                onUploadReview={({review, rating}) => 
                    onAddComment({review, rating})
                }
            />

            {/* MORE PRODUCT */}
            {sameCategoryProducts.length > 0 && 
                <section className="flex flex-col gap-4">
                    <h2>You May Also Like</h2>
                    <Grid 
                        collection={sameCategoryProducts} 
                        status={productStatus} 
                        variant={"detail"}
                    />
                </section>
            }

            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={desc}/>
        </>
    )
}

export default ProductPage;