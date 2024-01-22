import React from 'react'
import Headerbar  from "./components/common/Headerbar";
import Titlebar  from "./components/common/Titlebar";
import Inventoryreqeust from "./components/inventory/Inventoryreqeust";
import Inventoryrequestgrid from "./components/inventory/Inventoryrequestgrid";

function Home() {
  return (
    <><Headerbar /><Titlebar name="Inventory request form" /><Inventoryreqeust /><Inventoryrequestgrid /></>
  )
}

export default Home