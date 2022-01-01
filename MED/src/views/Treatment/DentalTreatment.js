import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsAdultTeeth from "CustomComponents/VsAdultTeeth";
import VsChildTeeth from "CustomComponents/VsChildTeeth";
import VsTextFilter from "CustomComponents/VsTextFilter";
import VsCheckBox from "CustomComponents/VsCheckBox";


import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import lodashSortBy from "lodash/sortBy"
import lodashSumBy from "lodash/sumBy"
import lodashCloneDeep  from "lodash/cloneDeep";

import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import { borders } from '@material-ui/system';
import {dynamicModal } from "assets/dynamicModal";
import cloneDeep from 'lodash/cloneDeep';
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";

// icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CancelIcon from '@material-ui/icons/Cancel';
import EventNoteIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

import Switch from "@material-ui/core/Switch";


import Link from '@material-ui/core/Link';

// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {DisplayYesNo, DisplayPageHeader, ValidComp, BlankArea,
LoadingMessage,
} from "CustomComponents/CustomComponents.js"

import {
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR,
MAGICNUMBER, INR,
} from "views/globals.js";

// icons
//import FileCopyIcon from '@material-ui/icons/FileCopy';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
//import CloseIcon from '@material-ui/icons/Close';
//import VisibilityIcon from '@material-ui/icons/Visibility';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Cancel';


//colours 
import { red, blue, green, lightGreen, 
} from '@material-ui/core/colors';

import { 
	validateInteger,
	vsDialog,
	ordinalSuffix,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
	selectedTooth: {
		backgroundColor: green[900],
		color: 'white',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	normalTooth: {
		//backgroundColor: 'lightGreen',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	toothNumber: {
		borderColour: 'black',
		borderWidth: "1px",
		borderRadius: "0px",
		borderType: "solid",
		innerPadding: "0px",
		//padding: "10px",
		//margin: "10px",
	},
	tooth: {
		//backgroundColor: 'lightGreen',
		fontSize: theme.typography.pxToRem(12),
		//fontWeight: theme.typography.fontWeightBold,
	},
	toothType: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		margin: "5px",
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
	total: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		paddingRight: '30px',
		color: 'green',
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


var userCid;
export default function DentalTreatment(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [isChild, setIsChild] = useState(false);
	const [currentSelection, setCurrentSelection] = useState("Treatment");
	const [remember, setRemember] = useState(false);
	
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [treatTypeArray, setTreatTypeArray] = useState([]);
	
	
	const [treatmentIndex, setTreatmentIndex] = useState(0);
	const [treatmentArray, setTreatmentArray] = useState([]);
	
	const [myToothArray, setmyToothArray] = useState([11, 13, 26, 28, 41, 47, 33, 34]);

	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [emurIndex, setEmurIndex] = useState(0);
	const [emurNumber, setEmurNumber] = useState(0);
	
	const [emurName, setEmurName] = useState("");
	const [emurToothArray, setEmurToothArray] = useState([]);
	const [emurAmount, setEmurAmount] = useState(0);
	
	const [balance, setBalance] = useState(0);
	
	const [modalRegister, setModalRegister] = useState(0);
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");
		const checkPatient = async () => {	
			let patRec = props.patient;	//JSON.parse(sessionStorage.getItem("shareData"));
			//console.log(patRec);
			setCurrentPatientData(patRec);
			setCurrentPatient(patRec.displayName);
			await getPatientTreatment(patRec);
		}
		checkPatient();
		getAllTreatType();
  }, []);

	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 2001:
        myMsg = 'Duplicate Treatment type';
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
	
	async function getPatientTreatment(patRec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/dentaltreatment/list/${userCid}/${patRec.pid}`)
			setTreatmentArray(resp.data);
			setTreatmentIndex(resp.data.length - 1);
			} catch (e) {
			console.log(e)
			setTreatmentArray([]);
			setTreatmentIndex(0);
			}
		setCurrentSelection("Treatment");	
	}
	
	async function getAllTreatType() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/treattype/list/${userCid}`)
			setTreatTypeArray(resp.data);
		} catch (e) {
			console.log(e);
		}
	}
	
	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={6} sm={6} md={2} lg={2} >
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
		//sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	function DisplayFunctionHeader() {
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Treatment" />
	</Grid>	
	</Box>
	)}
	
	
	
	function changIndex(num) {
		num += treatmentIndex;
		if (num < 0) return;
		if (num === treatmentArray.length) return;
		setTreatmentIndex(num);
		//setCurrentSelection("Medicine");
	}

	function OrgDisplayTreatmentDates() {
		if (treatmentArray.length === 0) {
			return (
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
				<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
					<Grid key={"VISIST"} item xs={12} sm={12} md={12} lg={12} >
						<Typography className={gClasses.indexSelection} >
							{"No Treatment history available"}
						</Typography>
					</Grid>
				</Grid>	
				</Box>
			);
		}
		
		//console.log(treatmentArray);
		let v = treatmentArray[treatmentIndex];
		let d = new Date(v.treatmentDate);
		let myDate = `Treatment dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
		if (v.treatmentNumber === MAGICNUMBER)
				myDate += " ( New ) ";
		else {
		}
		return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >	
				<IconButton color={'primary'} onClick={() => {changIndex(-1)}}  >
					<LeftIcon />
				</IconButton>
			</Grid>
			<Grid key={"VISIST"} item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.indexSelection} >
					{myDate}
				</Typography>
			</Grid>
			<Grid key="RIGHT1" item xs={2} sm={2} md={2} lg={2} >
				<IconButton color={'primary'} onClick={() => {changIndex(1)}}  >
						<RightIcon />
					</IconButton>
			</Grid>
		</Grid>	
		</Box>
		)
	}

	function DisplayTreatmentDates() {
		let myDate = "No Treatment history available";
		if (treatmentArray.length > 0) {
			console.log(treatmentIndex, treatmentArray);
			let v = treatmentArray[treatmentIndex];
			let d = new Date(v.treatmentDate);
			myDate = `Treatment dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			if (v.treatmentNumber === MAGICNUMBER)
					myDate += " ( New ) ";
			else {
			}
		}
		return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >
				{ (treatmentArray.length > 0)	 &&
					<IconButton color={'primary'} onClick={() => {changIndex(-1)}}  >
						<LeftIcon />
					</IconButton>
				}	
			</Grid>
			<Grid key={"VISIST"} item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.indexSelection} >
					{myDate}
				</Typography>
			</Grid>
			<Grid key="RIGHT1" item xs={2} sm={2} md={2} lg={2} >
			{ (treatmentArray.length > 0)	 &&
				<IconButton color={'primary'} onClick={() => {changIndex(1)}}  >
						<RightIcon />
					</IconButton>
			}
			</Grid>
		</Grid>	
		</Box>
		)
	}

	function handleUpdate(num) {
		//console.log(emurToothArray);
		//console.log(num);
		//console.log(num);
		let newTootlArray;
		if (emurToothArray.includes(num)) {
			newTootlArray = emurToothArray.filter(x => x !== num);
		} else {
			newTootlArray = [].concat(emurToothArray);
			newTootlArray.push(num);
		}
		console.log(newTootlArray);
		setEmurToothArray(newTootlArray);
	}
	
	
	function DisplayNewBtn() {
		let lastIndex = treatmentArray.length - 1;
		let newBtn = true;
		if ((lastIndex >= 0) &&	(treatmentArray[lastIndex].treatmentNumber === MAGICNUMBER))
			newBtn = false;
		//console.log(lastIndex, newBtn);
		return ( newBtn ) 
		? <VsButton align="right" name="Add New Treatment" onClick={handleCreateNewTreatment} />
		: <VsButton align="right" name="Close Treatment" onClick={handleCloseNewTreatment} />
	}
	
	function handleCreateNewTreatment() {
		let tmp = [{
			pid: currentPatientData.pid,
			treatmentNumber: MAGICNUMBER,
			treatmentDate: new Date(),
			treatment: [],
		}];
		let myArray = treatmentArray.concat(tmp);
		//console.log(myArray);
		setTreatmentArray(myArray);
		setTreatmentIndex(myArray.length - 1);
	}

	async function handleCloseNewTreatment() {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/dentaltreatment/close/${userCid}/${currentPatientData.pid}`)
			let tmpArray = lodashCloneDeep(treatmentArray);
			if (resp.data.treatmentNumber < 0) {
				console.log("Blank visit");
				tmpArray.pop();
				//console.log(tmpArray);
				setTreatmentIndex(tmpArray.length - 1);
				setTreatmentArray(tmpArray);	
			} else {
				let lastIndex = tmpArray.length - 1;
				tmpArray[lastIndex].treatmentNumber = resp.data.treatmentNumber;
				console.log(tmpArray[lastIndex].treatmentNumber)
				setTreatmentArray(tmpArray);				
			}
		} catch(e) {
			console.log(e);
			console.log("Error close treatment");
		}

	}

	
	function handleVsTreatTypeDelete(treat) {
		console.log(treat);
	}
	
	function handleAddTreatmentType() {
		setEmurName("");
		setEmurToothArray([]);
		setEmurAmount(0);
		setIsChild(false);

		setIsDrawerOpened("ADDTREAT");
		// set filter
		setFilterItem("TREATMENT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);
	}
	
	function handleEditTreatmentType(index) {
		let xxx = treatmentArray[treatmentIndex].treatment[index];
		//console.log(xxx);

		setEmurIndex(index);
		setEmurName(xxx.name);
		setEmurToothArray(xxx.toothArray);
		setEmurAmount(xxx.amount);
		let childtooth = false;
		for(let i=0; i<xxx.toothArray.length; ++i) {
			if (xxx.toothArray[i] > 50) {
				childtooth = true;
				break;
			}
		}
		setIsChild(childtooth);

		// set filter
		setFilterItem("TREATMENT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);

		setIsDrawerOpened("EDITTREAT");
	}
	
		
	function handleDeleteTreatment(itemName) {
		//console.log(itemName);
		//console.log(treatmentArray);
		vsDialog("Delete Treatment", `Are you sure you want to delete treatment ${itemName}?`,
			{label: "Yes", onClick: () => handleDeleteTreatmentConfirm(itemName) },
			{label: "No" }
		);
	}
	
	function handleDeleteTreatmentConfirm(itemName) {
		let lastIndex = treatmentArray.length - 1;
		let tmpArray = [].concat(treatmentArray);
		//console.log(tmpArray);
		tmpArray[lastIndex].treatment = tmpArray[lastIndex].treatment.filter(x => x.name !== itemName);
		//console.log(tmpArray);
		setTreatmentArray(tmpArray);
		updateNewTreatment(tmpArray[lastIndex].treatment);
	}
	

	function ArunTreatment() {
		if (treatmentArray.length === 0) return null;
		let x = treatmentArray[treatmentIndex];
		//console.log(x.treatment);
		return (
			<div> 
			{(x.treatmentNumber === MAGICNUMBER) && 
				<VsButton name="New treatment type" align="left" onClick={handleAddTreatmentType} />
			}	
			<Box borderColor="primary.main" border={1}>
			{x.treatment.map( (un, index) => {
				let arr = lodashSortBy(un.toothArray).toString();
				//console.log(arr);
				return (
					<Grid className={classes.noPadding} key={"NOTES"+index} container >
					<Grid item align="left" xs={10} sm={3} md={3} lg={3} >
						<Typography className={classes.heading}>{"Treatment: "+un.name}</Typography>
					</Grid>
					<Grid item align="left" xs={10} sm={3} md={7} lg={7} >
						{/*\<DisplayTeeth toothArray={un.toothArray} />*/}
						<Typography className={classes.heading}>{arr}</Typography>
					</Grid>
					<Grid item align="right" xs={10} sm={1} md={1} lg={1} >
						<Typography className={classes.heading}>{INR+un.amount}</Typography>
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1} >
						{(x.treatmentNumber === MAGICNUMBER) &&
							<div>
							<EditIcon color="primary" size="small" onClick={() => { handleEditTreatmentType(index)}} />
							<DeleteIcon color="secondary" size="small" onClick={() => { handleDeleteTreatment(un.name)}} />
							</div>
						}
					</Grid>
					</Grid>
				)}
			)}
			</Box>
			{/*<Box borderColor="primary.main" border={1}>*/}
			<Grid className={classes.noPadding} key={"PC"} container >
			<Grid item align="right" xs={10} sm={10} md={10} lg={10} >
			<Typography className={classes.total}>{"Total Professional Charges"}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
			<Typography className={classes.heading}>{INR+" "+lodashSumBy(x.treatment, 'amount')}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} />
			</Grid>
			{/*</Box>*/}
			</div>
		)}
		

	async function updateTreatTypeToDatabase(myName) {
		if (!remember) return;	
		//console.log(myName);
		//console.log(treatTypeArray);
		
		let tmp = treatTypeArray.find(x => x.name.toLowerCase() === myName.toLowerCase())
		if (!tmp) {
			let myEncodedName = encodeURIComponent(myName);
			try {
				axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/treattype/add/${userCid}/${myEncodedName}`)
				let tmpArray = [{name: myName}].concat(treatTypeArray);
				setTreatTypeArray(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
			}	
		}
	}
	
	function updateNewTreatment(sArray) {
		let tmp = JSON.stringify({treatment: sArray});
		let tmp1 = encodeURIComponent(tmp);
		axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/dentaltreatment/update/${userCid}/${currentPatientData.pid}/${tmp1}`)
	}	

	
	function updateTreatment() {
		updateTreatTypeToDatabase(emurName);
		
		let tmp = [].concat(treatmentArray);
		let index = emurNumber;
		let lastIndex = treatmentArray.length - 1;
		if (isDrawerOpened === "ADDTREAT") {
			if (tmp[lastIndex].treatment.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
				setModalRegister(2001);
				return;
			} 
			tmp[lastIndex].treatment.push({name: emurName, toothArray: emurToothArray, amount: emurAmount});
			setTreatTypeArray(tmp);
			//index = tmp[lastIndex].treatment.length - 1;
		} else {
			if (tmp[lastIndex].treatment[emurIndex].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[lastIndex].treatment.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(2001);
					return;
				} 
			}
			tmp[lastIndex].treatment[emurIndex].name = emurName;
			tmp[lastIndex].treatment[emurIndex].toothArray = emurToothArray;
			tmp[lastIndex].treatment[emurIndex].amount = emurAmount;
			setTreatmentArray(tmp);
		}
		setIsDrawerOpened("");
		
		tmp[lastIndex].treatment[index].name = emurName;
		updateNewTreatment(tmp[lastIndex].treatment)
		setTreatmentArray(tmp);
	}
	

	function handleVsSelect(item) {
		setFilterItemArray([]); 
		setEmurName(item.name);
	}
	
	
	function setEmurNameWithFilter(txt) {
		//console.log("Iin filter", txt);
		//console.log(filterItem);
		//console.log(treatTypeArray);
		setEmurName(txt);
		setFilterItemText(txt);
		let tmpArray = [];
		if (txt !== "") {
			if (filterItem.substr(0,3) === "TRE") {
				//console.log(treatTypeArray);
				//console.log(txt);
				tmpArray = treatTypeArray.filter(x => x.name.toLowerCase().includes(txt.toLowerCase()))
			}
		} 
		//console.log(treatTypeArray);
		//console.log(tmpArray);
		setFilterItemArray(tmpArray);
	}
	
	function handleToothUpdate(num) {
		let newTootlArray;
		if (emurToothArray.includes(num)) {
			newTootlArray = emurToothArray.filter(x => x !== num);
		} else {
			newTootlArray = [].concat(emurToothArray);
			newTootlArray.push(num);
		}
		//console.log(newTootlArray);
		setEmurToothArray(newTootlArray);
	}
	
	return (
	<div>
	{(sessionStorage.getItem("userType") === "Assistant") &&
		<Typography className={gClasses.indexSelection} >
			{"Only Doctors are permitted to Add / View / Edit patient treatment"}
		</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Assistant") &&
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayTreatmentDates />
		<DisplayFunctionHeader />
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<DisplayNewBtn />
			{(currentSelection === "Treatment") &&
				<ArunTreatment />
			}
		</Box>
		<Drawer className={classes.drawer}
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{((isDrawerOpened === "ADDTREAT") || (isDrawerOpened === "EDITTREAT")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updateTreatment}>
				<Typography align="center" className={classes.modalHeader}>
					{((isDrawerOpened === "ADDTREAT") ? "New Treatment" : "Edit Treatment")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				{/*<TextValidator required fullWidth color="primary"
					id="newName" label="Treatment type" name="newName"
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					value={emurName}
				/>*/}
				<VsTextFilter type="text" label="Treatment type" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={() => setEmurNameWithFilter("")}
				/>
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsTreatTypeDelete} />
				<BlankArea />
				<VsCheckBox align="left" label="Is Child" checked={isChild} onClick={() => { setEmurToothArray([]); setIsChild(!isChild); }} />
				{(isChild) &&
					<VsChildTeeth toothArray={emurToothArray} onClick={handleToothUpdate} />
				}
				{(!isChild) &&
					<VsAdultTeeth toothArray={emurToothArray} onClick={handleToothUpdate} />
				}
				<TextValidator required fullWidth color="primary" type="number" className={gClasses.vgSpacing} 
					id="newName" label="Professional Charge" name="newName"
					onChange={(event) => setEmurAmount(Number(event.target.value))}
					value={emurAmount}
					validators={['minNumber:100']}
					errorMessages={['Invalid Amount']}
				/>
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type ="submit" name= {(isDrawerOpened === "ADDTREAT") ? "Add" : "Update"} />
			</ValidatorForm>
		}
		</Box>
		</Drawer>
		</div>
	}
	</div>
 );    
}
