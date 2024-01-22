import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useEffect } from "react";

const useAxiosPrivate = ()=>{
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(()=>{

        console.log(`In Axios private useeffect`);

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.newAccessToken}`;
                }
                return config;
            },  (error) => Promise.reject(error)

        );

        const responseIntercept401 = axiosPrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Use router.push() to navigate to the login screen
                    router.push('/login'); // Adjust the route as needed
                    // Throw an exception to stop further execution
                    console.log('Unauthorized');
                    return Promise.reject('Unauthorized');
                }
                // Handle other errors here
                return Promise.reject(error);
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async(error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return ()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept401);
        }

    },[auth,refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;