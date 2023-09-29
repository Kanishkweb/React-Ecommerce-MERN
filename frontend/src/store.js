import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {
  newReviewReducer,
  productDetailReducer,
  productReducer,
} from "./reducers/productReducer";
import {
  forgotPasswordReducer,
  profileReducer,
  userReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { myOrdersReducer, newOrderReducer } from "./reducers/orderReducer";

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
export default configureStore({
  reducer: {
    products: productReducer,
    productDetails: productDetailReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    newReview: newReviewReducer,
  },
  preloadedState: initialState,
});

const middleware = [thunk];
