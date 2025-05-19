import { useState, memo, useMemo } from "react";

const OrderCard = ({item, date="", address=""}) => {
    const [shown, setShown] = useState(false);

    const price = useMemo(() => {
        return item.quantity * parseFloat(item.price);
    }, [item])

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-6 px-8 py-7 border border-gray-500">
                <div className="flex gap-6">
                    <img className="w-32 aspect-square bg-slate-400"/>

                    <div className="flex-1 flex flex-col gap-2 my-auto">
                        <p className="subtitle2">{item.name}</p>
                        <p className="body2">Expected by {date}</p>
                        <p className="body2 w-[32ch]">Shipping to {address}</p>
                    </div>
                    <h3 className="my-auto">RM{price}</h3>
                </div>

                {shown &&
                    <div className="flex flex-col gap-5">
                        <p className="body1 flex justify-between text-gray-400">
                            Qty <span className="subtitle2 text-black">{item.quantity}</span>
                        </p>

                        {item.value2 && 
                            <p className="body1 flex justify-between text-gray-400">
                                Size <span className="subtitle2 text-black">{item.value2}</span>
                            </p>
                        }

                        {item.value1 && 
                            <p className="body1 flex justify-between text-gray-400">
                                Color <span className="subtitle2 text-black">{item.value1}</span>
                            </p>
                        }
                    </div>
                }
            </div>

            <button 
                onClick={() => setShown(!shown)} 
                className="bg-white border-x border-b border-gray-500 py-3 flex justify-center"
            >
                {shown ? "View more" : "Hide detail"}
            </button>
        </div>
    )
}


const OrderPanel = memo(({userOrder, userOrderItem, loading}) => {
    const [state, setState] = useState("Pending");

    const newestOrder = useMemo(() => {
        return userOrder.slice().sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    }, [userOrder]);

    const sortedPending = useMemo(() => {
        return newestOrder.slice().filter((info) => info.order_status == "Prepping");
    }, [newestOrder])

    const sortedDelivered = useMemo(() => {
        return newestOrder.slice().filter((info) => info.order_status == "Delivered");
    }, [newestOrder])

    if (loading) return (
        < >
            
        </>
    )

    return (
        < >
            <h3>Order Status</h3>

            <nav className="flex">
                <button 
                    onClick={() => setState("Pending")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "Pending" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Pending {state == "Pending" && `(${sortedPending.length})`}</button>

                <button 
                    onClick={() => setState("OutDelivery")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "OutDelivery" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Out of Delivery {state == "OutDelivery" && "(0)"}</button>

                <button 
                    onClick={() => setState("Delivered")} 
                    className={`flex-1 body2 pb-4 border-b-2 ${state == "Delivered" ? " border-black text-black" : "border-gray-400 text-gray-400"}`}
                >Delivered {state == "Delivered" && `(${sortedDelivered.length})`}</button>
            </nav>

            {state == "Pending" && sortedPending.map((data, index) => 
                <div key={index} className="flex flex-col gap-6">
                    <p className="subtitle2">
                        Order #{data.id} | Placed on {data.order_date.split("T")[0]}
                    </p>

                    {userOrderItem.slice().filter((prev) => prev.id == data.id).map((data, index) => 
                        <OrderCard key={index} item={data} />
                    )}
                </div>
            )}

            {state == "Delivered" && sortedDelivered.map((data, index) => 
                <div key={index} className="flex flex-col gap-6">
                    <p className="subtitle2">
                        Order #{data.id} | Placed on {data.order_date.split("T")[0]}
                    </p>

                    {userOrderItem.slice().filter((prev) => prev.id == data.id).map((data, index) => 
                        <OrderCard key={index} item={data} />
                    )}
                </div>
            )}
        </>
    )
});

export default OrderPanel;