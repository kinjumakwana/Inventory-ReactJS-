export const removeOrderItemAction = (index) => {
    //console.log("remove item action fired");
   return { type: "removeorderitem",
    payload: index
    }
  };