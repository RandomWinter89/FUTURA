import { useState, useEffect, useMemo} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IconFramer } from "../../components/icon"

const VITE_FUTURA_API = import.meta.env.VITE_FUTURA_API;

//Payment
import axios from "axios";
import { Button } from "../../components/ui";

// Extractable Component
const CartItem = ({data, image}) => {
    const subtotal = ((parseFloat(data?.base_price) + parseFloat(data?.extra_charge)) * data.quantity);

    return (
        <div className="flex-1 flex gap-6 max-md:flex-col max-md:gap-4 max-sm:gap-2">
            <img src={image} className="w-32 skeleton aspect-square object-cover border border-gray-300 bg-opacity-30 max-md:w-full"/>

            <div className="flex-1 flex flex-col max-lg:gap-1">
                <p className="subtitle1 mb-2">{data.name}</p>
                {data.value1 != null && <p className="body2 opacity-60">Color: {data.value1}</p>}
                {data.value2 != null && <p className="body2 opacity-60">Size: {data.value2}</p>}
                <p className="body2 opacity-60">Quantity: {data.quantity}</p>

                <h3 className="mt-auto">RM{subtotal}</h3>
            </div>
        </div>
    )
}

const CheckoutPage = () => {
    const { products, productStatus } = useSelector((state) => state.products);
    const { carts } = useSelector((state) => state.carts);
    const { address } = useSelector((state) => state.address);

    const [addressID, setAddressID] = useState(0);
    const [items, setItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (carts.length != 0) {
            const price = carts.reduce((total, item) => 
                total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity)
            , 0)
            setSubTotal(price);

            setItems(carts.map((data) => ({
                    name: data.name, 
                    quantity: data.quantity, 
                    price: data.base_price
                })
            ));
        }
    }, [carts])

    const TotalPrice = useMemo(() => {
        return subTotal + 15;
    }, [subTotal])

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
        <section className="flex flex-col gap-11 max-md:gap-6 max-sm:gap-3">
            <div className="body2 w-fit flex gap-2 items-center">
                <span onClick={() => navigate("/Shop/Homepage")} className="text-gray-500 cursor-pointer hover:scale-125 hover:text-orange-600 transition-all duration-300">
                    Home
                </span>

                <IconFramer className={"h-fit"}/>

                <span>Cart</span>
                
                <IconFramer className={"h-fit"}/>

                <span>Checkout</span>
            </div>

            <div className="flex flex-col gap-11 max-md:gap-2">
                <h2>Checkout</h2>

                <div className="flex gap-16 max-md:flex-col">
                    <div className="h-fit flex-1 flex flex-col gap-6 max-md:grid max-md:grid-cols-2 max-sm:grid-cols-1">
                        {(productStatus == "succeed") && carts.map((item, index) => {
                                const imageUrl = products.find((data) => data.id == item.product_id)?.imageUrl;
                                return <CartItem key={index} data={item} image={imageUrl}/>
                            })
                        }
                    </div>

                    <div className="flex-[0.6] flex flex-col gap-6">
                        <h3>Order Summary</h3>

                        <div className="flex flex-col gap-5"> 
                            <span className="flex gap-2 justify-between items-center">
                                <p className="subtitle1 font-normal opacity-60">Subtotal</p>
                                <p className="subtitle1">RM{subTotal}</p>
                            </span>

                            <span className="flex gap-2 justify-between items-center">
                                <p className="subtitle1 font-normal opacity-60">Delivery</p>
                                <p className="subtitle1">RM15</p>
                            </span>

                            <hr className="border-gray-400" />

                            <span className="flex justify-between items-center gap-2">
                                <p className="subtitle1 font-normal opacity-60">Total</p>
                                <h3>RM{TotalPrice}</h3>
                            </span>
                        </div>

                        <select onChange={(e) => setAddressID(e.target.value)} >
                            <option value={null}>No Address</option>
                            {address.map((data, index) => 
                                <option key={index} value={data.id}>
                                    {data.address_line1} / {data.city} / {data.region} / {data.postal_code}
                                </option>
                            )}
                        </select>

                        <Button onClick={onSubmitPayment}>
                            Proceed Payment
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CheckoutPage;