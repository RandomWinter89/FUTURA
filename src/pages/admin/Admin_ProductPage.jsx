import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useMemo, useState } from "react";
import { Category } from "../../database/category";

import { 
    create_ProdVariation,
    fetchProducts, fetchImageProduct, 
    fetchProductItem, fetch_ProductVariation,
    update_ProdStock, updateProduct, updateProduct_Image
} from "../../features/productSlice";
import { Button } from "../../components/ui";


const EditProductForm = memo(({item, onCallUpdate}) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        setName(item?.name);
        setPrice(parseFloat(item?.base_price));
        setDescription(item?.description);
    }, [item])

    const ModifiedProductDetail = (e) => {
        e.preventDefault();

        if (name.trim().length == 0 || price <= 0 || description.trim().length == 0) 
            return;

        onCallUpdate({id: item.id, name, price, description, imageUrl});
    }

    const catName = useMemo(() => {
        return Category.find(prev => prev.id == item.category_id).category_name
    }, [item]);

    return (
        <div className="flex flex-col gap-2">
            <h3>Product Detail</h3>

            <div className="w-full flex gap-6 max-md:flex-col">
                <img src={item?.imageUrl} className="w-[30%] border border-gray-300 border-opacity-40 aspect-[3/4] object-cover max-md:w-full" />

                {/* Display Image */}
                <form onSubmit={ModifiedProductDetail} className="flex-1 flex flex-col gap-6">
                    <label>{catName}</label>

                    <label className="flex flex-col gap-2">
                        Image Update
                        <input 
                            type="file"
                            onChange={(e) => setImageUrl(e.target.files[0])}
                        />
                    </label>

                    <hr />

                    <label className="flex flex-col gap-2">
                        Name
                        <input 
                            type="text"
                            value={name || ""}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Pricing
                        <input 
                            text="number" 
                            value={price || 0.00}
                            onChange={(e) => {
                                if (e.target.value <= 0)
                                    return setPrice(1.00);

                                setPrice(e.target.value)
                            }}
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Description
                        <textarea 
                            value={description || ""}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-4 border-gray-300"
                        />
                    </label>

                    <Button type="submit" className={"flex-grow-0"}>
                        Modified
                    </Button>
                </form>
            </div>
        </div>
    )
});

const CreateProductVariationForm = memo(({productItem, colors, sizes, onCallCreate}) => {
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [charges, setCharges] = useState(1.00);

    const takenItems = useMemo(() => {
        return productItem.map((item) => ({
            color: item.value1, // Assuming value1 = Color
            size: item.value2,  // Assuming value2 = Size
        }));
    }, [productItem]);
    
    const takenSizesForColor = useMemo(() => {
        return takenItems
          .filter(item => item.color === selectedColor)
          .map(item => item.size);

    }, [selectedColor, takenItems]);
    
    const unavailableColors = useMemo(() => {
        return colors.filter(color => {
            const sizesTaken = takenItems
                .filter(item => item.color === color)
                .map(item => item.size);

            return sizes.every(size => sizesTaken.includes(size));
        });
    }, [colors, sizes, takenItems]);

    const CreateProductVariation = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedColor == null || selectedSize == null)
            return;

        onCallCreate({color: selectedColor, size: selectedSize, qty: quantity, charge: charges});
    }

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={CreateProductVariation}>
                Create New Variation
            </Button>

            <form className="flex flex-col gap-6 p-4 border border-black">
                <label className="flex flex-col gap-2">
                    COLOR
                    <select
                        value={selectedColor}
                        onChange={(e) => {
                            setSelectedColor(e.target.value);
                            setSelectedSize(""); // reset size when color changes
                        }}
                    >
                        <option value="" disabled>Select a color</option>
                        
                        {colors.map((color, index) => (
                            <option key={index} value={color} disabled={unavailableColors.includes(color)}>
                                {color} {unavailableColors.includes(color) ? '(Full)' : ''}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-2">
                    SIZE
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        disabled={!selectedColor} // only active if color is picked
                    >
                        <option value="" disabled>Select a size</option>

                        {sizes.map((size, index) => (
                            <option key={index} value={size} disabled={takenSizesForColor.includes(size)}>
                                {size} {takenSizesForColor.includes(size) ? '(Taken)' : ''}
                            </option>
                        ))}
                    </select>
                </label>


                <label className="flex flex-col gap-2">
                    Quantity
                    <input 
                        type="number" 
                        min={1} max={1000} 
                        value={quantity}
                        onChange={(e) => {
                            if (e.target.value <= 0)
                                return setQuantity(1)

                            setQuantity(e.target.value)
                        }}
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Extra Charge
                    <input 
                        type="number" min={"1.00"}
                        value={charges}
                        onChange={(e) => {
                            if (e.target.value < 0)
                                return setCharges(1)
                            
                            setCharges(e.target.value)
                        }}
                    />
                </label>
            </form>
        </div>
    )
});

const EditVariationQuantity = memo(({item, onCallUpdate}) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(item.quantity || 1)
    }, [item])

    const UpdateQuantity = (e) => {
        e.stopPropagation();
        onCallUpdate({value: quantity});
    }

    return (
        <div className="flex-1 flex flex-col gap-2 p-4 border border-black">
            <p>{item.name1}: {item.value1}</p>
            {item.value2 && <p>{item.name2}: {item.value2}</p>}

            <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-black w-auto"
            />

            <Button onClick={UpdateQuantity}>
                Update Quantity
            </Button>
        </div>
    )
})

// ------------------------------------

const Admin_ProductPage = () => {
    const { products, productItem, itemVariation, productStatus } = useSelector((state) => state.products);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts()).then(() => {
                dispatch(fetchImageProduct());
            })

        if (itemVariation.length === 0)
            dispatch(fetch_ProductVariation());
    }, [dispatch]);

    //Extract Selection
    const allColors = useMemo(() => {
        return itemVariation.filter((v) => v.name === "Color").map((v) => v.value);
    }, [itemVariation]);

    const allSizes = useMemo(() => {
        return itemVariation.filter((v) => v.name === "Size").map((v) => v.value);
    }, [itemVariation]);
    
    //Parent Action
    const onFetch = async (id) => {
        if (selectedProduct == id)
            return;

        setSelectedProduct(id);
        dispatch(fetchProductItem(id));
    }

    //Parent Action - Update Product Variation Quantity
    const onSubmitQuantity = ({id, value}) => {
        dispatch(update_ProdStock({id, quantity: value}));
    }

    //Parent Action - Create Product Variation
    const onCreateVariation = ({id, color, size, quantity, extra_charge}) => {  
        if (color == null || quantity <= 0 || extra_charge < 0)
            return console.error("Invalid input for creating product variation");

        const selectedColorId = itemVariation.find((v) => v.value === color).variation_option_id;
        let selectedSizeId = null;
        if (size != null && size.trim().length != 0)
            selectedSizeId = itemVariation.find((v) => v.value === size).variation_option_id;

        dispatch(create_ProdVariation({
            id,
            optionA_id: selectedColorId, 
            optionB_id: selectedSizeId, 
            quantity, 
            charge: extra_charge
        }))
    }

    //Parent Action - Update Product
    const onUpdateProduct = ({id, name, price, description, imageUrl}) => {
        if (name.trim().length == 0 || price <= 0 || description.trim().length == 0)
            return console.error("Invalid input for updating product");

        dispatch(updateProduct({id, name, description, base_price: price}));
        if (imageUrl != null)
            dispatch(updateProduct_Image({prodID: id, newFile: imageUrl}));
    }

    useEffect(() => {
        console.log("Selected Product: ", products);
    }, [])

    return (
        < >
            <section className="flex flex-col gap-6">
                <h1>Product</h1>

                <div className="flex flex-col gap-11">
                    {selectedProduct != null 
                        ?   < >
                                <EditProductForm 
                                    item={products.find(prev => prev.id == selectedProduct)}
                                    onCallUpdate={({id, name, price, description, imageUrl}) => 
                                        onUpdateProduct({id, name, price, description, imageUrl})
                                    }
                                />
                                <hr className="hidden max-lg:inline-block" />

                                <div className="flex gap-11 max-md:flex-col">
                                    {/* FORM CREATE */}
                                    <CreateProductVariationForm 
                                        productItem={productItem}
                                        colors={allColors}
                                        sizes={allSizes}
                                        onCallCreate={({color, size, qty, charge}) => 
                                            onCreateVariation({
                                                id: selectedProduct, 
                                                color: color, 
                                                size: size, 
                                                quantity: qty, 
                                                extra_charge: charge
                                            })
                                        }
                                    />

                                    {(productItem.length == 0) && <h3>No Product Variation</h3>}

                                    {/* LISTING */}
                                    <div className="h-fit flex-1 grid grid-cols-3 gap-2 max-md:grid-cols-2">
                                        {(productItem.length != 0) && productItem.map((prod, index) => 
                                            <EditVariationQuantity key={index} item={prod} onCallUpdate={({value}) => onSubmitQuantity({id: prod.id, value: value})}/>
                                        )}
                                    </div>
                                </div>
                        </>
                        :   < >
                            <h3>NO PRODUCT IS SELECTED</h3>
                        </>
                    }
                </div>
            </section>

            <hr />
            
            {(productStatus == "succeed") && (
                <section className="grid grid-cols-4 gap-10 max-md:grid-cols-2">
                    {products.map((prod, index) => 
                        <div onClick={() => onFetch(prod.id)} key={index} className="group flex-1 flex flex-col gap-2 p-1 border border-gray-200 cursor-pointer">
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