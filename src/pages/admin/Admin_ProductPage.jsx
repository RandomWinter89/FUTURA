import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { 
    fetchProducts, 
    fetchImageProduct, 
    fetchProductItem, 
    fetch_ProductVariation,
    update_ProdStock
} from "../../features/productSlice";


const Admin_ProductPage = () => {
    const { products, productItem, itemVariation, products_loading } = useSelector((state) => state.products);
    const [prodQuantity, setProdQuantity] = useState({});
    const [onLoad, setOnLoad] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts()).then(() => {
                dispatch(fetchImageProduct());
                setOnLoad(true);
            })

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());
    }, [dispatch]);

    
    //Fetch Product Item (variation)
    const onFetch = async (id) => {
        dispatch(fetchProductItem(id));
        setProdQuantity(productItem);
    }


    //Change Quantity
    const onUpdateQuantity = ({id, value}) => {
        setProdQuantity(prev => {
            if (prev.id == id)
                return {...prev, quantity: value}

            return prev;
        });
    };

    //Update Quantity
    const onSubmitQuantity = ({id}) => {
        const value = prodQuantity.find(prev => prev.id == id).quantity;
        if (value)
            dispatch(update_ProdStock({id, quantity: value}));
    }



    // 1. All Product are shown (With Variation been shown)
    // 2. Select one product create 3 options.
    // 3. 1 is Edit Product itself (only name, image, price and description)
    // 5. 3 is create new variation option (exclude if one of variation option is matched)
    return (
        < >
            <section className="mt-20 flex flex-col gap-2">
                <h2>Edit Quantity</h2>
                <hr />
                {/* Product Item */}
                <div className="grid grid-cols-4 gap-2">
                    <button className="p-4 border border-black items-center gap-2">
                        Create New Variation
                    </button>

                    {productItem.map((prod) => 
                        <div key={prod.id} className="p-4 border border-black flex flex-col gap-2">
                            <p>{prod.name1}: {prod.value1}</p>
                            <p>{prod.name2}: {prod.value2}</p>
                            <input 
                                type="number" 
                                value={prod.quantity}
                                onChange={(e) => onUpdateQuantity({id: prod.id, value: e.target.value})}
                                className="border border-black w-auto"
                            />
                            <button 
                                onClick={() => onSubmitQuantity({id: prod.id})}
                                className="border border-black p-4 rounded-xl"
                            >
                                Update Quantity
                            </button>
                        </div>
                    )}
                </div>

                {/* Only selected fill can have size */}
                <form className="flex flex-col gap-2 p-4 border border-black">
                    <label>COLOR</label>
                    <select>
                        {itemVariation
                            .filter((prev) => prev.name == "Color")
                            .map((data, index) => 
                                <option key={index} value={data.value}>{data.value}</option>
                            )}
                    </select>
                    
                    <label>SIZE</label>
                    <select>
                        {itemVariation
                            .filter((prev) => prev.name == "Size")
                            .map((data, index) => 
                                <option key={index} value={data.value}>{data.value}</option>
                            )}
                    </select>

                    <input type="number" defaultValue={0} />
                    <input type="number" defaultValue={0.00} />
                </form>
            </section>

            
            {!products_loading && (
                <section className="my-20 grid grid-cols-5 gap-4">
                    {products.map((prod) => 
                        <div onClick={() => onFetch(prod.id)} className="flex-1 hover:scale-110">
                            <img src={`${prod.imageUrl}`} />
                            <p>{prod.name}</p>
                        </div>
                    )}
                </section>
            )}
        </>
    )
}

export default Admin_ProductPage;