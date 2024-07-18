import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CheckoutSteps from '../Cart/CheckoutSteps';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import { createOrder, clearErrors } from "../../actions/orderAction";
import './Payment.css';

const Payment = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);
    const navigate = useNavigate();

    const orderInfo = sessionStorage.getItem("orderInfo") ? JSON.parse(sessionStorage.getItem("orderInfo")) : null;

    const { shippingInfo, cartItems, loading } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const { error } = useSelector(state => state.newOrder);

    const [isStripeLoaded, setIsStripeLoaded] = useState(false);

    useEffect(() => {
        if (stripe && elements) {
            setIsStripeLoaded(true);
        } else {
            setIsStripeLoaded(false);
        }
    }, [stripe, elements]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, alert]);

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const paymentData = {
                amount: Math.round(orderInfo.totalPrice * 100),
            };

            const { data } = await axios.post("/api/v1/payment/process", paymentData, config);

            const client_secret = data.client_secret;

            if (!stripe || !elements) {
                payBtn.current.disabled = false;
                alert.error("Stripe.js has not loaded yet.");
                return;
            }

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;
                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    const paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    const order = {
                        shippingInfo,
                        orderItems: cartItems,
                        itemsPrice: orderInfo.subtotal,
                        taxPrice: orderInfo.tax,
                        shippingPrice: orderInfo.shippingCharges,
                        totalPrice: orderInfo.totalPrice,
                        paymentInfo,
                    };

                    dispatch(createOrder(order));

                    alert.success("Payment successful");
                    navigate("/success");
                } else {
                    alert.error("There is some issue while processing payment");
                    payBtn.current.disabled = false;
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            alert.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="Payment" />
                    <CheckoutSteps activeStep={2} />
                    <div className="paymentContainer">
                        {!isStripeLoaded ? (
                            <Loader />
                        ) : (
                            <form className="paymentForm" onSubmit={submitHandler}>
                                <Typography>Card Info</Typography>
                                <div>
                                    <CreditCardIcon />
                                    <CardNumberElement className='paymentInput' />
                                </div>
                                <div>
                                    <EventIcon />
                                    <CardExpiryElement className='paymentInput' />
                                </div>
                                <div>
                                    <VpnKeyIcon />
                                    <CardCvcElement className='paymentInput' />
                                </div>
                                <input
                                    type="submit"
                                    value={`Pay - $${orderInfo ? orderInfo.totalPrice : ''}`}
                                    ref={payBtn}
                                    className='paymentFormBtn'
                                />
                            </form>
                        )}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Payment;

