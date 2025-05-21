import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrder, updateOrderStatus } from "../../features/orderedSlice.js"
import { useEffect, useState } from "react";

const UpdateOrder_Modal = ({data, onCall_Update}) => {
    const [status, setStatus] = useState(data.order_status || "Prepping");

    const submitUpdate = () => {
        onCall_Update({id: data.id, status: status})
    }

    useEffect(() => {
        setStatus(data.order_status);
    }, [data])

    return (
        <div className="border border-black rounded-xl p-4 flex flex-col gap-2">
            {data && <h2>Update Order #{data.id} from {data.name}</h2>}

            <hr />

            <label className="flex gap-4">
                STATUS:
                <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="px-4 py-1"
                >
                    <option value="Prepping">Prepping</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </label>

            <button 
                onClick={submitUpdate}
                className="py-2 bg-white border border-black"
            >
                Update
            </button>
        </div>
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
            <section className="flex flex-col gap-10">
                <h1>Customer Order</h1>

                {selectOrder != null && 
                    <UpdateOrder_Modal 
                        data={order.find(data => data.id == selectOrder)}
                        onCall_Update={({id, status}) => onUpdateState({order_id: id, status})}
                    />
                }

                <div className="flex flex-col gap-4">
                    <h2>Prepare (Newest to Oldest)</h2>
                    <div className="grid gap-4 grid-cols-4">
                        {order.filter((o) => o.order_status == "Prepping").map((o) => 
                            <div onClick={() => onEditOrderStatus(o.id)} className="flex flex-col p-4 border border-black">
                                <p>{o.id}</p>
                                <p>{o.name}</p>
                                <p>{o.order_date.split("T")[0]}</p>
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
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2>Delivered (Newest to Oldest)</h2>
                    <div className="grid gap-4 grid-cols-4">
                        {order.filter((o) => o.order_status == "Delivered").map((o) => 
                            <div onClick={() => onEditOrderStatus(o.id)} className="flex flex-col p-4 border border-black">
                                <p>{o.id}</p>
                                <p>{o.name}</p>
                                <p>{o.order_date.split("T")[0]}</p>
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
                </div>
            </section>
        </>
    )
}

export default Admin_OrderPage;