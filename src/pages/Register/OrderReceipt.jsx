import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Item = () => {

    return (
        <div className="flex justify-between">
            <div className="flex flex-col gap-6">
                <img className="w-16 h-full bg-blue-300"/>

                <div className="flex flex-col gap-1">
                    <strong>PRODUCT NAMING</strong>

                    <div className="grid grid-cols-3 gap-2">
                        <p>TYPE 1</p>
                        <p>TYPE 2</p>
                        <p>QTY</p>

                        <strong>VALUE_1</strong>
                        <strong>VALUE_2</strong>
                        <strong>VALUE_3</strong>
                    </div>
                </div>
            </div>

            {/* VALUE */}
            <strong>MYR</strong>
        </div>
    )
}

const OrderReceipt = () => {
    const { id } = useParams();
    

    // ORDER ITEM
    // PAYMENT AND ADDRESS
    // PRODUCT 
 
    return (
        <main className="flex flex-col gap-6">
            <div>
                <h2>ORDER RECEIPT FOR #00</h2>
                <p>Here's your order detail</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 bg-emerald-200">
                    <strong>Deliver to</strong>
                    {/* EMAIL STATUS */}
                </div>

                <div className="flex-1 bg-emerald-200">
                    <strong>Payment Method</strong>
                    {/* Payment Detail */}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <strong>Order Status</strong>
                    <p>date</p>
                </div>
                
                <hr className="border-black" />

                {/* ORDER ITEM */}
                <div className="flex flex-col gap-4">
                    <Item />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <p>Subtotal: </p>
                <p>0.00</p>

                <p>Shipping: </p>
                <p>0.00</p>

                <p>Total</p>
                <strong>RM3000</strong>
            </div>
        </main>
    )
}

export default OrderReceipt;