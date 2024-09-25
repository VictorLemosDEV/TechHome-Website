import React from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

import HomeIcon from '@mui/icons-material/Home';
import SensorsIcon from '@mui/icons-material/Sensors';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import { Settings } from '@mui/icons-material';


let NavLinks = document.getElementsByClassName("nav-link")




function DetectClickOrTouch(event) {

  console.log(event)
  console.log(event.target.closest(".nav-item"))

  

  let currentActiveItem = document.getElementsByClassName("active")[0]
  currentActiveItem.classList.remove("active")
  
  let parent = event.target.closest(".nav-item")
  
  parent.classList.add("active")

}

export default function Navbar(props) {
  return (
    <nav className="navbar">
    <ul className="navbar-nav">
      <li className={"nav-item " + (props.elementActive == "home" ? "active" : "")}>
        <Link to={"/home"} className='nav-link' onClick={DetectClickOrTouch}>
        
          <HomeIcon className='primary'/>
          <span className="link-text">Início</span>
        </Link>
      </li>
      <li className={"nav-item " + (props.elementActive == "sensors" ? "active" : "")}>
      <Link to={"/sensors"} className='nav-link' onClick={DetectClickOrTouch}>
          <SensorsIcon className='primary'/>
          <span className="link-text">Sensores</span>
        </Link>
      </li>

      

      <li className={"nav-item " + (props.elementActive == "actions" ? "active" : "")}>
      <Link to={"/actions"} className='nav-link' onClick={DetectClickOrTouch}>
          <AutoFixNormalIcon className='primary'/>
          <span className="link-text">Macros</span>
        </Link>
      </li>

      <li className={"nav-item " + (props.elementActive == "configuration" ? "active" : "")}>
      <Link to={"/configuration"} className='nav-link' onClick={DetectClickOrTouch}>
          <Settings className='primary'/>
          <span className="link-text">Configurações</span>
        </Link>
      </li>

    </ul>
  </nav>
  )
}
