import { Category } from "../../database/category";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

// MORE OPTIMIZED
import { Grid } from "../../components/shop";
import { useMemo } from "react";

const CategoryPage = () => {
    const { products, products_loading } = useSelector((state) => state.products);
    const [categories] = useState(Category);
    const [activeCategories, setActiveCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const dispatch = useDispatch();

    //==========================>
    //Category Selection

    useEffect(() => {
        if (categories.length != 0)
            setSelectedCategories(categories.map((data) => data.id));
    }, [dispatch, categories])

    
    const toggleActiveCat = (id) => {
        setActiveCategories((prev) => 
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    }

    const toggleSelectedCat = (id) => {
        setSelectedCategories((prev) => 
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedCategories((prev) => 
            prev.length === categories.length ? [] : categories.map((cat) => cat.id)
        );
    }

    //=======================>
    //Collection Optimized

    const sortedCategoryProduct = useMemo(() => {
        return products.filter((info) => selectedCategories.includes(info.category_id))
    }, [products,selectedCategories])

    return (
        < >            
            <section className="flex gap-10 justify-between">
                <ul className="w-fit flex flex-col gap-2">
                    {/* Select All */}
                    <label className="flex gap-4">
                        <input 
                            type="checkbox" 
                            checked={selectedCategories.length == categories.length} 
                            onChange={() => toggleAll()} 
                        />
                        Toggle All
                    </label>

                    {/* Category */}
                    {categories
                        .filter((cat) => cat.parent_category_id === null)
                        .map((parent) => (
                            <li key={parent.id} className="border border-black rounded-lg">
                                <button 
                                    onClick={() => toggleActiveCat(parent.id)}
                                    className="w-full p-2 flex justify-between text-left "
                                >
                                    {parent.category_name}
                                    <p>{activeCategories.includes(parent.id) ? "-" : "+"}</p>
                                </button>
                                
                                <ul className={` border-black rounded-b-lg overflow-hidden  ${activeCategories.includes(parent.id) ? "py-2 h-fit border-t" : "h-0"}`}>
                                    {categories
                                        .filter(child => child.parent_category_id === parent.id)
                                        .map((child) => (
                                            <li key={child.id} className="px-4 flex gap-1">
                                                <input type="checkbox" checked={selectedCategories.includes(child.id)} onChange={() => toggleSelectedCat(child.id)}/>
                                                <label>{child.category_name}</label>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                        ))
                    }
                </ul>
                
                <Grid collection={sortedCategoryProduct} isLoading={products_loading} variant={"category"}/>
            </section>
        </>
    )
}

export default CategoryPage;