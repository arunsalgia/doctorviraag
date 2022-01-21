import React, { useEffect, useState ,useContext} from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { TextField, InputAdornment } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Modal from 'react-modal';
import Container from '@material-ui/core/Container';
import axios from "axios";
import SplitPane, { Pane } from 'react-split-pane';
import globalStyles from "assets/globalStyles";

import lodashSortby from "lodash/sortBy";

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

/*
const useStyles = makeStyles((theme) => ({
  bgImage: {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '50vw',
    height: '100vh'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
  textData: {
    fontSize: '14px',
    margin: theme.spacing(0),
  },
}));

const BackgroundImage = `${process.env.PUBLIC_URL}/image/SI_BGD.JPG`;

*/

import { 
  isMobile, cdRefresh, specialSetPos, encrypt, upGradeRequired, clearBackupData, downloadApk,
 } from "views/functions.js"

import {setTab} from "CustomComponents/CricDreamTabs.js"

import {
  CricDreamLogo, ValidComp
} from "CustomComponents/CustomComponents";


let deviceIsMobile=isMobile();

export default function SignIn() {
  const gClasses = globalStyles();
	
	const [currentSelection, setCurrentSelection] = useState("Doctor");
	
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
	const [showPassword, setShowPassword] = useState(false);
		
  const [ errorMessage, setErrorMessage ] = useState({msg: "", isError: false });

	const [downloadMessage, setDownloadMessage ] = useState("");
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
  }, []);

	function DisplayLeft() {
	return (	
		<div align="center" className={gClasses.bgImage} >
		<br />
		<br />
		<br />
		<br />
		<br />
		<CricDreamLogo />
		<br />
		<br />
		<br />
		<br />
		<Typography className={gClasses.modalTitle1}>{"Welcome to Doctor Viraag"}</Typography>
		</div>
	)}

	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={4} lg={4} >	
			<Typography onClick={() => setSelection(itemName)}>
				<span 
					className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
				{itemName}
				</span>
			</Typography>
		</Grid>
	)}
	
	async function setSelection(item) {
		setCurrentSelection(item);
	}
	
	function DisplayFunctionHeader() {
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<Grid item xs={2} sm={2} md={2} lg={2} />
		<DisplayFunctionItem item="Doctor" />
		<DisplayFunctionItem item="Patient" />
		<Grid item xs={2} sm={2} md={2} lg={2} />
	</Grid>	
	)}

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
	
	
  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }

	function handleForgot() {
		console.log("Call forgot password here")
		sessionStorage.setItem("currentLogin", "FORGOT");
		cdRefresh();
	}
	
	async function handleSubmit(e) {
		console.log("in submit", currentSelection);
		e.preventDefault();
		if (currentSelection === "Patient") {
			try {
				let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendrabypatient/${userName}`); 
				console.log("axios okay");
				window.sessionStorage.setItem("uid", userName);
				window.sessionStorage.setItem("userName", userName);
				window.sessionStorage.setItem("userType", "Patient");
				window.sessionStorage.setItem("cid", "");
				let myPatients =  lodashSortby(response.data.patient, 'pid');
				window.sessionStorage.setItem("patients", JSON.stringify(myPatients));
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

	function LoginHeader() {
	return (
	<div align="center">
	<br />
	<br />
	<Typography className={gClasses.modalTitle1}>{"Sign In"}</Typography>
	<br />
	<br />
	<DisplayFunctionHeader />
	<br />
	<br />
	</div>
	)}
	
	function LoginFooter() {
	return (
	<div align="center">
	<br />
	<Link href="#" onClick={handleForgot} variant="body2">Forgot password</Link>
	<DisplayDownload />
	<DisplayUpgrade/>
	</div>
	)}
	
  function LoginIn() {
  return (
	<div align="center">
	<Container component="main" maxWidth="xs">
	<br />
	<br />
	<Typography className={gClasses.modalTitle1}>{"Sign In"}</Typography>
	<br />
	<br />
	<DisplayFunctionHeader />
	<br />
	<br />
	<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmit}>
    {(currentSelection === "Patient") &&
		<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
			id="newPatientName" label="Mobile Number" type="number"
			value={userName} 
			onChange={() => { setUserName(event.target.value) }}
			validators={['minNumber:1000000000', 'maxNumber:9999999999']}
			errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
		/>
    }
    {(currentSelection === "Doctor") &&
			<div>
			<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={userName} 
				onChange={() => { setUserName(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>
			{(showPassword) &&
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
			{(!showPassword) &&
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
			</div>
		}
    <Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
		<br/>
		<Button fullWidth type="submit" variant="contained" color="primary" className={gClasses.submit} >
			Sign In
		</Button>
		<ValidComp />
	</ValidatorForm>	
	<ValidComp />
	<Link href="#" onClick={handleForgot} variant="body2">Forgot password</Link>
	<DisplayDownload />
	<DisplayUpgrade/>
	</Container>
	</div>
  )}

	return (
		<div>
		{(!deviceIsMobile) &&
		<SplitPane split="vertical" >
		<DisplayLeft />
		<Container component="main" maxWidth="xs">
		<LoginHeader />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmit}>
			{(currentSelection === "Patient") &&
			<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
				id="newPatientName" label="Mobile Number" type="number"
				value={userName} 
				onChange={() => { setUserName(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
				errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
			/>
			}
			{(currentSelection === "Doctor") &&
				<div>
				<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
					id="newPatientName" label="Name" type="text"
					value={userName} 
					onChange={() => { setUserName(event.target.value) }}
					validators={['noSpecialCharacters']}
					errorMessages={['Special characters not permitted']}
				/>
				{(showPassword) &&
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
				{(!showPassword) &&
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
				</div>
			}
			<Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
			<br/>
			<Button fullWidth type="submit" variant="contained" color="primary" className={gClasses.submit} >
				Sign In
			</Button>
			<ValidComp />
		</ValidatorForm>	
		<LoginFooter />
		</Container>
		</SplitPane>
		}
		{(deviceIsMobile) &&
		<Container component="main" maxWidth="xs">
		<LoginHeader />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmit}>
			{(currentSelection === "Patient") &&
			<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
				id="newPatientName" label="Mobile Number" type="number"
				value={userName} 
				onChange={() => { setUserName(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
				errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
			/>
			}
			{(currentSelection === "Doctor") &&
				<div>
				<TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
					id="newPatientName" label="Name" type="text"
					value={userName} 
					onChange={() => { setUserName(event.target.value) }}
					validators={['noSpecialCharacters']}
					errorMessages={['Special characters not permitted']}
				/>
				{(showPassword) &&
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
				{(!showPassword) &&
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
				</div>
			}
			<Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
			<br/>
			<Button fullWidth type="submit" variant="contained" color="primary" className={gClasses.submit} >
				Sign In
			</Button>
			<ValidComp />
		</ValidatorForm>	
		<LoginFooter />
		</Container>
		}
		</div>
  )
}
