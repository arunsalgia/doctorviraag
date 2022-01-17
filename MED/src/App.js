import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext"; 
//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { CricDreamTabs, setTab }from "CustomComponents/CricDreamTabs"
import axios from "axios";
import SignIn from "views/Login/SignIn"
import Welcome from "views/MED/Welcome";
//import SignUp from "views/Login/SignUp.js";
//import Doctor from "views/MED/Doctor";
//import Session from "views/Session/Session"
//import JoinGroup from "views/Group/JoinGroup.js"
import ResetPassword from "views/Login/ResetPassword";
import ForgotPassword from "views/Login/ForgotPassword.js";
import DisplayDocument from "views/DisplayDocument/DisplayDocument";
import IdleTimer from 'react-idle-timer'

import { PinDropSharp } from "@material-ui/icons";


import firebase from 'firebase';
//import arunfb from 'firebase';

//const arunfb = require('firebase/app').default
//import messaging from 'firebase/messaging';

import { 
setIdle, isUserLogged,
isMobile, cdRefresh, specialSetPos, 
encrypt, 
clearBackupData, downloadApk 
} from "views/functions.js"

const hist = createBrowserHistory();


/***
function checkJoinGroup(pathArray) {
  let sts = false;
  if ((pathArray[1].toLowerCase() === "joingroup") && (pathArray.length === 3) && (pathArray[2].length > 0)) {
    localStorage.setItem("joinGroupCode", pathArray[2]);
    sts = true;
  }
  return sts;
}
***/

function initCdParams() {
  let ipos = 0;
  if ((localStorage.getItem("tabpos") !== null) &&
  (localStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(localStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) localStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    localStorage.setItem("tabpos", 0);
  //console.log(`ipos: ${ipos}   Tabpos ${localStorage.getItem("tabpos")}`)
}



function checkSessionRequest() {
	let resetLink = false;
	let x = location.pathname.split("/");
  console.log("Path is");
  console.log(x);
	if (x.length >= 3)
	if (x[1].toLowerCase() === "medmaster")
	if (x[2].toLowerCase() === "session") {
		resetLink = true;
	}
	return resetLink;
}


function checkResetPasswordRequest() {
	let resetLink = "";
  //console.log("-",location.pathname,"-" );
	let x = location.pathname.split("/");
  //console.log(x);
	if (x.length >= 4)
	if (x[1] === "doctorviraag")
	if (x[2] === "resetpassword") {
		resetLink = x[3];
	}
  //console.log(resetLink);
	return resetLink;
}


function checkExternalConnectRequest() {
	let resetLink = {cmd: 'none', param1: '', param2: ''};
  //console.log("-",location.pathname,"-" );
	let x = location.pathname.split("/");
  //console.log(x);
	if (x.length >= 3)
	if (x[1].toLowerCase() === "doctorviraag") {
    resetLink.cmd = x[2].toLowerCase();
    resetLink.param1 = (x.length >= 4) ? x[3] : '';
    resetLink.param2 = (x.length >= 5) ? x[4] : '';
  }
	return resetLink;
}

function AppRouter() {
  //let history={hist}

  const [user, setUser] = useState(null);
	const [fireToken, setFireToken] = useState("");
	
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  
  async function handleOnActive (event) {
    // console.log('user is active', event);
  }

  async function handleOnAction (event) {
    // console.log(`Action from user ${sessionStorage.getItem("uid")}`);
  }


  async function handleOnIdle (event) {
    // console.log('user is idle', event);
    // console.log('last active', idleTimer.getLastActiveTime());
    setIdle(true);
  }



  function DispayTabs() {
    let isLogged = isUserLogged();
    if (isLogged) {
      return (
        <div>
          <CricDreamTabs/>
        </div>
      )  
    } 
		else if (sessionStorage.getItem("currentLogin") ===  "SIGNIN") {
			return <SignIn />
		} 
		else if (sessionStorage.getItem("currentLogin") ===  "FORGOT") {
			return <ForgotPassword />
		} 
/*
    else if (sessionStorage.getItem("currentLogin") ===  "SIGNUP") {
			return <SignUp />
		} 
		else if (sessionStorage.getItem("currentLogin") ===  "DOCTOR") {
			return <Doctor />
		} 
*/
		else  {
			let myLink = checkExternalConnectRequest();
      if  (myLink.cmd !== 'none') {
      hist.push("/");
        switch (myLink.cmd) {
          case 'resetpassword':
            return (<ResetPassword param1={myLink.param1} />);
          case 'prescription':
          case 'receipt':
            return (<DisplayDocument cmd={myLink.cmd} param1={myLink.param1} />);
        }
				//sessionStorage.setItem("currentUserCode", myLink);
				//console.log(history, hist);
				
      } else {
				//console.log("About to call Welcome");
				if (process.env.REACT_APP_SHOWWELCOMEPAGE === 'true')
					return (<Welcome/>)
				else
					return <SignIn />
			}
		} 
  }

  // logic before displaying component
  // window.onbeforeunload = () => Router.refresh();
  //console.log("in before unload");

  initCdParams();
  return (
    <Router history={hist}> 
    <UserContext.Provider value={value}>
    </UserContext.Provider>
    <DispayTabs />
    </Router>
  );

}

export default AppRouter;
