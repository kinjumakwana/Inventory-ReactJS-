import { Navigation, Location, Outlet, useLocation, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRoles}) =>{
    const {auth} = useAuth();
    //console.log(`saurabh ${JSON.stringify(auth)}`);
    const location = useLocation();

    return (    
        //might have to fetch roles from token
        //auth?.roles?.map(role => allowedRoles?.include(role))
        allowedRoles?.includes(auth?.roles)        
        ?<Outlet/>
        :auth?.user
            ?<Navigate to="/unauthorized" state={{from: location}} replace/>
            :<Navigate to="/login" state={{from: location}} replace/>
    )
}

export default RequireAuth;