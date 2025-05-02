import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchProducts, fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";

const ProductPage  = () => {
    const { products, productItem, itemVariation } = useSelector((state) => state.products);
    const [product, setProduct] = useState({});
    const { id } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(id);

        if (products.length === 0)
            dispatch(fetchProducts());

        if (productItem.length === 0)
            dispatch(fetchProductItem(parseInt(id)));

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());
    }, [dispatch])

    useEffect(() => {
        if (products.length !== 0)
            setProduct(products[id]);
    }, [products])

    return (
        < >
            <section>
                <h1>Product #{id}</h1>
                <p>Here's the preview of the product</p>
                <hr/>
                <h2>{product.name}</h2>
            </section>

            <section className="flex flex-col gap-2 bg-slate-200">
                {productItem
                    .filter(item => item.product_id == id)
                    .map((item) => 
                    <div>
                        <p>Color: {itemVariation.find(data => data.variation_option_id == item.variation_option_id)?.value}</p>
                        <p>Size: {itemVariation.find(data => data.variation_option_id == item.variation_option_2_id)?.value}</p>
                        <p>quantity: {item.quantity}</p>
                        {parseFloat(item.extra_charge) > 0 && <p>Extra Charge: item.extra_charge</p>}
                    </div>
                )}  
            </section>

            <section>
                <button>Add Cart</button>
                <button>Add Wishlist</button>
            </section>
        </>
    )
}

export default ProductPage;