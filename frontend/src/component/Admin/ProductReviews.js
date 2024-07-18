import React, { Fragment, useEffect, useState } from "react";
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Paper,
    Button,
} from "@material-ui/core";
import "./ProductReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    getAllReviews,
    deleteReviews,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import SideBar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";

const ProductReviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId: urlProductId } = useParams();

    const alert = useAlert();

    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.review
    );

    const { error, reviews, loading } = useSelector(
        (state) => state.productReviews
    );

    const [productId, setProductId] = useState(urlProductId || "");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId, productId));
    };

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
    };

    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId));
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Review Deleted Successfully");
            navigate("/admin/reviews");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, alert, error, deleteError, navigate, isDeleted, productId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Fragment>
            <MetaData title={`ALL REVIEWS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productReviewsContainer">
                    <form
                        className="productReviewsForm"
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
                        <div>
                            <Star />
                            <input
                                type="text"
                                placeholder="Product Id"
                                required
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>
                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading || productId === ""}
                        >
                            Search
                        </Button>
                    </form>

                    {reviews && reviews.length > 0 ? (
                        <TableContainer component={Paper} className="tableContainer">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Review ID</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Comment</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reviews
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((review) => (
                                            <TableRow key={review._id}>
                                                <TableCell>{review._id}</TableCell>
                                                <TableCell>{review.name}</TableCell>
                                                <TableCell>{review.comment}</TableCell>
                                                <TableCell
                                                    className={
                                                        review.rating >= 3 ? "greenColor" : "redColor"
                                                    }
                                                >
                                                    {review.rating}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => deleteReviewHandler(review._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={reviews.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    ) : (
                        <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ProductReviews;


