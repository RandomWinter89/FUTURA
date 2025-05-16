import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart_item, fetchCartId, removeCartItem, updateItem_quantity } from "../../features/cartsSlice";

import { AuthContext } from "../../Context/AuthProvider";

const CartItem = ({
        data,
        product,
        quantity,
        onCallUpdate,
        onCallRemoval,
    }) => {

    const subtotal = ((parseFloat(data.base_price) + parseFloat(data.extra_charge)) * data.quantity);

    console.log("imageUrl", data);
    return (
        <div className="flex gap-2 border border-black p-4">
            <img src={product.imageUrl} className="flex-1 aspect-[3/4] object-cover"/>

            <div className="flex-1 flex flex-col gap-2 my-auto">
                <p>{data.name}</p>
                {data.name1 != null && <p>Color: {data.value1}</p>}
                {data.name2 != null && <p>Size: {data.value2}</p>}

                <hr className="border-black"/>

                <p>Subtotal price: MYR{subtotal}</p>

                <input 
                    type="number" 
                    value={quantity} 
                    min="1"
                    max="99"
                    onChange={(e) => onCallUpdate({quantity: parseInt(e.target.value)})} 
                />

                <button 
                    onClick={onCallRemoval} 
                    className="my-auto border border-black py-2 px-6 h-fit rounded-lg"
                >
                    X
                </button>
            </div>
        </div>
    )
}

const CartPage = () => {
    const [cartQuantities, setCartQuantities] = useState({});
    const [total, setTotal] = useState(0.00);

    // User Authentication
    const { cart_id, carts, cart_loading } = useSelector((state) => state.carts);
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

    const onNavigate_Homepage = () => navigate("/Shop/Homepage");

    return (
        < >
            <section className="flex gap-2">
                {/* Cart */}
                <section className="flex flex-wrap gap-4">
                    {carts.map((item, index) => 
                        <CartItem key={index}
                            data={item}
                            product={products.find((prev) => prev.id == item.product_id)}
                            quantity={cartQuantities[item.id]}
                            onCallUpdate={({quantity}) => onReceiveCall(item.id, quantity, item.product_id, item.product_variation_id)}
                            onCallRemoval={() => onReceiveCall_Remove(item.product_id, item.product_variation_id)}
                        /> 
                    )}
                </section>

                {/* Order Summary */}
                <section className="flex flex-col gap-2">
                    <div className="py-4 px-2 flex flex-col border border-black">
                        <h2>Order Summary</h2>
                        <hr className="border-black mb-4"/>

                        <p>Subtotal: MYR {total}</p>
                        <p>Order total: MYR {total}</p>

                        <hr className="border-black my-4"/>
                        <button onClick={() => navigate("/User/Checkout")} 
                            className="border border-black py-4 bg-emerald-300"
                        >
                            Proceed Checkout
                        </button>
                        <button 
                            onClick={onNavigate_Homepage}
                            className="border border-black bg-red-500 text-white font-bold mt-4 p-4 rounded-lg hover:bg-black hover:text-white"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    
                </section>
            </section>
        </>
    )
}

export default CartPage;