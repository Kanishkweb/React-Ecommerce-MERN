import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./component/layout/Header/Header";
import React, { useState } from "react";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home.js";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import loader from "./component/layout/loader/loader";
import ProductDetails from "./component/Product/ProductDetails.js";
import Product from "./component/Home/ProductCard.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/user/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/userOptions";
import { useSelector } from "react-redux";
import Profile from "./component/user/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/user/UpdateProfile";
import UpdatePassword from "./component/user/UpdatePassword";
import ForgotPassword from "./component/user/ForgotPassword";
import ResetPassword from "./component/user/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js"

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  const stripePromise = loadStripe("pk_test_51NusAASDv4LgKKu5840GetUnOvoiH44n1nUzvn9v4UunjdXKp2lzymJQy0pnNs3SMfG9mRcVdD6fvQ2nlZVu00yZ00ITGturEb")
  async function getStripeApiKey() {
    const { data } = await axios.post("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  // Alternative way to using useEffect
  React.useEffect(() => {
    WebFont.load({
      goolge: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);
  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/search" component={Search} />
        <Route path="/products/:keyword" component={Products} />

        <Route exact path="/login" component={LoginSignUp} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
        />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        {stripeApiKey && (
          <Elements stripe={stripePromise}>
            <ProtectedRoute exact path="/process/payment" component={Payment} />
          </Elements>
        )}

        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        <ProtectedRoute exact path="/orders" component={MyOrders} />

        <Footer />
      </Router>
    </>
  );
}

export default App;
