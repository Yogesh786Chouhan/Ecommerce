import React, { useEffect, useState } from 'react';
import "./dashboard.css";
import Sidebar from "./Sidebar";
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProduct } from '../../actions/productAction';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';


// Register chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);


const Dashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);
    const [outOfStock, setOutOfStock] = useState(0);

    useEffect(() => {
        dispatch(getAdminProduct());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    let totalAmount = 0;
    orders && orders.forEach((item) => {
        totalAmount += item.totalPrice
    })

    useEffect(() => {
        // Calculate out of stock count when products change
        if (products) {
            let count = 0;
            products.forEach((item) => {
                if (item.stock === 0) {
                    count++;
                }
            });
            setOutOfStock(count);
        }
    }, [products]);

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgba(197,72,49)"],
                data: [0, totalAmount], //actual data
            },
        ],
    };

    const doughnutState = {
        labels: ["Out of Stock", "In Stock"],
        datasets: [
            {
                backgroundColor: ["#00A6B4", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products ? products.length - outOfStock : 0],
            },
        ],
    };

    return (
        <div className='dashboard'>
            <Sidebar />
            <div className="dashboardContainer">
                <Typography component="h1" variant="h5">Dashboard</Typography>
                <div className="dashboardSummary">
                    <div>
                        <p>
                            Total Amount <br /> ${totalAmount} 
                        </p>
                    </div>
                    <div className="dashboardSummaryBox2">
                        <Link to="/admin/products">
                            <p>Product</p>
                            <p>{products ? products.length : 0}</p>
                        </Link>
                        <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>{orders ? orders.length : 0}</p> 
                        </Link>
                        <Link to="/admin/users">
                            <p>Users</p>
                            <p>{users ? users.length : 0}</p>
                        </Link>
                    </div>
                </div>

                <div className="lineChart">
                    <Line data={lineState} />
                </div>

                <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;



