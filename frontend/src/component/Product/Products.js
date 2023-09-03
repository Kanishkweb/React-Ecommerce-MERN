import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import LoadingBar from "../layout/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
]


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
    resultperPage,
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
    dispatch(getProduct(keyword, currentPage, price));
  }, [dispatch, keyword, currentPage, price]);

  let count = filteredProductsCount;

  return (
    <Fragment>
      {loading ? (
        <LoadingBar />
      ) : (
        <Fragment>
          <h1>Products</h1>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

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
          </div>

          <Typography>Categories</Typography>
                <ul className="categoryBox">
                  {category.map((category) => (
                    <li
                    className="category-link"
                    key={category}
                    onClick={() => setCategory}(category)
                    
                    ></li>
                  ))}
                </ul>

          {resultperPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultperPage}
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
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
