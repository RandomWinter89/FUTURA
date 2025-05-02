import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchProducts, fetchProductItem, fetch_ProductVariation } from "../../features/productSlice";

const ProductPage  = () => {
    const { products, productItem, itemVariation } = useSelector((state) => state.products);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [selectedVariation, setSelectedVariation] = useState(0);
    const [selectCharge, setSelectCharge] = useState(0);
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
            </section>

            {product != null && (
                <section className="bg-yellow-100">
                    <h2>Name: {product.name}</h2>
                    <p>Category ID: {product.category_id}</p>
                    <p>Description: {product.description}</p>
                    <p>Base Price: MYR{product.base_price}</p>
                    <p>SKU: {product.sku}</p>
                    {(product.created_date != undefined) && <p>Created Date: {product.created_date.split("T")[0].split("-").join("/")}</p>}
                </section>
            )}



            <section className="flex flex-col gap-2 bg-slate-200 my-4 p-4">
                <select 
                    className="bg-slate-600 text-white py-4 px-4 rounded-lg" 
                    onChange={(e) => {
                        setSelectedVariation(e.target.selectedOptions[0].dataset.id); 
                        setSelectCharge(e.target.selectedOptions[0].dataset.extra);
                    }}>

                    {productItem
                        .filter(item => item.product_id == id)
                        .map((item) => {
                            const color = itemVariation.find(data => data.variation_option_id == item.variation_option_id)?.value;
                            const size = itemVariation.find(data => data.variation_option_id == item.variation_option_2_id)?.value;
                            const extra = parseFloat(item.extra_charge) > 0 ? ` | Extra Charge: ${item.extra_charge}` : "";
                            return (
                                <option key={item.id} value={item.id} data-id={item.id} data-extra={item.extra_charge}>
                                    COLOR: {color} | SIZE: {size} | Stock: {item.quantity} {extra}
                                </option>
                            )
                        }
                    )} 
                </select>
            </section>

            <section className="flex flex-col gap-4 my-4">
                <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)} 
                    className="min-w-fit w-60 border border-black py-2 px-4"
                />
                <button className="min-w-fit w-60 border border-black py-2 px-4 rounded-lg">Add Cart</button>
            </section>

            <section>
                
                <button>Add Wishlist</button>
            </section>
        </>
    )
}

export default ProductPage;