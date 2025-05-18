import { useMemo } from "react";

const OrderPanel = () => {
    // collection
    // const sortedPending = useMemo(() => {
    //     return true;
    // });

    // const sortedOutOfDelivery = useMemo(() => {
    //     return true;
    // });

    // sortedDelivered = useMemo(() => {
    //     return true;
    // });

    return (
        < >
            <h3>Order Status</h3>

            <nav className="flex">
                <button>Pending</button>
                <button>Out of Delivery</button>
                <button>Delivered</button>
            </nav>
        </>
    )
}

export default OrderPanel;