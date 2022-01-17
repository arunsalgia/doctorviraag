import React, { useState, useContext, useEffect } from 'react';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Modal from 'react-modal';
import Avatar from '@material-ui/core/Avatar';
//import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField, InputAdornment } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Switch, Route } from 'react-router-dom';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
//import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";
//import {red, green, blue } from '@material-ui/core/colors';
//import { DesktopWindows } from '@material-ui/icons';
import { isMobile, cdRefresh, specialSetPos, encrypt, upGradeRequired, clearBackupData, downloadApk } from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { DisplayLogo, CricDreamLogo, ValidComp } from 'CustomComponents/CustomComponents.js';
//import { BlankArea } from 'CustomComponents/CustomComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import VsButton from "CustomComponents/VsButton";
//import VsCheckBox from "CustomComponents/VsCheckBox.js"


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#B3E5FC',
    //color                 : '#FFFFFF',
  }
};

let deviceIsMobile=isMobile();

export default function SignIn() {
  const gClasses = globalStyles();
  const history = useHistory();
	
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [isPatient, setIsPatient] = useState(false);
	const [selectionDone, setSelectionDone] = useState(false);
	const [currentSelection, setCurrentSelection] = useState("");

  const [ errorMessage, setErrorMessage ] = useState({msg: "", isError: false });
  const [ downloadMessage, setDownloadMessage ] = useState("");
	const [latestApk, setLatestApk] = React.useState(null);
	const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
	
	function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }
	
  useEffect(() => {
    if (window.localStorage.getItem("logout")) {
      localStorage.clear();
    }
    if (window.localStorage.getItem("uid")) {
      // setUser({ uid: window.localStorage.getItem("uid"), admin: window.localStorage.getItem("admin") })
      // history.push("/admin")
    } else {
      // setShowPage(true)
    }
		
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      //console.log("Checkversion");
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
    
		checkVersion(); 
	}, []);

	async function handleUpgrade() {
    //console.log("upgrade requested");
		setUpgrade(false);
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }
	
	async function handleSkip() {
		setUpgrade(false);
    closeModal();
  }
	
  function DisplayUpgrade() {
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
				shouldCloseOnOverlayClick={false}
				borderRadius={7} border={1} 
				>
					<Typography className={gClasses.new} align="center">
						Upgrade to latest
					</Typography>
					<br />
					<br />
					<Typography className={gClasses.new} align="center">
						What is new
					</Typography>
					<TextField variant="outlined" multiline fullWidth readonly
						// label="What is new" 
						className={gClasses.whatIsNew}
						defaultValue={latestApk.text} 
					/>
					<br />
					<br />
					<Grid key="UPG" container align="center">
					<Grid item xs={6} sm={6} md={6} lg={6} >
						<VsButton type="button" align="center" name="Update" onClick={handleUpgrade} />
					</Grid>
					<Grid item xs={6} sm={6} md={6} lg={6} >
						<VsButton type="button" align="center" name="Later" onClick={handleSkip} />
					</Grid>
					</Grid>
					<br />
      </Modal>
      )
    else
      return(null);
  }

  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }


	async function handleSubmit(e) {
  e.preventDefault();
  if (isPatient) {
    try {
      let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendrabypatient/${userName}`); 
      window.sessionStorage.setItem("uid", userName);
      window.sessionStorage.setItem("userName", userName);
      window.sessionStorage.setItem("userType", "Patient");
      window.sessionStorage.setItem("cid", "");
      
      window.sessionStorage.setItem("patients", JSON.stringify(response.data.patient));
      window.sessionStorage.setItem("clinics", JSON.stringify(response.data.clinic));
      
      setTab("6");
    } catch (e) {
      setError("Mobile number not registered with any clinic", true);
    }
  } else {
    try { 
      let enPassword = encrypt(password);
      let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendra/${userName}/${enPassword}`); 
      setError("", false);
      let userData = response.data.user;
      window.sessionStorage.setItem("uid", userData.uid)
      window.sessionStorage.setItem("userName", userData.displayName);
      window.sessionStorage.setItem("userType", userData.userType);
      window.sessionStorage.setItem("cid", userData.cid);

      window.sessionStorage.setItem("customerData", JSON.stringify(response.data.customer));
      
      //window.sessionStorage.setItem("doctorData", JSON.stringify(response.data.doctor));
      
      //window.sessionStorage.setItem("admin", true)
      setTab(process.env.REACT_APP_HOME);
    } catch (err) {
      setError("Invalid User name / Password", true);
    }
  }
};

	function handleForgot() {
  console.log("Call forgot password here")
  // history.push('/admin/emailpassword');
  sessionStorage.setItem("currentLogin", "FORGOT");
  cdRefresh();
}


  const handleClick = async () => {
    let myUserName = document.getElementById("userName").value;
    let myPassword = document.getElementById("password").value;
    setUserName(myUserName);
    setPassword(myPassword);

    let response = ""
    try { 
      let enPassword = encrypt(myPassword);
      response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendra/${myUserName}/${enPassword}`); 
      setError("", false);
    } catch (err) {
      setError("Invalid Username / Password", true);
    }
    // console.log("Signinresponse", response.data);

    if (response.status === 200) {
			console.log("Signinresponse", response.data);
			
			let userData = response.data.user;
      window.sessionStorage.setItem("uid", userData.uid)
      window.sessionStorage.setItem("userName", userData.displayName);
      window.sessionStorage.setItem("userType", userData.userType);
			window.sessionStorage.setItem("cid", userData.cid);

			window.sessionStorage.setItem("customerData", JSON.stringify(response.data.customer));
			
			window.sessionStorage.setItem("doctorData", JSON.stringify(response.data.doctor));
			 
			//window.sessionStorage.setItem("admin", true)
			setTab(process.env.REACT_APP_HOME);
			 
			//setUser({ uid: myUID, admin: true })
			
			/*
      response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/default/${myUID}`);
      // console.log("default respose", response.data);
      // SAMPLE OUTPUT
      // {"uid":"8","gid":2,"displayName":"Salgia Super Stars",
      // "groupName":"Happy Home Society Grp 2","tournament":"ENGAUST20","ismember":true,"admin":true}
      window.localStorage.setItem("gid", response.data.gid);
      window.localStorage.setItem("groupName", response.data.groupName);
      window.localStorage.setItem("tournament", response.data.tournament);
      
      window.localStorage.setItem("SNG", "");
      window.localStorage.setItem("cGroup", "");
      clearBackupData();
			*/
			
      // setUser({ uid: myUID, admin: response.data.admin });
      // cdRefresh(true);
      //let newPos = specialSetPos();
      //if (newPos < 0) newPos = 0;
      // let newPos = (response.data.gid > 0) ? process.env.REACT_APP_DASHBOARD : process.env.REACT_APP_GROUP;
      // console.log(`User is ${localStorage.getItem("uid")}`)
     
    }
  }

 
  async function handleAndroid() {
    try {
      setDownloadMessage("DOCTORVIRAAG Android app. download started. Please wait...")
      // console.log("Download Android app.");
      await downloadApk();
      setDownloadMessage("DOCTORVIRAAG Android app. download complete.")
      // console.log("APK has to be downloaded");
    } catch (e) {
      setDownloadMessage("Error encountered while downloading DOCTORVIRAAG Android app", true)
    }
  }

  function handleIos() {
    console.log("Download IOS app");
  }


  function DisplayDownload() {
    if (process.env.REACT_APP_DEVICE !== "WEB") return null;
		if (!isMobile()) return null;
		
    let androidImage = `${process.env.PUBLIC_URL}/image/ANDROID.JPG`;
    let iosImage = `${process.env.PUBLIC_URL}/image/IOS.JPG`;
    return (
      <div align="center">
      <Typography className={gClasses.message18}>Download the offical app</Typography>
      <br />
      <Typography className={gClasses.nonerror} align="center">{downloadMessage}</Typography>
      <Grid key="jp1" container align="center">
        <Grid item xs={12} sm={12} md={12} lg={12} >
        <button><img src={androidImage} alt="my image" onClick={handleAndroid} /></button>
        </Grid>
        {/* <Grid item className={classes.downloadButon} xs={6} sm={6} md={6} lg={6} >
        <button disabled><img src={iosImage}  alt="my image" onClick={handleIos} /></button>
        </Grid> */}
      </Grid>
      </div>
    )  
  } 

  
  const [showPassword, setShowPassword] = useState(false);

  function handleVisibility(visible) {
    let myName = document.getElementById("userName").value;
    let myPassword = document.getElementById("password").value;
    setUserName(myName);
    setPassword(myPassword);
    setShowPassword(visible);
  }

  function NonMobile() {
    return (
      <TextField variant="outlined" required fullWidth
        id="password" label="Password" type="password"
        defaultValue={password}
        // onChange={(event) => setPassword(event.target.value)}
      />
    )
  }

	function selectCategory(category) {
		console.log(category);
		setIsPatient((category.toLowerCase() === "patient"));
		setSelectionDone(true);
		setCurrentSelection((category.toLowerCase() === "patient") ? " Patient" : " Doctor");
	}

  return (
	<Container component="main" maxWidth="xs">
	<CssBaseline />
	<div className={gClasses.paper}>
	<CricDreamLogo />
	<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmit}>
		<Typography component="h1" variant="h5" align="center">{"Sign in as "+((selectionDone) ? ((isPatient) ? " Patient" : " Doctor") :  "")}</Typography>
		<br />
		{(!selectionDone) &&
		<div>
		<br />
		<Grid className={gClasses.fullWidth} key="LOGO" container align="center">
		<Grid item xs={12} sm={12} md={12} lg={12} >
		</Grid>
		<Grid item xs={false} sm={false} md={1} lg={1} />
		<Grid item xs={6} sm={6} md={5} lg={5} >
      <DisplayLogo onClick={() => selectCategory("Patient")} label="Patient" image="SI_PATIENT.JPG" />;
		</Grid>
		<Grid item xs={6} sm={6} md={5} lg={5} >
      <DisplayLogo onClick={() => selectCategory("Doctor")} label="Doctor" image="SI_DOCTOR.JPG" />;
		</Grid>
		<Grid item xs={false} sm={false} md={1} lg={1} />
		</Grid>
		</div>
		}
    {((isPatient) && (selectionDone)) &&
		<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
			id="newPatientName" label="Mobile Number" type="number"
			value={userName} 
			onChange={() => { setUserName(event.target.value) }}
			validators={['minNumber:1000000000', 'maxNumber:9999999999']}
			errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
		/>
    }
    {((!isPatient) && (selectionDone)) &&
		<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
			id="newPatientName" label="Name" type="text"
			value={userName} 
			onChange={() => { setUserName(event.target.value) }}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted']}
		/>
    }
    <br/>
		{((!isPatient) &&  (showPassword) && (selectionDone)) &&
			<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
				id="password" label="Password" type={"text"}
				value={password} 
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<VisibilityIcon onClick={() => { setShowPassword(false); }} />
						</InputAdornment>
					),
				}}
				onChange={() => { setPassword(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>
		}
		{((!isPatient) &&  (!showPassword)  && (selectionDone)) &&
			<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
				id="password" label="Password" type={"password"}
				value={password} 
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<VisibilityOffIcon onClick={() => { setShowPassword(true); }} />
						</InputAdornment>
					),
				}}
				onChange={() => { setPassword(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>
		}
		<Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
		<ValidComp />
		{(selectionDone) &&
		<Grid className={gClasses.fullWidth} key="LOGO" container align="center" alignItems="center" >
		<Grid item xs={1} sm={1} md={1} lg={1} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Button type="submit" fullWidth variant="contained" color="primary" className={gClasses.submit}>
				Sign In
			</Button>
		</Grid>
		<Grid item xs={1} sm={1} md={1} lg={1} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Button fullWidth variant="contained" color="primary" className={gClasses.submit} onClick={() => setSelectionDone(false)}>
				Back
			</Button>
		</Grid>
		</Grid>
		}
		</ValidatorForm>	
		{(selectionDone) &&
		<div align="left">
			<br />
			<Link href="#" onClick={handleForgot} variant="body2">Forgot password</Link>
		</div>
		}
		<DisplayDownload />
		<DisplayUpgrade/>
	</div>
	</Container>
  );
}
