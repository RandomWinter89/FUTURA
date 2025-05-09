import { Layout } from "../../components/common";
import { Category } from "../../database/category";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import {  } from "../../features/productSlice";

const Admin_DashboardPage = () => {
    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);

    const [ prodName, setProdName ] = useState("");
    const [ prodDesc, setProdDesc ] = useState("");
    const [ prodPrice, setProdPrice ] = useState(0.0);
    const [ selectedCat, setSelectedCat ] = useState(1);
    const [ prodSKU, setProdSKU ] = useState("");
    const [ prodImg, setProdImg ] = useState("");

    const dispatch = useDispatch();
    

    useEffect(() => {
        const filterCat = Category.filter((cat) => cat.parent_category_id === null);
        setCategory(filterCat);

        const filterSubCat = Category.filter((cat) => cat.parent_category_id != null);
        setSubCategory(filterSubCat);
    }, [])

    const onUpload_Product = (e) => {
        e.preventDefault();

        if (prodName.trim().length == 0 || prodDesc.trim().length == 0 || prodPrice == 0.0 ||
        prodSKU.trim().length == 0 || prodImg.trim().length == 0 )
            return;

        
    }   

    return (
        <Layout>
            <section className="flex flex-col gap-6">
                <h1>Admin Page</h1>
                <hr className="border-black" />

                <form className="flex flex-col gap-4">
                    <label className="flex gap-2">
                        Product Name:
                        <input 
                            type="text" 
                            onChange={(e) => setProdName(e.target.value)}
                            className="border border-black"
                        />
                    </label>

                    <label className="flex gap-2">
                        Description:
                        <input 
                            type="text" 
                            onChange={(e) => setProdDesc(e.target.value)}
                            className="border border-black"
                        />
                    </label>

                    <label className="flex gap-2">
                        Pricing:
                        <input 
                            type="number"
                            min="0.00"
                            onChange={(e) => setProdPrice(e.target.value)}
                            className="border border-black"
                        />
                    </label>


                    {/* Select Category */}
                    <label className="flex gap-2">
                        Product Category
                        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                            {category.map((parent) => 
                                < >
                                    <option value={parent.id}>
                                        {parent.category_name}
                                    </option>
                                    
                                    <optgroup label={`${parent.category_name}`}>
                                        {subCategory
                                            .filter(child => child.parent_category_id === parent.id)
                                            .map((child) =>
                                                <option value={child.id}>
                                                    {child.category_name}
                                                </option>
                                            )
                                        }
                                    </optgroup>
                                </>
                            )}
                        </select>
                    </label>

                    <label className="flex gap-2">
                        SKU:
                        <input 
                            type="text"
                            onChange={(e) => setProdSKU(e.target.value)}
                            className="border border-black"
                        />
                    </label>

                    <label className="flex gap-2">
                        Image:
                        <input 
                            type="file"
                            onChange={(e) => setProdImg(e.target.value)}
                            className="border border-black"
                        />
                    </label>

                    <button type="submit">Submit Product</button>
                </form>
            </section>
        </Layout>
    )
}

export default Admin_DashboardPage;