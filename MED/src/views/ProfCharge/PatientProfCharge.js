import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import ReactTooltip from "react-tooltip";
import fileDownload  from 'js-file-download';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsTeeth from "CustomComponents/VsTeeth";
import VsTextFilter from "CustomComponents/VsTextFilter";
import VsCheckBox from "CustomComponents/VsCheckBox";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';


import { useLoading, Audio } from '@agney/react-loading';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'
//import fs from 'fs';
//import lodashSortBy from "lodash/sortBy"
//import BorderWrapper from 'react-border-wrapper'

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
//import Select from "@material-ui/core/Select";
//import MenuItem from '@material-ui/core/MenuItem';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import { borders } from '@material-ui/system';
// import the stylesheet
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";


import {ValidComp, BlankArea, 
	DisplayProfCharge_WO_Name, DisplayProfCharge, DisplayProfChargeBalance
} from "CustomComponents/CustomComponents.js"

import {
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR, INR
} from "views/globals.js";




//colours 
import { red, blue, green, lightGreen, 
} from '@material-ui/core/colors';


import { 
	isMobile,
	vsDialog,
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

const paymentModeArray = ["Cash", "Cheque", "On-line", "Others"];
var userCid;

export default function ProfCharge(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [profChargeArray, setProfChargeArray] = useState([]);
	const [profChargeMasterArray, setProfChargeMasterArray] = useState([]);
	
	const [balance, setBalance] = useState({billing: 0, payment: 0, due: 0})
	const [currentSelection, setCurrentSelection] = useState("Prof.Charge");
	
	//const [paymentMode, setPaymentMode] = useState("Cash");
	//const [currentPatient, setCurrentPatient] = useState("");
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
