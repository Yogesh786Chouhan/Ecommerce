import React, { Fragment, useEffect } from 'react'
import { useSelector } from "react-redux"
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader/Loader'
import { Link, useNavigate } from 'react-router-dom'
import "./Profile.css";

const Profile = () => {
    const { user, loading, isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={`${user?.name}'s Profile`} />
                    <div className="profileContainer">
                        <div>
                            <h1>My Profile</h1>
                            {user && user.avatar && user.avatar.url ? (
                                <img src={user.avatar.url} alt={user.name} />
                            ) : (
                                <img src="/images/default_avatar.png" alt="Default Avatar" />
                            )}
                            <Link to="/me/update">Edit Profile</Link>
                        </div>

                        <div>
                            <div>
                                <h4>Full Name</h4>
                                <p>{user?.name}</p>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>{user?.email}</p>
                            </div>
                            <div>
                                <h4>Joined On</h4>
                                <p>{user ? String(user.createdAt).substring(0, 10) : ''}</p>
                            </div>

                            <div>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default Profile
