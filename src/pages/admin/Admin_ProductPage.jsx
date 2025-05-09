import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchProducts, fetchImageProduct, fetchProductItem } from "../../features/productSlice";


const Admin_ProductPage = () => {
    const { products, productItem, products_loading } = useSelector((state) => state.products);
    const [onLoad, setOnLoad] = useState(false);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (products.length != 0 && !onLoad) {
            dispatch(fetchImageProduct());
            setOnLoad(true);
        }

    }, [dispatch, products])

    const onFetch = (id) => {
        try {
            dispatch(fetchProductItem(id));
        } catch (err) {
            console.log("Err", err);
        }
    }

    return (
        < >
            <section className="mt-20">
                <h2>Edit Quantity</h2>
                <hr />
                <p>Select a dress</p>
                <hr />
                <div className="grid grid-cols-4 gap-2">
                    {productItem.map((prod) => 
                        <div key={prod.id} className="p-4 border border-black flex flex-col gap-2">
                            <p>{prod.name1}: {prod.value1}</p>
                            <p>{prod.name2}: {prod.value2}</p>
                            <input 
                                type="number" 
                                value={prod.quantity} 
                                className="border border-black w-auto"
                            />
                        </div>
                    )}
                </div>
                <p>You can edit one of them and confirm</p>
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