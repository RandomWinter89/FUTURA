import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrder } from "../../features/orderedSlice.js"
import { useEffect } from "react";

const UpdateOrder_Modal = ({id, data}) => {

    return (
        < >
            {data && <h2>Update Order #{data[id].id} from {data[id].name}</h2>}
            <p>Status</p>
            <select value="Prepping">
                <option value="Prepping">Prepping</option>
                <option value="Delivered">Delivered</option>
            </select>
        </>
    )
}

const Admin_OrderPage = () => {
    const { order } = useSelector((state) => state.orders );
    const dispatch = useDispatch();

    useEffect(() => {
        if (order.length == 0)
            dispatch(fetchAllOrder());
    }, [dispatch])

    return (
        < >
            <section>
                <h1>Customer Order</h1>

                <UpdateOrder_Modal />

                <p>Prepare (Newest to Oldest)</p>
                <div className="grid gap-4 grid-cols-4">
                    {order.filter((o) => o.order_status == "Prepping").map((o) => 
                        <div className="flex flex-col p-4 border border-black">
                            <p>{o.id}</p>
                            <p>{o.name}</p>
                            <p>{o.order_date}</p>
                            <hr/>
                            <p>{o.address_line1}</p>
                            <p>{o.address_line2}</p>
                            <p>{o.city}</p>
                            <p>{o.region}</p>
                            <p>{o.postal_code}</p>
                            <hr/>
                            <p>{o.order_status}</p>
                        </div>
                    )}
                </div>

                <hr />

                <p>Delivered (Newest to Oldest)</p>
                <div className="grid gap-4 grid-cols-4">
                    {order.filter((o) => o.order_status == "Delivered").map((o) => 
                        <div className="flex flex-col p-4 border border-black">
                            <p>{o.id}</p>
                            <p>{o.name}</p>
                            <p>{o.order_date}</p>
                            <hr/>
                            <p>{o.address_line1}</p>
                            <p>{o.address_line2}</p>
                            <p>{o.city}</p>
                            <p>{o.region}</p>
                            <p>{o.postal_code}</p>
                            <hr/>
                            <p>{o.order_status}</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Admin_OrderPage;