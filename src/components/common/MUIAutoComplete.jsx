import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '../../api/axios';




export default function FreeSolo() {

    const REQUEST_URL="/Inventory/GetSpareParts";
    const {auth,setAuth} = useAuth();
    //let arrSuggestions = [];
    const [arrSuggestions, setSuggestions] = useState([]);

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

            })
            .catch(error =>{
                console.log(error);
            });
        
        }
        catch(err){

            console.log(err.response);

        }
        
    }, []);


    return (
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={arrSuggestions.map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="freeSolo" />}
          />
          {/* <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={arrSuggestions.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          /> */}
        </Stack>
      );
}


