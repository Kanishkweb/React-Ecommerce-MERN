import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./component/layout/Header/Header";
import React from "react";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home.js"
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import loader from "./component/layout/loader/loader";
import ProductDetails from "./component/Product/ProductDetails.js"
import Product from "./component/Home/ProductCard.js";
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
function App() {
  return (
    <>
      <Router>
        <Header />
        <Route extact path="/home" component={Home}/>
        <Route extact path="/product/:id" component={ProductDetails} />
        <Route extact path="/products" component={Products} />
        <Route extact path="/search" component={Search} />
        <Route  path="/products/:keyword" component={Products} />
        <Footer/>
      </Router>
    </>
  );
}

export default App;
