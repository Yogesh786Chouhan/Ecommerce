import React, { Fragment, useEffect } from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const About = () => {
    const visitInstagram = () => {
        window.location = "https://www.instagram.com/english_67_learner?igsh=cDlvZG5uNnF4enhx";
    };

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
                    <div className="aboutSection">
                        <div></div>
                        <div className="aboutSectionGradient"></div>
                        <div className="aboutSectionContainer">
                            <Typography component="h1">About Us</Typography>

                            <div>
                                <div>
                                    <Avatar
                                        style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                                        src={user && user.avatar && user.avatar.url ? user.avatar.url : "/Profile.png"}
                                        alt="Founder"
                                    />
                                    <Typography>{user ? user.email : "Loading..."}</Typography>
                                    <Button onClick={visitInstagram} color="primary">
                                        Visit Instagram
                                    </Button>
                                    <span>
                                        {user ? `This is a sample website made by ${user.email} only with the
                                        purpose to show MERN Stack` : "Loading..."}
                                    </span>
                                </div>
                                <div className="aboutSectionContainer2">
                                    <Typography component="h2">Our Brands</Typography>
                                    <a
                                        href="https://youtu.be/k-St-Gxyld8?si=mLNm7_FbO6eQds0T"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <YouTubeIcon className="youtubeSvgIcon" />
                                    </a>

                                    <a
                                        href="https://www.instagram.com/english_67_learner?igsh=cDlvZG5uNnF4enhx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <InstagramIcon className="instagramSvgIcon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default About;
