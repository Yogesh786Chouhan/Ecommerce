import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

const initialState = {
  cartItems: [],
  shippingInfo: {},
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      // Ensure cartItems is an array before using find
      const isItemExist = Array.isArray(state.cartItems)
        ? state.cartItems.find((i) => i.product === item.product)
        : null;

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: Array.isArray(state.cartItems)
            ? [...state.cartItems, item]
            : [item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: Array.isArray(state.cartItems)
          ? state.cartItems.filter((i) => i.product !== action.payload)
          : [],
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
