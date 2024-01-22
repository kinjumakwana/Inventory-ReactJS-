import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Inventoryitemgrid from './Inventoryitemgrid';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useSelector, useDispatch } from 'react-redux';
import store from '../../store';
import { axiosPrivate } from '../../api/axios';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate,Link,Location, useLocation } from 'react-router-dom';


function Row(props) {
  const dispatch = useDispatch();
  const { row } = props;
  //console.log(row.items);
  const [open, setOpen] = React.useState(false);
  // const isItemSelected = isSelected(row.id);
  // const labelId = `enhanced-table-checkbox-${index}`;

  const handleOrderSelectionChange = (event) => {
    if(event.target.checked)
    {
      //console.log('checked');
      //console.log(event.target.value);
      dispatch({ type: 'addapprovedorder', payload: event.target.value  });
    }
    else{
      dispatch({ type: 'undoapprovedorder', payload: event.target.value  });
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={handleOrderSelectionChange}
            value={row.orderID}
            // checked={isItemSelected}
            // inputProps={{
            //   'aria-labelledby': labelId,
            // }}
          />
        </TableCell>
        <TableCell align="left" component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {row.orderID}
        </TableCell>
        <TableCell align="center">{row.requestedDate}</TableCell>
        <TableCell align="center">{row.department}</TableCell>
        <TableCell align="center">{row.requestor}</TableCell>
        <TableCell align="center">{row.orderStatus}</TableCell>
        {/* <TableCell align="right">{row.issuedby}</TableCell>
        <TableCell align="right">{row.recievedby}</TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Inventoryitemgrid items={row.items}/>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    requestedDate: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    requestor: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    orderStatus: PropTypes.string.isRequired,
    // issuedby: PropTypes.string.isRequired,
    // recievedby: PropTypes.string.isRequired,
  }).isRequired,
};


//copied from sorting and selecting
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort(array, comparator) {
    //console.log('In Stable sort');
    const stabilizedThis = Array.from(array).map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    //console.log('Out Stable sort');
    return stabilizedThis.map((el) => el[0]);
  }
  
  const headCells = [
    {
      id: 'id',
      numeric: true,
      disablePadding: true,
      label: 'ID',
    },
    {
      id: 'orderID',
      numeric: true,
      disablePadding: true,
      label: 'Order#',
    },
    {
      id: 'requestedDate',
      numeric: false,
      disablePadding: false,
      label: 'Date',
    },
    {
      id: 'department',
      numeric: false,
      disablePadding: false,
      label: 'Department',
    },
    {
      id: 'requestor',
      numeric: false,
      disablePadding: false,
      label: 'Requestor',
    },
    {
      id: 'orderStatus',
      numeric: false,
      disablePadding: false,
      label: 'Status',
    },
    // {
    //     id: 'issuedby',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Issued by',
    //   },
    //   {
    //     id: 'recievedby',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Recieved by',
    //   },
  ];
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow className='info'>
        <TableCell />
        <TableCell />
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align='center'
              //align={headCell.numeric ? 'right' : 'center'}
              //text-align='center'
              padding={headCell.disablePadding ? 'none' : 'normal'}
              //padding='none'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'desc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Orders
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>            
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

//end copying from sorting and selecting

export default function CollapsibleTable() {

  //console.log('in collapsible table');
  const REQUEST_URL="/Inventory/GetOrdersForApproval";
	const {auth,setAuth} = useAuth();
  const navigate = useNavigate();
  //let rows = [];

  // need to fetch data from api
  //const [rows,setOrderRows] = React.useState([]);

  // useEffect(() => {

		
		
	//   }, []);


  //setting data in redux store
  const dispatch = useDispatch();
   
  
  let rows = useSelector(() => store.getState().orderitem.ApprovalOrders);
  const approvedOrders = useSelector(() => store.getState().order.approvedorders);
  // console.log(`Rows key length : ${Object.keys(rows).length}`);
  if(Object.keys(rows).length === 0)
  {
    //console.log('start of get');
    try{
          //console.log(`Bearer ${auth.accessToken}`)
          const response = axiosPrivate.get(REQUEST_URL,{
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
              rows = response.data;
              dispatch({ type: 'addOrders', payload: response.data  });
              //console.log(`Rows : ${[...rows]}`);
              
            })
            .catch(error =>{
              console.log(error);
            });
        
      }
      catch(err){

          console.log(err.response);

      }

  }
 

  

  //console.log([...rows]);

    //start copy from sorting and selecting

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [filterSwitch, setFilterSwitch] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    //console.log('setOrder');
    setOrder(isAsc ? 'desc' : 'asc');
    //console.log('setOrderby');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      //console.log('setSelected')
      setSelected(newSelected);
      return;
    }
    //console.log('setSelected empty')
    setSelected([]);
  };

  const handleFilter = (event) => {
    //console.log(`In handleFilter : ${event.target.value}`);
    //rows = rows.filter(row => row.department.includes(event.target.value));
    setFilterSwitch(event.target.value);
    //console.log(`rows count : ${rows.length}`)              
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    //console.log('setSelected handleclick')
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    //console.log('setpage');
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log('setRowsPerPage');
    setRowsPerPage(parseInt(event.target.value, 10));
    //console.log('setpage 1');
    setPage(0);
  };

  const handleChangeDense = (event) => {
    //console.log('setdense');
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>{
        //stableSort(rows, getComparator(order, orderBy))
        //console.log('inside memo');
        return rows.filter(row => row.department.toLowerCase().includes(filterSwitch.toLowerCase())).slice().sort(getComparator(order, orderBy))
        .slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
    },
    [rows,filterSwitch,order, orderBy, page, rowsPerPage],
  );

    //end copy from sorting and selecting

    const handleSubmit = async(e)=>{
      //console.log(`handleSubmit rows : ${JSON.stringify(rows)}`);
      //console.log(`handleSubmit approvedOrders : ${JSON.stringify(approvedOrders)}`);
      const REQUEST_URL_APPROVAL="/Inventory/ApproveOrders";
      
      let approvedOrdersForSubmission = [];

      approvedOrders.forEach((approvedOrder) => {
        approvedOrdersForSubmission.push(rows.find((row) => row.orderID == approvedOrder));
        rows = rows.filter(row => row.orderID != approvedOrder);
        //console.log('rows updated');

      });

      //console.log(`handleSubmit approvedOrdersForSubmission : ${JSON.stringify(approvedOrdersForSubmission)}`);
      
        try{
            //console.log(`Bearer ${auth.accessToken}`)
            const response = await axiosPrivate.post(REQUEST_URL_APPROVAL,approvedOrdersForSubmission,{
                withCredentials: true,
                headers: {
                  'content-type': 'application/json',
                  'Authorization': `Bearer ${auth?.accessToken}`
                  //'access-control-allow-origin' : '*'
                }
              })
              .then(response =>{

                //console.log('inside response');
                //window.location.reload(false);
                dispatch({ type: 'resetorders', payload: {}});
                dispatch({ type: 'resetorderitems', payload: {}});
                navigate('/approve', {replace:true});

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
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TextField id="deptFilter" label="Department" variant="standard" onChange={handleFilter} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
        <TableBody>
          {visibleRows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" onClick={handleSubmit} className="btn btn-success">
            Approve
        </button>
    </div>
    <br/>
    <br/>
    </>

  );
}


