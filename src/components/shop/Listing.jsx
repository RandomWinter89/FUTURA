import { ProductCard } from "./ProductCard";

//Listing the Product
const Listing = ({collection, isLoading}) => {
    const base = "flex flex-col gap-2";

    return (
        <div className={base}>
            {isLoading && collection.map(item => <ProductCard key={item.id} data={item}/>)}
        </div>
    )
}

export default Listing;