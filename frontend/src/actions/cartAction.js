import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartContant";

// Add to Carts
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    const link = `http://localhost:4000/api/v1/products/${id}`
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await response.json();

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.Stock,
        quantity,
      },
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  } catch (error) {
    // Handle errors here
    console.error("Error adding item to cart:", error);
  }
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
