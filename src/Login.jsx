import React from 'react'
import Headerbar  from "./components/common/Headerbar";
import Titlebar  from "./components/common/Titlebar";
import LoginComponent from './components/user/login'

const Login = () => {
  return (
    <><Headerbar /><Titlebar name="Hindustan Gold" /><LoginComponent/></>
  )
}

export default Login