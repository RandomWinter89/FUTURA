import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext} from "react";
import { AuthContext } from "../../Context/AuthProvider";

import { createOrder, create_OrderItem, reset_OrderReceipt } from "../../features/orderedSlice";
import { clearCart } from "../../features/cartsSlice";
import { Button } from "../../components/ui";

const SuccessPage = () => {
  const { cart_id, carts } = useSelector((state) => state.carts);
  const { order, orderId, orderItem_loading} = useSelector((state) => state.orders);
  const { address } = useSelector((state) => state.address);
  const { addressID } = useParams();
  const { currentUser } = useContext(AuthContext) || null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (carts.length != 0 && address.length != 0) {
      const price = carts.reduce((total, item) => total + ((parseFloat(item.base_price) + parseFloat(item.extra_charge)) * item.quantity), 0)

      dispatch(createOrder({
        uid: currentUser.uid,
        shipping_address_id: addressID, 
        shipping_method: "Deliver", 
        order_total: price, 
        order_status: "Prepping"
      }))
    }
  }, [dispatch, address])

  useEffect(() => {
    const migrate_CartToOrder = async () => {
      if (orderId != null && carts.length > 0) {
        try { 
          await Promise.all(
            carts.map(item => 
              dispatch(create_OrderItem({
                order_id: orderId, 
                product_id: item.product_id,
                quantity: item.quantity, 
                price: parseFloat(item.base_price) + parseFloat(item.extra_charge),
                product_variation_id: item.product_variation_id
              }))
            )
          );

          dispatch(clearCart(cart_id));
          dispatch(reset_OrderReceipt());
        } catch (error) {
          console.error("MIGRATION FAILED: ", error);
        }
      }
    };

    migrate_CartToOrder();
      
  }, [dispatch, order])


  return (
    <main className="flex-1 flex flex-col justify-center items-center gap-6">
      <h1>Payment Successful!</h1>

      {orderItem_loading && <p>Processing the cart to order</p>}
      {!orderItem_loading && 
        <Button onClick={() => navigate("/Shop/Homepage")} state={"fit"}>
          Return homepage
        </Button>
      }
    </main>
  );
}
  
export default SuccessPage;