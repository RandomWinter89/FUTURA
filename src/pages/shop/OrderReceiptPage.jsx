import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { get_OrderItem, reset_OrderReceipt } from '../../features/orderedSlice';

const Item = ({data, quantity, image}) => {

    return (
        <div className="flex justify-between border border-black p-2">
            <div className="flex gap-6">
                <img src={image} className="w-16 h-full bg-blue-300"/>

                <div className="flex flex-col gap-1">
                    <strong>{data.name}</strong>

                    <div className="grid grid-cols-3 gap-4">
                        <p>TYPE 1</p>
                        <p>TYPE 2</p>
                        <p>QTY</p>

                        <strong>VALUE_1</strong>
                        <strong>VALUE_2</strong>
                        <strong>{quantity}</strong>
                    </div>
                </div>
            </div>

            {/* VALUE */}
            <strong>RM {data.base_price} * {quantity}</strong>
        </div>
    )
}

const OrderReceiptPage = () => {
    const { id } = useParams();
    const { order, orderItem } = useSelector((state) => state.orders);
    const { products } = useSelector((state) => state.products);
    const { address } = useSelector((state) => state.address);

    const [order_info, setOrder_Info] = useState(order.find(o => o.id == id));
    const [order_Addr, setOrder_Addr] = useState({});

    const dispatch = useDispatch();
    
    useEffect(() => {
        if (orderItem.length == 0)
            dispatch(get_OrderItem(id));

        return () => {
            dispatch(reset_OrderReceipt());
        }
    }, [dispatch]);

    useEffect(() => {
        if (order != null && address.length != 0) {
            const foundOrder = order.find(o => o.id == id);

            if (foundOrder) {
                console.log(foundOrder);
                setOrder_Info(foundOrder);
                setOrder_Addr(address.find(a => a.id == foundOrder.shipping_address_id));
            }
        }
            
    }, [order, address])
 
    return (
        < >
            <section>
                <h2>Order Receipt for #{id}</h2>
                {order_Addr && 
                    <div className="mt-3 border border-black p-4">
                        <strong>Deliver to</strong>
                        <hr className="border-gray-500"/>
                        <p>Address 1: {order_Addr?.address_line1}</p>
                        <p>Address 2: {order_Addr?.address_line2}</p>
                        <p>City: {order_Addr?.city}</p>
                        <p>Region: {order_Addr?.region}</p>
                        <p>Postal: {order_Addr?.postal_code}</p>
                    </div>
                }
            </section>

            {order_info && (
                < > 
                    <section className="flex flex-col gap-4">
                        <div className="flex justify-between">
                            <strong>Order Status</strong>
                            <p>Date: {order_info.order_date.split("T")[0].split("-").join("/")}</p>
                        </div>
                        
                        <hr className="border-black" />

                        {/* ORDER ITEM */}
                        <div className="flex flex-col gap-4">
                            {orderItem.map((item) => {
                                const prod = products.find(prod => prod.id == item.product_id);

                                return <Item 
                                    key={item.id}
                                    data={prod} 
                                    quantity={item.quantity} 
                                    image={prod.imageUrl} 
                                />
                            })}
                        </div>
                    </section>

                    <section className="flex justify-between gap-2">
                        {/* <p>Subtotal: </p>
                        <p>0.00</p>

                        <p>Shipping: </p>
                        <p>0.00</p> */}

                        <p className="text-xl">Total</p>
                        <strong>RM {order_info.order_total}</strong>
                    </section>
                </>
            )}
        </>
    )
}

export default OrderReceiptPage;