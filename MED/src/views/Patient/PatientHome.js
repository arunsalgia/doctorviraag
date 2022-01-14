import React, { useEffect, useState, useContext } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar"
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert';



import Report from 'views/Report/Report';
import ProfCharge from 'views/ProfCharge/PatientProfCharge';
import Visit from 'views/Visit/PatientVisit';

import { isMobile, encrypt,
	dispOnlyAge, dispAge, dispEmail, dispMobile, checkIfBirthday,
	validateInteger,
	getAllPatients,
	vsDialog,
	disableFutureDt,
 } from "views/functions.js"
import {
	DisplayLogo,
	DisplayPageHeader, 
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";


import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import {setTab} from "CustomComponents/CricDreamTabs.js"

/*
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

export default function PatientHome() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [currentPatientData, setCurrentPatientData] = useState({});
	const [currentSelection, setCurrentSelection] = useState("");

	
  useEffect(() => {
		
		const us = async () => {
			try {
				let userCid = sessionStorage.getItem("cid");
				let allPatient = JSON.parse(sessionStorage.getItem("patients"));
				setCurrentPatientData(allPatient.find(x => x.cid === userCid));
			} catch {
				console.log("in patient catch");
			}	
		}
		us();	
  }, [])

	function selectCategory(category) {


		
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{(currentSelection !== "") &&
		<div>
		<DisplayPageHeader headerName={currentSelection} groupName="" tournament=""/>
		<VsButton align="right" name="Home" onClick={() => setCurrentSelection("")} />
		</div>
	}
	{(currentSelection === "") &&
	<Container component="main" maxWidth="xs">
	<DisplayPageHeader headerName={"Welcome "+currentPatientData.displayName} groupName="" tournament=""/>
	<br />
	<Grid className={gClasses.fullWidth} key="LOGO" container align="center">
		<Grid item xs={12} sm={12} md={12} lg={12} >
		</Grid>
		<Grid item xs={6} sm={4} md={3} lg={3} >
      <DisplayLogo onClick={() => selectCategory("Appointment")} label="Appointment" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={3} lg={3} >
      <DisplayLogo onClick={() => setCurrentSelection("Visit")} label="Prescription" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={3} lg={3} >
      <DisplayLogo onClick={() => setCurrentSelection("Report")} label="Report" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={3} lg={3} >
      <DisplayLogo onClick={() => setCurrentSelection("Payment")} label="Payment" image="SAMPLE.JPG" />;
		</Grid>
	</Grid>
	</ Container>
	}
	{(currentSelection === "Report") &&
		<Report patient={currentPatientData} />
	}
	{(currentSelection === "Payment") &&
		<ProfCharge patient={currentPatientData} />
	}
	{(currentSelection === "Visit") &&
		<Visit patient={currentPatientData} />
	}
  </div>
  );    
}

