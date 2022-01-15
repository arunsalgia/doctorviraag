import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { Container, CssBaseline } from '@material-ui/core';
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import { borders } from '@material-ui/system';


// styles
import globalStyles from "assets/globalStyles";


import { 
	DisplayProfCharge_WO_Name, DisplayProfCharge, DisplayProfChargeBalance
} from "CustomComponents/CustomComponents.js"

import {
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR, INR
} from "views/globals.js";


var userCid;
export default function ProfCharge(props) {
	const gClasses = globalStyles();

	const [profChargeArray, setProfChargeArray] = useState([]);
	const [profChargeMasterArray, setProfChargeMasterArray] = useState([]);
	
	const [balance, setBalance] = useState({billing: 0, payment: 0, due: 0})
	const [currentSelection, setCurrentSelection] = useState("Prof.Charge");

	const [currentPatientData, setCurrentPatientData] = useState({});
		
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");
		const checkPatient = async () => {	
			let patRec = props.patient;
			//console.log(patRec);
			setCurrentPatientData(patRec);
			//setCurrentPatient(patRec.displayName);
			getProfCharge(patRec);
			getBalance(patRec);
		}
		checkPatient();
		
  }, []);

	async function getProfCharge(patRec) {
		let myArray = [];
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/list/${userCid}/${patRec.pid}`)
			myArray = resp.data;
		} catch (e) {
			console.log(e)
		}
		setProfChargeMasterArray(myArray);
		//myArray = myArray.filter(x => x.amount < 0);
		//setProfChargeArray(myArray);
	}

	async function getBalance(patRec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/balance/${userCid}/${patRec.pid}`)
			setBalance(resp.data);
		} catch (e) {
			console.log(e)
		}
	}


	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={6} sm={4} md={2} lg={2} >
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
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Prof.Charge" />
		<DisplayFunctionItem item="Payment" />
	</Grid>	
	</Box>
	)}

	function DisplayPayments() {
		let myArray = (currentSelection === "Payment") 
		  ? profChargeMasterArray.filter(x => x.amount > 0) 
			: profChargeMasterArray.filter(x => x.amount < 0) 
			
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{myArray.map( (p, index) => {
				let d = new Date(p.date);
				let myDate = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear() % 100}`;
			return (
			<Grid align="left" className={gClasses.noPadding} key={"AllPayments"+index} container align="center">
			<Grid item xs={3} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
			</Grid>
			<Grid align="left" item xs={6} sm={8} md={8} lg={8} >
				<Typography className={gClasses.patientInfo2}>{p.description}</Typography>
			</Grid>
			<Grid align="right" item xs={3} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
			</Grid>
			</Grid>	
			)}
		)}
	</Box>
	)}
	
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayProfChargeBalance balance={balance}/>
	<DisplayFunctionHeader />
	<DisplayPayments />
	</div>
  );    
}
