import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";

import { fetchCart_item, fetchCartId } from "../../features/cartsSlice";
import { AuthContext } from "../../Context/AuthProvider";
import { fetchAddress } from "../../features/addressSlice";

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

//Payment
import axios from "axios";

const CartItem = ({
    name, 
    color, 
    size, 
    quantity, 
    price,
    extraCharge,
    discount = 1.00
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
                <p>Quantity: {quantity}</p>
                <p>Subtotal price: MYR{subtotal}</p>
            </div>
        </div>
    )
}

const SummaryPayment = ({total, address, setAddressID}) => {
    return (
        < >
            <div className="py-4 px-2 flex flex-col border border-black">
                <h2>Order Summary</h2>
                <hr className="border-black mb-2"/>
                <p>Subtotal: MYR {total}</p>
                <p>Order total: MYR {total}</p>
            </div>

            <div className="flex flex-col gap-2">
                <select onChange={(e) => setAddressID({value: e.target.value})} className="border border-black p-2">
                    <option value={null}>No Address</option>
                    {address.map((data, index) => 
                        <option key={index} value={data.id}>{data.address_line1} / {data.city} / {data.region} / {data.postal_code}</option>
                    )}
                </select>
            </div>
        </>
    )
}

const CheckoutPage = () => {
    const { cart_id, carts } = useSelector((state) => state.carts);
    const { address } = useSelector((state) => state.address);
    const { currentUser } = useContext(AuthContext) || null;

    const [addressID, setAddressID] = useState(0);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    // const [paymentMode, setPaymentMode] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (cart_id == null)
            dispatch(fetchCartId(currentUser.uid));

        if (address.length == 0)
            dispatch(fetchAddress(currentUser.uid));
    }, [dispatch])

    useEffect(() => {
        if (cart_id != null && carts.length == 0)
            dispatch(fetchCart_item(cart_id));

    }, [dispatch, cart_id])

    useEffect(() => {
        if (carts.length != 0) {
            const price = carts.reduce((total, item) => 
                total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity)
            , 0)
            setTotal(price);

            setItems(carts.map((data) => ({
                    name: data.name, 
                    quantity: data.quantity, 
                    price: data.base_price
                })
            ))
        }
    }, [carts])

    const onSubmitPayment = async () => {
        if (items.length == 0 || addressID == 0)
            return;
        
        try {
          const response = await axios.post(`${VITE_FUTURA_API}/api/create-payment-intent/${addressID}`, {items});
          window.location.href = response.data.url;
        } catch (err) {
          console.error("Error creating checkout session:", err);
        }
    };

    return (
        < >
            <section>
            <button 
                onClick={() => navigate(-1)}
                className="py-2 px-4 w-fit text-gray-800 hover:-translate-x-3 transition-transform"
            >{`<--`} Back to Home</button>

            <div className="flex gap-2">
                <section className="flex flex-col gap-4">
                    {carts.map((item, index) => 
                        <CartItem key={index}
                            name={item.name}
                            color={item.value1}
                            size={item.value2}
                            quantity={item.quantity}
                            price = {item.base_price}
                            extraCharge = {item.extra_charge}
                        />
                    )}
                </section>

                <section className="flex flex-col gap-1 p-2 ">
                    <SummaryPayment 
                        total = {total}
                        address = {address}
                        setAddressID = {({value}) => setAddressID(value)}
                    />

                    <button onClick={onSubmitPayment} className="border border-black py-2">
                        Proceed Payment
                    </button>
                    <p>**You're required to enter the payment by yourself. Stripe forbidden pre-set</p>
                </section>
            </div>
            </section>
        </>
    )
}

export default CheckoutPage;