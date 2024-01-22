import React from 'react';
import Autocomplete from '../common/AutoComplete';
import { useSelector, useDispatch } from 'react-redux';
import { axiosPrivate } from '../../api/axios';
import { useRef,useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import store from '../../store';


function Inventoryreqeust() {

	const autocompleteElement = useRef('');
	//React.createRef();
	const REQUEST_URL="/Inventory/GetSpareParts";
	const {auth,setAuth} = useAuth();
	const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');

	const inventoryRequestState = useSelector((state)=> state.value);
	
	const dispatch = useDispatch();

	const arrSuggestionsRedux = useSelector(() => store.getState().orderitem.SpareItems);

	//let arrSuggestions = [];
	const [arrSuggestions, setSuggestions] = useState([]);

	//useEffect(()=>{userRef.current.focus()},[]);
    
	useEffect(() => {

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
                setSuggestions(response.data);
				dispatch({ type: 'addSpareItems', payload: {
					...state,
					'spareitems': response.data
				  }})

              })
              .catch(error =>{
                console.log(error);
              });
          
        }
        catch(err){

            console.log(err.response);

        }
		
	  }, []);

	
	  

	const [state, setState] = React.useState({
		//id: 0,
		sku: "",
		uom: "",
		name:"",
		purpose:"",
		aou:"",
		quantity:"",
		pickedBy:"",
	  });

	  useEffect(()=>{
        setErrMsg('');
    },[state.quantity,state.purpose,state.aou,state.pickedBy,state.name]);

	  function handleChange(evt) {

		console.log(autocompleteElement.current?.value);
		
		let value = evt.target.value;
		// if(evt.target.name.toLowerCase == 'quantity')
		// {
		// 	val=event.target.value.replace(/\D/g, '');
		// }
		setState({
		  ...state,
		  [evt.target.name]: value
		});
	  };

	function clear()
	{

		setState({
			sku: "",
			uom:"",
			name:"",
			purpose:"",
			aou:"",
			quantity:"",
			pickedBy:"",
		  });
		  autocompleteElement.current.resetState();	
	};

	function updateUOM(uom)
	{
		//console.log(`UOM Value : ${uom}`)
		setState({
			...state,
			'uom': uom,			
		  });
	}

	const onClearClick = (event) =>{
		clear();
		
	};

	function search(nameKey, myArray){
		for (let i=0; i < myArray.length; i++) {
			if (myArray[i].name === nameKey) {
				return myArray[i];
			}
		}
	}

	const onAddClick = (event) => {
		//setValue(event.target.value);
		//console.log("click event firing");		
		//console.log(JSON.stringify(arrSuggestionsRedux.spareitems));		
		const suggestVal = document.getElementById('txtSuggest').value;

		if(!suggestVal || !state.quantity || !state.aou || !state.purpose || !state.pickedBy)
		{
			setErrMsg('Please input mandatory fields');
			return false;
		}

		if(state.quantity < 1)
		{
			setErrMsg('Quantity cannot be less than 1');
			return false;
		}


		//String(document.getElementById('txtSuggest').value).replace(/&/g, '\&').replace(/</g, '\<').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); 
		//.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); 
		//console.log(`suggestVal : ${document.getElementById('txtSuggest').value}`);
		//console.log(`SpareItems : ${JSON.stringify(arrSuggestionsRedux.spareitems)}`);
		//console.log(`suggestVal : ${suggestVal}`);
		const suggestSKU = arrSuggestionsRedux.spareitems.find(x=>x.name.replace(/\s/g,'') == suggestVal.replace(/\s/g,'')).sku;
		//const suggestUOM = arrSuggestionsRedux.spareitems.find(x=>x.name.replace(/\s/g,'') == suggestVal.replace(/\s/g,'')).uom;
		//search(suggestVal, arrSuggestionsRedux.spareitems);
		//arrSuggestionsRedux.spareitems.find(x=>x.name == suggestVal).sku
		//console.log(`suggestSKU : ${suggestSKU}`);
		setState({
			...state,
			'sku': suggestSKU,
			//'uom': suggestUOM,
			'name': String(suggestVal).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
		  });

		 //console.log(state);

		dispatch({ type: 'addorderitem', payload: {
			...state,
			'sku': suggestSKU,
			//'uom': suggestUOM,
			'name': String(suggestVal).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
		  }})

		//console.log(store.getState().orderitem.neworderitems);
		clear();
		
		//console.log("click event fired");
	  };


  return (
    <><form>
		<div className="mb-3 row">
        <p ref={errRef} className={errMsg?'validation':"offscreen"} aria-live='assertive'>{errMsg}</p>
        </div>
		  <div className="mb-3 row">
			  <label className="col-sm-1 col-form-label">Item *</label>
			  <div className="col-sm-3">
				  {/* <input type="text" className="form-control" id="inputItem" />
				  <div className="position-absolute invisible" id="inputItem_complete"></div> */}
				   <Autocomplete
						suggestions={arrSuggestions} ref={autocompleteElement} change={updateUOM}
					/>
			  </div>
		  </div>
		  <div className="mb-3 row">
			  <label htmlFor="inputUOM" className="col-sm-1 col-form-label">UOM *</label>
			  <div className="col-sm-3">
				  <input type="text" name="uom" className="form-control" value={state.uom} id="inputUOM" readOnly/>
			  </div>
		  </div>
		  <div className="mb-3 row">
			  <label htmlFor="inputQuantity" className="col-sm-1 col-form-label">Quantity *</label>
			  <div className="col-sm-3">
				  <input type="number" name="quantity" className="form-control" onChange={handleChange} placeholder='Enter Quantity' value={state.quantity} id="inputQuantity" />
			  </div>
		  </div>
		  <div className="mb-3 row">
			  <label htmlFor="inputPurpose" className="col-sm-1 col-form-label">Purpose *</label>
			  <div className="col-sm-3">
				  <input type="text" name="purpose" className="form-control" onChange={handleChange} value={state.purpose} id="inputPurpose" />
			  </div>
		  </div>
		  <div className="mb-3 row">
			  <label htmlFor="inputUse" className="col-sm-1 col-form-label">Area of Use *</label>
			  <div className="col-sm-3">
				  <input type="text" name="aou" className="form-control" onChange={handleChange} value={state.aou} id="inputUse" />
			  </div>
		  </div>
		  <div className="mb-3 row">
			  <label htmlFor="inputReciever" className="col-sm-1 col-form-label">Recieving Person *</label>
			  <div className="col-sm-3">
				  <input type="text" name="pickedBy" className="form-control" onChange={handleChange} value={state.pickedBy} id="inputReciever" />
			  </div>
		  </div>
		  <div className="mb-3 row">

			  <div className="col-sm-4">
				  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
					  <button className="btn btn-warning me-md-2" onClick={onClearClick} type="button">Clear</button>
					  <button className="btn btn-primary" type="button" onClick={onAddClick}>Add</button>
				  </div>
			  </div>
		  </div>

	  </form>
	  
	  </>
  )
}

export default Inventoryreqeust