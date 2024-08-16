import React, { useEffect, useState } from 'react';
import './App.css';
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import webFont from "webfontloader";
import Home from "./component/Home/Home";
import ProductDetails from './component/Product/ProductDetails';
import about from './component/about.js'
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from './component/Admin/Dashboard.js';
import ProductList from './component/Admin/ProductList.js';
import newProduct from './component/Admin/newProduct.js';
import UpdateProduct from './component/Admin/UpdateProduct.js';
import OrderList from './component/Admin/OrderList.js';
import ProcessOrder from './component/Admin/ProcessOrder.js';
import UserList from './component/Admin/UserList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import Cart from './component/Cart/Cart.js';
import About from './component/layout/About/About.js';
import Contact from './component/layout/Contact/Contact.js';
import NotFound from './component/layout/NotFound/NotFound.js';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
      setStripePromise(loadStripe(data.stripeApiKey));
    } catch (error) {
      console.error('Error fetching Stripe API key:', error);
    }
  }

  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();

  }, []);


  // useEffect(() => {
  //   const disableShortcuts = (e) => {
  //     if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
  //       e.preventDefault();
  //     }
  //   };

  //   window.addEventListener("keydown", disableShortcuts);

  //   return () => {
  //     window.removeEventListener("keydown", disableShortcuts);
  //   };
  // }, []);


  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path = 'about1' element={<about/>}/>
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/shipping' element={<ProtectedRoute element={Shipping} />} />
        <Route path='/success' element={<ProtectedRoute element={OrderSuccess} />} />
        <Route path='/orders' element={<ProtectedRoute element={MyOrders} />} />
        <Route path='/order/confirm' element={<ProtectedRoute element={ConfirmOrder} />} />
        <Route path='/order/:id' element={<ProtectedRoute element={OrderDetails} />} />
        <Route path='/process/payment' element={
          stripePromise ? (
            <Elements stripe={stripePromise}>
              <ProtectedRoute element={Payment} />
            </Elements>
          ) : null
        } />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />
        <Route path='/search' element={<Search />} />
        <Route path='/login' element={<LoginSignUp />} />
        <Route path='/account' element={<ProtectedRoute element={Profile} />} />
        <Route path='/me/update' element={<ProtectedRoute element={UpdateProfile} />} />
        <Route path='/password/update' element={<ProtectedRoute element={UpdatePassword} />} />
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path='/password/reset/:token' element={<ResetPassword />} />
        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true} element={Dashboard} />} />
        <Route path='/admin/products' element={<ProtectedRoute isAdmin={true} element={ProductList} />} />
        <Route path='/admin/product' element={<ProtectedRoute isAdmin={true} element={newProduct} />} />
        <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true} element={UpdateProduct} />} />
        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true} element={OrderList} />} />
        <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true} element={ProcessOrder} />} />
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true} element={UserList} />} />
        <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true} element={UpdateUser} />} />
        <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true} element={ProductReviews} />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/process/payment' element={<Navigate to='/' NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

