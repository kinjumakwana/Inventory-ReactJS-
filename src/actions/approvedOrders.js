export const approvedOrderAction = (objOrder) => {
    //console.log("add item action fired");
   return { type: "addapprovedorder",
    payload: objOrder
    }
  };