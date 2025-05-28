import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { removeCartItem, updateItem_quantity } from "../../features/cartsSlice";

import { IconFramer, IconBin} from "../../components/icon";
import { Button, InputForm } from "../../components/ui";

const CartItem = ({data, product, quantity, onCallUpdate, onCallRemoval}) => {
    const [qty, setQty] = useState(quantity);
    const originalQuantity = useRef(quantity);

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
        if (qty !== originalQuantity.current)
            onCallUpdate({quantity: parseInt(qty)});
    }, [qty])

    useEffect(() => {
        originalQuantity.current = quantity;
    }, [quantity])

    const subtotal = ((parseFloat(data.base_price) + parseFloat(data.extra_charge)) * data.quantity);

    return (
        <div className="flex-1 flex gap-2 max-md:flex-col max-md:gap-4">
            <img src={product.imageUrl} className="w-32 skeleton aspect-square object-cover border border-gray-300 bg-opacity-30 max-md:w-full"/>

            <div className="flex-1 flex justify-between max-md:flex-col max-md:gap-2">
                <div className="flex flex-col max-lg:gap-1">
                    <p className="subtitle1 mb-2">{data.name}</p>
                    {data.name1 != null && <p className="body2 opacity-60">Color: {data.value1}</p>}
                    {data.name2 != null && <p className="body2 opacity-60">Size: {data.value2}</p>}

                    <h3 className="mt-auto">RM{subtotal}</h3>
                </div>

                
                <div className="flex flex-col justify-between items-end max-md:flex-row-reverse max-md:items-center">
                    <button onClick={onCallRemoval} >
                        <IconBin className={"stroke-red-600 hover:scale-150 hover:stroke-red-900 transition-all duration-300"} />
                    </button>

                    <InputForm.Number 
                        onDecrement={decrementQuantity}
                        onIncrement={incrementQuantity}
                        quantity={qty}
                        setQuantity={({value}) => setQty(value)}
                    />
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
    const { products, productStatus } = useSelector((state) => state.products);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    useEffect(() => {
        console.log("Cart Quantities Updated:", cartStatus, carts);
    }, []);

    return (
        <section className="flex flex-col gap-11 max-md:gap-6 max-sm:gap-3">
            {/* Breadcrumb */}
            <div className="body2 w-fit flex gap-2 items-center">
                <span onClick={() => navigate("/Shop/Homepage")} className="text-gray-500 cursor-pointer hover:scale-125 hover:text-orange-600 transition-all duration-300">
                    Home
                </span>
                
                <IconFramer className={"max-md:w-4"}/>

                <span>Carts</span>
            </div>

            <div className="flex flex-col gap-11 max-md:gap-4">
                <h2>Your Cart</h2>

                <div className="flex gap-16 max-md:flex-col">
                    {/* Cart List */}
                    <div className="flex-1 flex flex-col gap-6 max-md:grid max-md:grid-cols-2 max-sm:grid-cols-1">
                        {cartStatus == "loading" && 
                            <h3>Fetching Cart Item</h3>
                        }
                        
                        {cartStatus == "failed" && 
                            <h3>No Item in Cart</h3>
                        }
                        
                        {(cartStatus ==  "succeed" && productStatus == "succeed") && carts.map((item, index) =>
                            <div className="flex flex-col gap-6" key={index}>
                                <CartItem 
                                    key={index}
                                    data={item}
                                    product={products.find((prev) => prev.id == item.product_id)}
                                    quantity={cartQuantities[item.id] || item.quantity}
                                    onCallUpdate={({quantity}) => onReceiveCall(item.id, quantity, item.product_id, item.product_variation_id)}
                                    onCallRemoval={() => onReceiveCall_Remove(item.product_id, item.product_variation_id)}
                                /> 

                                {index != carts.length - 1 && <hr key={index + 1} className="border-gray-400"/>}
                            </div>
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
                                <h3>RM{total + 15}</h3>
                            </span>
                        </div>

                        <Button 
                            onClick={() => navigate("/User/Checkout")}
                        >
                            Proceed Checkout
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartPage;