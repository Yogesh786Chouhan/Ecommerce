import React, { Fragment, useEffect } from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const Contact = () => {
    const { loading, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (user) {
            console.log(user);
        }
     
    }, [user]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="contactContainer">
                        {user && user.email ? (
                            <a className="mailBtn" href={`mailto:${user.email}`}>
                                <Button>Contact: {user.email}</Button>
                            </a>
                        ) : (
                            <Button disabled>No Contact Info Available</Button>
                        )}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Contact;
