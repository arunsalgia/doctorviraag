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

/*
import SearchIcon from '@material-ui/icons/Search';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EventNoteIcon from '@material-ui/icons/EventNote';
*/

// icons
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Cancel';


//import Switch from "@material-ui/core/Switch";


//import Link from '@material-ui/core/Link';
//import Card from "components/Card/Card.js";
//import CardBody from "components/Card/CardBody.js";
//import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

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


/*

//colours 
import { red, blue 
} from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	patientName: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	patientInfo: {
		fontSize: theme.typography.pxToRem(14),
	},
	murItem: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		paddingRight: '10px',
	},
    info: {
        color: blue[700],
    },     
    header: {
			color: '#D84315',
    }, 
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
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
		reviewDate: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: 'blue',
			marginBottom: '50px',
		},
		title: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));
*/

let infoStyle={backgroundColor: '#EEEEEE', paddingTop: '5px', paddingLeft: '5px'}

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
export default function Visit(props) {
  
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
	
	const [editMedicine, setEditMedicine] = useState({});
	
	//const [newPatient, setNewPatient] = useState(false)
	
	const [emurVisitNumber, setEmurVisitNumber] = useState(0);
	const [emurNumber, setEmurNumber] = useState(0);
	const [emurName, setEmurName] = useState("");
	
	const [emedDose1, setEmedDose1] = useState(0);
	const [emedDose2, setEmedDose2] = useState(0);
	const [emedDose3, setEmedDose3] = useState(0);
	const [emedTime,  setEmedTime] = useState(0);
	const [emedUnit,  setEmedUnit] = useState("");
	
	const [modalRegister, setModalRegister] = useState(0);

	

  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");

		const checkPatient = async () => {	
			try {
				let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
				//console.log(patRec);
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
				await getPatientVisit(patRec);
				//setSearchText(patRec.displayName);
				//setPatientArray([patRec]);

				//let ddd = await getPatientDocument(userCid, patRec.pid);
				//console.log("Docs", ddd);
				//setDocumentArray(ddd);
			} catch {
				// have come directly
				//let ppp = await getAllPatients();
				//setPatientArray(ppp);
				//setPatientMasterArray(ppp);
			}
			sessionStorage.setItem("shareData", "");		// clean up
			
		}
		setMedQty();
		checkPatient();
		getAllMedicines();
		getAllNotes();
		getAllRemarks();
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
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={0} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Medicine" />
		<DisplayFunctionItem item="User Note" />
		<DisplayFunctionItem item="Lab Test" />
		{((false) && (visitArray.length > 0) && (visitIndex === lastIndex )) &&
			<DisplayFunctionItem item="Next Review" />
		}
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
			myDate = `Visit dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;	
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
	
	async function getAllMedicines() {
		if (medicineArray.length == 0) {
			try {
				var resp = await 
				axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${userCid}`)
				setMedicineArray(resp.data);
				//console.log(resp.data);
			} catch (e) {
				console.log(e);
				setMedicineArray([]);
			}
		}	
	}	
	
	async function getAllNotes() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/note/list/${userCid}`)
			setNoteArray(resp.data);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
		
	async function getAllRemarks() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/remark/list/${userCid}`)
			setRemarkArray(resp.data);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
	
	
	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `"${emurName}" already added`;
        break;
      case 1002:
        myMsg = `All the doses cannot be 0`;
        break;
      case 1003:
        myMsg = `No Medicine selected`;
        break;
      case 2001:
        myMsg = `"${emurName}" already added`;
        break;
      case 3001:
        myMsg = `"${emurName}" already added`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }
	


	function DisplayNewVisitBtn() {
		let lastIndex = visitArray.length - 1;
		if ((visitArray.length > 0) && (visitArray[lastIndex].visitNumber === MAGICNUMBER)) return null;
		return (
			<div align="right">
				<VsButton name="Add new Visit" onClick={handleCreateNewVisit} />
				{(false) &&
				<VsButton name="Duplicate Visit" onClick={handleCopyNew} />
				}
			</div>
		)
	}
	
	function handleCreateNewVisit() {
		let x = new Date();
		
		let tmp = [{
			enabled: true,
			medicines: [],
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			remarks: [],
			userNotes: [],
			visitDate: x.toString(),
			visitNumber: MAGICNUMBER,
			appointment: '',
		}];
		
		let tmpArray = visitArray.concat(tmp);
		setVisitArray(tmpArray);
		setVisitIndex(tmpArray.length - 1);
		// also add date
		
	}
	
	function handleCopyNew() {
		let today = new Date();

		let selectedVisit = visitArray[visitIndex];
		let newVisit = lodashCloneDeep(selectedVisit);
		updateNewVisit(newVisit.medicines, newVisit.userNotes, newVisit.remarks, nextVisitTime, nextVisitUnit)
		
		newVisit.visitNumber = MAGICNUMBER;
		newVisit.visitDate = new Date().toString();
		let tmpArray = [newVisit];
		tmpArray = visitArray.concat(tmpArray);
		setVisitArray(tmpArray);
		setVisitIndex(tmpArray.length - 1);
	}
	

	async function generateVisitDocument() {
		try {
			await axios.get (`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/printdoc/${userCid}/${currentPatientData.pid}`);
			
			// now prepare for download
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/visit/downloadvisit/${userCid}/${currentPatientData.pid}`;
			let response = await axios({ method: 'get', url: myURL, responseType: 'arraybuffer',

			});
			let myFile = "patientVisit.docx";
			console.log(myFile);
			console.log(response.data);
			await fileDownload (response.data, myFile);
			//setStepNo(3);
			console.log("download over");

			alert.success("Successfully generated visit document");
		} catch (e) {
			console.log(e)
			alert.error("Error generating visit document");
		}
		//setShowProgress(false);
	}
	
	async function closeVisitDocument() {
		try {
			let resp = await axios.get (`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/close/${userCid}/${currentPatientData.pid}`);
			let tmpArray = lodashCloneDeep(visitArray);
			if (resp.data.visitNumber < 0) {
				tmpArray.pop();
				setVisitIndex(tmpArray.length - 1);
				setVisitArray(tmpArray);
			} else {
				let lastIndex = tmpArray.length - 1;
				tmpArray[lastIndex].visitNumber = resp.data.visitNumber;
				setVisitArray(tmpArray);
			}
		} catch (e) {
			console.log(e)
			alert.error("Error closing visit");
		}
		//setShowProgress(false);
	}

	function updateNewVisit(med, note, rem, nextime, nextunit) {	
		let newVisit = {
			pid: currentPatientData.pid, displayName: currentPatientData.displayName,
			medicine: med, userNote: note, remark: rem, nextTime: nextime, nextUnit: nextunit
		};
		//console.log(newVisit);
		let newVisitInfo = encodeURIComponent(JSON.stringify(newVisit));
		axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/visit/update/${userCid}/${newVisitInfo}`);
		let tmpArray = lodashCloneDeep(visitArray);
		tmpArray[tmpArray.length-1].visitDate = new Date().toString();
		setVisitArray(tmpArray);
		setShowCloseVisit(true);
	}
	
	async function printVisit() {	
		try {
			await downloadVisit(userCid, currentPatientData.pid);
			alert.success("Successfully downloaded visit document");
		} catch (e) {
			alert.error("Error downloading visit document");
		}
	}

	

	
	//Arun Salgia new add / edit / delete Notes
	
	function handleAddUserNotes() {
		setEmurName("");
		setIsDrawerOpened("ADDNOTE");
		// set filter
		setFilterItem("NOT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);

	}
	
	function handleEditUserNotes(vNumber, notesNumber) {
		let tmp = visitArray.find( x => x.visitNumber === vNumber);
		setEmurVisitNumber(vNumber);
		setEmurNumber(notesNumber);
		setEmurName(tmp.userNotes[notesNumber].name);
		setModalRegister(0);
		setIsDrawerOpened("EDITNOTE");
		
		setFilterItem("NOT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
	}
	
	function updateUserNotes() {
		updateNoteToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		let lastIndex = visitArray.length - 1;
		if (isDrawerOpened === "ADDNOTE") {
			if (tmp[lastIndex].userNotes.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(2001);
				return;
			} 
			tmp[lastIndex].userNotes.push({name: ""});
			index = tmp[lastIndex].userNotes.length - 1;
		} else {
			if (tmp[lastIndex].userNotes[index].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[lastIndex].userNotes.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(2001);
					return;
				} 
			}
		}
		setIsDrawerOpened("");
		
		tmp[lastIndex].userNotes[index].name = emurName;
		console.log(tmp[lastIndex].userNotes);
		updateNewVisit(tmp[lastIndex].medicines, tmp[lastIndex].userNotes, tmp[lastIndex].remarks, nextVisitTime, nextVisitUnit)
		setVisitArray(tmp);
	}
	
	function handleDeleteNotes(vNumber, mNumber) {
		let lastIndex = visitArray.length - 1;
		if (vNumber === MAGICNUMBER) {
			vsDialog("Delete User Note", `Are you sure you want to delete note ${visitArray[lastIndex].userNotes[mNumber].name}?`,
				{label: "Yes", onClick: () => handleDeleteNotesConfirm(mNumber) },
				{label: "No" }
			);
		}
	}
	
	function handleDeleteNotesConfirm(mNumber) {
		let lastIndex = visitArray.length - 1;
		var tmp = [].concat(visitArray);
		tmp[lastIndex].userNotes = tmp[lastIndex].userNotes.filter(function(value, index, arr){ 
			return index !== mNumber;
		});
		setVisitArray(tmp);
		updateNewVisit(tmp[lastIndex].medicines, tmp[lastIndex].userNotes, tmp[lastIndex].remarks, nextVisitTime, nextVisitUnit)
	}
	
	
	function handleAddNewRemark() {
		setEmurName("");
		setModalRegister(0);
		setIsDrawerOpened("ADDREM");
		
		setFilterItem("REM");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
	}
	
	function handleEditRemark(vNumber, remarkNumber) {
		let tmp = visitArray.find( x => x.visitNumber === vNumber);

		setEmurVisitNumber(vNumber);
		setEmurNumber(remarkNumber);
		setEmurName(tmp.remarks[remarkNumber].name)
		setModalRegister(0);
		setIsDrawerOpened("EDITREM");
		
		setFilterItem("REM");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
	}
	
	function updateRemark() {
		updateRemarkToDatabase(emurName);
		
		let tmp = [].concat(visitArray);
		let index = emurNumber;
		if (isDrawerOpened === "ADDREM") {
			if (tmp[visitIndex].remarks.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(3001);
				return;
			}
			tmp[visitIndex].remarks.push({name: ""});
			index = tmp[visitIndex].remarks.length - 1;
		} else {
			if (tmp[visitIndex].remarks[index].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[visitIndex].remarks.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(3001);
					return;
				}
			}
		}
		setIsDrawerOpened("");
		
		tmp[visitIndex].remarks[index].name = emurName;
		setVisitArray(tmp);
		updateNewVisit(tmp[visitIndex].medicines, tmp[visitIndex].userNotes, tmp[visitIndex].remarks, nextVisitTime, nextVisitUnit)
	}
	
	function handleDeleteRemark(vNumber, mNumber) {
		if (vNumber !== MAGICNUMBER) return;
		let lastIndex = visitArray.length - 1;
		let item = visitArray[lastIndex].remarks[mNumber].name;
		vsDialog("Delete Examination Advice", `Are you sure you want to delete Examination advice of ${item}?`,
		{label: "Yes", onClick: () => handleDeleteRemarkConfirm(mNumber) },
		{label: "No" }
		);
	}
	
	function handleDeleteRemarkConfirm(mNumber) {
		//console.log("handleDeleteMedicine Remark "+mNumber);
		let lastIndex = visitArray.length - 1;
		var tmp = [].concat(visitArray);
		tmp[lastIndex].remarks = tmp[lastIndex].remarks.filter(function(value, index, arr){ 
			return index !== mNumber;
		});
		setVisitArray(tmp);
		updateNewVisit(tmp[lastIndex].medicines, tmp[lastIndex].userNotes, tmp[lastIndex].remarks, nextVisitTime, nextVisitUnit);
	}
	

	
	function handleAddNewMedicine() {
		setEmurNumber(0);
		setEmurName("");
		setEmedDose1(2);
		setEmedDose2(0);
		setEmedDose3(2);
		setEmedTime(2);
		setEmedUnit(unitArray[1]);
		setModalRegister(0);
		// for filter
		setFilterItem("MED");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
		
		setIsDrawerOpened("ADDMED");
	}
	
	
	function handleEditMedicine(vNumber, mNumber) {
		//await getAllMedicines();
		console.log("handleEditMedicine "+vNumber+" Medicine "+mNumber);
		let lastIndex = visitArray.length - 1;
		let tmp = visitArray[lastIndex];
		setEditMedicine(tmp.medicines[mNumber]);
		console.log(tmp.medicines[mNumber]);
		
		setEmurVisitNumber(vNumber);
		setEmurNumber(mNumber);
		setEmurName(tmp.medicines[mNumber].name)
		setEmedDose1(tmp.medicines[mNumber].dose1);
		setEmedDose2(tmp.medicines[mNumber].dose2);
		setEmedDose3(tmp.medicines[mNumber].dose3);
		setEmedTime (tmp.medicines[mNumber].time);
		setEmedUnit (tmp.medicines[mNumber].unit);
		let ttt = medicineArray.find(x => x.name == tmp.medicines[mNumber].name);
		//setStandard(ttt != null);
		
				// for filter
		setFilterItem("MED");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);		
		setModalRegister(0);
		
		setIsDrawerOpened("EDITMED");
	}

	function updateMedicineToDatabase(medName) {
		if (!remember) return;
		let tmp = medicineArray.find(x => x.name.toLowerCase() === medName.toLowerCase());
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${userCid}/${medName}`;
				axios.get(myUrl);
				let tmpArray = [{name: medName}].concat(medicineArray);
				setMedicineArray(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}

	function handleVsMedicineDelete(med) {
		let medName = med.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${userCid}/${medName}`;
			axios.get(myUrl);
			setMedicineArray(medicineArray.filter(x => x.name !== medName))
			setFilterItemArray(filterItemArray.filter(x => x.name !== medName));
		} catch (e) {
			console.log(e);
		}
	}

	
	function updateNoteToDatabase(noteName) {
		if (!remember) return;
		
		let tmp = noteArray.find(x => x.name.toLowerCase() === noteName.toLowerCase())
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/note/add/${userCid}/${noteName}`;
				axios.get(myUrl);
				let tmpArray = [{name: noteName}].concat(noteArray);
				setNoteArray(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}
	
		
	function handleVsNoteDelete(note) {
		let noteName = note.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/note/delete/${userCid}/${noteName}`;
			axios.get(myUrl);
			setNoteArray(noteArray.filter(x => x.name !== noteName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== noteName));
		} catch (e) {
			console.log(e);
		}
	}
	
	
	function updateRemarkToDatabase(remarkName) {
		if (!remember) return;
		let tmp = remarkArray.find(x => x.name.toLowerCase() === remarkName.toLowerCase());
		if (!tmp) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/remark/add/${userCid}/${remarkName}`;
				axios.get(myUrl);
				let tmpArray = [{name: remarkName}].concat(remarkArray);
				setRemarkArray(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}
		}
	}
	
	function handleVsRemarkDelete(remark) {
		let remarkName = remark.name;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/remark/delete/${userCid}/${remarkName}`;
			axios.get(myUrl);
			setRemarkArray(remarkArray.filter(x => x.name !== remarkName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== remarkName))
		} catch (e) {
			console.log(e);
		}
	}
	
	function handleMedicineUpdate() {
		if ((emedDose1+emedDose2+emedDose3) === 0) {
				setModalRegister(1002);
				return;
		}
		if (emurName == "") {
			setModalRegister(1003);
			return;
		}
		
		updateMedicineToDatabase(emurName);
		let tmp = [].concat(visitArray);
		let lastIndex = visitArray.length - 1;
		let index = emurNumber;
		//console.log("indx", index);
		if (isDrawerOpened === "ADDMED") {
			//console.log(emurName);
			if (tmp[lastIndex].medicines.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				// duplicate medicine 
				setModalRegister(1001);
				return;
			}
			tmp[lastIndex].medicines.push({name: "", dose1: 0, dose2: 0, dose3: 0, unit: "", time: 0});
			index = tmp[lastIndex].medicines.length - 1;
		} else {
			console.log("in edit");
			if (tmp[lastIndex].medicines[index].name.toLowerCase() !== emurName.toLowerCase()) {
				//console.log("in edit different");
				if (tmp[lastIndex].medicines.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					// duplicate medicine 
					//console.log("in edit error");
					setModalRegister(1001);
					return;
				}
			}
		}

		setIsDrawerOpened("");		

		tmp[lastIndex].medicines[index].name = emurName;
		tmp[lastIndex].medicines[index].dose1 = emedDose1;
		tmp[lastIndex].medicines[index].dose2 = emedDose2;
		tmp[lastIndex].medicines[index].dose3 = emedDose3;
		tmp[lastIndex].medicines[index].unit = emedUnit;
		tmp[lastIndex].medicines[index].time = emedTime;
		setVisitArray(tmp);
		updateNewVisit(tmp[lastIndex].medicines, tmp[lastIndex].userNotes, tmp[lastIndex].remarks, nextVisitTime, nextVisitUnit);
	}
	
	function handleDeleteMedicine(vNumber, mNumber) {
		if (vNumber !== MAGICNUMBER) return;
		let lastIndex = visitArray.length - 1;
		vsDialog("Delete Medicine", `Are you sure you want to delete medicine ${visitArray[lastIndex].medicines[mNumber].name}?`,
		{label: "Yes", onClick: () => handleDeleteMedicineConfirm(mNumber) },
		{label: "No" }
		);
	}
	
	function handleDeleteMedicineConfirm(mNumber) {
		//console.log("handleDeleteMedicine Medicine "+mNumber);
		let lastIndex = visitArray.length - 1;
		var tmp = [].concat(visitArray);
		tmp[lastIndex].medicines = tmp[lastIndex].medicines.filter(function(value, index, arr){ 
			return index != mNumber;
		});
		updateNewVisit(tmp[lastIndex].medicines, tmp[lastIndex].userNotes, tmp[lastIndex].remarks, nextVisitTime, nextVisitUnit);
		setVisitArray(tmp);
		console.log(tmp[lastIndex].medicines);
	}
	
	// handle visits

	function ArunMedicines() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	//let lastIndex = visitArray.length - 1;
	return (
	<div style={infoStyle}>	
	{(x.visitNumber === MAGICNUMBER) && 
		<VsButton name="Add new Medicine" align="left" onClick={handleAddNewMedicine} />
	}	
	<Box borderColor="primary.main" border={0}>
	<Grid  key="MEDHDR" container justify="center" alignItems="center" >
		<Grid item xs={6} sm={6} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Orange}>Medicine</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Orange}>Dose</Typography>
		</Grid>
		<Grid item xs={1} sm={1} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Orange}>{isMobile() ? "Dur." : "Duration"}</Typography>
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
	</Grid>
	{x.medicines.map( (m, index) =>
		<Grid  key={"MED"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
		<Grid item xs={6} sm={6} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2}>{m.name}</Typography>
		</Grid>
		<Grid item xs={3} sm={3} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{dose(m.dose1, m.dose2, m.dose3)}</Typography>
		</Grid>
		<Grid item xs={1} sm={1} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>
			{m.time+((isMobile()) ? m.unit.substr(0, 1) : " "+m.unit+((m.time > 1) ? "s" : ""))}
			</Typography>
		</Grid>
		<Grid item xs={false} sm={false} md={false} lg={1} />
		<Grid item xs={2} sm={2} md={2} lg={1} >
			{(x.visitNumber === MAGICNUMBER) &&
				<EditIcon color="primary" size="small" onClick={() => { handleEditMedicine(x.visitNumber, index)}} />
			}
			{(x.visitNumber === MAGICNUMBER) &&
				<DeleteIcon color="secondary" size="small" onClick={() => { handleDeleteMedicine(x.visitNumber, index)}} />
			}
		</Grid>
		</Grid>
	)}
	</Box>
	</div>
	)}
	
	function ArunNotes() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	//let lastIndex = visitArray.length - 1;
	return (
	<div style={infoStyle}>
	{(x.visitNumber === MAGICNUMBER) && 
		<VsButton name="Add new User Note" align="left"  onClick={handleAddUserNotes} />
	}
	<Box borderColor="primary.main" border={0}>
	{x.userNotes.map( (un, index) =>
		<Grid key={"NOTES"+x.visitNumber+"notes"+index} container justify="center" alignItems="center" >
		<Grid item xs={10} sm={10} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{un.name}</Typography>
		</Grid>
		<Grid item xs={false} sm={false} md={false} lg={1} >
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={1} >
		{(x.visitNumber === MAGICNUMBER) &&
			<EditIcon color="primary" size="small" onClick={() => { handleEditUserNotes(x.visitNumber, index)}} />
		}
		{(x.visitNumber === MAGICNUMBER) &&
			<DeleteIcon color="secondary" size="small" onClick={() => { handleDeleteNotes(x.visitNumber, index)}} />
		}
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
	<div style={infoStyle}>
	{(x.visitNumber === MAGICNUMBER) && 
		<VsButton name="Add new Lab Test" align="left" onClick={handleAddNewRemark} />
	}
	<Box borderColor="primary.main" border={0}>
	{x.remarks.map( (r, index) =>
		<Grid key={"REM"+x.visitNumber+"-"+index} container justify="center" alignItems="center" >
		<Grid item xs={10} sm={10} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{r.name}</Typography>
		</Grid>
		<Grid item xs={false} sm={false} md={false} lg={1} >
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={1} >
			{(x.visitNumber === MAGICNUMBER) &&
				<EditIcon color="primary" size="small" onClick={() => { handleEditRemark(x.visitNumber, index)}}/ >
			}
			{(x.visitNumber === MAGICNUMBER) &&
				<DeleteIcon color="secondary" size="small" onClick={() => { handleDeleteRemark(x.visitNumber, index)}} />
			}
		</Grid>
	</Grid>
	)}
	</Box>
	</div>
	)}
	
	function updateUnit(value) {
		setNextVisitUnit(value);
		let lastIndex = visitArray.length - 1;
		let myVisit = visitArray[lastIndex];
		updateNewVisit(myVisit.medicines, myVisit.userNotes, myVisit.remarks, nextVisitTime, value)
	}
	
	function updateTime(value) {
		setNextVisitTime(value);
		let lastIndex = visitArray.length - 1;
		let myVisit = visitArray[lastIndex];
		updateNewVisit(myVisit.medicines, myVisit.userNotes, myVisit.remarks, value, nextVisitUnit);
	}

	function ArunFollowup() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	if (x.visitNumber !== MAGICNUMBER) return null;
	let d = new Date();
	//console.log(d, nextVisitUnit, nextVisitTime )
	switch (nextVisitUnit) {
		case 'Day':
			d.setDate(d.getDate()+nextVisitTime);
			break;
		case 'Week':
			d.setDate(d.getDate()+(7*nextVisitTime));
			break;	
		case 'Month':
			d.setMonth(d.getMonth()+nextVisitTime);
			break;	
		case 'Year':
			d.setYear(d.getFullYear()+nextVisitTime);
			break;			
	}
	//console.log(d);
	let reviewDate = DATESTR[d.getDate()] + "/" + MONTHNUMBERSTR[d.getMonth()] + "/" + d.getFullYear().toString().slice(-2);
	reviewDate += " (" + WEEKSTR[d.getDay()] + ")";
	return (
		<div align="left">
		<Typography className={gClasses.title}>{"Next visit scheduled on "+reviewDate}</Typography>
		<Grid key={"UNIT"} container>
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<br />
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={2} lg={2} >
		<Typography className={gClasses.title}>Select Unit: </Typography>
		</Grid>
		<Grid item xs={12} sm={12} md={10} lg={10} >		
		<VsRadioGroup value={nextVisitUnit} onChange={() => {updateUnit(event.target.value); }}
			radioList={unitArray} />
		</Grid>
		<Grid item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={12} sm={12} md={2} lg={2} >
		<Typography className={gClasses.title}>Select Time: </Typography>
		</Grid>
		<Grid item xs={12} sm={12} md={10} lg={10} >	
			<VsRadioGroup value={nextVisitTime} onChange={() => {updateTime(Number(event.target.value)); }}
				radioList={timeArray} />
		</Grid>
		</Grid>
		</div>
	)}
	
	
	function ArunVisitUpdateButton() {
	if (visitArray.length === 0) return null;
	let x = visitArray[visitIndex];
	if  (x.visitNumber !== MAGICNUMBER) return null;

	return (
		<div align="right">
			<VsButton name="Close Visit"  onClick={closeVisitDocument} />
			<VsButton name="Print Visit"  onClick={generateVisitDocument} />
			{/*<VsButton name="Download Visit Document"  onClick={printVisit} />*/}
		</div>
	);
	}

	function setEmurNameWithFilter(itemName) {
		let txt = itemName;
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (itemName !== "") {
			if (filterItem.substr(0,3) === "MED")
				tmpArray = medicineArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
			else if (filterItem.substr(0,3) === "NOT")
				tmpArray = noteArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
			else if (filterItem.substr(0,3) === "REM")
				tmpArray = remarkArray.filter( x => x.name.toLowerCase().includes(txt.toLowerCase()) );
		} 
		//console.log(tmpArray);
		setFilterItemArray(tmpArray);
	}
	
	function DisplayFilterArray() {
	return (
		<div align="center" >
			{filterItemArray.map( (item, index) =>
				<Typography key={"ITEM"+index} className={gClasses.blue} type="button" onClick={() => { setFilterItemArray([]); setEmurName(item.name); }} >
				{item.name}
				</Typography>
			)}
		</div>	
	)}
	
	function handleVsSelect(item) {
		//console.log(item);
		//alert.info(`To select item ${item.name}`)
		setFilterItemArray([]); 
		setEmurName(item.name);
	}
	

	return (
	<div>
	{(sessionStorage.getItem("userType") === "Assistant") &&
		<Typography className={gClasses.indexSelection} >
			{"Only Doctors are permitted to Add / View / Edit patient visits"}
		</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Assistant") &&
		<div align="center" key="main">
		<CssBaseline />
		{(currentPatient !== "") &&
			<Box align="left" >
				<DisplayVisitDates />
				<DisplayFunctionHeader />
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={0} >
					<DisplayNewVisitBtn />
					<ArunVisitUpdateButton />		{/* only for visitNumber MAGICNUMBER i.e. new visit */}
					{(currentSelection === "Medicine") &&
						<ArunMedicines />
					}
					{(currentSelection === "User Note") &&
						<ArunNotes />
					}
					{(currentSelection === "Lab Test") &&
						<ArunRemarks  />
					}
					{(currentSelection === "Next Review") &&
						<ArunFollowup />
					}
				</Box>
			</Box>
		}
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{((isDrawerOpened === "ADDMED") || (isDrawerOpened === "EDITMED")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleMedicineUpdate}>
				<Typography align="center" className={gClasses.functionSelected}>
					{((isDrawerOpened === "ADDMED") ? "New Medicine" : "Edit Medicine")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				<VsTextFilter type="text" label="Medicine" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={(event) => setEmurNameWithFilter("")}
				/>	
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsMedicineDelete} />
				<BlankArea />
				<Grid key="editmed" container justify="center" alignItems="center">
				<Grid align="right" className={gClasses.vgSpacing} item xs={4} sm={1} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>Dose1:</Typography>
				</Grid>
				<Grid className={gClasses.vgSpacing} item xs={5} sm={2} md={2} lg={2} >
					<Select labelId='dose1' id='dose1' name="dose1" 
						required fullWidth label="Dose 1" 
						value={emedDose1}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose1(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item align="right" className={gClasses.vgSpacing}  xs={4} sm={1} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>Dose2:</Typography>
				</Grid>
				<Grid item className={gClasses.vgSpacing}  xs={5} sm={2} md={2} lg={2} >
					<Select labelId='dose2' id='dose2' name="dose2" 
						required fullWidth label="Dose 2" 
						value={emedDose2}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose2(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
				<Grid item align="right"  className={gClasses.vgSpacing}  xs={4} sm={1} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>Dose3:</Typography>
				</Grid>
				<Grid item className={gClasses.vgSpacing}  xs={5} sm={2} md={2} lg={2} >
					<Select labelId='dose3' id='dose3' name="dose3" 
						required fullWidth label="Dose 3" 
						value={emedDose3}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => setEmedDose3(event.target.value)}
						>
					{medQty.map(x =>	<MenuItem key={x.str} value={x.num}>{x.str}</MenuItem>)}
					</Select>
				</Grid>
				</Grid>
				<Grid key="editdur" container justify="center" alignItems="center" >
				<Grid item className={gClasses.vgSpacing}  xs={2} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>for</Typography>
				</Grid>
				<Grid className={gClasses.vgSpacing} item xs={3} sm={2} md={2} lg={2} >
				<Select labelId='time' id='time' name="time"
					required fullWidth label="Time" 
					value={emedTime}
					placeholder="Arun"
					inputProps={{
						name: 'Group',
						id: 'filled-age-native-simple',
					}}
					onChange={(event) => setEmedTime(event.target.value)}
					>
				{timeArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
				</Grid>
				<Grid className={gClasses.vgSpacing}  item xs={4} sm={2} md={2} lg={2} >
				<Select labelId='unit' id='unit' name="unit" 
					required fullWidth label="Unit" 
					value={emedUnit}
					inputProps={{
						name: 'Group',
						id: 'filled-age-native-simple',
					}}
					onChange={(event) => setEmedUnit(event.target.value)}
					>
				{unitArray.map(x =>	<MenuItem key={x} value={x}>{x}</MenuItem>)}
				</Select>
				</Grid>
				</Grid>
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type="submit" 
				name= {(isDrawerOpened === "ADDMED") ? "Add" : "Update"}
				/>
			</ValidatorForm>
		}
		{((isDrawerOpened === "ADDNOTE") || (isDrawerOpened === "EDITNOTE")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updateUserNotes}>
				<Typography align="center" className={gClasses.functionSelected}>
					{((isDrawerOpened === "ADDNOTE") ? "New Note" : "Edit Note")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				{/*<TextValidator required fullWidth color="primary"
					id="newName" label="Note" name="newName"
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					value={emurName}
				/>*/}
				<VsTextFilter type="text" label="Note" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={(event) => setEmurNameWithFilter("")}
				/>				
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsNoteDelete} />
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type ="submit" name= {(isDrawerOpened === "ADDNOTE") ? "Add" : "Update"} />
			</ValidatorForm>
		}
		{((isDrawerOpened === "ADDREM") || (isDrawerOpened === "EDITREM")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updateRemark} >
				<Typography align="center" className={gClasses.functionSelected}>
					{((isDrawerOpened === "ADDREM") ? "New Remark" : "Edit Remark")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				{/*<TextValidator required fullWidth color="primary"
					id="newName" label="Remark" name="newName"
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					value={emurName}
				/>*/}
				<VsTextFilter type="text" label="Remark" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={(event) => setEmurNameWithFilter("")}
				/>			
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsRemarkDelete} />
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type="submit" name= {(isDrawerOpened === "ADDREM") ? "Add" : "Update"}
				/>
			</ValidatorForm>
		}
		</Box>
		</Drawer>	
		</div>
	}
	</div>
  );    
}
