import React, { useEffect, useState, useContext } from 'react';
import { CssBaseline } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import Box from '@material-ui/core/Box';
import lodashSumBy from 'lodash/sumBy';

import VsButton from "CustomComponents/VsButton";
import VsTextSearch from "CustomComponents/VsTextSearch";


import Grid from "@material-ui/core/Grid";
//import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
// icons
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';


import {
WEEKSTR, MONTHSTR, SHORTMONTHSTR, DATESTR, MONTHNUMBERSTR,
HOURSTR, MINUTESTR,
INR,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { isMobile, 
	dispAge, dispEmail, dispMobile,
	validateInteger,
	getAllPatients,
	disableFutureDt,
 } from "views/functions.js"
import {
	DisplayPageHeader, BlankArea, DisplayPatientBox, 
	DisplayProfChargeBalance, DisplayProfCharge, DisplayProfCharge_WO_Name,
	DisplayPatientHeader,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";



import { compareDate } from 'views/functions';


const AVATARHEIGHT=4;


var userCid;
//var customerData = JSON.parse(sessionStorage.getItem("customerData"));

var tmpDate1 = moment();
var tmpDate2 = moment();
function setTmpDate1(d) { tmpDate1 = d};
function setTmpDate2(d) { tmpDate2 = d};
const ZEROBALANCE = {billing: 0, payment: 0, due: 0};

export default function Summary() {
	//const history = useHistory();	
	const gClasses = globalStyles();
	const alert = useAlert();
	//customerData = sessionStorage.getItem("customerData");

	const [searchText, setSearchText] = useState("");
	
	const [balance, setBalance] = useState(ZEROBALANCE);
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [patientMasterArray, setPatientMasterArray] = useState([]);
	const [patientArray, setPatientArray] = useState([]);

	const [visitArray, setVisitArray] = useState([]);
	const [billingArray, setBillingArray] = useState([]);
	const [dueArray, setDueArray] = useState([]);

	const [currentSelection, setCurrentSelection] = useState("");
	const [currentDateWiseSelection, setCurrentDateWiseSelection] = useState("");
	const [currentPatientWiseSelection, setCurrentPatientWiseSelection] = useState("");
	const [currentPendingApptSelection, setCurrentPendingApptSelection] = useState("");

	const [date1, setDate1] = useState(new Date());
	const [date2, setDate2] = useState(new Date());

	
  useEffect(() => {
		const us = async () => {
			let ppp = await getAllPatients(userCid);
			setPatientMasterArray(ppp);
			setPatientFilter(ppp, searchText);		
			setSummaryMainSelect("Dues")		
		}
		userCid = sessionStorage.getItem("cid");
		us();
  }, [])



	async function getBalance(pid) {
		try {
			let myUrl = (pid > 0) ?
				`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/balance/${userCid}/${pid}` :
				`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/balance/${userCid}`;

			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setBalance(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching balance`);
			setBalance(ZEROBALANCE);
		}
	}

	async function getBilling(pid) {
		try {
			let myUrl;
			if (pid > 0) {
				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/list/${userCid}/${pid}`;
			} else {
				let myFrom = date1.getFullYear() + MONTHNUMBERSTR[date1.getMonth()] + DATESTR[date1.getDate()];
				let myTo = date2.getFullYear() + MONTHNUMBERSTR[date2.getMonth()] + DATESTR[date2.getDate()];

				myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/fromtolist/${userCid}/${myFrom}/${myTo}`;
			}
			let resp = await axios.get(myUrl);
			setBillingArray(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching balance`);
			setBillingArray([]);
		}
	}

	async function getDues() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/due/${userCid}`;
			let resp = await axios.get(myUrl);
			setDueArray(resp.data);
		} catch (e) {
			console.log(e)
			alert.error(`Error fetching dues`);
			setDueArray([]);
		}
	}


	function DisplayPatientVisit() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
	<Grid className={gClasses.noPadding} key="PATHDR" container align="center" alignItems="center" >
	<Grid align={(isMobile()) ? "left" : "center"} item xs={5} sm={5} md={2} lg={2} >
		<Typography className={gClasses.patientInfo2Orange}>Date</Typography>
	</Grid>
	<Grid item xs={4} sm={4} md={4} lg={4} >
		<Typography className={gClasses.patientInfo2Orange}>Name</Typography>
	</Grid>
	<Grid item xs={false} sm={false} md={1} lg={1} >
	{(!isMobile()) &&
		<Typography className={gClasses.patientInfo2Orange}>Age</Typography>
	}
	</Grid>
	<Grid item xs={false} sm={false} md={3} lg={3} >
	{(!isMobile()) &&
		<Typography className={gClasses.patientInfo2Orange}>Email</Typography>
	}
	</Grid>
	<Grid item xs={3} sm={3} md={2} lg={2} >
		<Typography className={gClasses.patientInfo2Orange}>Mobile</Typography>
	</Grid>
	<Grid item xs={4} sm={4} md={false} lg={false} />
	</Grid>
	{visitArray.map( (v, index) => {
		let myPat = patientMasterArray.find(x => x.pid === v.pid);
		if (!myPat) return null;
		let myName = (myPat) ? myPat.displayName : "";
		let d = new Date(v.visitDate);
		let myDate = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()} ${HOURSTR[d.getHours()]}:${MINUTESTR[d.getMinutes()]}`;
		return (
		<Grid className={gClasses.noPadding} key={"VISIT"+index} container align="center" alignItems="center" >
		<Grid align={(isMobile()) ? "left" : "center"} item xs={5} sm={5} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography className={gClasses.patientInfo2}>{myName}</Typography>
		</Grid>
		<Grid item xs={false} sm={false} md={1} lg={1} >
		{(!isMobile()) &&
			<Typography className={gClasses.patientInfo2}>{dispAge(myPat.age, myPat.gender)}</Typography>
		}
		</Grid>
		<Grid item xs={false} sm={false} md={3} lg={3} >
		{(!isMobile()) &&
			<Typography className={gClasses.patientInfo2}>{dispEmail(myPat.email)}</Typography>
		}
		</Grid>
		<Grid item xs={3} sm={3} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{dispMobile(myPat.mobile)}</Typography>
		</Grid>
		</Grid>
		)}
	)}
	</Box>
	)}

	function TotalDues() {
	let totalDue = Math.abs(lodashSumBy(dueArray, 'due'));
	return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="DUESTTOAL"  container align="center" alignItems="center" >
		<Grid item align="right" xs={9} sm={9} md={11} lg={11} >
		<Typography className={gClasses.patientInfo2Green}>Total Dues</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={1} lg={1} >
			<Typography align="right" className={gClasses.patientInfo2Green}>{INR+totalDue}</Typography>
		</Grid>
		</Grid>
		</Box>
	)}

	function DisplayPatientDues() {
		return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="DUESHDR" container align="center" alignItems="center" >
			<Grid align="left"  item xs={5} sm={5} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Orange}>Name</Typography>
			</Grid>
			<Grid item xs={false} sm={false} md={1} lg={1} >
				{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2Orange}>Age</Typography>
				}
			</Grid>
			<Grid item xs={false} sm={false} md={3} lg={3} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2Orange}>Email</Typography>
			}
			</Grid>
			<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Mobile</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Dues</Typography>
			</Grid>
		</Grid>
		{dueArray.map( (v, index) => {
			let myPat = patientMasterArray.find(x => x.pid === v._id);
			if (!myPat) return null;
			let myName = myPat.displayName;
			return (
			<Grid className={gClasses.noPadding} key={"DUES"+index} container align="center" alignItems="center" >
			<Grid align="left" item xs={5} sm={5} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2}>{myName}</Typography>
			</Grid>
			<Grid item xs={false} sm={false} md={1} lg={1} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2}>{dispAge(myPat.age, myPat.gender)}</Typography>
			}
			</Grid>
			<Grid item xs={false} sm={false} md={3} lg={3} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2}>{dispEmail(myPat.email)}</Typography>
			}
			</Grid>
			<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{dispMobile(myPat.mobile)}</Typography>
			</Grid>
			<Grid align="right" item xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(v.due)}</Typography>
			</Grid>
			</Grid>
			)}
		)}
		</Box>
		)}


	function handleSelectPatient(pat) {
		setCurrentPatientData(pat);
		setCurrentPatient(pat.displayName);
		setCurrentPatientWiseSelection("");
	}



	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
	<Typography onClick={() => props.onClick(itemName)}>
		<span 
			className={(itemName === props.match) ? gClasses.functionSelected : gClasses.functionUnselected}>
		{itemName}
		</span>
	</Typography>
	</Grid>
	)}
	
	async function setSummaryMainSelect(item) {
		if (item === "Dues") {
			await getDues()
		}
		setCurrentDateWiseSelection(""); 
		setCurrentPatientWiseSelection("");
		setCurrentPatient("");
		setCurrentPatientData({});
		setCurrentPendingApptSelection("");
		setCurrentSelection(item);
	}
	
	async function handlePatientWiseSelect(item) {
		if (item === "Visit") {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/revlist/${userCid}/${currentPatientData.pid}`)
				setVisitArray(resp.data);
			} catch (e) {
				console.log(e)
				setVisitArray([]);
			} finally {
			}
		} else if (item === "Billing") {
			//console.log(currentPatientData);
			await getBalance(currentPatientData.pid);
			await getBilling(currentPatientData.pid)
		}
		setCurrentPatientWiseSelection(item);
	}

	async function handleDateWiseSelect(item) {
		//validate start date and end date
		if (compareDate(date1, date2) > 0) return alert.error('From date later than To date');

		if (item === "Visit") {
			let myFrom = date1.getFullYear() + MONTHNUMBERSTR[date1.getMonth()] + DATESTR[date1.getDate()];
			let myTo = date2.getFullYear() + MONTHNUMBERSTR[date2.getMonth()] + DATESTR[date2.getDate()];
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/fromtolist/${userCid}/${myFrom}/${myTo}`)
				setVisitArray(resp.data);
			} catch (e) {
				console.log(e)
				setVisitArray([]);
			} 
		} else if (item === "Billing") {
			await getBalance(0);
			await getBilling(0);
		} else if (item === "Dues") {
			// shifted to Main
			//await getBalance(0);
			//await getDues();
		}
		setCurrentDateWiseSelection(item);
	}

	async function handleDateWiseSelect(item) {
		//validate start date and end date
		if (compareDate(date1, date2) > 0) return alert.error('From date later than To date');

		if (item === "Visit") {
			let myFrom = date1.getFullYear() + MONTHNUMBERSTR[date1.getMonth()] + DATESTR[date1.getDate()];
			let myTo = date2.getFullYear() + MONTHNUMBERSTR[date2.getMonth()] + DATESTR[date2.getDate()];
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/fromtolist/${userCid}/${myFrom}/${myTo}`)
				setVisitArray(resp.data);
			} catch (e) {
				console.log(e)
				setVisitArray([]);
			} 
		} else if (item === "Billing") {
			await getBalance(0);
			await getBilling(0);
		} else if (item === "Dues") {
			// shifted to Main
			//await getBalance(0);
			//await getDues();
		}
		setCurrentDateWiseSelection(item);
	}

	function DisplayPendingVisit() {
		//console.log("About to display");
		//console.log(visitArray);
		return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="DUESHDR" container align="center" alignItems="left" >
			<Grid align="left" item xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Date</Typography>
			</Grid>
			<Grid align="left" item xs={6} sm={6} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Orange}>Name</Typography>
			</Grid>
			<Grid item xs={false} sm={false} md={1} lg={1} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2Orange}>Age</Typography>
			}
			</Grid>
			<Grid item xs={false} sm={false} md={3} lg={3} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2Orange}>Email</Typography>
			}
			</Grid>
			<Grid align="center" item xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Mobile</Typography>
			</Grid>
		</Grid>
		{visitArray.map( (v, index) => {
			let myPat = patientMasterArray.find(x => x.pid === v.pid);
			if (!myPat) { console.log(`patient ${v.pid} not found`); return null; }
			let myName = (myPat) ? myPat.displayName : "";
			let d = new Date(v.nextVisitDate);
			let visitDate = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()%100}`;
			return (
			<Grid className={gClasses.noPadding} key={"DUES"+index} container align="center" alignItems="center" >
			<Grid align="left" item xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{visitDate}</Typography>
			</Grid>
			<Grid align="left" item xs={6} sm={6} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2}>{myName}</Typography>
			</Grid>
			<Grid item xs={false} sm={false} md={1} lg={1} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2}>{dispAge(myPat.age, myPat.gender)}</Typography>
			}
			</Grid>
			<Grid item xs={false} sm={false} md={3} lg={3} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2}>{dispEmail(myPat.email)}</Typography>
			}
			</Grid>
			<Grid align="center" item xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{dispMobile(myPat.mobile)}</Typography>
			</Grid>
			</Grid>
			)}
		)}
		</Box>
		)}

	async function handlePendingApptSelect(item) {
		//validate start date and end date
		setCurrentPendingApptSelection("");
		if (item === "Missed") {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/nextvisit/missed/${userCid}`)
				setVisitArray(resp.data.visit);
				//setPatientArray(resp.data.patient);
				//console.log(resp.data);
				setCurrentPendingApptSelection(item);
			} catch (e) {
				console.log(e)
				setVisitArray([]);
				//setPatientArray([]);
			} 
		} else if (item === "Upcoming") {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/nextvisit/upcoming/${userCid}`)
				setVisitArray(resp.data.visit);
				//setPatientArray(resp.data.patient);
				//console.log(resp.data);
				setCurrentPendingApptSelection(item);
			} catch (e) {
				console.log(e)
				setVisitArray([]);
				//setPatientArray([]);
			} 
		}
	}

	function DisplayFunctionHeader() {
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Dues"  match={currentSelection}  onClick={setSummaryMainSelect} />
		<DisplayFunctionItem item="Date wise"  match={currentSelection} onClick={setSummaryMainSelect} />
		<DisplayFunctionItem item="Patient wise"  match={currentSelection}  onClick={setSummaryMainSelect} />
		<DisplayFunctionItem item="PendingVisit"  match={currentSelection}  onClick={setSummaryMainSelect} />
	</Grid>	
	)}

	function DisplayPatientWiseFunctionHeader() {
		return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<DisplayFunctionItem item="Visit" match={currentPatientWiseSelection} onClick={handlePatientWiseSelect} />
			<DisplayFunctionItem item="Billing" match={currentPatientWiseSelection} onClick={handlePatientWiseSelect} />
		</Grid>	
		</Box>
		)}

	function DisplayDateWiseFunctionHeader() {
		return (
		<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid className={gClasses.noPadding} key="AllDateWise" container align="center">
			<DisplayFunctionItem item="Visit" match={currentDateWiseSelection} onClick={handleDateWiseSelect}/>
			<DisplayFunctionItem item="Billing" match={currentDateWiseSelection} onClick={handleDateWiseSelect}/>
			{/*<DisplayFunctionItem item="Due" match={currentDateWiseSelection} onClick={handleDateWiseSelect}/>*/}
		</Grid>	
		</Box>
		)}
	
		function DisplayPendingApptFunctionHeader() {
			return (
			<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
				<DisplayFunctionItem item="Missed" match={currentPendingApptSelection} onClick={handlePendingApptSelect} />
				<DisplayFunctionItem item="Upcoming" match={currentPendingApptSelection} onClick={handlePendingApptSelect} />
			</Grid>	
			</Box>
			)}
	
	function DisplayAllPatients() {
	//console.log(patientArray);
	//console.log(patientMasterArray);
	return (
	<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientBox patient={m}
		button1={
			<IconButton className={gClasses.blue} size="small" onClick={() => handleSelectPatient(m) }  >
				<VisibilityIcon  />
			</IconButton>
		}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	

	
	function setPatientFilter(myArray, filterStr) {
		//console.log(myArray);
		//console.log(filterStr);
		filterStr = filterStr.trim().toLowerCase();
		//console.log(filterStr);
		let tmpArray;
		if (myArray !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
				//console.log("Num check",filterStr);
				tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
			} else {
				tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
			}
		} else {
			tmpArray = myArray;
		}
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setPatientFilter(patientMasterArray, filterStr);
	}
	
	function handleBack() {
		setSearchText("");
		setPatientArray(patientMasterArray);
		setCurrentPatientData({});
		setCurrentPatient("");
	}
	
	
	function handleSelectDateRange() {
		if (tmpDate1.isAfter(tmpDate2) ) {
			return alert.error("From date later than Start date");
		}
		setCurrentDateWiseSelection("");
		let startDate = (tmpDate1) ? tmpDate1.toDate() : new Date();
		let endDate = (tmpDate2) ? tmpDate2.toDate() : startDate;
		console.log(tmpDate1, tmpDate2);
		setDate1(startDate);
		setDate2(endDate);
	}

	function SelectDateRange(props) {
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid key="DateSelection" container alignItems="center" >
		<Grid key={"F1"} item xs={false} sm={false} md={1} lg={2} />
		<Grid align="right" key={"F2"} item xs={4} sm={1} md={1} lg={1} >
			<Typography>From: </Typography>
		</Grid>
		<Grid key={"F3"} item xs={6} sm={3} md={2} lg={2} >
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={props.date1}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={props.handleDate1}
				closeOnSelect={true}
			/>
		</Grid>
		<Grid align="right" key={"F4"} item xs={4} sm={1} md={1} lg={1} >
			<Typography>To: </Typography>
		</Grid>
		<Grid key={"F5"} item xs={6} sm={3} md={2} lg={2} >
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={props.date2}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={props.handleDate2}
				closeOnSelect={true}
			/>
		</Grid>
		<Grid key={"F6"} item xs={4} sm={1} md={1} lg={1} >
			{/*<VsButton name="Go"	onClick={() => handleSelectDateRange()} />*/}
		</Grid>
		<Grid key={"F7"} item xs={false} sm={false} md={3} lg={3} />
	</Grid>	
	</Box>
	)}
	
	function handleDate1(d) {
		setTmpDate1(d);
		setDate1(d.toDate());
		setCurrentDateWiseSelection("");
	}

	function handleDate2(d) {
		setTmpDate2(d);
		setDate2(d.toDate());
		setCurrentDateWiseSelection("");
	}

  return (
  <div className={gClasses.webPage} align="center" key="main">
	{(sessionStorage.getItem("userType") === "Assistant") &&
		<Typography className={gClasses.indexSelection} >
			{"Only Doctors are permitted to Add / View / Edit Summary"}
		</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Assistant") &&
		<Box align="left" >
			<DisplayPageHeader headerName="Summary Report" groupName="" tournament=""/>	
			<DisplayFunctionHeader />
			{/*<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >*/}
				{(currentSelection === "Date wise") &&
					<div>
					<SelectDateRange date1={date1} date2={date2} handleDate1={handleDate1} handleDate2={handleDate2} />
					<DisplayDateWiseFunctionHeader />
					{(currentDateWiseSelection === "Visit") &&
						<DisplayPatientVisit />
					}
					{(currentDateWiseSelection === "Billing") && 
						<div>
							<DisplayProfChargeBalance balance={balance} />
							<DisplayProfCharge profChargeArray={billingArray} patientArray={patientMasterArray} />
						</div>
					}	
					{(currentDateWiseSelection === "") &&
					<div>
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					</div>
					}
					</div>
				}
				{(currentSelection === "Patient wise") &&
					<div>
					{(currentPatient === "") &&
						<div>
						<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>
						<BlankArea />
						<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
							<Grid key={"F1"} item xs={false} sm={false} md={2} lg={2} />
							<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
							<VsTextSearch label="Search Patient by name or Id" value={searchText}
								onChange={(event) => filterPatients(event.target.value)}
								onClear={(event) => filterPatients("")}
							/>
							</Grid>
							<Grid key={"F4"} item xs={8} sm={8} md={3} lg={3} >
							</Grid>
							<Grid key={"F5"} item xs={4} sm={4} md={1} lg={1} >
							</Grid>
							<Grid key={"F6"} item xs={false} sm={false} md={2} lg={2} />
						</Grid>
						<DisplayAllPatients />
						</div>
					}
					{(currentPatient !== "") &&
						<div>
							<VsButton name="Back to patient Directory" align="right" onClick={handleBack} />
							<DisplayPatientHeader patient={currentPatientData} />
							<DisplayPatientWiseFunctionHeader />
							{(currentPatientWiseSelection === "Visit") && 
								<DisplayPatientVisit />
							}
							{(currentPatientWiseSelection === "Billing") && 
								<div>
								<DisplayProfChargeBalance balance={balance} />
								<DisplayProfCharge_WO_Name profChargeArray={billingArray} patientArray={patientMasterArray} />
								</div>
							}
						</div>
					}
					</div>
				}
				{(currentSelection === "Dues") && 
				<div>
				<TotalDues />
				<DisplayPatientDues />
				</div>
				}	
				{(currentSelection === "PendingVisit") && 
				<div>
				<DisplayPendingApptFunctionHeader />
				{((currentPendingApptSelection === "Missed") || (currentPendingApptSelection === "Upcoming")) && 
					<DisplayPendingVisit />
				}
				</div>
				}	
				{/*</Box>*/}
		</Box>
	}
  </div>
  );    
}
