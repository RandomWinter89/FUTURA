/* eslint-disable react-hooks/exhaustive-deps */
import { fetchProducts,  fetchCategory } from "../../features/productSlice";
import { addWishlist_item } from "../../features/wishlistSlice";

import { AuthContext } from "../../Context/AuthProvider";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";


const CategoryPage = () => {
    const { products, categories } = useSelector((state) => state.products);
    const { wishlist_id,  wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;

    const [activeCategories, setActiveCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //==========================>

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts());

        if (categories.length == 0)
            dispatch(fetchCategory());
    }, [dispatch])

    useEffect(() => {
        if (categories.length != 0)
            setSelectedCategories(categories.map((data) => data.id));
    }, [dispatch, categories])

    //==========================>
    //Category Selection
    
    const onToggle_ActiveCategories = (id) => {
        setActiveCategories((prev) => 
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    }

    const onToggle_SelectedCategories = (id) => {
        setSelectedCategories((prev) => 
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    const onHandle_Favorite = ({e, id}) => {
        e.stopPropagation();

        console.log(id);

        if (currentUser) {
            onAdd_Item(id);
        } else {
            navigate("/Login");
        }
    }

    //Add wishlist id
    const onAdd_Item = (product_id) => {        
        const uid = currentUser.uid;
        if (wishlist_id === null)
            return;

        if (wishlists.length === 0 )
            return dispatch(addWishlist_item({uid, wishlist_id, product_id}));
            
        if (wishlists.length !== 0 && !wishlists.some((data) => data.product_id === product_id)) 
            return dispatch(addWishlist_item({uid, wishlist_id, product_id}));
    }

    const onHandle_DisplayCategory = (data) => {
        const child = categories.find((cat) => cat.id === data.category_id);
        const parent = categories.find((cat) => cat.id === child?.parent_category_id);

        if (parent) {
            return `${parent.category_name} / ${child.category_name}`;
        } else if (child) {
            return `${child.category_name}`;
        } else {
            return "Unknown Category";
        }
    }

    const onNavigate_ProductPage = (id) => {navigate(`/Product/${id}`)};

    return (
        <main className="flex flex-col gap-4 my-4">
            <section>
                <h1>Category</h1>
                <p>Here's where you find your stuff</p>
            </section>
            
            <section className="flex gap-2 justify-between">
                {/* Category */}
                <ul className="w-fit text-left">
                    {categories
                        .filter(cat => cat.parent_category_id === null) // Only top-level categories
                        .map((parent) => (
                        <li key={parent.id}>
                            <button onClick={() => onToggle_ActiveCategories(parent.id)}>{parent.category_name}</button>
                            <ul className={`bg-slate-100 overflow-hidden ${activeCategories.includes(parent.id) ? "h-auto" : "h-0"}`}>
                                {categories
                                    .filter(child => child.parent_category_id === parent.id)
                                    .map((child) => (
                                        <li key={child.id} className="pl-4">
                                            <input type="checkbox" checked={selectedCategories.includes(child.id)} onChange={() => onToggle_SelectedCategories(child.id)}/>
                                            <label>{child.category_name}</label>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))}
                </ul>

                {/* Product */}
                <div className="flex-1 flex gap-6 flex-wrap">
                    {products
                        .filter((data) => selectedCategories.includes(data.category_id))
                        .map((data, index) => (
                            <div key={index} onClick={() => onNavigate_ProductPage(data.id)} className="size-60 p-6 bg-slate-200 border-2 border-black flex flex-col gap-2">
                                <p className="uppercase">{data.name}</p>
                                <img className="h-full w-full bg-green-200 border-2 border-black rounded-lg"/>
                                

                                <div className="flex justify-between"> 
                                    <div>
                                        <p>{onHandle_DisplayCategory(data)}</p>
                                        <p>MYR {data.base_price}</p>
                                    </div>
                                    <button onClick={(e) => onHandle_Favorite({e, id: data.id})} className="w-fit p-2 border-2 border-black rounded-lg">
                                        Liked
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </main>
    )
}

export default CategoryPage;