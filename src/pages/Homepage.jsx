import { useDispatch, useSelector } from "react-redux";
import { useState, useContext } from "react";

import { AuthContext } from "../Context/AuthProvider";
import { addWishlist_item } from "../features/wishlistSlice";

import { ToastOverlay, Card } from "../components/ui";

const Homepage = () => {
    const { products, products_loading } = useSelector((state) => state.products);
    const { wishlist_id, wishlists } = useSelector((state) => state.wishlists);
    const { currentUser } = useContext(AuthContext) || null;

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();

    const onWishlistProduct = (id) => {
        if (wishlist_id == null)
            return;

        if (!wishlists.length || !wishlists.some((data) => data.product_id == id)) {
            dispatch(addWishlist_item({
                uid: currentUser.uid, 
                wishlist_id: wishlist_id, 
                product_id: id
            }));

            setOpen(true);
        }
    }
    
    return (
        < >
            {/* Cover page */}
            <div className="h-[80svh] -mt-10 flex justify-center items-center text-center bg-slate-600 text-white">
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
                                imageUrl={data.imageUrl} 
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
                                imageUrl={data.imageUrl} 
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
                        .slice(0, 5)
                        .map(data => (
                            <Card 
                                key={data.id} 
                                product={data} 
                                imageUrl={data.imageUrl} 
                                onAddWishlist={() => onWishlistProduct(data.id)}
                            />
                        ))
                    }
                </div>
            </section>

            <ToastOverlay show={open} onHide={() => setOpen(false)} desc={"Wishlist Added"}/>
        </>
    )
}

export default Homepage;