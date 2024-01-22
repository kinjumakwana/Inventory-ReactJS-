import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from '../../hooks/useAuth';


function dateToTicks(date) {
    const epochOffset = 621355968000000000;
    const ticksPerMillisecond = 10000;
  
    const ticks =
      date * ticksPerMillisecond + epochOffset;
  
    return ticks;
  }

const AuthVerify = (props) => {
  let location = useLocation();
  const {auth,setAuth} = useAuth();

  useEffect(() => {

    //console.log(`Auth : ${JSON.stringify(auth)}`);
    //expiration
    //console.log(`checking session`);
    const user = auth.accessToken;

    //console.log(`User : ${user}`);

    if (user) {      
      //const decodedJwt = parseJwt(user.accessToken);
      const d = new Date();
      //console.log(`Timezone offset : ${d.getTimezoneOffset()}`); 
      const offsetValue = d.getTimezoneOffset() * 60 * 1000 * 10000;
      //console.log(`offsetValue : ${offsetValue}`);
      //console.log(`Auth Expiration : ${auth.expiration}`);
      //console.log(`Auth Expiration with offset : ${auth.expiration + offsetValue}`);
      //console.log(`now time : ${dateToTicks(Date.now())}`);
           
      //console.log(`User exist`);

      if ((auth.expiration + offsetValue) < dateToTicks(Date.now())) {
        //console.log(`overtime`);
        props.logOut();
      }
    }    
  }, [location, props]);

  return ;
};

export default AuthVerify;