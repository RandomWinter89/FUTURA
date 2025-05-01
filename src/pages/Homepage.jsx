import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchProducts, fetchProductItem, fetchCategory } from "../features/productSlice";

import { fetchWishlistId, addWishlist_item, fetchWishlist_item} from "../features/wishlistSlice";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const { products, productItem, categories } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { wishlist_id,  wishlists } = useSelector((state) => state.wishlists);

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts());

        if (categories.length == 0)
            dispatch(fetchCategory());
    }, [dispatch])

    useEffect(() => {
        if (products.length != 0 && productItem.length == 0)
            dispatch(fetchProductItem(products[0].id));
    }, [dispatch, products])


    //
    useEffect(() => {
        if (wishlist_id == null){
            const uid = "meBqDqbhXYVNgygH8w8oPHGmrWk1";
            dispatch(fetchWishlistId(uid));
        }
    }, [dispatch])

    useEffect(() => {
        if (wishlist_id != null && wishlists.length === 0)
            dispatch(fetchWishlist_item(wishlist_id));
    }, [wishlist_id])

    const [display, setDisplay] = useState(0);
    const [show, setShow] = useState("h-auto");

    //Category Selection
    const [selectedCategories, setSelectedCategories] = useState([]);
    const onHandle_CategoryChange = (id) => {
        setSelectedCategories((prev) => 
            prev.includes(id) ? prev.filter((catId) => catId != id) : [...prev, id]
        );
    }

    const isChecked = (id) => selectedCategories.includes(id);
    const filteredProducts = selectedCategories.length === 0
        ? products
        : products.filter((p) => selectedCategories.includes(p.category_id));

    //Show Category
    const onToggle = () => {
        setShow(show == "h-0" ? "h-auto" : "h-0")
    }

    const onAdd_Item = (product_id) => {
        const uid = "meBqDqbhXYVNgygH8w8oPHGmrWk1";
        console.log("wishlist_id: ", wishlists);

        if (wishlists.length != 0)
            console.log("Condition: ", wishlists.includes(product_id));

        dispatch(addWishlist_item({uid, wishlist_id, product_id}));
    }

    const onNavigate_ProductPage = (id) => {navigate(`/Product/${id}`)};

    return (
        <section className="mx-9 flex flex-col gap-4">
            <h1>Homepage</h1>
            
            <div className="flex gap-2">
                {/* Category */}
                <ul>
                    {categories
                        .filter(cat => cat.parent_category_id === null) // Only top-level categories
                        .map((parent) => (
                        <li key={parent.id}>
                            <button onClick={onToggle}>{parent.category_name}</button>
                            <ul className={`bg-slate-100 overflow-hidden ${show}`}>
                                {categories
                                    .filter(child => child.parent_category_id === parent.id)
                                    .map((child) => (
                                        <li key={child.id}>- {child.category_name}</li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                {/* Product */}
                <div className="grid grid-cols-3 gap-6">
                {products
                    .filter((data) => data.category_id == 8)
                    .map((data) => (
                        <div className="size-52 p-6 bg-slate-200 border-2 border-black flex flex-col gap-2">
                            <p className="uppercase">{data.name}</p>
                            <button 
                                onClick={() => onNavigate_ProductPage(data.id)}
                                className="py-1 px-4 border-2 border-black"
                            >
                                Visit
                            </button>
                            <button 
                                onClick={() => onAdd_Item(data.id)}
                                className="py-1 px-4 border-2 border-black"
                            >
                                Add Wishlist
                            </button>
                        </div>
                    ))
                }
                </div>
            </div>

            <div>
                <h2>Show Wishlist</h2>
                {wishlists.map((data, index) => 
                    <div key={index}>
                        <p>Wishlist: {data.id}</p>
                    </div>
                )}
            </div>
            
        </section>
    )
}

export default Homepage;