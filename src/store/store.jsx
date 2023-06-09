import { createContext, useReducer } from "react";

const initialState = {
  start: false
}

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "NEW_NOTIFICATION":
        return { ...state, start: true }
      case EventTypes.NEW_NOTIFICATION:
        const newNotificationList = [...state.notificationList, action.payload];
        return {
          ...state,
          notificationList: newNotificationList
        };
      case EventTypes.REMOVE_NOTIFICATION:
        const newArray = state.notificationList;
        newArray.shift();
        return {
          ...state,
          notificationList: newArray
        };
      case EventTypes.FORCE_REMOVE_NOTIFICATION:
        return {
          ...state,
          notificationList: action.payload
        };
      default:
        return state
    }

  }, initialState);

  return <Provider
    value={{ state, dispatch }}
  >
    {children}
  </Provider>
}

export {
  StateProvider,
  store
}