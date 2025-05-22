import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { 
    fetchProducts, 
    fetchImageProduct, 
    fetchProductItem, 
    fetch_ProductVariation,
    update_ProdStock
} from "../../features/productSlice";
import { Button } from "../../components/ui";


const Admin_ProductPage = () => {
    const { products, productItem, itemVariation, productStatus } = useSelector((state) => state.products);
    const [prodQuantity, setProdQuantity] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts()).then(() => {
                dispatch(fetchImageProduct());
            })

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());
    }, [dispatch]);

    useEffect(() => {
        console.log(products);
    }, []);

    
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



    return (
        < >
            <section className="flex flex-col gap-6">
                {/* Only selected fill can have size */}
                <h2>Modified Product Detail</h2>

                <div className="flex gap-2">

                </div>

                <hr />

                <div className="flex gap-11 max-lg:flex-col">
                    <div className="flex flex-col gap-4">
                        <Button>
                            Create New Variation
                        </Button>

                        <form className="flex flex-col gap-6 p-4 border border-black">
                            <label className="flex flex-col gap-2">
                                COLOR
                                <select>
                                    {itemVariation
                                        .filter((prev) => prev.name == "Color")
                                        .map((data, index) => 
                                            <option key={index} value={data.value}>{data.value}</option>
                                        )}
                                </select>
                            </label>
                            
                            <label className="flex flex-col gap-2">
                                Size
                                <select>
                                    <option value="none">None</option>
                                    {itemVariation
                                        .filter((prev) => prev.name == "Size")
                                        .map((data, index) => 
                                            <option key={index} value={data.value}>{data.value}</option>
                                        )
                                    }
                                </select>
                            </label>

                            <label className="flex flex-col gap-2">
                                Quantity
                                <input type="number" min={1} max={1000} defaultValue={0} />
                            </label>

                            <label className="flex flex-col gap-2">
                                Extra Charge
                                <input type="number" min={"1.00"} defaultValue={"1.00"} />
                            </label>
                        </form>
                    </div>

                    <hr className="hidden max-lg:inline-block" />

                    <div className="h-fit flex-1 grid grid-cols-3 gap-2 max-md:grid-cols-2">
                        {productItem.map((prod) => 
                            <div key={prod.id} className="flex-1 flex flex-col gap-2 p-4 border border-black">
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
                </div>
            </section>
            
            {(productStatus == "succeed") && (
                <section className="grid grid-cols-4 gap-10">
                    {products.map((prod) => 
                        <div onClick={() => onFetch(prod.id)} className="group flex-1 flex flex-col gap-2">
                            <img src={`${prod.imageUrl}`} className="aspect-square object-cover group-hover:scale-110" />
                            <p>{prod.name}</p>
                        </div>
                    )}
                </section>
            )}
        </>
    )
}

export default Admin_ProductPage;