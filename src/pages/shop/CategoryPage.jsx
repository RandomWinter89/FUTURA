import { Category } from "../../database/category";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

// MORE OPTIMIZED
import { Grid } from "../../components/shop";
import { useMemo } from "react";

const CategoryPage = () => {
    const { products, productStatus } = useSelector((state) => state.products);
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
            <section className="flex justify-between gap-20 max-md:gap-10 max-sm:flex-col">
                {/* Filter */}
                <div className="flex flex-col gap-6">
                    <p className="subtitle1">Filter</p>
                    <ul className="w-fit flex flex-col gap-2 max-sm:w-full">
                        {/* Select All */}
                        <label className="body2 flex gap-2 text-gray-500">
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
                                <li key={parent.id} className="border-b py-1 border-gray-300">
                                    <button 
                                        onClick={() => toggleActiveCat(parent.id)}
                                        className="w-full flex justify-between gap-4 items-center text-left body1"
                                    >
                                        {parent.category_name}
                                        <p>{activeCategories.includes(parent.id) ? "-" : "+"}</p>
                                    </button>
                                    
                                    <ul className={`overflow-hidden flex flex-col max-md:gap-2 ${activeCategories.includes(parent.id) ? "pb-3 h-fit" : "h-0"}`}>
                                        {categories
                                            .filter(child => child.parent_category_id === parent.id)
                                            .map((child) => (
                                                <li key={child.id} className="flex gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedCategories.includes(child.id)} 
                                                        onChange={() => toggleSelectedCat(child.id)}
                                                    />
                                                    <label className="body2 text-gray-500">{child.category_name}</label>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <Grid 
                        collection={sortedCategoryProduct}
                        status={productStatus} 
                        header={"Category"}  
                        enableMore={false}
                        variant={"category"}
                    />
                </div>
            </section>
        </>
    )
}

export default CategoryPage;