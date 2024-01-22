import React from 'react'
import Headerbar  from "./components/common/Headerbar";
import Titlebar  from "./components/common/Titlebar";
import Inventoryhistorygrid from './components/inventory/Inventoryhistorygrid';

function History() {
  return (
    <><Headerbar /><Titlebar name="Inventory history form" /><Inventoryhistorygrid/></>
  )
}

export default History