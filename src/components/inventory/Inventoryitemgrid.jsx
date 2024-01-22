import React,{useCallback} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';

const columns = [
 { field: 'id', headerName: 'S.no', width: 50,type: 'number',},
  {
    field: 'orderID',
    headerName: 'Order#',
    width: 90,
    editable: false,
    align: 'center'
  },
  {
    field: 'sku',
    headerName: 'SKU',
    width: 100,
    editable: false,
    align: 'left'
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 350,
    editable: false,
    align: 'left',
    renderCell: ({ value }) => (
      <span style={{ overflow: "normal", textOverflow: "initial", whiteSpace: "initial" }}>
        {value}
      </span>
    )
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 350,
    editable: false,
    align: 'left',
    renderCell: ({ value }) => (
      <span style={{ overflow: "normal", textOverflow: "initial", whiteSpace: "initial" }}>
        {value}
      </span>
    )
  },
  {
    field: 'uom',
    headerName: 'UOM',
    width: 100,
    editable: false,
    align: 'left'
  },
  {
    field: 'requestedQuantity',
    headerName: 'Requested Quantity',
    type: 'number',
    width: 150,
    editable: false,
    align: 'center',
    renderCell: ({ value }) => (
      <span style={{ overflow: "normal", textOverflow: "initial", whiteSpace: "initial" }}>
        {value}
      </span>
    )
  },
  {
    field: 'approvedQuantity',
    headerName: 'Issued Quantity',
    type: 'number',
    sortable: false,
    editable: true,
    width: 150,
    align: 'center',
    renderCell: ({ value }) => (
      <span style={{ overflow: "normal", textOverflow: "initial", whiteSpace: "initial" }}>
        {value}
      </span>
    )
  },
  {
    field: 'pickedBy',
    headerName: 'Recieved By',
    sortable: false,
    editable: true,
    width: 200,
    align: 'left'
  },
//   {
//     field: 'issuedquantity',
//     headerName: 'Issued Quantity',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
];

// const rows = [
//   { id: 1, sku: '374313434', description: 'description of item 1', requiredquantity: 35,issuedquantity:35 },
//   { id: 2, sku: '71964136467', description: 'description of item 2', requiredquantity: 6,issuedquantity:6 },
//   { id: 3, sku: '790646410', description: 'description of item 3', requiredquantity: 7,issuedquantity:7 },
//   { id: 4, sku: '79406106514', description: 'description of item 4', requiredquantity: 4,issuedquantity:4 },
//   { id: 5, sku: '4967031031', description: 'description of item 5', requiredquantity: 12,issuedquantity:12 },
//   { id: 6, sku: '7031640345', description: 'description of item 6', requiredquantity: 44,issuedquantity:44 },
//   { id: 7, sku: '711061255420', description: 'description of item 7', requiredquantity: 74,issuedquantity:74 },
//   { id: 8, sku: '6733041674', description: 'description of item 8', requiredquantity: 85,issuedquantity:85 },
//   { id: 9, sku: '79701636730', description: 'description of item 9', requiredquantity: 8,issuedquantity:8 },
// ];

function OrderItemData(id,orderID,sku,name,description,requestedQuantity,approvedQuantity,pickedBy,uom) {
    this.id=id;
    this.orderID=orderID;
    this.sku=sku;
    this.uom=uom;
    this.name=name;
    this.description=description;
    this.requestedQuantity=requestedQuantity;
    this.approvedQuantity=approvedQuantity;
    this.pickedBy=pickedBy;
}


export default function Inventoryitemgrid(props) {
    const arrprops = {props};
    let arrorderitems=[];
    //console.log(arrprops.props.items[0].sku);
    const dispatch = useDispatch();

   for(var i=0; i<arrprops.props.items.length; i++){ 
    //console.log(arrprops.props.items[i]);   
        
    arrorderitems.push(new OrderItemData(arrprops.props.items[i].id,arrprops.props.items[i].orderID, arrprops.props.items[i].sku, arrprops.props.items[i].name, arrprops.props.items[i].description, arrprops.props.items[i].requestedQuantity, arrprops.props.items[i].approvedQuantity, arrprops.props.items[i].pickedBy, arrprops.props.items[i].uom));
   }
   //console.log(arrorderitems);


  const updaterowonredux = (updatedRow) =>
  {
    //console.log('updated row');
    //console.log({...updatedRow});
    dispatch({ type: 'editorderitem', payload: {
			'orderID' : updatedRow.orderID,
			'sku': updatedRow.sku,
			'quantity': updatedRow.approvedQuantity,
      'pickedBy':updatedRow.pickedBy
		  }})

  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {

    //console.log(`handleProcessRowUpdate : ${JSON.stringify(updatedRow)}`);
    // Find the index of the row that was edited
    // const rowIndex = arrorderitems.findIndex((row) => row.orderid === updatedRow.orderid);
  
    // // Replace the old row with the updated row
    // const updatedRows = [...arrorderitems];
    // updatedRows[rowIndex] = updatedRow;    
  
    // Update the state with the new rows
    //setRows(updatedRows);
    updaterowonredux(updatedRow);
  
    // Return the updated row to update the internal state of the DataGrid
    return updatedRow;
  };
  

  const processRowUpdateError = (error) => {
   // console.log(`processRowUpdateError : ${error}`);
  };

  
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid 
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={(error)=>
          processRowUpdateError(error)
        }
        rows={arrorderitems}
        columns={columns}
        columnVisibilityModel={{ orderID: false }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
       // checkboxSelection
       disableRowSelectionOnClick
      />
    </Box>
  );


}