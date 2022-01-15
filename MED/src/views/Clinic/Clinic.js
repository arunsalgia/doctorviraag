import React, {useEffect, useState, createContext }  from 'react';
import { Container } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import VisibilityIcon from '@material-ui/icons/Visibility';// styles
import {setTab} from "CustomComponents/CricDreamTabs.js"
import PatientHome from "views/Patient/PatientHome";

import globalStyles from "assets/globalStyles";

import {
	DisplayPageHeader, DisplayCustomerBox
} from "CustomComponents/CustomComponents.js"

export default function Clinic() {
	const gClasses = globalStyles();
	
	const [clinicArray, setClinicArray] = useState([]);
	const [patientArray, setPatientArray] = useState([]);

  useEffect(() => {
		let tmpArray = 	JSON.parse(sessionStorage.getItem("clinics"));
		setClinicArray(tmpArray);
		if (tmpArray.length === 1) {
			setCurrentClinic(tmpArray[0], true);
		}
		
		setCurrentClinic(tmpArray[0], false)
		
  }, []);

	function setCurrentClinic(myClinic, startDisplay) {
		window.sessionStorage.setItem("cid", myClinic._id);
		window.sessionStorage.setItem("customerData", JSON.stringify(myClinic));
		
		if (startDisplay) {
			setTab(process.env.REACT_APP_PATIENTHOME);
		} else {
			
		}
	}

	function handleSelectCustomer(clinicRec) {
		setCurrentClinic(clinicRec, true);
	}

	function DisplayClinicList() {
	if (clinicArray.length <= 1) return null;
	
	return (	
		<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
		{clinicArray.map( (m, index) => 
			<Grid key={"PAT"+m.name} item xs={12} sm={6} md={3} lg={3} >
			<DisplayCustomerBox customer={m}
				button1={<VisibilityIcon className={gClasses.blue} size="small" onClick={() => handleSelectCustomer(m) } />}
			/>
			</Grid>
			)}
		</Grid>	
	)}


	
	return (
  <div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Clinic Directory" groupName="" tournament=""/>
	<br />
	<DisplayClinicList />
	</div>
	)
}