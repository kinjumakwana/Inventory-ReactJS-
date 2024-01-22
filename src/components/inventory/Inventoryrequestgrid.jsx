import React from 'react'
import store from '../../store';
import {useSelector,useDispatch} from 'react-redux';
import { axiosPrivate } from '../../api/axios';
import useAuth from '../../hooks/useAuth';


function Inventoryrequestgrid() {

    const {auth,setAuth} = useAuth();
    const dispatch = useDispatch();
    
    const REQUEST_URL="/Inventory/AddInventoryItems";

    function deleteOrderItem(event, index){
        //console.log('delete order item');
        event.preventDefault();
        dispatch({ type: 'removeorderitem', payload: index })
        //console.log('delete order item done');

    }

    const orderItems = useSelector(() => store.getState().orderitem.neworderitems)

    const handleSubmit = async(e)=>{
        try{
            //console.log(`Bearer ${auth.accessToken}`)
            //console.log(orderItems);
            const response = await axiosPrivate.post(REQUEST_URL,orderItems,{
                withCredentials: true,
                headers: {
                  'content-type': 'application/json',
                  'Authorization': `Bearer ${auth?.accessToken}`
                  //'access-control-allow-origin' : '*'
                }
              })
              .then(response =>{

                dispatch({ type: 'removeallorderitem'})

              })
              .catch(error =>{
                console.log(error);
              });
          
        }
        catch(err){

            console.log(err.response);

        }

    };

  return (
    <><table className="table table-sm table-hover table-striped">
          <thead>
              <tr>
                  <th>
                      #
                  </th>
                  <th>
                      SKU#
                  </th>
                  <th>
                      UOM
                  </th>
                  <th>
                      Item
                  </th>
                  <th>
                      Quantity
                  </th>
                  <th>
                      Purpose
                  </th>
                  <th>
                      Picked by
                  </th>
                  <th>
                      Action
                  </th>
              </tr>
          </thead>
          <tbody>
          

          {orderItems.map((orderItem) => (

                <tr key={orderItem.sku}>
                <td>
                    {orderItems.indexOf(orderItem)+1}
                </td>
                <td>
                    {orderItem.sku}
                </td>
                <td>
                    {orderItem.uom}
                </td>
                <td>
                    {orderItem.name}
                </td>
                <td>
                    {orderItem.quantity}
                </td>
                <td>
                    {orderItem.purpose}
                </td>
                <td>
                    {orderItem.pickedBy}
                </td>
                <td>
                    <a href="#" onClick={event=>deleteOrderItem(event, orderItems.indexOf(orderItem))}><img src="images/delete.svg" alt="Remove Item" width="20" height="20" /></a>
                </td>
                </tr>            
            
            ))}

              
          </tbody>
      </table><div className="d-grid gap-2 d-md-flex justify-content-md-end">
              {/* <button type="button" className="btn btn-danger">
                  Cancel
              </button> */}
              <button type="button" onClick={handleSubmit} className="btn btn-success">
                  Submit
              </button>
          </div></>
  )
}

export default Inventoryrequestgrid