import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext} from "react";
import { AuthContext } from "../../Context/AuthProvider";

import { createOrder, reset_OrderReceipt, createOrderItems } from "../../features/orderedSlice";
import { clearCart } from "../../features/cartsSlice";
import { Button } from "../../components/ui";

const SuccessPage = () => {
  const { cart_id, carts } = useSelector((state) => state.carts);
  const { order, orderId, orderItemStatus} = useSelector((state) => state.orders);
  const { address } = useSelector((state) => state.address);
  const { addressID } = useParams();
  const { currentUser } = useContext(AuthContext) || null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (carts.length != 0 && address.length != 0) {
      const price = carts.reduce((total, item) => 
        total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity)
      , 0)

      dispatch(createOrder({
          uid: currentUser.uid,
          shipping_address_id: addressID, 
          shipping_method: "Deliver", 
          order_total: price, 
          order_status: "Prepping"
        })
      )
    }

  }, [dispatch, address])

  useEffect(() => {
    if (orderId != null) {
      const sorted = carts.map(data => ({
          product_id: data.product_id,
          quantity: data.quantity,
          price: parseFloat(data.base_price) + parseFloat(data.extra_charge),
          product_variation_id: data.product_variation_id
        })
      );

      dispatch(createOrderItems({order_id: orderId, items: sorted}))
        .then(() => {
          dispatch(clearCart(cart_id));
          dispatch(reset_OrderReceipt());
        })
    }
      
  }, [dispatch, order, orderId])


  return (
    <main className="flex-1 flex flex-col justify-center items-center gap-6">
      <h1>Payment Successful!</h1>

      {orderItemStatus == "loading" && <p>Processing the cart to order</p>}
      {orderItemStatus == "succeed" && 
        <Button onClick={() => navigate("/Shop/Homepage")} state={"fit"}>
          Return homepage
        </Button>
      }
    </main>
  );
}
  
export default SuccessPage;