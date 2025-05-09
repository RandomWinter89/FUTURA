import { useDispatch, useSelector } from "react-redux";
import { useEffect, useContext } from "react";

import { AuthContext } from "../Context/AuthProvider";
import { fetchProducts, fetchImageProduct } from "../features/productSlice";

import { fetchWishlistId, fetchWishlist_item, addWishlist_item } from "../features/wishlistSlice";

import Card from "../components/Card";


const Homepage = () => {
    const { products, products_loading } = useSelector((state) => state.products);
    const { wishlist_id, wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;

    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length == 0)
            dispatch(fetchProducts());

        if (wishlist_id == null)
            dispatch(fetchWishlistId(currentUser.uid));

        dispatch(fetchImageProduct());
    }, [dispatch])

    useEffect(() => {
        if (wishlist_id != null && wishlists.length == 0) {
            dispatch(fetchWishlist_item(wishlist_id));
        }
    }, [dispatch, wishlist_id])

    const onWishlistProduct = (id) => {
        if (wishlist_id == null)
            return;

        if (!wishlists.length || !wishlists.some((data) => data.product_id === id)) {
            dispatch(addWishlist_item({
                uid: currentUser.uid, 
                wishlist_id: wishlist_id, 
                product_id: id
            }));
        }
    }
    
    return (
        <main className="flex flex-col gap-20 mb-10">
            {/* Cover page */}
            <div className="h-[80svh] flex justify-center items-center text-center bg-slate-600 text-white">
                <h1 className="text-balance">
                    UNLOCK CREATIVITY . BECOME PART OF THEM . BE WILD
                </h1>
            </div>

            <section>
                <h2 className="mb-2">New Product</h2>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2">
                    {!products_loading && products
                        .slice()
                        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
                        .slice(0, 5)
                        .map(data => (
                            <Card 
                                key={data.id} 
                                product={data} 
                                imageUrl={null} 
                                onAddWishlist={() => onWishlistProduct(data.id)}
                            />
                        ))
                    }
                </div>
            </section>

            <section>
                <h2 className="mb-2">Most Popular</h2>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2">
                    {!products_loading && products
                        .slice()
                        .sort((a, b) => b.average_rating - a.average_rating)
                        .slice(0, 5)
                        .map(data => (
                            <Card 
                                key={data.id} 
                                product={data} 
                                imageUrl={null} 
                                onAddWishlist={() => onWishlistProduct(data.id)}
                            />
                        ))
                    }
                </div>
            </section>

            <section>
                <h2 className="mb-2">Recommendation</h2>
                <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2">
                    {!products_loading && products
                        .slice()
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map(data => (
                            <Card 
                                key={data.id} 
                                product={data} 
                                imageUrl={null} 
                                onAddWishlist={() => onWishlistProduct(data.id)}
                            />
                        ))
                    }
                </div>
            </section>
        </main>
    )
}

export default Homepage;