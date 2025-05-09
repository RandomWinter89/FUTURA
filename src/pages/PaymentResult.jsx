import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useContext} from "react";
import { AuthContext } from "../Context/AuthProvider";

import { createOrder, create_OrderItem } from "../features/orderedSlice";
import { fetchCartId, fetchCart_item } from "../features/cartsSlice";
import { fetchAddress } from "../features/addressSlice";
import { fetchPayment } from "../features/paymentSlice";

// Payment Failed
export function CancelPage() {
    const navigate = useNavigate();

    return (
      <main className="m-4 h-[85svh] flex flex-col justify-center items-center gap-6">
        <h1>Payment Cancelled</h1>

        <button 
          onClick={() => navigate("/Checkout")}
          className="border border-black py-2 px-8 rounded-xl hover:bg-black hover:text-white"
        >
          Return to homepage
        </button>
      </main>
    );
}

// Payment Success
export function SuccessPage() {
  const { cart_id, carts } = useSelector((state) => state.carts);
  const { order, orderItem_loading} = useSelector((state) => state.orders);
  const { payment } = useSelector((state) => state.payments);
  const { address } = useSelector((state) => state.address);
  const { paymentID, addressID } = useParams();
  const { currentUser } = useContext(AuthContext) || null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart_id == null)
      dispatch(fetchCartId(currentUser.uid));

    if (address.length == 0)
      dispatch(fetchAddress(currentUser.uid));

    if (payment.length == 0)
      dispatch(fetchPayment(currentUser.uid));
  }, [dispatch])

  useEffect(() => {
    if (cart_id != null){
      dispatch(fetchCart_item(cart_id));
    }

  }, [dispatch, cart_id])

  useEffect(() => {
    if (carts.length != 0 && address.length != 0 && payment.length != 0) {
      const price = carts.reduce((total, item) => total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity), 0)

      dispatch(createOrder({
        uid: currentUser.uid,
        payment_method_id: paymentID, 
        shipping_address_id: addressID, 
        shipping_method: "Deliver", 
        order_total: price, 
        order_status: "Prepping"
      }))
    }
  }, [dispatch, address, payment])

  useEffect(() => {
    if (order.length != 0){
      carts.forEach((item) => {
        dispatch(create_OrderItem({
          order_id: order[0].id, 
          product_item_id: item.product_id,
          quantity: item.quantity, 
          price: item.base_price + item.extra_charge,
          product_variation_id: item.product_variation_id
        }));
      });
    }
      
  }, [dispatch, order])


  return (
    <main className="m-4 h-[85svh] flex flex-col justify-center items-center gap-6">
      <h1>Payment Successful!</h1>
      {orderItem_loading && <p>Processing the cart to order</p>}
      {!orderItem_loading && 
        <button 
          onClick={() => navigate("/Orders")}
          className="border border-black py-2 px-8 rounded-xl hover:bg-black hover:text-white"
        >
          Check your order
        </button>
      }
    </main>
  );
}
  