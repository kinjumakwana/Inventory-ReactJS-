import React, { Component } from 'react';
import exportFromJSON from 'export-from-json';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosPrivate } from '../../api/axios';
import useAuth from '../../hooks/useAuth';


const DownloadComp = () => {

  const REQUEST_URL="/Inventory/GetOrdersReport";

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [disabled, setDisabled] = useState(true);
  const {auth,setAuth} = useAuth();

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    //console.log(`Start date : ${start}`);
    //console.log(`End date : ${end}`);

    if(end !== null && start !== null && end>=start)
    {
      setDisabled(false);
    }
    else{
      setDisabled(true);
    }

  };
  
  const Table = (data) => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>OrderID</th>
            <th>SKU</th>
            <th>Desc</th>
            <th>Req Quantity</th>
            <th>App Quantity</th>
            <th>Picked by</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.orderID}</td>
              <td>{item.sku}</td>
              <td>{item.description}</td>
              <td>{item.requestedQuantity}</td>
              <td>{item.approvedQuantity}</td>
              <td>{item.pickedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const fnBeforeTableEncode = (data) => {
    // Remove the 'name' and 'age' columns from the data.
    const newData = data.map((row) => {
      return {
        ...row,
        items: Table(row.items),

      };
    });
  
    return newData;
  };

  const handleDownload = async(e)=>{
    
    try{
            //console.log(`Bearer ${auth.accessToken}`)
            const response = axiosPrivate.get(REQUEST_URL,{
              params: {
                  startdate: startDate,
                  enddate: endDate
                },
                withCredentials: true,
                headers: {
                  'content-type': 'application/json',
                  'Authorization': `Bearer ${auth?.accessToken}`
                  //'access-control-allow-origin' : '*'
                }
              })
              .then(response =>{
                //console.log(response.data);
                //console.log(`Response : ${JSON.stringify(response.data)}`);
                //setOrderRows(response.data);
                const data = response.data;
                //dispatch({ type: 'addOrders', payload: response.data  });
                //console.log(`Rows : ${JSON.stringify(rows)}`);
                const fileName = 'download';  
                const exportType = 'xls'; 
                
                exportFromJSON({ 
                  data, 
                  fileName, 
                  exportType,
                  //beforeTableEncode: rows => fnBeforeTableEncode(rows)
                  //beforeTableEncode,
                  //beforeTableEncode: rows => rows.
                });
                
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
    <>
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      inline
    />
    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" onClick={handleDownload} className="btn btn-success" disabled={disabled}>
            Download
        </button>
    </div>
    </>
  );

  
}

export default DownloadComp;