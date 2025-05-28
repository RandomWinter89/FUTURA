import { updateReview, deleteReview } from '../../features/reviewSlice';
import { useDispatch } from 'react-redux';

import { useState, memo } from "react";
import { StarRating } from '../common';
import { Button } from "../ui";

const ReviewCard = memo(({data, requestEdit, requestDelete}) => {
    return (
        <div className="flex flex-col gap-4 p-4 border border-black">
            <p className="subtitle2">
                {data.product_name} 
            </p>

            <StarRating rate={Math.round(data.rating_value)} />

            <p className='body2 opacity-60'>
                Comment: {data.comment}
            </p>

            <div className='flex gap-2 mt-auto max-sm:flex-col'>
                <Button size={"sm"} onClick={requestEdit}>
                    Edit
                </Button> 

                <Button size={"sm"} variant={"primary_outline"} onClick={requestDelete}>
                    Delete
                </Button> 
            </div>
        </div>
    )
});

const ReviewPanel = ({authUser, userReviews, status}) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [selectedReview, setSelectedReview] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();

    const handleEdit = (e) => {
        e.preventDefault();

        if (review.trim().length == 0 || selectedReview == null)
            return;

        dispatch(updateReview({
            uid: authUser.uid, 
            review_id: selectedReview, 
            rating_value: rating, 
            comment: review
        }));

        setEditMode(false);
        setSelectedReview(null);
        setReview("");
        setRating(0);
    }

    const handleDelete = ({e, reviewId}) => {
        e.preventDefault();

        if (reviewId == null)
            return;

        dispatch(deleteReview({
            uid:authUser.uid, 
            review_id: reviewId
        }))
    }

    const toggleEditMode = (reviewId) => {
        setSelectedReview(reviewId);
        if (reviewId != null) {
            const data = userReviews.find((data => data.id == reviewId));
            if (data) {
                setRating(Math.round(data.rating_value));
                setReview(data.comment);
                setEditMode(true);
            }
        } else {
            setRating(0);
            setReview("");
            setEditMode(false);
        }
    }

    if (status == "loading" || status == "idle") return (
        < >
        </>
    )

    return (
        < >
            <h2>{editMode ? "Edit Review" : "Personal Review" }</h2>

            {editMode && (
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
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="border border-black min-h-fit p-8"
                        />
                    </label>

                    <div className='flex gap-6'>
                        <Button onClick={() => {setEditMode(false); toggleEditMode(null)}} size={"sm"}>
                            Cancel Review
                        </Button>

                        <Button onClick={handleEdit} variant={"primary_outline"} size={"sm"}>
                            Submit Review
                        </Button>
                    </div>
                </div>
            )}

            {!editMode && 
                <div className='grid grid-cols-2 gap-6 max-sm:grid-cols-1'>
                    {(userReviews.length != 0) 
                        ?   (userReviews.map((data, index) => 
                                <ReviewCard
                                    key={index}
                                    data={data}
                                    requestEdit={() => 
                                        toggleEditMode(data.id)
                                    }
                                    requestDelete={(e) => {
                                        handleDelete({e, reviewId: data.id});
                                    }}
                                />
                            ))
                        :   <p>No Review</p>
                    }
                </div>
            }
        </>
    )
}

export default ReviewPanel;