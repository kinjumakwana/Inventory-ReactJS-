import React from 'react'

function Titlebar(props) {
  return (
    <h3 className="text-primary mb-5 mt-3 text-uppercase">
				{props.name}
	</h3>
  )
}

export default Titlebar