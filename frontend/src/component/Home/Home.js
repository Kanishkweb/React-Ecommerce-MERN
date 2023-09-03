import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import LoadingBar from "../layout/loader/loader";
import { useAlert } from "react-alert";

// Sample API Result------------------

// const product = {
//   name: "Kanishk",
//   images: [{ url: "https://m.timesofindia.com/photo/93075477/93075477.jpg" }],
//   price: "3000rs",
//   _id: "kanishk",
// };

const Home = () => {
  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
       alert.error(error);
       dispatch(clearErrors)
    }
    dispatch(getProduct());
  }, [ dispatch, error,alert]);
  return (
    <>
      <Fragment>
        {loading ? (
          <LoadingBar />
        ) : (
          <Fragment>
            <MetaData title="ECCOMERCE" />
            <div className="banner">
              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>

              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
            </div>

            <h2 className="homeHeading">Featured Product</h2>

            <div className="container" id="container">
              {products &&
                products.map((product) => <Product product={product} />)}
            </div>
          </Fragment>
        )}
      </Fragment>
    </>
  );
};

export default Home;
