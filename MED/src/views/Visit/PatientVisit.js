import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from "axios";
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsTextFilter from "CustomComponents/VsTextFilter";
import VsRadioGroup from "CustomComponents/VsRadioGroup"

import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import fileDownload  from 'js-file-download';
//import fs from 'fs';
import lodashSortBy from 'lodash/sortBy';
import lodashCloneDeep from 'lodash/cloneDeep';

import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { borders } from '@material-ui/system';


// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";


// icons
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Cancel';


import {
DisplayPageHeader, BlankArea, 
} from "CustomComponents/CustomComponents.js"

import {
str1by4, str1by2, str3by4,
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, WEEKSTR,
MAGICNUMBER,
} from "views/globals.js";




import {  
	isMobile,
	downloadVisit,
	validateInteger,
	vsDialog,
	ordinalSuffix,
} from "views/functions.js";


let test=[];
let medQty=[];
const timeArray=[1, 2, 3, 4, 5, 6];
const unitArray=["Day", "Week", "Month"];

function setMedQty() {
	medQty = [];
	for(let i=0; i<=4; ++i) {
		medQty.push({num: i, str: medStr(i)});
	}
}

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	var retStr = (qtyNum >= 2) ? Math.floor(qtyNum / 2).toString() : "";
	switch (qtyNum % 2) 
	{
		case 1: retStr += str1by2; break;
		//case 2: retStr += str1by2; break;
		//case 3: retStr += str3by4; break;
	}
	return retStr;
}

function dose(dose1, dose2, dose3) {
	//dose3 = 3;
	return (medStr(dose1) + "-" + medStr(dose2) + "-" + medStr(dose3));
}

//let searchText = "";
//function setSearchText(sss) { searchText = sss;}


var userCid;
export default function PatientVisit(props) {
  
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState("Medicine");
	const [visitIndex, setVisitIndex] = useState(0);
	const [remember, setRemember] = useState(false);
	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [showCloseVisit, setShowCloseVisit] = useState(false);

	const [startLoading, setStartLoading] = useState(false);
	
	
	const [medicineArray, setMedicineArray] = useState([])
	const [noteArray, setNoteArray] = useState([]);
	const [remarkArray, setRemarkArray] = useState([]);

	const [visitArray, setVisitArray] = useState([])

	const [nextVisitTime, setNextVisitTime] = useState(2);
	const [nextVisitUnit, setNextVisitUnit] = useState(unitArray[1]);
	
	const [addEditNotes, setAddEditNotes] = useState(false);


  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");

		const checkPatient = async () => {	
			try {
				let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
				//console.log(patRec);
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
				await getPatientVisit(patRec);
			} catch {
			}			
		}
		setMedQty();
		checkPatient();
		//getAllMedicines();
		//getAllNotes();
		//getAllRemarks();
  }, []);


	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
		{(itemName !== "NEW") &&		
			<Typography onClick={() => setSelection(itemName)}>
				<span 
					className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
				{itemName}
				</span>
			</Typography>
		}
		</Grid>
		)}
	
	async function setSelection(item) {
		sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	let lastIndex = visitArray.length - 1;
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Medicine" />
		<DisplayFunctionItem item="User Note" />
		<DisplayFunctionItem item="Lab Test" />
	</Grid>	
	</Box>
	)}

	function changIndex(num) {
		num += visitIndex;
		if (num < 0) return;
		if (num === visitArray.length) return;
		setVisitIndex(num);
		setCurrentSelection("Medicine");
	}
	
	function DisplayVisitDates() {
		let myDate = "No Visit history available";
		if (visitArray.length > 0) {
			let v = visitArray[visitIndex];
			let d = new Date(v.visitDate);
			myDate = `Visit dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;	
			if (v.visitNumber === MAGICNUMBER)
					myDate += " (New)";
		}
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >
		{(visitArray.length > 0)  &&
			<IconButton color={'primary'} onClick={() => {changIndex(-1)}}  >
				<LeftIcon />
			</IconButton>
		}
		</Grid>
		<Grid key={"VISIST"} item xs={8} sm={8} md={8} lg={8} >
			<Typography className={gClasses.dateSelection} >
				{myDate}
			</Typography>
		</Grid>
		<Grid key="RIGHT1" item xs={2} sm={2} md={2} lg={2} >
		{(visitArray.length > 0)  &&
			<IconButton color={'primary'} onClick={() => {changIndex(1)}}  >
					<RightIcon />
				</IconButton>
		}
		</Grid>
	</Grid>	
	</Box>
	)}

	async function getPatientVisit(rec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/list/${userCid}/${rec.pid}`)
			setVisitArray(resp.data);
			setVisitIndex(resp.data.length - 1);
		} catch (e) {
			console.log(e)
			setVisitArray([]);
			setVisitIndex(0);
		}
	}


	function ArunMedicines() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	return (
	<div>	
	<Box borderColor="primary.main" border={1}>
	<Grid  key="MEDHDR" container justify="center" alignItems="center" >
		<Grid item xs={6} sm={6} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Orange}>Medicine</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2Orange}>Dose</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2Orange}>{isMobile() ? "Dur." : "Duration"}</Typography>
		</Grid>
	</Grid>
	{x.medicines.map( (m, index) =>
		<Grid  key={"MED"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
		<Grid item xs={6} sm={6} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2}>{m.name}</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>{dose(m.dose1, m.dose2, m.dose3)}</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>
			{m.time+((isMobile()) ? m.unit.substr(0, 1) : " "+m.unit+((m.time > 1) ? "s" : ""))}
			</Typography>
		</Grid>
		</Grid>
	)}
	</Box>
	</div>
	)}
	
	function ArunNotes() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	return (
	<div>
	<Box borderColor="primary.main" border={1}>
	{x.userNotes.map( (un, index) =>
		<Grid key={"NOTES"+x.visitNumber+"notes"+index} container justify="center" alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography className={gClasses.patientInfo2}>{un.name}</Typography>
		</Grid>
		</Grid>
	)}
	</Box>
	</div>
	)}

	function ArunRemarks() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	let lastIndex = visitArray.length - 1;
	return (
	<div>
	<Box borderColor="primary.main" border={1}>
	{x.remarks.map( (r, index) =>
		<Grid key={"REM"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography className={gClasses.patientInfo2}>{r.name}</Typography>
		</Grid>
	</Grid>
	)}
	</Box>
	</div>
	)}
	


	return (
		<div align="center" key="main">
	<CssBaseline />
	<Box align="left" >
		<DisplayVisitDates />
		<DisplayFunctionHeader />
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >`
			{(currentSelection === "Medicine") &&
				<ArunMedicines />
			}
			{(currentSelection === "User Note") &&
				<ArunNotes />
			}
			{(currentSelection === "Lab Test") &&
				<ArunRemarks  />
			}
		</Box>
	</Box>
	</div>
  );    
}
