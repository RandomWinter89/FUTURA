import { AuthContext } from "../../Context/AuthProvider";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext, useMemo } from "react";

import { fetchOrder, getAllItem } from "../../features/orderedSlice";

// Panel Component
import { DetailPanel, AddressPanel, OrderPanel } from "../../components/user"

// ====================>

const ProfilePage = () => {
    const { currentDBUser, currentDBUserPicture, currentDBUserStatus} = useSelector((state) => state.users);
    const { products, productStatus } = useSelector((state) => state.products);
    const { address, addressStatus } = useSelector((state) => state.address);
    const { order, orderItem } = useSelector((state) => state.orders);
    
    const { currentUser } = useContext(AuthContext) || null;

    const [mode, setMode] = useState("PROFILE");

    const dispatch = useDispatch();

    useEffect(() => {
        if (order.length == 0)
            dispatch(fetchOrder(currentUser.uid));

        if (orderItem.length == 0)
            dispatch(getAllItem(currentUser.uid));
    }, [dispatch]);

    const filteredProductImage = useMemo(() => {
        if (productStatus == "succeed") {
            return products.map((item) => ({id: item.id, imageUrl: item?.imageUrl}));
        }

        return null;
    }, [productStatus, products])

    return (
        < >
            <section className="flex gap-20 max-lg:flex-col max-lg:gap-10">
                <aside className="flex-[0.4] flex flex-col gap-4 max-lg:flex-auto">
                    <h2>Settings</h2>

                    <div className="flex flex-col gap-2 max-lg:flex-row">
                        <button 
                            onClick={() => setMode("PROFILE")} 
                            className={`
                                subtitle2 py-3 px-4 text-start
                                ${mode == "PROFILE" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Profile
                        </button>

                        <button 
                            onClick={() => setMode("ADDRESS")} 
                            className={`
                                subtitle2 py-3 px-4 text-start 
                                ${mode == "ADDRESS" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Delivery Address
                        </button>

                        <button 
                            onClick={() => setMode("ORDER")} 
                            className={`
                                subtitle2 py-3 px-4 text-start 
                                ${mode == "ORDER" ? "bg-black text-white" : "border-b border-black"}
                            `}
                        >
                            Order Status
                        </button>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col gap-6">
                    {(mode == "PROFILE") && 
                        <DetailPanel 
                            authUser={currentUser} 
                            dataUser={currentDBUser} 
                            imageUrl={currentDBUserPicture?.imageUrl}
                            status={currentDBUserStatus}
                        />
                    }
                    {(mode == "ADDRESS") && 
                        <AddressPanel
                            authUser={currentUser}
                            userAddress={address}
                            loading={(addressStatus == "loading")}
                        />
                    }
                    {(mode == "ORDER") && 
                        <OrderPanel 
                            userOrder={order}
                            userOrderItem={orderItem} 
                            productImage={filteredProductImage}
                            loading={false}
                        />
                    }
                </div>
            </section>
            
        </>
    )
}


export default ProfilePage;