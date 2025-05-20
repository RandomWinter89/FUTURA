import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart_item, fetchCartId, removeCartItem, updateItem_quantity } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";

import framer from "../../assets/svg/Frame.svg";
import dash from "../../assets/svg/dash.svg";
import plus from "../../assets/svg/plus.svg";
import bin from "../../assets/svg/deleteBin.svg";


const CartItem = ({data, product, quantity, onCallUpdate, onCallRemoval,}) => {
    const [qty, setQty] = useState(1);

    const incrementQuantity = () => {
        setQty(prev => {
            if (prev + 1 >= 100)
                return 99;

            return prev + 1;
        })
    }

    const decrementQuantity = () => {
        setQty(prev => {
            if (prev - 1 <= 0)
                return 1;

            return prev - 1;
        })
    }

    useEffect(() => {
        onCallUpdate({quantity: parseInt(qty)});
    }, [qty])

    const subtotal = ((parseFloat(data.base_price) + parseFloat(data.extra_charge)) * data.quantity);

    return (
        <div className="flex gap-2 p-4 max-md:flex-col">
            <img src={product.imageUrl} className="w-32 aspect-square object-cover max-md:w-full"/>

            <div className="flex-1 flex justify-between max-md:flex-col">
                <div className="flex flex-col justify-between">
                    <p className="subtitle1">{data.name}</p>
                    {data.name1 != null && <p>Color: {data.value1}</p>}
                    {data.name2 != null && <p>Size: {data.value2}</p>}

                    <h3 className="mt-auto">MYR{subtotal}</h3>
                </div>

                
                <div className="flex flex-col justify-between items-end">
                    <button onClick={onCallRemoval} >
                        <img src={bin} />
                    </button>

                    <div className="w-fit max-h-12 flex gap-2 border border-black">
                        <button onClick={decrementQuantity} className="p-2">
                            <img src={dash} />
                        </button>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => {
                                if (e.target.value >= 100)
                                    return setQty(99)

                                if (e.target.value <= 0)
                                    return setQty(1)

                                setQty(e.target.value);
                            }}
                            className="border-none text-center w-16"
                        />
                        <button onClick={incrementQuantity} className="p-2">
                            <img src={plus} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CartPage = () => {
    const [cartQuantities, setCartQuantities] = useState({});
    const [total, setTotal] = useState(0.00);

    // User Authentication
    const { cart_id, carts, cartStatus } = useSelector((state) => state.carts);
    const { products } = useSelector((state) => state.products);
    const { currentUser } = useContext(AuthContext) || null;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (cart_id == null)
            dispatch(fetchCartId(currentUser.uid));
    }, [dispatch]);
    
    useEffect(() => {
        if (cart_id != null)
            dispatch(fetchCart_item(cart_id));

    }, [dispatch, cart_id]);

    useEffect(() => {
        if (carts.length != 0) {
            const price = carts.reduce((total, item) => 
                total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity)
            , 0)
            setTotal(price);
        } else {
            setTotal(0);
        }
    }, [carts])

    useEffect(() => {
        if (carts.length > 0) {
            const initialQuantities = {};
            carts.forEach(item => {
                initialQuantities[item.id] = item.quantity;
            });
            setCartQuantities(initialQuantities);
        }
    }, [carts]);

    const onReceiveCall = (itemIndex, quantity, product_id, product_variation_id) => {
        setCartQuantities(prevState => ({
            ...prevState,
            [itemIndex]: quantity
        }));

        dispatch(updateItem_quantity({
            cart_id: cart_id, 
            product_id: product_id, 
            product_variation_id: product_variation_id, 
            quantity: quantity
        }))
    }

    const onReceiveCall_Remove = (product_id, product_variation_id) => {
        dispatch(removeCartItem({
            cart_id: cart_id, 
            product_id: product_id, 
            product_variation_id: product_variation_id
        }))
    }

    return (
        <section className="flex flex-col gap-11">
            {/* Breadcrumb */}
            <div className="body2 w-fit flex gap-2">
                <span onClick={() => navigate("/Shop/Homepage")} className="text-gray-500 cursor-pointer">
                    Home
                </span>
                <img src={framer} className="flex-1 aspect-square"/>

                <span className="cursor-pointer">
                    Carts
                </span>
            </div>

            <div className="flex flex-col gap-11">
                <h2>Your Cart</h2>

                <div className="flex gap-16">
                    {/* Cart List */}
                    <div className="flex-1 flex flex-col gap-6">
                        {cartStatus == "loading" && 
                            <h3>Fetching Cart Item</h3>
                        }
                        
                        {cartStatus ==  "succeed" && carts.map((item, index) =>
                            < >
                                <CartItem 
                                    key={index}
                                    data={item}
                                    product={products.find((prev) => prev.id == item.product_id)}
                                    quantity={cartQuantities[item.id]}
                                    onCallUpdate={({quantity}) => onReceiveCall(item.id, quantity, item.product_id, item.product_variation_id)}
                                    onCallRemoval={() => onReceiveCall_Remove(item.product_id, item.product_variation_id)}
                                /> 

                                {index != carts.length - 1 && <hr key={index} className="border-gray-400"/>}
                            </>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="flex-[0.6] flex flex-col gap-6">
                        <h3>Order Summary</h3>

                        <div className="flex flex-col gap-5">
                            <span className="flex gap-2 justify-between items-center">
                                <p className="subtitle1 font-normal opacity-60">Subtotal</p>
                                <p className="subtitle1">RM{total}</p>
                            </span>

                            <span className="flex gap-2 justify-between items-center">
                                <p className="subtitle1 font-normal opacity-60">Delivery</p>
                                <p className="subtitle1">RM15</p>
                            </span>

                            <hr className="border-gray-400"/>

                            <span className="flex gap-2 justify-between items-center">
                                <p className="subtitle1 font-normal opacity-60">Total</p>
                                <h3>RM{total}</h3>
                            </span>
                        </div>

                        <button 
                            onClick={() => navigate("/User/Checkout")} 
                            className="bg-black text-white py-4"
                        >
                            Proceed Checkout
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartPage;