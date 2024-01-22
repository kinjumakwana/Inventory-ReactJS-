import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';

function Headerbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {auth,setAuth} = useAuth();
  const requestorRoles = ['Common','Administrator'];
  const approverRoles = ['Administrator'];
  //console.log(location.pathname);
  //console.log(`auth value : ${JSON.stringify(auth)}`);
  
  const homeClass = location.pathname === "/" ? "nav-link px-2 text-white" : "nav-link px-2 text-secondary";
  const approveClass = location.pathname.match(/^\/approve/) ? "nav-link px-2 text-white" : "nav-link px-2 text-secondary";
  const historyClass = location.pathname.match(/^\/history/) ? "nav-link px-2 text-white" : "nav-link px-2 text-secondary";
  const reportClass = location.pathname.match(/^\/report/) ? "nav-link px-2 text-white" : "nav-link px-2 text-secondary";

  const handleLogout = async(e) =>{
    setAuth({});
    dispatch({ type: 'resetorders', payload: {}})
    dispatch({ type: 'resetorderitems', payload: {}})
    navigate('/login');
  }

  return ( 

     <header className="p-3 bg-dark text-white">
    <div className="container" style={{marginLeft:'0px', marginRight:'0px', maxWidth:'1720px'}}>
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"> 
        <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <img src="images/logo_hindustan.png" alt="Hindustan Gold" width="70" height="70" />
        </a>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ">
          <li style={{display :  requestorRoles.includes(auth?.roles)? 'block' : 'none'}}><Link to="/" className={homeClass}>Request</Link></li>
          <li style={{display :  approverRoles.includes(auth?.roles)? 'block' : 'none'}}><Link to="/approve" className={approveClass}>Approval</Link></li>
          <li style={{display :  requestorRoles.includes(auth?.roles)? 'block' : 'none'}}><Link to="/history" className={historyClass}>History</Link></li>
          <li style={{display :  approverRoles.includes(auth?.roles)? 'block' : 'none'}}><Link to="/report" className={reportClass}>Report</Link></li>
        </ul>


        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {auth.user}
          <button type="button" onClick={handleLogout} style={{display :  requestorRoles.includes(auth?.roles)? 'block' : 'none'}} className="btn btn-warning">Logout</button>
        </div>
      </div>
    </div>
  </header>
  )
}

export default Headerbar