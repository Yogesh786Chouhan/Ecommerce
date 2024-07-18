import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';

const ProtectedRoute = ({ isAdmin, element: Component, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    if (loading) {
        return <div><Loader /></div>;
    }
    if (isAdmin === true && user.role !== "admin") {
        return <Navigate to="/login" />;
    }
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;

};

export default ProtectedRoute;

