/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchPromotion_Category, fetchPromotion } from "../../features/promotionSlice";

const PromotionPage = () => {
    const { 
        promotionCategory, 
        promotion, 
        promotionCategory_loading,  
        promotion_loading 
    } = useSelector((state) => state.promotions);
    const dispatch = useDispatch();

    useEffect(() => {
        if (promotion.length == 0)
            dispatch(fetchPromotion());

        if (promotionCategory.length == 0)
            dispatch(fetchPromotion_Category());
    }, [dispatch])

    const ModifiedDateStyle = (date) => {
        return date.split("T")[0].split("-").join("/");
    }

    // Should add category list.
    return (
        < >
            <section className="mb-2">
                <h2>Promotion</h2>
                <p>Where all offer locate here, you can preview them and see which category applied</p>
            </section>

            <section className="flex flex-col gap-4">
                {promotion_loading && <h3>Loading...</h3>}
                {!promotion_loading && (
                    promotion.map((data) => 
                        < >
                            <div className="flex flex-col gap-2 bg-slate-100 p-2 border border-black rounded-lg">
                                <div>
                                    <h3 className="text-xl">{data.name}</h3>
                                    <p>{data.description}</p>
                                </div>

                                <hr/>

                                <p>Duration: {ModifiedDateStyle(data.start_date)} ~ {ModifiedDateStyle(data.end_date)}</p>

                                <hr/>

                                <p>Discount: {100 - (parseFloat(data.offer) * 100)}%</p>
                            </div>
                            <hr/>
                        </>
                    )
                )}
            </section>
        </>
    )
}

export default PromotionPage;