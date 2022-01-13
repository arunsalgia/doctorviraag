import React, { useState, useContext, useEffect } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsTextFilter from "CustomComponents/VsTextFilter";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import lodashSortBy from "lodash/sortBy"
import lodashCloneDeep  from "lodash/cloneDeep";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";

// icons
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';



// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
//import Card from "components/Card/Card.js";
//import CardBody from "components/Card/CardBody.js";
//import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {
	BlankArea,
} from "CustomComponents/CustomComponents.js"

import {
	DATESTR, MONTHNUMBERSTR, MONTHSTR,
	MAGICNUMBER,
} from "views/globals.js";

// icons
import DeleteIcon from '@material-ui/icons/Cancel';



//colours 
import { red, blue 
} from '@material-ui/core/colors';

import { 
	vsDialog,
} from "views/functions.js";

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
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
			color: '#D84315',
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
		title: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		selectedAccordian: {
			//backgroundColor: '#B2EBF2',
		},
		normalAccordian: {
			backgroundColor: '#FFE0B2',
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));


let searchText = "";
function setSearchText(sss) { searchText = sss;}


var userCid;
export default function Visit(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState("Symptom");
	const [remember, setRemember] = useState(false);
	
	const [investigationIndex, setInvestigationIndex] = useState(0);
	const [investigationArray, setInvestigationArray] = useState([])
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	//const [isListDrawer, setIsListDrawer] = useState("");

	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [symptomArray, setSymptomArray] = useState([]);
	const [diagnosisArray, setDiagnosisArray] = useState([]);

	const [diagnosisDbArray, setDiagnosisDbArray] = useState([]);
	const [symptomDbArray, setSymptomDbArray] = useState([]);
	
	//const [emurVisitNumber, setEmurIndex] = useState(0);
	//const [emurNumber, setEmurNumber] = useState(0);
	const [emurName, setEmurName] = useState("");

	
	//const [registerStatus, setRegisterStatus] = useState(0);
	//const [registerError, setRegisterError] = useState("");
	const [modalRegister, setModalRegister] = useState(0);
	//const [visitRegister, setVisitRegister] = useState(0);
	//const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  //const [page, setPage] = useState(0);
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");

		const checkPatient = async () => {	
			try {
				let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
				setCurrentPatientData(patRec);
				setCurrentPatient(patRec.displayName);
				await getPatientInvestigation(patRec);
			} catch {

			}
			sessionStorage.setItem("shareData", "");		// clean up
		}
		checkPatient();
		getAllDiagnosis();
		getAllSymptom();
  }, []);

	function changeIndex(num) {
		num += investigationIndex;
		if (num < 0) return;
		if (num === investigationArray.length) return;
		setInvestigationIndex(num);
		setCurrentSelection("Symptom");
	}
	
	function DisplayInvestigationDates() {
		let myDate = "No Investigation history available";
		if (investigationArray.length > 0) {	
			let v = investigationArray[investigationIndex];
			let d = new Date(v.investigationDate);
			myDate = `Investigation dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			if (v.investigationNumber === MAGICNUMBER) {
					myDate += " (New)";
			}
		}
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >	
		{(investigationArray.length > 0) &&
			<IconButton color={'primary'} onClick={() => {changeIndex(-1)}}  >
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
		{(investigationArray.length > 0) &&
			<IconButton color={'primary'} onClick={() => {changeIndex(1)}}  >
				<RightIcon />
			</IconButton>
		}
		</Grid>
	</Grid>	
	</Box>
	)}

	async function getPatientInvestigation(rec) {
		let myArray = [];
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/investigation/list/${userCid}/${rec.pid}`)
			myArray = resp.data;
			setInvestigationArray(myArray);
			setInvestigationIndex(myArray.length - 1);
			} catch (e) {
			console.log(e)
			setInvestigationArray([]);
			setInvestigationIndex(0);
		}
		setCurrentSelection("Symptom");
	}
	
	function handleCreateNewInvestigation() {
		//
		let tmp = {
			pid: currentPatientData.pid,
			investigationNumber: MAGICNUMBER,
			investigationDate: new Date(),
			symptom: [],
			diagnosis: []
		};
		//let myArray = [].concat(investigationArray);
		let myArray = investigationArray.concat(tmp);
		setInvestigationArray(myArray);
		setInvestigationIndex(myArray.length-1);
		setCurrentSelection("Symptom");
	}
	
	async function handleCloseNewInvestigation() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/investigation/close/${userCid}/${currentPatientData.pid}`)
			let tmpArray = lodashCloneDeep(investigationArray);
			if (resp.data.investigationNumber < 0) {
				//console.log("Blank visit");
				tmpArray.pop();
				//console.log(tmpArray);
				setInvestigationIndex(tmpArray.length - 1);
				setInvestigationArray(tmpArray);	
			} else {
				let lastIndex = tmpArray.length - 1;
				tmpArray[lastIndex].investigationNumber = resp.data.investigationNumber;
				console.log(tmpArray[lastIndex].investigationNumber)
				setInvestigationArray(tmpArray);				
			}
		} catch(e) {
			console.log(e);
			console.log("Error close visit");
		}
	}
	
	function updateInvestigation(sArray, dArray) {
		//console.log(sArray);
		//console.log(dArray);
		let tmp = JSON.stringify({symptom: sArray, diagnosis: dArray});
		let tmp1 = encodeURIComponent(tmp);
		axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/investigation/update/${userCid}/${currentPatientData.pid}/${tmp1}`)
	}
	
	async function getAllDiagnosis() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/diagnosis/list/${userCid}`)
			setDiagnosisDbArray(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
	
	async function getAllSymptom() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/symptom/list/${userCid}`)
			setSymptomDbArray(resp.data);
		} catch (e) {
			console.log(e);
		}
	}	
		

	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >	
		<Typography onClick={() => setSelection(itemName)}>
			<span 
				className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
		)}
	
	async function setSelection(item) {
		//sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Symptom" />
		<DisplayFunctionItem item="Diagnosis" />
	</Grid>	
	</Box>
	)}



	function setVisitError(errcode) {
    console.log(errcode);
    let myMsg;
		let iserr = true;
    switch (errcode) {
      case 0:
        myMsg = "";
				iserr = false;
        break;
      case 1001:
        myMsg = `No medicines specified`;
        break;
      case 1011:
        myMsg = `Blank medicine name specified`;
        break;
      case 1012:
        myMsg = `Duplicate medicines specified`;
        break;
      case 1013:
        myMsg = `All the 3 doses specifed as 0`;
        break;
			case 200:
				myMsg = `Successfully updated current visit`;
				iserr = false;
				break;
			case 201:
				myMsg = `Error updating current visit`;
				//iserr = false;
				break;
      default:
          myMsg = "Unknown Error";
          break;
    }
		setRegisterError(myMsg);
		openModal("ERROR");
    //return(
		//   <div>
    //    <Typography className={(iserr == false) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
     // </div>
    //)
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
        myMsg = `Selected Symptom already added`;
        break;
      case 2001:
        myMsg = `Selected Diagnosis already added`;
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
	
	function handleAddDiagnosis() {
		setEmurName("");
		setIsDrawerOpened("ADDDIAG");
		// set filter
		setFilterItem("DIA");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
	}
	
	function handleEditDiagnosis(mNumber) {
		setEmurNumber(mNumber);
		setEmurName(diagnosisArray[mNumber].name);
		setModalRegister(0);
		setIsDrawerOpened("EDITDIAG");
		
		setFilterItem("DIA");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);
	}
	
	function updateDiagnosis() {
		//console.log("Hi in update diag", emurName);
		updateDiagnosisToDatabase(emurName);
		let myInvestitgation = [].concat(investigationArray);
	//	console.log(arun)
		//let myIndex = investigationArray.length - 1;
		if (isDrawerOpened === "ADDDIAG") {
			let test = myInvestitgation[investigationIndex].diagnosis.find(x => x.name === emurName);
			if (!test) {
				// not present. Thus add it
				let tmpArray = myInvestitgation[investigationIndex].diagnosis.concat([{name: emurName}]);
				myInvestitgation[investigationIndex].diagnosis = tmpArray;
				setInvestigationArray(myInvestitgation);
				updateInvestigation(investigationArray[investigationIndex].symptom, tmpArray);
				setIsDrawerOpened("");
			} else {
				setModalRegister(2001);
			}
		}
		
	}
	
	function handleDeleteDiagnosis(itemName) {
		//console.log("handleDeleteSymptom "+vNumber+" Notes "+mNumber);
		vsDialog("Delete Diagnosis", `Are you sure you want to delete diagnosis ${itemName}?`,
			{label: "Yes", onClick: () => handleDeleteDiagnosisConfirm(itemName) },
			{label: "No" }
		);
	}
	
	function handleDeleteDiagnosisConfirm(itemName) {
		let tmpArray = [].concat(investigationArray);
		//let myIndex = investigationArray.length - 1;
		tmpArray[investigationIndex].diagnosis = tmpArray[investigationIndex].diagnosis.filter(x => x.name !== itemName);
		setInvestigationArray(tmpArray);
		updateInvestigation(tmpArray[investigationIndex].symptom, tmpArray[investigationIndex].diagnosis);
	}
	

	function handleAddNewSymptom() {
		setEmurName("");
		setModalRegister(0);
		// for filter
		setFilterItem("SYM");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
		setModalRegister(0);

		setIsDrawerOpened("ADDSYM");
	}
	
	function handleEditSymptom(mNumber) {
		setEmurNumber(mNumber);
		setEmurName(symptomArray[mNumber].name)

				// for filter
		setFilterItem("SYM");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);		
		setModalRegister(0);
		
		setIsDrawerOpened("EDITSYM");
	}

	async function updateSymptomToDatabase(myName) {
		if (!remember) return;
		let tmp = symptomDbArray.find(x => x.name.toLowerCase() === myName.toLowerCase())
		if (!tmp) {
			let myEncodedName = encodeURIComponent(myName);
			try {
				axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/symptom/update/${userCid}/${myEncodedName}`)
				let tmpArray = [{name: myName}].concat(symptomDbArray);
				setSymptomDbArray(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}	
		}
	}
	
	function handleVsSymptomDelete(sym) {
		let myName = sym.name;
		let myEncodedName = encodeURIComponent(myName);
		try {
			axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/symptom/delete/${userCid}/${myEncodedName}`)
			setSymptomDbArray(symptomDbArray.filter(x => x.name !== myName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== myName));
		} catch (e) {
			console.log(e);
		}		
	}
	
	function updateDiagnosisToDatabase(myName) {
		if (!remember) return;	
		let tmp = diagnosisDbArray.find(x => x.name.toLowerCase() === myName.toLowerCase())
		let myEncodedName = encodeURIComponent(myName);
		try {
			axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/diagnosis/update/${userCid}/${myEncodedName}`)
			let tmpArray = [{name: myName}].concat(diagnosisDbArray);
			setDiagnosisDbArray(lodashSortBy(tmpArray, 'name'));
		} catch (e) {
			console.log(e);
		}		
	}

	function handleVsDiagnosisDelete(dia) {
		let myName = dia.name;
		let myEncodedName = encodeURIComponent(myName);
		try {
			axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/diagnosis/delete/${userCid}/${myEncodedName}`)
			setDiagnosisDbArray(diagnosisDbArray.filter(x => x.name !== myName));
			setFilterItemArray(filterItemArray.filter(x => x.name !== myName));
		} catch (e) {
			console.log(e);
		}		
	}

	function handleSymptomUpdate() {
		updateSymptomToDatabase(emurName);
		
		let myInvestitgation = [].concat(investigationArray);
		console.log(investigationIndex);
		if (isDrawerOpened === "ADDSYM") {
			let test = myInvestitgation[investigationIndex].symptom.find(x => x.name === emurName);
			if (!test) {
				let tmpArray = myInvestitgation[investigationIndex].symptom.concat([{name: emurName}]);
				//tmpArray = lodashSortBy(tmpArray, 'name');
				myInvestitgation[investigationIndex].symptom = tmpArray;
				setInvestigationArray(myInvestitgation);
				updateInvestigation(tmpArray, investigationArray[investigationIndex].diagnosis)
				setIsDrawerOpened("");
			} else {
				setModalRegister(1001);
			}
		}
	}
	
	function handleDeleteSymptom(itemName) {
		vsDialog("Delete Symptom", `Are you sure you want to delete symptom ${itemName}?`,
		{label: "Yes", onClick: () => handleDeleteSymptomConfirm(itemName) },
		{label: "No" }
		);
	}
	
	function handleDeleteSymptomConfirm(itemName) {
		let myData = [].concat(investigationArray);
		//let myIndex = investigationArray.length - 1;
		myData[investigationIndex].symptom = myData[investigationIndex].symptom.filter(x => x.name !== itemName);
		setInvestigationArray(myData);
		updateInvestigation(myData[investigationIndex].symptom, myData[investigationIndex].diagnosis);
	}
	
	// handle visits


	function ArunSymptoms() {
	if (investigationArray.length === 0) return null;
	//console.log(investigationIndex);
	//console.log(investigationArray);
	let x = investigationArray[investigationIndex];
	return (
	<div>	
	{(x.investigationNumber === MAGICNUMBER) && 
		<VsButton name="Add new Symptom" align="left" onClick={handleAddNewSymptom} />
	}	
	<Box borderColor="primary.main" border={1}>
	{x.symptom.map( (m, index) =>
		<Grid className={classes.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
		<Grid item xs={10} sm={10} md={11} lg={11} >
			<Typography className={classes.heading}>{m.name}</Typography>
		</Grid>
		<Grid item xs={1} sm={1} md={1} lg={1} >
			{(x.investigationNumber === MAGICNUMBER) &&
				<IconButton color="secondary" size="small" onClick={() => { handleDeleteSymptom(m.name)}} >
				<DeleteIcon />
				</IconButton>
			}
		</Grid>
		</Grid>
	)}
	</Box>
	</div>
	)}
	
	function ArunDiagnosis() {
	if (investigationArray.length === 0) return null;
	let x = investigationArray[investigationIndex];
	return (
		<div> 
		{(x.investigationNumber === MAGICNUMBER) && 
			<VsButton name="Add new diagnosis" align="left" onClick={handleAddDiagnosis} />
		}	
		<Box borderColor="primary.main" border={1}>
		{x.diagnosis.map( (un, index) =>
			<Grid className={classes.noPadding} key={"NOTES"+index} container justify="center" alignItems="center" >
			<Grid item xs={10} sm={10} md={11} lg={11} >
				<Typography className={classes.heading}>{un.name}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(x.investigationNumber === MAGICNUMBER) &&
					<IconButton color="secondary" size="small" onClick={() => { handleDeleteDiagnosis(un.name)}} >
					<DeleteIcon />
					</IconButton>
				}
			</Grid>
			</Grid>
		)}
		</Box>
		</div>
	)}
	

	function setEmurNameWithFilter(txt) {
		//console.log("Iin filter", txt);
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (txt !== "") {
			if (filterItem.substr(0,3) === "SYM")
				tmpArray = symptomDbArray.filter(x => x.name.toLowerCase().includes(txt.toLowerCase()));
			else if (filterItem.substr(0,3) === "DIA")
				tmpArray = diagnosisDbArray.filter(x => x.name.toLowerCase().includes(txt.toLowerCase()));
		} 
		//console.log(symptomDbArray);
		//console.log(diagnosisDbArray);
	//	console.log(tmpArray);
		setFilterItemArray(tmpArray);
	}
	
	function DisplayFilterArray() {
	console.log(filterItemArray);
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
		setFilterItemArray([]); 
		setEmurName(item.name);
	}


	function DisplayNewBtn() {
		let lastIndex = investigationArray.length - 1;
		let newBtn = true;
		if ((lastIndex >= 0) &&	(investigationArray[lastIndex].investigationNumber === MAGICNUMBER))
			newBtn = false;

		return (newBtn) 
			? <VsButton align="right" name="Add New Investigation" onClick={handleCreateNewInvestigation} />
			: <VsButton align="right" name="Close Investigation" onClick={handleCloseNewInvestigation} />
	}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{(sessionStorage.getItem("userType") === "Assistant") &&
		<Typography className={gClasses.indexSelection} >
			{"Only Doctors are permitted to Add / View / Edit patient Investigation"}
		</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Assistant") &&
	<div>
		{(currentPatient !== "") &&
			<Box align="left" >
				<DisplayInvestigationDates />
				<DisplayFunctionHeader />
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
					<DisplayNewBtn />
					{(currentSelection === "Symptom") &&
						<ArunSymptoms />
					}
					{(currentSelection === "Diagnosis") &&
						<ArunDiagnosis />
					}
				</Box>
			</Box>
		}
		<Drawer className={classes.drawer}
			anchor="right"
			variant="temporary"
			open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{((isDrawerOpened === "ADDSYM")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSymptomUpdate}>
				<Typography align="center" className={classes.modalHeader}>
					{((isDrawerOpened === "ADDSYM") ? "Add Symptom" : "Edit Symptom")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				{/*<TextValidator required fullWidth color="primary"
					id="newName" label="Symptom" name="newName"
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					value={emurName}
				/>*/}
				<VsTextFilter type="text" label="Symptom" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={(event) => setEmurNameWithFilter("")}
				/>
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsSymptomDelete} />
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type="submit" name= {(isDrawerOpened === "ADDSYM") ? "Add" : "Update"}
				/>
			</ValidatorForm>
		}
		{((isDrawerOpened === "ADDDIAG") || (isDrawerOpened === "EDITDIAG")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updateDiagnosis}>
				<Typography align="center" className={classes.modalHeader}>
					{((isDrawerOpened === "ADDDIAG") ? "New Diagnosis" : "Edit Diagnosis")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				{/*<TextValidator required fullWidth color="primary"
					id="newName" label="Diagnosis" name="newName"
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					value={emurName}
				/>*/}
				<VsTextFilter type="text" label="Diagnosis" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={(event) => setEmurNameWithFilter("")}
				/>			
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsDiagnosisDelete} />
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type ="submit" name= {(isDrawerOpened === "ADDDIAG") ? "Add" : "Update"} />
			</ValidatorForm>
		}
		</Box>
		</Drawer>
		</div>
	}	
  </div>
  );    
}
