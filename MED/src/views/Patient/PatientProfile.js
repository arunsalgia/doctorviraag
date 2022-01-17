import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadioGroup from 'CustomComponents/VsRadioGroup';

import Drawer from '@material-ui/core/Drawer';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import lodashSortby from "lodash/sortBy";

// icons
import EditIcon from '@material-ui/icons/Edit';

import {
MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR, GENDER,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, encrypt,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
	disableFutureDt,
 } from "views/functions.js"
import {BlankArea, 
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";





/*
const drawerWidth=800;
const AVATARHEIGHT=4;
const useStyles = makeStyles((theme) => ({
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		width: '40%'
	},
	drawer: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
	boxStyle: {padding: "5px 10px", margin: "4px 2px", backgroundColor: blue[300] },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
    root: {
      width: '100%',
    }, 
		link: {
			backgroundColor: 'transparent',
		},
		switchText: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    info: {
			backgroundColor: yellow[500],	
			color: blue[700],
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
    }, 
		noinfo: {
			backgroundColor: '#FFFFFF',	
			color: '#000000',
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
		},       
    td : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#00E5FF',
		},
		th : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#FF7043',
		},
		header: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
			paddings: '20px',
		},
		NoPatients: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));

*/

var userCid;
var customerData;

export default function PatientProfile(props) {
	const gClasses = globalStyles();
	//const alert = useAlert();


	const [currentPatient, setCurrentPatient] = useState("");
	const [patientData, setPatientData] = useState(null);

	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	const [radioValue, setRadioValue] = useState("Male");
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [oldPatientName, setOldPatientName] = useState("");
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	const	[patientEmail, setPatientEmail] = useState("");
	const	[patientMobile, setPatientMobile] = useState(0);
	const [patientDob, setPatientDob] = useState(new Date(2000, 1, 1));
  
	
  useEffect(() => {
		// do not get data if current user is patient
		userCid = sessionStorage.getItem("cid");
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		setPatientData(props.patient);
		setPatientName(props.patient.displayName);
  }, [])


	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
        break;
			case 1001:
        myMsg = "Invalid date of birth";
        break;
      case 601:
        myMsg = "Patient name already in database";
        break;
      case 611:
        myMsg = "Patient name not found in database";
        break;
    }
    return(
      <div>
        <Typography className={gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }


	
	function handleEdit(rec) {
		//console.log(rec);
		setOldPatientName(rec.displayName);
		setPatientName(rec.displayName);		
		setPatientAge(dispOnlyAge(rec.age));
		setPatientGender(rec.gender);
		setRadioValue(rec.gender);
		setPatientEmail(dispEmail(rec.email));
		setPatientMobile(dispMobile(rec.mobile));
		setPatientDob(moment(rec.dob));
		setRegisterStatus(0);
		setIsDrawerOpened(true);
	}



	
	async function handleAddEditSubmit() {
		let myDate = patientDob.toDate();
		let testAge = new Date().getFullYear() - myDate.getFullYear();
		console.log(testAge, myDate);
		if ((testAge >= 100) || (testAge <= 1)) return setRegisterStatus(1001);
		let myMobile = (patientMobile !== "") ? patientMobile : 0;
		let myEmail = (patientEmail !== "") ? patientEmail : "-";
		myEmail = encrypt(myEmail);
		let dobStr = myDate.getFullYear() + MONTHNUMBERSTR[myDate.getMonth()] + DATESTR[myDate.getDate()];
		//console.log(myEmail);
		//console.log("Addedit", patientName, dobStr, patientGender, myEmail, myMobile);
		let resp;
		let myUrl;
		try {
			myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/editwithdob/${userCid}/${oldPatientName}/${patientName}/${dobStr}/${patientGender}/${myEmail}/${myMobile}`;
			resp = await axios.get(myUrl);
			let myData = resp.data;
			setPatientData(myData);
			setPatientName(myData.displayName);
			// update patinet session data
			let tmp = JSON.parse(sessionStorage.getItem("patients"));
			tmp = tmp.filter(x => x.pid !== myData.pid);
			tmp.push(myData);
			tmp = lodashSortby(tmp, 'pid');
			
			//console.log("in home");
			//console.log(tmp);
			sessionStorage.setItem("patients", JSON.stringify(tmp));
			setIsDrawerOpened(false);
		} catch (error)  {
			console.log(error.response.status);
			setRegisterStatus(error.response.status);
		}			
	}




	
	function DisplayProfile() {
	let pRec = patientData;
	if (!pRec) return null;

	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="right" >
			<EditIcon color="primary" onClick={() => handleEdit(pRec)} />
		</div>
		<div align="left" >
		<br />
		<Typography>
			<span className={gClasses.patientInfo}>Name: </span>
			<span className={gClasses.patientInfo2}>{pRec.displayName}</span>
		</Typography>
		<br />
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{pRec.pid}</span>
		</Typography>
		<br />
		<Typography>
			<span className={gClasses.patientInfo}>Age: </span>
			<span className={gClasses.patientInfo2}>{dispAge(pRec.age, pRec.gender)}</span>
		</Typography>
		<br />
		<Typography>
			<span className={gClasses.patientInfo}>Mobile: </span>
			<span className={gClasses.patientInfo2}>{pRec.mobile}</span>
		</Typography>
		<br />
		<Typography>
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(pRec.email)}</span>
		</Typography>
		</div>
	</Box>		
	)}


  return (
  <div className={gClasses.webPage} align="center" key="main">
		<DisplayProfile />
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened(false)}} />
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{ "Edit Patient Profile"}</Typography>
			<TextValidator fullWidth  className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={patientName} 
				onChange={(event) => { setPatientName(event.target.value) }}
      />
			<div align="left">
			<Typography className={gClasses.vgSpacing}>Date of Birth</Typography>
			</div>
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={gClasses.dateTimeNormal}
				timeFormat={false} 
				initialValue={patientDob}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={setPatientDob}
				closeOnSelect={true}
			/>
			<br />
			<VsRadioGroup value={radioValue} 
				onChange={(event) => {setRadioValue(event.target.value)}}
				radioList={GENDER} 
				/>
			{/*<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={(event) => {setRadioValue(event.target.value); setPatientGender(event.target.value); }}
				>
				<FormControlLabel className={gClasses.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
				<FormControlLabel className={gClasses.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
				<FormControlLabel className={gClasses.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
			</RadioGroup>
			</FormControl>*/}

			<TextValidator   fullWidth   className={gClasses.vgSpacing} 
				id="newPatientEmail" label="Email" type="email"
				value={patientEmail} 
				onChange={() => { setPatientEmail(event.target.value) }}
      />
			<TextValidator fullWidth required className={gClasses.vgSpacing} 
				id="newPatientMobile" label="Mobile" type="number"
				value={patientMobile} 
				onChange={() => { setPatientMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
			<ShowResisterStatus />
			<BlankArea />
			<VsButton name={"Update Profile"} />
		</ValidatorForm>    		
		</Box>
		</Drawer>
  </div>
  )   
}

