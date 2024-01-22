import React from 'react'
import Headerbar  from "./components/common/Headerbar";
import Titlebar  from "./components/common/Titlebar";
import DownloadComp from "./components/common/DownloadComp"

function Download() {
  return (
    <><Headerbar /><Titlebar name="Inventory report download" /><DownloadComp/></>
  )
}

export default Download