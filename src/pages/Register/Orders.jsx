import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";

import { AuthContext } from "../../Context/AuthProvider";
import { fetchOrder } from "../../features/orderedSlice";
import { useNavigate } from "react-router-dom";

import GoogleCalenderService from "../../components/GoogleCalenderService";

const CalendarEmbed = () => {
    return (
        <div style={{ position: 'relative', paddingBottom: '75%', height: 0 }}>
            <iframe
                src="https://calendar.google.com/calendar/embed?src=en.malaysia%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKuala_Lumpur"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                }}
                title="Google Calendar"
            ></iframe>
        </div>
    )
}


const OrdersPage = () => {
    const { order, order_loading } = useSelector((state) => state.orders);
    const { currentUser } = useContext(AuthContext) || null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (order.length != 0)
            dispatch(fetchOrder(currentUser.uid));
    }, [dispatch])

    return (
        <main className="m-4 flex flex-col gap-2">
            <h2>ORDERS COLLECTION</h2>

            {/* ORDER RECEIPT */}
            <div className="flex gap-6">
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <h3>Order List</h3>
                        <p>Number: #</p>
                    </div>

                    <hr className="border-black"/>

                    {order
                        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
                        .map((data, index) => (
                            <div key={index} onClick={() => navigate(`/OrderReceipt/${data.id}`)}>
                                <p>ORDER ID: #{data.id}</p>
                                <p>ORDER DATE: {data.order_date.split("T")[0]}</p>
                                <p>ORDER TOTAL: {data.order_total}</p>
                                <p>ORDER STATUS: {data.order_status}</p>
                            </div>
                        )
                    )}

                    <GoogleCalenderService />
                </div>

                {/* ORDER LIST */}
                <aside className="flex-[0.4]">
                    <img className="bg-emerald-300 w-full aspect-square"/>
                    {/* <CalendarEmbed /> */}
                    <h3>GOOGLE CALENDER DISPLAY</h3>
                </aside>
            </div>
        </main>
    )
}

export default OrdersPage;