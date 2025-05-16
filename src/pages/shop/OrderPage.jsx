import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useMemo } from "react";

import { AuthContext } from "../../Context/AuthProvider";
import { fetchOrder } from "../../features/orderedSlice";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const { order, order_loading } = useSelector((state) => state.orders);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (order.length == 0)
            dispatch(fetchOrder(currentUser.uid));
    }, [dispatch])

    const newestOrder = useMemo(() => {
        return order.slice().sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
    }, [order]);
    
    return (
        <>
            <section>
                <h2>ORDERS COLLECTION</h2>

                {/* ORDER RECEIPT */}
                <div className="flex gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <h3>Order List</h3>
                            <p>Number: {order.length}</p>
                        </div>

                        <hr className="border-black"/>

                        {newestOrder.map((data, index) => (
                                <div key={index} onClick={() => navigate(`/User/Order/${data.id}`)} 
                                    className="border border-black p-4 cursor-pointer transition-colors hover:bg-black hover:text-white"
                                >
                                    <p>ORDER ID: #{data.id}</p>
                                    <p>ORDER DATE: {data.order_date.split("T")[0]}</p>
                                    <p>ORDER TOTAL: {data.order_total}</p>
                                    <p>ORDER STATUS: {data.order_status}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderPage;