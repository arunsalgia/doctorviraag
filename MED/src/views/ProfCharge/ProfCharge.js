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
	const [balance, setBalance] = useState({billing: 0, payment: 0, due: 0})
	
	const [paymentMode, setPaymentMode] = useState("Cash");
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	
	const [emurTid, setEmurTid] = useState(0);
	const [emurAmount, setEmurAmount] = useState(100);
	const [emurDesc, setEmurDesc] = useState("");
	const [modalRegister, setModalRegister] = useState(0);
	
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");
		const checkPatient = async () => {	
			let patRec = props.patient;
			//console.log(patRec);
			setCurrentPatientData(patRec);
			setCurrentPatient(patRec.displayName);
			getProfCharge(patRec);
			getBalance(patRec);
		}
		checkPatient();
		
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
	
	async function getProfCharge(patRec) {
		let myArray = [];
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/list/${userCid}/${patRec.pid}`)
			myArray = resp.data;
		} catch (e) {
			console.log(e)
		}
		setProfChargeArray(myArray);
	}

	async function getBalance(patRec) {
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/balance/${userCid}/${patRec.pid}`)
			setBalance(resp.data);
		} catch (e) {
			console.log(e)
		}
	}

	function addNewPayment() {
		setPaymentMode(paymentModeArray[0]);
		setEmurTid(0);
		setEmurAmount(100);
		setEmurDesc("");
		setIsDrawerOpened("ADDPAY");
	}
	
	function handleEditPayment(pRec) {
		setEmurTid(pRec.tid);
		setPaymentMode(pRec.paymentMode);
		setEmurAmount(pRec.amount);
		setEmurDesc(pRec.description);
		setIsDrawerOpened("EDITPAY");
	}
	
	function DisplayNewBtn() {
	return (
		<div align="right">
			<VsButton name="Add New Payment" onClick={addNewPayment} />
		</div>
	)}

	function handleDeletePayment(t) {
		vsDialog("Delete Payment", `Are you sure you want to delete payment of amount ${Math.abs(t.amount)}?`,
			{label: "Yes", onClick: () => handleDeleteTreatmentConfirm(t) },
			{label: "No" }
		);
	}
	
	async function handleReceipt(t) {
		try {
			await axios.get (`${process.env.REACT_APP_AXIOS_BASEPATH}/docx/receipt/${t.cid}/${t.pid}/${t.tid}`);
			
			// now prepare for download
			let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/docx/downloadreceipt/${t.cid}/${t.pid}`;
			let response = await axios({ method: 'get', url: myURL, responseType: 'arraybuffer',

			});
			let myFile = "patientReceipt.docx";
			console.log(myFile);
			console.log(response.data);
			await fileDownload (response.data, myFile);
			//setStepNo(3);
			console.log("download over");

			alert.success("Successfully generated receipt document");
		} catch (e) {
			let isufficientPayment = false;
			if (e.response) {
				if (e.response.status === 603) return alert.info("Receipt available only on full payment");
				if (e.response.status === 604) return alert.info("Kindly subscribe 'Billing' add on to avail bill generation functionality");
			}
			console.log(e)
			alert.error("Error generating visit document");
		}		
	}

	
	async function handleDeleteTreatmentConfirm(t) {
		await axios.post(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/delete/${userCid}/${currentPatientData.pid}/${t.tid}`)
		setProfChargeArray(profChargeArray.filter(x => x.tid !== t.tid));
		getBalance(currentPatientData);
		alert.success(`Delete payment of amount ${t.amount}`);
	}
	
	

	async function updatePayment() {
		let tmp = encodeURIComponent(JSON.stringify({
			date: new Date(),
			amount: emurAmount,
			description: emurDesc,
			paymentMode: paymentMode
		}));
		if (isDrawerOpened === "ADDPAY") {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/add/${userCid}/${currentPatientData.pid}/${tmp}`)
				setIsDrawerOpened("");
				let tmpArray = [resp.data].concat(profChargeArray);
				setProfChargeArray(tmpArray);
				await getBalance(currentPatientData);
				alert.success(`Successfully added payment of amount ${emurAmount}.`);
			} catch(e) {
				console.log(e);
				alert.error("Error adding new payment");
			}
		} else {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/profcharge/update/${userCid}/${currentPatientData.pid}/${emurTid}/${tmp}`)
				setIsDrawerOpened("");
				let tmpArray = profChargeArray.filter(x => x.tid !== emurTid);
				tmpArray.push(resp.data);
				//console.log(tmpArray);
				tmpArray = lodashSortBy(tmpArray, 'tid');
				setProfChargeArray(tmpArray.reverse());
				getBalance(currentPatientData);
				alert.success(`Successfully update payment of new amount ${emurAmount}.`);
			} catch(e) {
				console.log(e);
				alert.error("Error updating edit payment");
			}			
		}
	}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
		<DisplayProfChargeBalance balance={balance}/>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<DisplayNewBtn />
			<DisplayProfCharge_WO_Name profChargeArray={profChargeArray} patientArray={[currentPatientData]}
				handleReceipt={handleReceipt}
				handleEdit={handleEditPayment} 
				handleCancel={handleDeletePayment}
			/>
		</Box>
		<Drawer
		anchor="right"
		variant="temporary"
		open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		{((isDrawerOpened === "ADDPAY") || (isDrawerOpened === "EDITPAY")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={updatePayment}>
				<Typography align="center" className={classes.modalHeader}>
					{((isDrawerOpened === "ADDPAY") ? "New payment" : "Edit payment")+` for ${currentPatient}`}
				</Typography>
				<BlankArea />
				<TextValidator required fullWidth color="primary" type="number" className={gClasses.vgSpacing} 
					id="newName" label="Payment Amount" name="newName"
					onChange={(event) => setEmurAmount(Number(event.target.value))}
					value={emurAmount}
					validators={['minNumber:100']}
					errorMessages={['Invalid Amount']}
				/>
				<Typography>Payment Mode</Typography>
				<FormControl component="fieldset">
				<RadioGroup row aria-label="unitSelect" name="unitSelect" value={paymentMode} 
					onChange={() => {setPaymentMode(event.target.value); }}
				>
				{paymentModeArray.map ( (r, index) =>
				<FormControlLabel key={"MODE"+index} className={gClasses.filterRadio} value={r} control={<Radio color="primary"/>} label={r} />
				)}
				</RadioGroup>
				</FormControl>
				<TextValidator fullWidth color="primary" className={gClasses.vgSpacing} 
					label="Description"
					onChange={(event) => setEmurDesc(event.target.value)}
					value={emurDesc}
				/>
				<ModalResisterStatus />
				<BlankArea />
				<VsButton type ="submit" name= {(isDrawerOpened === "ADDPAY") ? "Add" : "Update"} />
			</ValidatorForm>
		}
		</Box>
		</Drawer>
		{/*<DisplayAllToolTips />*/}
	</div>
  );    
}
