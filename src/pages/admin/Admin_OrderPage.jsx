import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrder, updateOrderStatus } from "../../features/orderedSlice.js"
import { useEffect, useState } from "react";

const UpdateOrder_Modal = ({data, onCall_Update}) => {
    const [status, setStatus] = useState(data.status);

    const submitUpdate = () => {
        onCall_Update({order_id: data.id, status: status})
    }

    return (
        < >
            {data && <h2>Update Order #{data.id} from {data.name}</h2>}
            <p>Status</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Prepping">Prepping</option>
                <option value="Delivered">Delivered</option>
            </select>
            <button onClick={submitUpdate}>Update</button>
        </>
    )
}

const Admin_OrderPage = () => {
    const { order } = useSelector((state) => state.orders );
    const [selectOrder ,setSelectOrder] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (order.length == 0)
            dispatch(fetchAllOrder());
    }, [dispatch])

    const onEditOrderStatus = (id) => {
        if (selectOrder == id) {
            setSelectOrder(null);
        } else {
            setSelectOrder(id);
        }
    }

    const onUpdateState = ({order_id, status}) => {
        dispatch(updateOrderStatus({order_id, status}))
    }

    return (
        < >
            <section>
                <h1>Customer Order</h1>

                {selectOrder != null && 
                    <UpdateOrder_Modal 
                        data={order.find(data => data.id == selectOrder)}
                        onCall_Update={({id, status}) => onUpdateState({id, status})}
                    />
                }

                <p>Prepare (Newest to Oldest)</p>
                <div className="grid gap-4 grid-cols-4">
                    {order.filter((o) => o.order_status == "Prepping").map((o) => 
                        <div onClick={() => onEditOrderStatus(o.id)} className="flex flex-col p-4 border border-black">
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
                        <div onClick={() => onEditOrderStatus(o.id)} className="flex flex-col p-4 border border-black">
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