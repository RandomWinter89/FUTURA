/* eslint-disable react-hooks/exhaustive-deps */
import { addWishlist_item } from "../../features/wishlistSlice";
import { Category } from "../../database/category";


import { AuthContext } from "../../Context/AuthProvider";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Card, ToastOverlay } from "../../components/ui";


const CategoryPage = () => {
    const { products } = useSelector((state) => state.products);
    const { wishlist_id,  wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;
    const [categories] = useState(Category);
    const [activeCategories, setActiveCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [desc, setDesc] = useState("");
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //==========================>

    // useEffect(() => {
    //     if (products.length == 0)
    //         dispatch(fetchProducts());
    // }, [dispatch])

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

    const onToggle_All = () => {
        setSelectedCategories((prev) => 
            prev.length === categories.length
            ? []
            : categories.map((cat) => cat.id)
        );
    }

    const onWishlistProduct = ({id}) => {
        console.log(id);

        if (currentUser) {
            onAction_Wishlist(id);
        } else {
            navigate("/Auth/Login");
        }
    }

    const onAction_Wishlist = (id) => {
        if (wishlist_id == null)
            return;

        if (!wishlists.length || !wishlists.some((data) => data.product_id == id)) {
            dispatch(addWishlist_item({
                uid: currentUser.uid, 
                wishlist_id: wishlist_id, 
                product_id: id
            }));

            setDesc("Added to wishlists");
            setOpen(true);
        } else {
            setDesc("This item is in wishlist already");
            setOpen(true);
        }
    }

    return (
        < >
            <section className="flex flex-col gap-2">
                <h1>Category</h1>
                <p>Here's where you find your stuff</p>
            </section>
            
            <section className="flex gap-10 justify-between">
                {/* Category */}
                <ul className="w-fit flex flex-col gap-2">
                    <label className="flex gap-4">
                        <input type="checkbox" checked={selectedCategories.length == categories.length} onChange={() => onToggle_All()} />
                        Toggle All
                    </label>
                    {categories
                        .filter((cat) => cat.parent_category_id === null)
                        .map((parent) => (
                            <li key={parent.id} className="border border-black rounded-lg">
                                <button 
                                    onClick={() => onToggle_ActiveCategories(parent.id)}
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
                                                <input type="checkbox" checked={selectedCategories.includes(child.id)} onChange={() => onToggle_SelectedCategories(child.id)}/>
                                                <label>{child.category_name}</label>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                        ))
                    }
                </ul>

                {/* Product */}
                <div className="flex-1 grid gap-2 grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-1">
                    {products
                        .filter((data) => selectedCategories.includes(data.category_id))
                        .map((data) => (
                            <Card 
                                key={data.id} 
                                product={data} 
                                imageUrl={data.imageUrl} 
                                onAddWishlist={() => onWishlistProduct({id: data.id})}
                            />
                        ))
                    }
                </div>
            </section>

            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={desc}/>
        </>
    )
}

export default CategoryPage;