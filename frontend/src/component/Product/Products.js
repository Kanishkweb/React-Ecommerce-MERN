import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import LoadingBar from "../layout/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { getProduct,clearErrors } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = ({ match }) => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");

  const [rating, setRating] = useState(0);
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    console.log("1");
    setPrice(newPrice);
  };

  useEffect(() => {
    if(error) {
      alert.error(error);
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, price, category, rating,alert,error]);

  let count = productsCount;

  console.log(resultPerPage);
  console.log(count);

  return (
    <Fragment>
      {loading ? (
        <LoadingBar />
      ) : (
        <Fragment>

          <MetaData title="PRODUCTS -- ECOMMERCE"/>
          <div className="centered-title">
            <h1>Products</h1>
          </div>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          {keyword && (
            <>
              <div className="filterBox">
                <Typography>Price</Typography>
                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="on"
                  aria-labelledby="range-slider"
                  min={0}
                  max={2500}
                />
              </div>{" "}
              <div className="category-container">
                <Typography>Categories</Typography>
                <ul className="categoryBox">
                  {categories.map((category) => (
                    <li
                      className="category-link"
                      key={category}
                      onClick={() => setCategory(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
              <fieldset>
                <Typography component="lengend">Rating Above</Typography>
                <Slider
                  value={rating}
                  onChange={(e, newRating) => {
                    setRating(newRating);
                  }}
                  aria-labelledby="continuous slider"
                  min={0}
                  max={5}
                />
              </fieldset>
            </>
          )}
          {resultPerPage < productsCount && (
            <>
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            </>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
