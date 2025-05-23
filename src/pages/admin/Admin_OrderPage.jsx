import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrder, updateOrderStatus } from "../../features/orderedSlice.js"
import { memo, useEffect, useMemo, useState } from "react";
import {Button} from "../../components/ui";

const UpdateOrderPanel = ({data, onCall_Update, onCallCancel}) => {
    const [status, setStatus] = useState(data.order_status || "Prepping");

    const submitUpdate = () => {
        onCall_Update({id: data.id, status: status})
    }

    useEffect(() => {
        setStatus(data.order_status);
    }, [data])

    return (
        <div className="border border-black rounded-xl p-4 flex flex-col gap-4">
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
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </label>

            <div className="flex gap-4 max-md:flex-col max-md:gap-2">
                <Button onClick={submitUpdate}>
                    Update Status
                </Button>

                <Button onClick={onCallCancel} variant="primary_outline">
                    Cancel
                </Button>
            </div>
        </div>
    )
}

const OrderCard = memo(({data, onCallUpdateMode}) => {
    return (
        < >
            <div 
                onClick={() => onCallUpdateMode({value: data.id})} 
                className="flex flex-col gap-2 p-4 bg-white border border-slate-300 cursor-pointer hover:scale-105 transition-all"
            >
                <p>#{data.id}</p>
                <p>Client: {data.name}</p>
                <p>Order Date: {data.order_date.split("T")[0]}</p>

                <hr />

                <p>Address: {data?.address_line1} {data?.address_line2}</p>
                <p>City: {data?.city}</p>
                <p>Region: {data?.region}</p>
                <p>Postal Code: {data?.postal_code}</p>

                <hr />

                <p>Status: {data?.order_status}</p>
            </div>
        </>
    )
});

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

    const filteredOnPrepping = useMemo(() => {
        return order.filter((o) => o.order_status == "Prepping");
    }, [order]);

    const filteredOutOfDelivery = useMemo(() => {
        return order.filter((o) => o.order_status == "Out for Delivery");
    }, [order]);

    const filteredOnDelivered = useMemo(() => {
        return order.filter((o) => o.order_status == "Delivered");
    }, [order]); 

    return (
        < >
            <section className="flex flex-col gap-10">
                <h1>Customer Order</h1>

                {selectOrder != null && 
                    <UpdateOrderPanel 
                        data={order.find(data => data.id == selectOrder)}
                        onCall_Update={({id, status}) => {
                            onUpdateState({order_id: id, status})
                            setSelectOrder(null);
                        }}
                        onCallCancel={() => setSelectOrder(null)}
                    />
                }

                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <h2>Prepping Stage</h2>
                        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-1">
                            {filteredOnPrepping.length == 0 && <p>No Order</p>}
                            {filteredOnPrepping.length != 0 && 
                                filteredOnPrepping.map((info, index) => 
                                    <OrderCard 
                                        key={index} 
                                        data={info} 
                                        onCallUpdateMode={({value}) => onEditOrderStatus(value)} 
                                    />
                                )
                            }
                        </div>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-4">
                        <h2>Out of Delivery Stage</h2>
                        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-1">
                            {filteredOutOfDelivery.length == 0 && <p>No Order</p>}
                            {filteredOutOfDelivery.length != 0 && 
                                filteredOutOfDelivery.map((info, index) => 
                                    <OrderCard 
                                        key={index} 
                                        data={info} 
                                        onCallUpdateMode={({value}) => onEditOrderStatus(value)} 
                                    />
                                )
                            }
                        </div>
                    </div>

                    <hr />

                    <div className="flex flex-col gap-4">
                        <h2>Delivered Stage</h2>
                        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-1">
                            {filteredOnDelivered.length == 0 && <p>No Order</p>}
                            {filteredOnDelivered.length != 0 && 
                                filteredOnDelivered.map((info, index) => 
                                    <OrderCard 
                                        key={index} 
                                        data={info} 
                                        onCallUpdateMode={({value}) => onEditOrderStatus(value)} 
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Admin_OrderPage;