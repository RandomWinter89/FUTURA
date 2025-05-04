import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchCart_item, fetchCartId, removeCartItem, updateItem_quantity } from "../../features/cartsSlice";
import { fetchPromotion } from "../../features/promotionSlice";

import { AuthContext } from "../../Context/AuthProvider";

const CartItem = ({
        name, 
        color, 
        size, 
        quantity, 
        price,
        extraCharge,
        discount = 1.00, 
        onCallUpdate,
        onCallRemoval
    }) => {

    const subtotal = ((parseFloat(price) + parseFloat(extraCharge)) * quantity) * discount;

    return (
        <div className="w-fit h-40 flex gap-2 border border-black p-4">
            <img className="flex-1 bg-orange-300 w-64 h-full"/>

            <div className="flex flex-col my-auto">
                <p>Product Name: {name}</p>
                {color != null && <p>Color: {color}</p>}
                {size != null && <p>Size: {size}</p>}

                <hr className="border-black"/>

                <p>Subtotal price: MYR{subtotal}</p>

                <input 
                    type="number" 
                    value={quantity} 
                    min="1"
                    onChange={(e) => onCallUpdate({quantity: parseInt(e.target.value)})} 
                />
            </div>

            <button 
                onClick={onCallRemoval} 
                className="my-auto border border-black py-2 px-6 h-fit rounded-lg"
            >
                X
            </button>
        </div>
    )
}

const CartPage = () => {
    const [cartQuantities, setCartQuantities] = useState({});
    const [selectedDiscount, setSelectedDiscount] = useState("");
    const [total, setTotal] = useState(0.00);

    // User Authentication
    const { cart_id, carts, cart_loading } = useSelector((state) => state.carts);
    const { promotion, } = useSelector((state) => state.promotions);
    const { currentUser } = useContext(AuthContext) || null;

    // Product, Item, Variation
    // Cart
    // promotion

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (cart_id == null)
            dispatch(fetchCartId(currentUser.uid));

        if (promotion.length == 0)
            dispatch(fetchPromotion());
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
            console.log("Total: ", price)
            setTotal(price);
        }
    }, [carts])

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

    const discount = selectedDiscount.trim().length != 0 ? parseFloat(selectedDiscount) : 1;

    const onReturn = () => navigate(-1);
    const onNavigate_Homepage = () => navigate("/Homepage");

    return (
        <main className="m-4 flex flex-col gap-2">
            <button 
                onClick={onReturn} 
                className="border border-black py-2 px-6 rounded-xl h-fit hover:bg-black hover:text-white"
            >
                RETURN PAGE
            </button>

            <div className="flex gap-2">
                {/* Cart */}
                <section className="flex flex-wrap gap-4 bg-green-50">
                    {carts.map((item, index) => 
                        <CartItem key={index}
                            name={item.name}
                            color={item.value1}
                            size={item.value2}
                            quantity={cartQuantities[index] || 1}
                            price={item.base_price}
                            extraCharge={item.extra_charge}
                            discount={1}
                            onCallUpdate={({quantity}) => onReceiveCall(index, quantity, item.product_id, item.product_variation_id)}
                            onCallRemoval={() => onReceiveCall_Remove(item.product_id, item.product_variation_id)}
                        /> 
                    )}
                </section>

                {/* Order Summary */}
                <section className="flex flex-col gap-2">
                    <div className="py-4 px-2 border border-black">
                        <h2>Order Summary</h2>
                        <hr className="border-black mb-4"/>
                        <p>Subtotal: MYR {total}</p>
                        {selectedDiscount.trim().length != 0 && <p>Discount: {100 - (parseFloat(selectedDiscount) * 100)}%</p>}
                        <p>Order total: MYR {total * discount}</p>
                    </div>

                    <label>Promotion Discount</label>
                    <select onChange={(e) => setSelectedDiscount(e.target.value)} className="border border-black p-1">
                        <option value="">None</option>
                        {promotion.map((data, index) => 
                            <option key={index} value={data.offer}>{data.name}: {100 - (parseFloat(data.offer) * 100)}%</option>
                        )}
                    </select>

                    <button 
                        onClick={onNavigate_Homepage}
                        className="border border-black py-1 px-6 rounded-lg hover:bg-black hover:text-white"
                    >
                        Continue Shopping
                    </button>
                </section>
            </div>
        </main>
    )
}

export default CartPage;