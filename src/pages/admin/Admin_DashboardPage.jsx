
import { Category } from "../../database/category";
import { useState, useEffect } from "react";

import { uploadProduct, uploadProductImage } from "../../features/productSlice";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../../components/ui";

const Admin_DashboardPage = () => {
    const { products } = useSelector((state) => state.products);
    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);

    const [ prodName, setProdName ] = useState("");
    const [ prodDesc, setProdDesc ] = useState("");
    const [ prodPrice, setProdPrice ] = useState(0.0);
    const [ selectedCat, setSelectedCat ] = useState();
    const [ prodImg, setProdImg ] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        const filterCat = Category.filter((cat) => cat.parent_category_id === null);
        setCategory(filterCat);

        const filterSubCat = Category.filter((cat) => cat.parent_category_id != null);
        setSubCategory(filterSubCat);
    }, [])

    const onUpload_Product = (e) => {
        e.preventDefault();

        if (prodName.trim().length == 0 || prodDesc.trim().length == 0 || prodPrice <= 0)
            return;

        if (prodImg == null || selectedCat == null)
            return;

        const categoryInfo = Category.find(info => info.id == selectedCat);
        const indexProduct = products.filter(prev => prev.category_id == categoryInfo.id).length + 1;
        const skuString = "F-" + `${categoryInfo.sdk}-` + "A" + String(indexProduct).padStart(2, 0);

        dispatch(uploadProduct({
                category_id: selectedCat, 
                name: prodName, 
                description: prodDesc, 
                base_price: prodPrice, 
                sku: skuString 
            })
        ).then(() => 
            dispatch( uploadProductImage({sku: skuString, prodImg}))
        )
    } 

    return (
        < >
            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1>Welcome to Admin</h1>
                    <p>Here's the create section of the product</p>
                    <p>You can add variation on products tab</p>
                    <p>Or you can modified customer order status</p>
                </div>

                <form onSubmit={onUpload_Product} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                        Product Name:
                        <input 
                            type="text" 
                            onChange={(e) => setProdName(e.target.value)}
                            className="flex-1 p-2 border border-black"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Description:
                        <input 
                            type="text" 
                            onChange={(e) => setProdDesc(e.target.value)}
                            className="flex-1 p-2 border border-black"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        Pricing:
                        <input 
                            type="number"
                            min="0.00"
                            onChange={(e) => setProdPrice(e.target.value)}
                            className="flex-1 p-2 border border-black"
                        />
                    </label>

                    {/* Select Category */}
                    <label className="flex flex-col gap-2">
                        Product Category:
                        <select 
                            value={selectedCat} 
                            onChange={(e) => setSelectedCat(e.target.value)}
                            className="bg-white"
                        >
                            <option value={null}>Select a category</option>

                            {category.map((parent) => 
                                <option key={parent.id} value={parent.id}>
                                    {parent.category_name}
                                </option>
                            )}

                            {category.map((parent) =>
                                <optgroup key={parent.id} label={`${parent.category_name}`}>
                                    {subCategory
                                        .filter(child => child.parent_category_id === parent.id)
                                        .map((child, index) =>
                                            <option key={index} value={child.id}>
                                                {child.category_name}
                                            </option>
                                        )
                                    }
                                </optgroup>
                            )}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        Image:
                        <input 
                            type="file"
                            onChange={(e) => setProdImg(e.target.files[0])}
                        />
                    </label>
                    
                    <Button type="submit">
                        Submit Product
                    </Button>
                </form>
            </section>
        </>
    )
}

export default Admin_DashboardPage;