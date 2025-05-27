import { memo, useState, useMemo} from "react";

import { IconArrowLeft, IconArrowRight } from "../../components/icon";
import { Button } from "../../components/ui";

import { StarRating } from "../../components/common";

const ITEMS_PER_PAGE = 4;


const ReviewContainer = memo(({avgRating, maxNumReview, reviewStatus, productReviews, onUploadReview}) => {
    const [reviewMode, setReviewMode] = useState(false);
    const [review, setReview] = useState(""); 
    const [rating, setRating] = useState(0);
    const [page, setPage] = useState(0);
    
    const currentPageReviews = useMemo(() => {
        if (productReviews.length != 0)
            return productReviews.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
        return [];
    }, [page, productReviews]);

    
    const maximumPage = useMemo(() => {
        if (productReviews.length != 0)
            return Math.ceil(productReviews.length / ITEMS_PER_PAGE)

        return 0;
    }, [productReviews]);

    const handleNext = () => setPage((p) => Math.min(p + 1, maximumPage - 1));
    const handlePrev = () => setPage((p) => Math.max(p - 1, 0));

    //REVIEW
    

    const CreateReview = (e) => {
        e.stopPropagation();

        if (review.trim().length == 0)
            return;

        onUploadReview({review, rating});
        setReviewMode(false);
        setReview("");
        setRating(0);
    }

    return (
        < >
            <section className="flex flex-col gap-8">
                {/* HEADER */}
                <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-4">
                    {/* TITLE */}
                    <div className="flex gap-6 max-sm:flex-col max-sm:gap-2 max-sm:w-full">
                        <h2>Reviews</h2>
                        {/* Star Rating */}
                        <div className="flex gap-4 items-center">
                            {/* ICON */}
                            <StarRating rate={Math.round(avgRating)} />

                            {/* VALUE */}
                            {avgRating &&
                                <p className="body2">
                                    {parseFloat(avgRating).toFixed(1)} ({maxNumReview})
                                </p>
                            }
                        </div>
                    </div>
                    
                    {/* ACTION BUTTON */}
                    <div className="flex gap-3 max-sm:w-full">
                        {reviewMode &&
                            < >
                                <Button onClick={() => setReviewMode(false)} size={"sm"}>
                                    Cancel Review
                                </Button>

                                <Button onClick={CreateReview} variant={"primary_outline"} size={"sm"}>
                                    Submit Review
                                </Button>
                            </>
                        }

                        {!reviewMode &&
                            <Button onClick={() => setReviewMode(true)} variant={"primary_outline"} size={"sm"}>
                                Write a Review
                            </Button>
                        }
                    </div>
                </div>

                {/* FORM */}
                {reviewMode && 
                    <div className="flex flex-col gap-6 max-sm:gap-3">
                        <label className="flex gap-4 body2 max-sm:items-center">
                            Rating: 
                            <div className="flex gap-1">
                                <StarRating preview={false} rate={rating} setRate={(value) => setRating(value)} />
                            </div>
                        </label>

                        <label className="flex flex-col gap-5 body2 max-sm:gap-3">
                            Comments
                            <textarea 
                                placeholder={"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."}
                                onChange={(e) => setReview(e.target.value)}
                                className="border border-black min-h-fit p-8"
                            />
                        </label>
                    </div>
                }

                <hr className="border-gray-300" />

                {/* REVIEW */}
                <div className="flex flex-col gap-8 items-center">
                    {(reviewStatus == "succeed") &&
                        <div className="w-full grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                            {currentPageReviews.map((data, index) => 
                                <div key={index} className="border border-black p-9 flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <StarRating rate={Math.round(data.rating_value)} />
                                        <p className="subtitle1">{data.username} : {data.rating_value}</p>
                                        <p className="body2 opacity-60">"{data.comment}"</p>
                                    </div>
                                    
                                    
                                    <p className="body2 opacity-60">
                                        Posted on: {data.created_datetime.split("T")[0].split("-").join("/")}
                                    </p>
                                </div>
                            )}
                        </div>
                    }

                    {productReviews.length != 0 && 
                        <div className="flex gap-4 items-center">
                            <button 
                                onClick={handlePrev} 
                                disabled={page === 0} 
                                className={`${page === 0  ? "text-gray-300" : "text-gray-600 hover:text-orange-600"}`}
                            >
                                <IconArrowLeft />
                            </button>

                            <p className="body2">{page + 1}</p>

                            <button 
                                onClick={handleNext} 
                                disabled={page >= maximumPage - 1}
                                className={`${(page >= maximumPage - 1)  ? "text-gray-300" : "text-gray-600 hover:text-orange-600"}`}
                            >
                                <IconArrowRight />
                            </button>
                        </div>
                    }
                </div>
            </section>
        </>
    )
});

export default ReviewContainer;