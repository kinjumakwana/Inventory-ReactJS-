import { combineReducers } from "redux";
 
import orderitem from "./orderItemsreducers";
import order from "./orderreducers";
 
export default combineReducers({
    orderitem,
    order
});