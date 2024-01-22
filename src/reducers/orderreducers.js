const INITIAL_STATE = {
    approvedorders: []
 };
 
  const orderReducer = (state = INITIAL_STATE, action) => {
     switch (action.type) {
      case "resetorders":
         return {
          ...INITIAL_STATE
           };
       case "addapprovedorder":
         return {
             ...state,
             approvedorders: state.approvedorders.concat(action.payload),
           };
       case "undoapprovedorder":
        const index = state.approvedorders.indexOf(action.payload);
        const arrApprovedorders = state.approvedorders;
        arrApprovedorders.splice(index,1);         
         return {
           ...state,
           approvedorders: arrApprovedorders
           };
       default:
         return state;
     }
   };
 
   export default orderReducer;