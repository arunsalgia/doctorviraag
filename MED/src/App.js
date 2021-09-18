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
import SignUp from "views/Login/SignUp.js";
import Welcome from "views/MED/Welcome";
import ResetPassword from "views/Login/ResetPassword";
//import Session from "views/Session/Session"
//import JoinGroup from "views/Group/JoinGroup.js"
import ForgotPassword from "views/Login/ForgotPassword.js";
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


function checkJoinGroup(pathArray) {
  let sts = false;
  if ((pathArray[1].toLowerCase() === "joingroup") && (pathArray.length === 3) && (pathArray[2].length > 0)) {
    localStorage.setItem("joinGroupCode", pathArray[2]);
    sts = true;
  }
  return sts;
}

function initCdParams() {
  localStorage.setItem("joinGroupCode", "");
  let ipos = 0;
  if ((localStorage.getItem("tabpos") !== null) &&
  (localStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(localStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) localStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    localStorage.setItem("tabpos", 0);
  console.log(`ipos: ${ipos}   Tabpos ${localStorage.getItem("tabpos")}`)
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
	let x = location.pathname.split("/");
  console.log("Path is");
  console.log(x);
	if (x.length >= 4)
	if (x[1] === "viraagdental")
	if (x[2] === "resetpassword") {
		resetLink = x[3];
	}
	return resetLink;
}


function AppRouter() {
  //let history={hist}
	
  const [user, setUser] = useState(null);
	const [fireToken, setFireToken] = useState("");
	
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  // console.log(`000. User is ${localStorage.getItem("uid")}`)
  
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
    console.log("Login status", isLogged)
    if (isLogged) {
      // console.log("User is logged");
      return (
        <div>
          <CricDreamTabs/>
        </div>
      )  
    } 
		else if (sessionStorage.getItem("currentLogin") ===  "SIGNIN") {
			return <SignIn />
		} 
		else if (sessionStorage.getItem("currentLogin") ===  "SIGNUP") {
			return <SignUp />
		} 
		else if (sessionStorage.getItem("currentLogin") ===  "FORGOT") {
			return <ForgotPassword />
		} 
		else  {
			let myLink = checkResetPasswordRequest();
			console.log("Link", myLink);
			if (myLink !== "") {
				sessionStorage.setItem("currentUserCode", myLink);
				hist.push("/");
				//console.log(history, hist);
				return (<ResetPassword />);
			} else {
				console.log("Aboyt to call Welcome");
				return (<Welcome/>)
			}
		} 
  }

  // logic before displaying component
  // window.onbeforeunload = () => Router.refresh();
  //console.log("in before unload");

  initCdParams();

  let mypath = window.location.pathname.split("/");
  if (checkJoinGroup(mypath)) {
    //console.log("join group found");
    localStorage.setItem("tabpos", 105);
    //history.push("/")
  } 

  // return (
  // <Router history={hist}> 
  //     <UserContext.Provider value={value}>
  //       {!user && <Redirect from="/" to="/signIn" />}
  //       <Route path="/joingroup" component={JoinGroup} />
  //       <Route path="/admin" component={value ? Admin : SignIn} />
  //       <Redirect from="/" to="/signIn" />
  //     </UserContext.Provider>
  //   </Router>
  // );


  return (
    <Router history={hist}> 
    <UserContext.Provider value={value}>
    </UserContext.Provider>
    <DispayTabs />
    </Router>
  );

}

export default AppRouter;
