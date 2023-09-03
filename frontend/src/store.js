import { configureStore } from '@reduxjs/toolkit'
import { productDetailReducer, productReducer } from './reducers/productReducer'
export default configureStore({
  reducer: {
    products:productReducer,
    productDetails:productDetailReducer
  },
})