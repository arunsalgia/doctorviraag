import React, { useEffect, useState, useContext } from 'react';
import { TextareaAutosize, TextField, CssBaseline } from '@material-ui/core';
import axios from "axios";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import SwitchBtn from '@material-ui/core/Switch';
//import { usePromiseTracker, trackPromise } from "react-promise-tracker";
//import InputLabel from '@material-ui/core/InputLabel';
//import FormControl from '@material-ui/core/FormControl';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsAdultTeeth from "CustomComponents/VsAdultTeeth";
import VsChildTeeth from "CustomComponents/VsChildTeeth";
import VsTextFilter from "CustomComponents/VsTextFilter";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";

import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
import lodashSortBy from "lodash/sortBy"
import lodashSumBy from "lodash/sumBy"
import lodashCloneDeep  from "lodash/cloneDeep";

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';


// import the stylesheet
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";

// icons
//import IconButton from '@material-ui/core/IconButton';
//import SearchIcon from '@material-ui/icons/Search';
//import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
//import EventNoteIcon from '@material-ui/icons/EventNote';
//import AddIcon from '@material-ui/icons/AddCircleOutline';

import CancelIcon from '@material-ui/icons/Cancel';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Cancel';
import InfoIcon from 	'@material-ui/icons/Info';

// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {
	ValidComp,
} from "CustomComponents/CustomComponents.js"

import {
DATESTR, MONTHNUMBERSTR, MAGICNUMBER, INR,
} from "views/globals.js";



import { 
	isMobile,
	dateString,
	validateInteger,
	vsDialog,
	ordinalSuffix,
	disableFutureDt,
} from "views/functions.js";

/*

//colours 
import { red, blue, green, lightGreen, 
} from '@material-ui/core/colors';

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
*/

const DrawerWidth={drawerStyle: {width: 500, },};
const MAXDISPLAYTEXTROWS=12;
const MAXEDITTEXTROWS=25;

const infoStyle={backgroundColor: '#EEEEEE', paddingTop: '5px', paddingLeft: '5px'}

const DISCOUNTTYPE = ["Percentage", "Fixed"]; 
var userCid;
export default function DentalTreatment(props) {
  
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [isChild, setIsChild] = useState(false);
	const [currentSelection, setCurrentSelection] = useState("Treatment");
	const [remember, setRemember] = useState(false);
	
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [treatTypeArray, setTreatTypeArray] = useState([]);
	
	const [treatmentPlan, setTreatmentPlan] = useState("");
	const [treatmentNotes, setTreatmentNotes] = useState("");
	
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

	const [emurMaxDiscount, setEmurMaxDiscount] = useState(0);
	const [isDiscount, setIsDiscount] = useState(false);
	const [discountStyle, setDiscountStyle] = useState("Fixed");
	const [percentageDiscount, setPercentageDiscount] =  useState(0);
	const [fixedDiscount, setFixedDiscount] = useState(0);
	const [finalDiscount, setFinalDiscount] = useState(0);
	
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
			//console.log(resp.data);
			setTreatmentArray(resp.data);
			//console.log(resp.data);
			setTreatmentIndex(resp.data.length - 1);
			} catch (e) {
			console.log(e)
			setTreatmentArray([]);
			setTreatmentIndex(0);
			}
			//setCurrentSelection("Treatment");	
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
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
		<Typography className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected} onClick={() => setSelection(itemName)}>
			{itemName}
		</Typography>
		</Grid>
		)}
	
	async function setSelection(item) {
		//sessionStorage.setItem("shareData",JSON.stringify(currentPatientData));
		setCurrentSelection(item);
	}
	
	function DisplayFunctionHeader() {
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={0}>
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Treatment" />
		<DisplayFunctionItem item="Plan" />
		<DisplayFunctionItem item="Notes" />
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

	function editTreatmentDate() {
		setEmurNumber(moment(treatmentArray[treatmentIndex].treatmentDate));
		setIsDrawerOpened("EDITDATE");
	}
	
	async function submitTreatmentDate() {
		let d = emurNumber.toDate();
		let myDateStr = `${d.getFullYear()}${MONTHNUMBERSTR[d.getMonth()]}${DATESTR[d.getDate()]}`;
		//console.log(myDateStr);
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/dentaltreatment/setdate/${userCid}/${currentPatientData.pid}/${myDateStr}`);
			//console.log(resp.data);
			//treatmentArray.pop();
			let tmpArray = [].concat(treatmentArray);
			tmpArray[tmpArray.length-1] = resp.data;
			setTreatmentArray(tmpArray);
			//setTreatmentArray(treatmentArray.concat([resp.data]));
		} catch(e) {
			console.log(e);
		}
		setIsDrawerOpened("");
	}
	

	function DisplayTreatmentDates() {
		//console.log(treatmentIndex, treatmentArray);
		let myDate = "No Treatment history available";
		let newTreat = false;
		if (treatmentArray.length > 0) {
			let v = treatmentArray[treatmentIndex];
			myDate = ((!isMobile()) ? 'Treatment dated ' : '') + dateString(v.treatmentDate);
			newTreat = (treatmentArray[treatmentIndex].treatmentNumber === MAGICNUMBER);
		}
		return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<Grid key={"LEFT1"} item xs={2} sm={2} md={2} lg={2} >
				{ (treatmentArray.length > 0)	 &&
					<LeftIcon color={'primary'} onClick={() => {changIndex(-1)}}  />
				}	
			</Grid>
			<Grid key={"VISIST"} item xs={8} sm={8} md={8} lg={8} >
				<Typography>
					<span className={gClasses.dateSelection} >{myDate}</span>
				{(newTreat) &&
				<span><EditIcon color={'primary'} onClick={editTreatmentDate} /></span>
				}
				</Typography>
			</Grid>
			<Grid key="RIGHT1" item xs={2} sm={2} md={2} lg={2} >
			{ (treatmentArray.length > 0)	 &&
				<RightIcon color={'primary'} onClick={() => {changIndex(1)}}  />
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
		
		// discount
		setIsDiscount(false);
		setDiscountStyle("Percentage");
		setPercentageDiscount(0);
		setFixedDiscount(0);
		setFinalDiscount(0);

		// set filter
		setFilterItem("TREATMENT");
		setFilterItemText("");
		setFilterItemArray([]);
		setRemember(false);

		setIsDrawerOpened("ADDTREAT");
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

		// discount 
		setIsDiscount(xxx.isDiscount);
		setDiscountStyle((xxx.isPercent) ? "Percentage" : "Fixed");
		setPercentageDiscount(Math.floor(xxx.discount*100/xxx.amount));
		setFixedDiscount(xxx.discount);
		setFinalDiscount(xxx.discount);
		
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
		updateNewTreatment(tmpArray[lastIndex].treatment, treatmentPlan, treatmentNotes, tmpArray[lastIndex].discount);
	}
	
	function handleEditDiscount() {
		setEmurAmount(treatmentArray[treatmentIndex].discount);
		let maxAmt = lodashSumBy(treatmentArray[treatmentIndex].treatment, 'amount')
		//console.log(maxAmt);
		setEmurMaxDiscount(maxAmt);
		setIsDrawerOpened("EDITDISCOUNT");
	}
	
	function updateDiscount() {
		let tmpArray = [].concat(treatmentArray);
		tmpArray[treatmentIndex].discount = emurAmount;
		setTreatmentArray(tmpArray);
		setIsDrawerOpened("");
		updateNewTreatment(tmpArray[treatmentIndex].treatment, 
			tmpArray[treatmentIndex].plan, 
			tmpArray[treatmentIndex].notes, 
			emurAmount);
	}
	
	function handleDeleteDiscount() {
		//console.log("in delete");
		let tmpArray = [].concat(treatmentArray);
		tmpArray[treatmentIndex].discount = 0;
		setTreatmentArray(tmpArray);
		updateNewTreatment(tmpArray[treatmentIndex].treatment, 
			tmpArray[treatmentIndex].plan, 
			tmpArray[treatmentIndex].notes, 
			0);
		//console.log("Over");
	}
	
	function DisplayAllToolTips() {
	if (treatmentArray.length === 0) return null;
	return(
		<div>
		{treatmentArray[treatmentIndex].treatment.map( (t, index) =>
			<ReactTooltip key={"TREAT"+index} type="info" effect="float" id={"TREAT"+index} multiline={true}/>
		)}
		</div>
	)}
	
	function ArunTreatment() {
		if (treatmentArray.length === 0) return null;
		let x = treatmentArray[treatmentIndex];
		//console.log(x.treatment);
		let discountValue = lodashSumBy(x.treatment, 'discount');
		let payableValue = lodashSumBy(x.treatment, 'amount') - discountValue;
		//console.log(discountValue, payableValue);
		return (
			<div style={infoStyle}>
			{(x.treatmentNumber === MAGICNUMBER) && 
				<VsButton name="New treatment type" align="left" onClick={handleAddTreatmentType} />
			}	
			<Box borderColor="primary.main" border={1}>
				<Grid  key={"NOTESHDR"} container >
				<Grid item align="left" xs={8} sm={10} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2Orange}>Treatment</Typography>
				</Grid>
				{(!isMobile()) &&
					<Grid item align="left" xs={12} sm={4} md={7} lg={7} >
						<Typography className={gClasses.patientInfo2Orange}>Tooth(s)</Typography>
					</Grid>
				}
				<Grid item align="right" xs={2} sm={1} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2Orange}>Amount</Typography>
				</Grid>
				<Grid item xs={2} sm={1} md={1} lg={1} >
				</Grid>
				</Grid>
			{x.treatment.map( (un, index) => {
				//console.log(un);
				let arr = lodashSortBy(un.toothArray).toString();
				let myInfo = "Professional Charge: " + INR + un.amount;
				if (un.isDiscount) {
					myInfo  += "<br />";
					if (un.isPercent) 
						myInfo += "Discount : " + Math.floor(un.discount*100/un.amount) + "%" + "<br />";
					else 
						myInfo += "Discount : " + un.discount + "<br />";
					myInfo += "Amount Payable : " + (un.amount - un.discount);
				}
				return (
					<Grid  key={"NOTES"+index} container >
					<Grid item align="left" xs={8} sm={10} md={3} lg={3} >
						<Typography>
						<span className={gClasses.patientInfo2}>{un.name}</span>
						<span align="left"
							data-for={"TREAT"+index}
							data-tip={myInfo}
							data-iscapture="true"
						>
						<InfoIcon color="primary" size="small"/>
						</span>
						</Typography>
					</Grid>
					{(!isMobile()) &&
					<Grid item align="left" xs={12} sm={4} md={7} lg={7} >
						<Typography className={gClasses.patientInfo2}>{arr}</Typography>
					</Grid>
					}
					<Grid item align="right" xs={2} sm={1} md={1} lg={1} >
						<Typography className={gClasses.patientInfo2}>{INR+un.amount}</Typography>
					</Grid>
					<Grid item xs={2} sm={1} md={1} lg={1} >
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
			<Box borderColor="primary.main" border={1}>
			<Grid  key={"DISCOUNT"} container >
			<Grid item align="left" xs={8} sm={10} md={10} lg={10} >
				<Typography className={gClasses.patientInfo2}>{"Discount"}</Typography>
			</Grid>
			<Grid item align="right" xs={2} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{INR+discountValue}</Typography>
			</Grid>
			<Grid item xs={2} sm={1} md={1} lg={1} >
				{((false) && (x.treatmentNumber === MAGICNUMBER)) &&
					<div>
					<EditIcon color="primary" size="small" onClick={handleEditDiscount} />
					<DeleteIcon color="secondary" size="small" onClick={handleDeleteDiscount} />
					</div>
				}
			</Grid>
			</Grid>			
			</Box>
			{/*<Box borderColor="primary.main" border={1}>*/}
			<Grid  key={"PC"} container >
			<Grid item align="right" xs={7} sm={9} md={9} lg={9} >
			<Typography className={gClasses.patientInfo2}>{"Professional Charges:"}</Typography>
			</Grid>
			<Grid align="right" item xs={3} sm={2} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{INR+" "+ payableValue}</Typography>
			</Grid>
			<Grid item align="right" xs={2} sm={1} md={1} lg={1} />
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
	
	function updateNewTreatment(sArray, tPlan, tNotes, discount) {
		//console.log(tPlan, tNotes);
		let tmp = encodeURIComponent(JSON.stringify({
			treatment: sArray,
			plan: tPlan,
			notes: tNotes,
			discount: discount
		}));
		axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/dentaltreatment/update/${userCid}/${currentPatientData.pid}/${tmp}`)

		let tmpArray = lodashCloneDeep(treatmentArray);
		tmpArray[tmpArray.length-1].treatmentDate = new Date().toString();
		setTreatmentArray(tmpArray);
		//setShowCloseVisit(true);
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
			tmp[lastIndex].treatment.push({
				name: emurName, 
				toothArray: emurToothArray, 
				amount: emurAmount,
				isDiscount: isDiscount,
				isPercent: (discountStyle === 'Percentage'),
				discount: finalDiscount
			});
			setTreatTypeArray(tmp);
			//index = tmp[lastIndex].treatment.length - 1;
		} 
		else {
			if (tmp[lastIndex].treatment[emurIndex].name.toLowerCase() !== emurName.toLowerCase()) {
				if (tmp[lastIndex].treatment.find(x => x.name.toLowerCase() === emurName.toLowerCase())) {
					setModalRegister(2001);
					return;
				} 
			}
			tmp[lastIndex].treatment[emurIndex].name = emurName;
			tmp[lastIndex].treatment[emurIndex].toothArray = emurToothArray;
			tmp[lastIndex].treatment[emurIndex].amount = emurAmount;
			tmp[lastIndex].treatment[emurIndex].isDiscount = isDiscount;
			tmp[lastIndex].treatment[emurIndex].isPercent = (discountStyle === 'Percentage');
			tmp[lastIndex].treatment[emurIndex].discount = finalDiscount;
			setTreatmentArray(tmp);
		}
		setIsDrawerOpened("");
		
		//tmp[lastIndex].treatment[index].name = emurName;
		updateNewTreatment(tmp[lastIndex].treatment, treatmentPlan, treatmentNotes, tmp[lastIndex].discount);
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
	
	function editNotes() {
		setEmurName(treatmentArray[treatmentIndex].notes);
		setIsDrawerOpened("EDITTREATMENTNOTES")
	}

	function handlEditNotes() {
		updateEditNotes(emurName);
	}
	
	function updateEditNotes(newText) {
		let tmpArray = [].concat(treatmentArray);
		tmpArray[treatmentIndex].notes = newText;
		setTreatmentArray(tmpArray);
		updateNewTreatment(tmpArray[treatmentIndex].treatment, 
			tmpArray[treatmentIndex].plan, 
			tmpArray[treatmentIndex].notes,
			tmpArray[treatmentIndex].discount
		);
		setIsDrawerOpened("");
	}

	function ArunNotes() {
		if (treatmentArray.length === 0) return null;
		let myNotes = treatmentArray[treatmentIndex].notes;
		let myNumber = treatmentArray[treatmentIndex].treatmentNumber;
	return (
		<Box borderColor="primary.main" border={0}>
		{(myNumber === MAGICNUMBER) &&
		<div style={infoStyle} align="right">
			<EditIcon color="primary" size="small" onClick={editNotes} />
			<CancelIcon color="secondary" size="small" onClick={() => updateEditNotes("")} />
		</div>
		}
		<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed} readOnly value={myNotes} />
		</Box>
	)}
		
		
	function editPlan() {
		setEmurName(treatmentArray[treatmentIndex].plan);
		setIsDrawerOpened("EDITTREATMENTPLAN")
	}

	function handlEditPlan() {
		updateEditPlan(emurName);
	}

	function updateEditPlan(newText) {
		let tmpArray = [].concat(treatmentArray);
		tmpArray[treatmentIndex].plan = newText;
		setTreatmentArray(tmpArray);
		updateNewTreatment(tmpArray[treatmentIndex].treatment, 
			tmpArray[treatmentIndex].plan, 
			tmpArray[treatmentIndex].notes,
			tmpArray[treatmentIndex].discount
		);
		setIsDrawerOpened("");
	}

	function ArunPlan() {
		if (treatmentArray.length === 0) return null;
		let myPlan =  treatmentArray[treatmentIndex].plan;
		let myNumber = treatmentArray[treatmentIndex].treatmentNumber;
		//setTreatmentPlan(myPlan);
		return (
		<div style={infoStyle}>
		<Box borderColor="primary.main" border={0}>
		{(myNumber === MAGICNUMBER) &&
		<div align="right">
			<EditIcon color="primary" size="small" onClick={editPlan} />
			<CancelIcon color="secondary" size="small" onClick={() => updateEditPlan("")} />
		</div>
		}
		<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed} readOnly value={myPlan} />
		</Box>
		</div>
	)}

	function verifyAmount(item, value) {
		//console.log(item, value);
		if (item === "AMOUNT") {
			setEmurAmount(value);
			let myFix = Math.min(fixedDiscount, value);
			setFixedDiscount(myFix);
			setFinalDiscount((discountStyle === 'Fixed') ? myFix : Math.floor(value*percentageDiscount/100));
		} 
		else if (item === "YESNODISCOUNT") {
			setIsDiscount(value);		// true or false
			if (value) {
				if (discountStyle === "Fixed") {
					if (fixedDiscount > emurAmount) {
						setFixedDiscount(emurAmount);
						setFinalDiscount(0);
					} else {
						setFinalDiscount(emurAmount - fixedDiscount);
					}
				} 
				else {
					setFinalDiscount(Math.floor(emurAmount*(100-percentageDiscount)/100))
				}				
			} 
			else {
				setFinalDiscount(0);
			}
		}
		else if (item === "DISCOUNTSTYLE") {
			setDiscountStyle(value);
			setFinalDiscount((value === "Fixed") ? Math.min(emurAmount,fixedDiscount) : Math.floor(emurAmount*percentageDiscount/100));
		}
		else if (item === "PERCENT") {
			setPercentageDiscount(value);
			setFinalDiscount(Math.floor(emurAmount*value/100));
		}
		else if (item === "FIXED") {
			let myDis = Math.min(emurAmount, value)
			setFixedDiscount(myDis);
			setFinalDiscount(myDis);
		}
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
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={0} >
			<DisplayNewBtn />
			{(currentSelection === "Treatment") &&
				<div>
				<ArunTreatment />
				<DisplayAllToolTips />
				</div>
			}
			{(currentSelection === "Plan") &&
				<ArunPlan />
			}
			{(currentSelection === "Notes") &&
				<ArunNotes />
			}
		</Box>
		{/*<Drawer 
			classes={{ paper:(isDrawerOpened === "EDITDISCOUNT") ? gClasses.drawer : gClasses.drawer90}}
			anchor="right" variant="temporary" open={isDrawerOpened !== ""}
		>*/}
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{((isDrawerOpened === "ADDTREAT") || (isDrawerOpened === "EDITTREAT")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updateTreatment}>
				<Typography align="center" className={gClasses.patientInfo2Blue}>
					{((isDrawerOpened === "ADDTREAT") ? "New Treatment" : "Edit Treatment")+` for ${currentPatient}`}
				</Typography>
				<br />
				<VsTextFilter type="text" label="Treatment type" value={emurName}
					onChange={(event) => setEmurNameWithFilter(event.target.value)}
					onClear={() => setEmurNameWithFilter("")}
				/>
				<VsCheckBox align='left' label="Remember" checked={remember} onClick={() => setRemember(!remember)} />
				<VsList listArray={filterItemArray} onSelect={handleVsSelect} onDelete={handleVsTreatTypeDelete} />
				<br />
				<VsCheckBox align="left" label="Is Child" checked={isChild} onClick={() => { setEmurToothArray([]); setIsChild(!isChild); }} />
				{(isChild) &&
					<VsChildTeeth toothArray={emurToothArray} onClick={handleToothUpdate} />
				}
				{(!isChild) &&
					<VsAdultTeeth toothArray={emurToothArray} onClick={handleToothUpdate} />
				}
				<TextValidator required fullWidth color="primary" type="number" className={gClasses.vgSpacing} 
					id="newName" label="Professional Charge" name="newName"
					onChange={(event) => verifyAmount("AMOUNT", Number(event.target.value))}
					value={emurAmount}
					validators={['minNumber:100']}
					errorMessages={['Invalid Amount']}
				/>
				<VsCheckBox align="left" label="Treatment Discount" checked={isDiscount} onClick={() => verifyAmount("YESNODISCOUNT", !isDiscount)} />
				{(isDiscount) &&
					<VsRadioGroup radioList={DISCOUNTTYPE} value={discountStyle} onChange={(event) => verifyAmount('DISCOUNTSTYLE', event.target.value)} />
				}
				<div align="left">
				{((isDiscount) && (discountStyle === "Fixed")) &&
					<TextValidator required color="primary" type="number" className={gClasses.vgSpacing} 
						id="newName" label="Discount" name="newName"
						onChange={(event) => verifyAmount("FIXED", Number(event.target.value))}
						value={fixedDiscount}
						validators={['minNumber:0', `maxNumber:${emurAmount}`]}
						errorMessages={['Invalid Discount Amount', 'Invalid Discount Amount']}
					/>				
				}
				{((isDiscount) && (discountStyle !== "Fixed")) &&
					<TextValidator align="left" required label="Percentage" color="primary" type="number" className={gClasses.vgSpacing}  
						onChange={(event) => verifyAmount("PERCENT", Number(event.target.value))}
						value={percentageDiscount}
						validators={['minNumber:0', 'maxNumber:100']}
						errorMessages={['Invalid Percentage', 'Invalid Percentage']}
					/>				
				}
				<br />
				{(isDiscount) && 
					<Typography className={gClasses.patientInfo2Blue} >
					{"Professional Charge payable "+(emurAmount-finalDiscount)}
					</Typography>
				}				
				</div>
				<ModalResisterStatus />
				<br />
				<VsButton type ="submit" name= {(isDrawerOpened === "ADDTREAT") ? "Add" : "Update"} />
			</ValidatorForm>
		}  
		{(isDrawerOpened === "EDITDISCOUNT") &&
			<ValidatorForm align="center" onSubmit={updateDiscount}>
				<Typography align="center" className={gClasses.patientInfo2Blue}>
					{"Treatment Discount"}
				</Typography>
				<br />
				<TextValidator required color="primary" type="number" className={gClasses.vgSpacing} 
					id="newName" label="Discount" name="newName"
					onChange={(event) => setEmurAmount(Number(event.target.value))}
					value={emurAmount}
					validators={['minNumber:0', `maxNumber:${emurMaxDiscount}`]}
					errorMessages={['Invalid Discount Amount', 'Invalid Discount Amount']}
				/>
				<ModalResisterStatus />
				<br />
				<VsButton type ="submit" name="Update" />
			</ValidatorForm>
		}
		{(isDrawerOpened === "EDITTREATMENTPLAN") &&
			<div align="center">
				<Typography className={gClasses.patientInfo2Blue}>Treatment Plan</Typography>
				<br />
				<TextareaAutosize
					maxRows={MAXEDITTEXTROWS}
					aria-label="empty textarea"
					placeholder="Treatment Plan..."
					value={emurName}
					onChange={(event) => setEmurName(event.target.value)}
					className={gClasses.textAreaFixed}
				/>
				<br />
				<VsButton name="Update" onClick={handlEditPlan} />
			</div>
		}
		{(isDrawerOpened === "EDITTREATMENTNOTES") &&
			<div align="center">
				<Typography className={gClasses.patientInfo2Blue}>Treatment Notes</Typography>
				<br />
				<TextareaAutosize
					maxRows={MAXEDITTEXTROWS}
					aria-label="empty textarea"
					placeholder="Treatment Notes..."
					value={emurName}
					onChange={(event) => setEmurName(event.target.value)}
					className={gClasses.textAreaFixed}
				/>
				<br />
				<VsButton name="Update" onClick={handlEditNotes} />
			</div>
		}
		{(isDrawerOpened === "EDITDATE") &&
			<div>
			<Typography align="center" className={gClasses.functionSelected}>
					{`Set treatment date for ${currentPatient}`}
			</Typography>
			<br />
			<br />
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurNumber}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={setEmurNumber}
				closeOnSelect={true}
			/>
			<br />
			<br />
			<VsButton align="center" name="Update" onClick={submitTreatmentDate} />
			</div>
		}
		</Box>
		</Drawer>
		</div>
	}
	</div>
 );    
}
