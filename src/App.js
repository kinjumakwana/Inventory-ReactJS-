import Home from "./Home";
import Approve from './Approve';
import Login from "./Login";
import History from "./History";
import Notfound from "./Notfound";
import Download from "./Download";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import RequireAuth from "./components/common/RequireAuth";
import AuthVerify from "./components/common/AuthVerify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import useAuth from "./hooks/useAuth";

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {auth,setAuth} = useAuth();


  const handleLogout = async(e) =>{
    setAuth({});
    dispatch({ type: 'resetorders', payload: {}})
    dispatch({ type: 'resetorderitems', payload: {}})
    navigate('/login');
  }

  //console.log(process.env.REACT_APP_API_KEY);
  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-md-12">
        <Routes>          

          <Route path="/" element={<Layout/>}>
            <Route path="login" element={<Login/>} exact />
            <Route element={<RequireAuth allowedRoles={['Common','Administrator']}/>}>
                  
                  <Route path="home" element={<Home/>} />
                  <Route path="history" element={<History/>} />
                  <Route index element={<Home/>} />
                  
            </Route>
            <Route element={<RequireAuth allowedRoles={['Administrator']}/>}>                  
                  
                  <Route path="approve" element={<Approve/>} />
                  <Route path="report" element={<Download/>} />

            </Route>
                <Route path="unauthorized" element={<unauthorized/>} />
                <Route path="*" element={<Notfound/>}/>

          </Route>

                
        </Routes>

        <AuthVerify logOut={handleLogout}/>
        
      </div>
      </div>
    </div>
  );
}

export default App;
