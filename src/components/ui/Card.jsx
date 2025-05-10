import { useNavigate } from "react-router-dom";

const Card = ({product, imageUrl = "NONE", onAddWishlist}) => {
    const navigate = useNavigate();

    const onNavigateProduct = () => navigate(`/Shop/Product/${product.id}`);
    const onCalledWishlist = (e) => {
        e.stopPropagation();
        onAddWishlist();
    }

    //Grid or Row
    return (
        <div 
            onClick={onNavigateProduct} 
            className="
                flex-1 flex flex-col 
                border border-black 
                cursor-pointer hover:scale-105 hover:transition-transform
            "
        >
            {imageUrl != "NONE"
                ? <img src={`${imageUrl}`} className="object-cover w-full aspect-[3/4]"/>
                : <span className="bg-orange-300 w-full aspect-[3/4]" />
            }


            <div className="flex-1 flex flex-col gap-2 p-2 bg-white">
                <div className="flex justify-between items-center">
                    <p>COLOR</p>
                    <button 
                        onClick={onCalledWishlist} 
                        className="
                            border border-black px-2 rounded-lg 
                            hover:bg-red-500 hover:transition-colors
                        "
                    >
                        Liked
                    </button>
                </div>

                <hr className="border-t border-black"/>

                <div className="flex justify-between text-gray-700">
                    <p>Category</p>
                    <p>Size</p>
                </div>

                <hr className="border-t border-black"/>

                <div className="flex-1 flex flex-col justify-between gap-2">
                    <p className="text-lg">{product.name}</p>
                
                    <div className="flex items-end justify-between">
                        <p className="font-semibold">RM {product.base_price}</p>
                        {product.average_rating != null && (
                            <p>Rating: {parseFloat(product.average_rating)} ({product.number_of_reviews})</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;
