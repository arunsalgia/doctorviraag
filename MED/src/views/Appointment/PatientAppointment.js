import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { InputAdornment, Container, CssBaseline } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";

import Typography from '@material-ui/core/Typography';

import Box from '@material-ui/core/Box';


import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";





// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

import {
	DisplayPageHeader, ValidComp, DisplayPatientHeader,
} from "CustomComponents/CustomComponents.js"



import {
SHORTMONTHSTR, SHORTWEEKSTR,
HOURSTR, MINUTESTR,
MONTHSTR, DATESTR, MONTHNUMBERSTR,
VISITTYPE,
str1by4, str1by2,  str3by4,
BLOCKNUMBER,
} from 'views/globals';

import CancelIcon from '@material-ui/icons/Cancel';



import { 
	isMobile, 
	disablePastDt, disableFutureDt,
	validateInteger,
	encrypt, decrypt, 
	compareDate,
	getAllPatients,
	vsDialog,
	generateOrder, generateOrderByDate,
} from "views/functions.js";

let medQty=[];
const MINUTEBLOCK = [0, 15, 30, 45];
var userCid;
var customerData;

const NUMBEROFDAYS = (isMobile()) ? 2: 5;

export default function PatientAppointment(props) {
  //const classes = useStyles();
	const gClasses = globalStyles();
	const [currentPatientData, setCurrentPatientData] = useState({});	
	const [apptArray, setApptArray] = useState([]);
	
 
	
	useEffect(() => {			
		userCid = sessionStorage.getItem("cid");
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
		//console.log(patRec);
		setCurrentPatientData(patRec);
		getPatientAppt(patRec);

  }, []);

	async function getPatientAppt(rec) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/pid/${userCid}/${rec.pid}`);
			//console.log(resp.data);
			setApptArray(resp.data);
		} catch (e) {
			console.log(e);
		}
	}


	async function handleCancelAppt(cancelAppt) {
		
		let myMsg = `Are you sure you want to cancel appointment of ${cancelAppt.displayName} dated `;
		myMsg += `${DATESTR[cancelAppt.date]}/${MONTHNUMBERSTR[cancelAppt.month]}/${cancelAppt.year} at `;
		myMsg += `${HOURSTR[cancelAppt.hour]}:${MINUTESTR[cancelAppt.minute]}?`;
		
		vsDialog("Cancel Appointment", myMsg,
			{label: "Yes", onClick: () => handleCancelApptConfirm(cancelAppt) },
			{label: "No" }
		);
	}

	async function handleCancelApptConfirm(cancelAppt) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/cancel/${userCid}/${cancelAppt.pid}/${cancelAppt.order}`;
			let resp = await axios.get(myUrl);
			//alert.success("Cancelled appointment of "+cancelAppt.displayName);

			// remove from patient appoint 
			let tmpAppt = apptArray.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setApptArray(tmpAppt)
			
			// now remove from all pending apt list
			tmpAppt = allPendingAppt.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setAllPendingAppt(tmpAppt);
			//let tmpArray = await reloadAppointmentDetails();
			//generateSlots(tmpArray);
						
			let slotIndex = getSlotIndex(cancelAppt.year, cancelAppt.month, cancelAppt.date);
			if (slotIndex >= 0) {
				let cancelOrder = generateOrder(cancelAppt.year, cancelAppt.month, cancelAppt.date,
					cancelAppt.hour, cancelAppt.minute);
				let currentOrder = generateOrderByDate(new Date());
				let hasExpired = (cancelOrder <= currentOrder);
				let myTmpSlots = [].concat(allTimeSlots);
				
				// check if cancel apt is in morning
				let ttt = myTmpSlots[slotIndex].morningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}

				ttt = myTmpSlots[slotIndex].afternoonSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}
				
				ttt = myTmpSlots[slotIndex].eveningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}	
				setAllTimeSlots(myTmpSlots);
			}
		} catch (e) {
			console.log(e);
			alert.error("Error cancelling appointment of "+cancelAppt.displayName);
		}
	}
	
	function DisplayPatientAppointments() {
	return (
	<div >
	{(apptArray.length === 0) &&
		<Box align="left" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography className={gClasses.patientInfo2}>No Appointment</Typography>
		</Box>
	}
	{(apptArray.length > 0) &&
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		{apptArray.map( (a, index) => {
		let d = new Date(a.apptTime);
		let myDate = DATESTR[d.getDate()] + "/" +
			MONTHNUMBERSTR[d.getMonth()] + "/" +
			d.getFullYear();
			let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
			return (
				<Grid align="left" key={"Apt"+a.pid+index} item xs={12} sm={6} md={4} lg={3} >
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
					<Typography> 
					<span className={gClasses.patientName}>{"Appt.Date : "}</span>
					<span className={gClasses.patientInfo2}>{myDate+" "+myTime}</span>
					</Typography>
					<Typography> 
					<span className={gClasses.patientName}>{"Appt.Time: "}</span>
					<span className={gClasses.patientInfo2}>{myDate+" "+myTime}</span>
					</Typography>
					<Typography> 
					<span className={gClasses.patientName}>{"Patient Id : "}</span>
					<span className={gClasses.patientInfo2}>{a.pid}</span>
					</Typography>
					<VsCancel align="right" onClick={() => { handleCancelAppt(a)}}  />
				</Box>
				</Grid>
			)}
		)}
		</Grid>
	}
	</div>
	)}

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPatientAppointments />
  </div>
  );    
}