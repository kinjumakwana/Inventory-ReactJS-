const INITIAL_STATE = {
   neworderitems: [],
   ApprovalOrders:[],
   SpareItems:[]
};

function updateChildRowByKey(array, orderId, sku, quantity, pickedBy) {
  //console.log('inside reducer update function orderID ='+ orderId+' sku='+ sku);
  //console.log([...array]);
  for (let i = 0; i < array.length; i++) {
    if (array[i].orderID === orderId) {
      const children = array[i].items;
      //console.log([...children]);
      for (let j = 0; j < children.length; j++) {
        //console.log([children[j][0].sku]);
        if (children[j].sku === sku) {
          children[j].approvedQuantity = quantity;
          children[j].pickedBy = pickedBy; // Update the child row
          //console.log(children[j][0].issuedquantity);
        //  return true; // Parent found, child row updated
        }
      }
     // return false; // Child not found
    }
  }
  //return false; // Parent not found
  return array;
}

 const inventoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "resetorderitems":
         return {
          ...INITIAL_STATE
           };
      case "addorderitem":
        return {
            ...state,
            neworderitems: state.neworderitems.concat(action.payload),
          };
      case "removeorderitem":
        return {
          ...state,
          neworderitems: state.neworderitems.filter((neworderitem, index) => index !== action.payload)
          };
      case "removeallorderitem":
        return {
          ...state,
          neworderitems: []
          };
      case "editorderitem":
        return {
          ...state,
          ApprovalOrders: updateChildRowByKey(state.ApprovalOrders,action.payload.orderID,action.payload.sku,action.payload.quantity,action.payload.pickedBy)
          };
      case "addOrders":
        return {
          ...state,
          ApprovalOrders: action.payload
          };
      case "removeOrders":
        return {
          ...state,
          ApprovalOrders: []
          };
      case "addSpareItems":
        return {
          ...state,
          SpareItems: action.payload
          };
      default:
        return state;
    }
  };

  export default inventoryReducer;