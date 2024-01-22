import {useRef,useEffect,useState,useContext} from 'react';
import useAuth from '../../hooks/useAuth';
import axiosPrivate from '../../api/axios';
import { useNavigate,Link,Location, useLocation } from 'react-router-dom';

const LOGIN_URL = '/login';

const LoginComponent = () => {
    const {auth,setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const userRef = useRef();
    const errRef = useRef();

    const [user,setUser] = useState('');
    const [pwd,setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    //const [succes, setSuccess] = useState(false); // will be removed to redirect to page of choice upon successful login
    
    useEffect(()=>{userRef.current.focus()},[]);
    useEffect(()=>{
        setErrMsg('');
    },[user,pwd]);

    const handleSubmit = async(e) =>{
        //debugger;
        e.preventDefault();
        const loginData = {Email:user,Password:pwd};
        try{
            const response = await axiosPrivate.post(LOGIN_URL,loginData,{
                //withCredentials: true,
                headers: {
                  'content-type': 'application/json',
                  //'access-control-allow-origin' : '*'
                }
              });
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.role;
            const expiration = response?.data?.expiration;
            setAuth({roles,accessToken,expiration});
            setUser('');
            setPwd('');
            //setSuccess(true);
            //console.log(JSON.stringify(auth));
            if(roles.includes('Administrator'))
            {
                navigate('/approve', {replace:true})
            }
            else{
                navigate(from, {replace:true})
            }
        }
        catch(err){

            if(!err.response){
                setErrMsg('No Server Response');
            }
            else if(err.response?.status === 400){
                setErrMsg('Missing Username or Password');
            }
            else if(err.response?.status === 401){
                setErrMsg('Unauthorised access');
            }
            else{
                setErrMsg('Login Failed');
            }

            errRef.current.focus();

        }
        
    };

    
  return (
    <section>
        <div className="mb-3 row">
        <p ref={errRef} className={errMsg?'validation':"offscreen"} aria-live='assertive'>{errMsg}</p>
        </div>
        <div className="mb-3 row">
        <h1>Sign In</h1>
        </div> 
        <form onSubmit={handleSubmit}>
            <div className="mb-3 row">
                <label htmlFor='username' className="col-sm-1 col-form-label">Username: </label>
                <div className="col-sm-3">
                    <input 
                    type='text' 
                    id='username' 
                    className="form-control"
                    ref={userRef} 
                    autoComplete='off'
                    onChange={(e)=>setUser(e.target.value)}
                    value={user}
                    required
                    ></input>
                </div>
            </div>
            <div className="mb-3 row">
            <label className="col-sm-1 col-form-label" htmlFor='password'>Password: </label>
            <div className="col-sm-3">
            <input 
            type='password' 
            id='password'
            className="form-control" 
            onChange={(e)=>setPwd(e.target.value)}
            value={pwd}
            required
            ></input>
            </div>
            </div>

            <div className="mb-3 row">

			  <div className="col-sm-4">
				  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
					  <button className="btn btn-primary" type="submit">Sign In</button>
				  </div>
			  </div>
		  </div>
        </form>
    </section>
  )
}

export default LoginComponent