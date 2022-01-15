import React, { useEffect, useState, useContext } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar"

import VsButton from "CustomComponents/VsButton";

import Report from 'views/Report/Report';
import ProfCharge from 'views/ProfCharge/PatientProfCharge';
import Visit from 'views/Visit/PatientVisit';
import PatientAppointment from 'views/Appointment/PatientAppointment';

import VisibilityIcon from '@material-ui/icons/Visibility';

import {
	DisplayLogo,
	DisplayPageHeader, 
	DisplayPatientBox,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";

var userCid;
var customerData;
var clinicName = "";

export default function PatientHome() {
	const gClasses = globalStyles();
	const [patientArray, setPatientArray] = useState([]);

	const [currentPatientName, setCurrentPatientName] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [currentSelection, setCurrentSelection] = useState("");
  useEffect(() => {
		
		const us = async () => {
			try {
				let userCid = sessionStorage.getItem("cid");
				//console.log(userCid);
				customerData = JSON.parse(sessionStorage.getItem("customerData"));
				//console.log(customerData);
				clinicName = customerData.clinicName;
				let tmp = JSON.parse(sessionStorage.getItem("patients"));
				tmp = tmp.filter(x => x.cid === userCid);
				setPatientArray(tmp);
				//console.log(tmp);
				if (tmp.length === 1) {
					handleSelectPatient(tmp[0]);
				} 				
			} catch {
				console.log("in patient catch");
			}	
		}
		us();	
  }, [])


	function handleSelectPatient(patRec) {
		setCurrentPatientData(patRec);
		setCurrentPatientName(patRec.displayName);
	}
	
	function DisplayAllPatients() {
	//console.log(patientArray);
	//console.log(patientMasterArray);
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={4} lg={3} >
			<DisplayPatientBox patient={m}
				button1={<VisibilityIcon className={gClasses.blue} size="small" onClick={() => handleSelectPatient(m) }  />}
			/>
		</Grid>
	)}
	</Grid>	
	)}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<Typography className={gClasses.patientInfo2Orange}>{"Clinic: "+clinicName}</Typography>
	<br />
	{(currentPatientName === "") &&
		<DisplayAllPatients />
	}
	{((currentPatientName !== "") && (currentSelection === "")) &&
	<Container component="main" maxWidth="xs">
	<DisplayPageHeader headerName={"Welcome "+currentPatientData.displayName} groupName="" tournament=""/>
	<br />
	<br />
	<Grid className={gClasses.fullWidth} key="LOGO" container align="center">
		<Grid item xs={12} sm={12} md={12} lg={12} >
		</Grid>
		<Grid item xs={6} sm={4} md={4} lg={4} >
      <DisplayLogo onClick={() => setCurrentSelection("Appointment")} label="Appointment" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={4} lg={4} >
      <DisplayLogo onClick={() => setCurrentSelection("Visit")} label="Prescription" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={4} lg={4} >
      <DisplayLogo onClick={() => setCurrentSelection("Report")} label="Report" image="SAMPLE.JPG" />;
		</Grid>
		<Grid item xs={6} sm={4} md={4} lg={4} >
      <DisplayLogo onClick={() => setCurrentSelection("Payment")} label="Payment" image="SAMPLE.JPG" />;
		</Grid>
	</Grid>
	</ Container>
	}
	{(currentSelection === "Appointment") &&
		<div>
		<DisplayPageHeader headerName={"Appointment Details"} groupName="" tournament=""/>
		<Typography className={gClasses.patientInfo2}>{"( " + currentPatientData.displayName + " )"}</Typography>
		<VsButton align="right" name="Home" onClick={() => setCurrentSelection("")} />
		<PatientAppointment patient={currentPatientData} />
		</div>
	}
	{(currentSelection === "Report") &&
		<div>
		<DisplayPageHeader headerName={"Report Details"} groupName="" tournament=""/>
		<Typography className={gClasses.patientInfo2}>{"( " + currentPatientData.displayName + " )"}</Typography>
		<VsButton align="right" name="Home" onClick={() => setCurrentSelection("")} />
		<Report patient={currentPatientData} />
		</div>
	}
	{(currentSelection === "Payment") &&
		<div>
		<DisplayPageHeader headerName={"Payment Details"} groupName="" tournament=""/>
		<Typography className={gClasses.patientInfo2}>{"( " + currentPatientData.displayName + " )"}</Typography>
		<VsButton align="right" name="Home" onClick={() => setCurrentSelection("")} />
		<ProfCharge patient={currentPatientData} />
		</div>
	}
	{(currentSelection === "Visit") &&
		<div>
		<DisplayPageHeader headerName={"Visit Details"} groupName="" tournament=""/>
		<Typography className={gClasses.patientInfo2}>{"( " + currentPatientData.displayName + " )"}</Typography>
		<VsButton align="right" name="Home" onClick={() => setCurrentSelection("")} />
		<Visit patient={currentPatientData} />
		</div>
	}
  </div>
  );    
}

