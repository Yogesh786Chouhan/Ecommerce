import React, { Fragment, useEffect, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { clearErrors, getProductsDetails, newReview } from '../../actions/productAction';
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader.js";
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData.js';
import { addItemsToCart } from '../../actions/cartAction.js';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core"
import { Rating } from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstants.js';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { id } = useParams();
    const { products, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductsDetails(id));
    }, [dispatch, id, error, alert, reviewError, success]);

    const options = {
        size: "large",
        value: products.ratings,
        readOnly: true,
        precision: 0.5,
    };


    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increaseQuantity = () => {
        if (products.stock <= quantity) return;
        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        if (1 >= quantity) return;
        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item added to Cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    }

    const reviewSubmitHandler = () => {
        const myform = new FormData()
        myform.set("rating", rating);
        myform.set("comment", comment);
        myform.set("productId", id);

        dispatch(newReview(myform));
        setOpen(false);
    }
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`${products.name} -- ECOMMERCE`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel sx={{ width: "21vmax", height: "35vmax", marginTop: "40px", '& .carousel .slide img': { width: '100vw', height: '100vh' } }}>
                                {products.images && products.images.map((item, i) => (
                                    <img className="CarouselImage" key={item.url} src={item.url} alt={`${i} Slide`} />
                                ))}
                            </Carousel>
                        </div>
                        <div>
                            <div className="detailsBlock-1">
                                <h2>{products.name}</h2>
                                <p>Product # {products._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className='detailsBlock-2-span'>({products.noOfReviews} reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`$${products.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input value={quantity} type="number" readOnly />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button disabled={products.stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>
                                </div>
                                <p>
                                    Status:
                                    <b className={products.stock < 1 ? "redColor" : "greenColor"}>
                                        {products.stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                Description : <p>{products.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                        </div>
                    </div>

                    <h3 className='reviewsHeading'>REVIEWS</h3>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size='large'
                            />
                            <textarea
                                className='submitDialogTextArea'
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            >
                            </textarea>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                            <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
                        </DialogActions>
                    </Dialog>
                    {products.reviews && products.reviews[0] ? (
                        <div className="reviews">
                            {products.reviews.map((review) => <ReviewCard review={review} key={review._id} />)}
                        </div>
                    ) : (
                        <p className='noReviews'>No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;

