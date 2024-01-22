import React from 'react'
import Headerbar  from "./components/common/Headerbar";
import Titlebar  from "./components/common/Titlebar";
import Inventoryapprovalgrid from './components/inventory/Inventoryapprovalgrid';

function Approve() {
  return (
    <><Headerbar /><Titlebar name="Inventory request approval form" /><Inventoryapprovalgrid/></>
  )
}

export default Approve