import React, {useEffect, useState, createContext }  from 'react';
import { Container } from '@material-ui/core';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
//import lodashSortBy from "lodash/sortBy"
import lodashCloneDeep from 'lodash/cloneDeep';
import { useAlert } from 'react-alert'
import Grid from "@material-ui/core/Grid";

import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import VsCancel from "CustomComponents/VsCancel";
import VsButton from "CustomComponents/VsButton";
//import VsCheckBox from "CustomComponents/VsCheckBox";

import Wallet from "views/SuperUser/Wallet"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

// styles
import globalStyles from "assets/globalStyles";

import {ValidComp, BlankArea, DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"

import useScript from 'CustomComponents/useScript';

import { dispEmail, disablePastDt, vsDialog,  encrypt} from 'views/functions';
import { DATESTR, MONTHNUMBERSTR } from 'views/globals';
import { dispMobile } from 'views/functions';
import { compareDate } from 'views/functions';

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';


var orderId=""; 
function setOrderId(sss) { orderId = sss; }
let userCid; 
export default function PanelDoctor() {
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [panelSubscribed, setPanelSubscribed] = useState(false);
	const [currentCustomer, setCurrentCustomer] = useState("");
	const [customerData, setCustomerData] = useState({});

	const [emurDate1, setEmurDate1] = useState(moment());
	
	const [emurData, setEmurData] = useState({});
	const [emurText1, setEmurText1] = useState("");
	const [emurText2, setEmurText2] = useState("");


  useEffect(() => {	
		let cData = JSON.parse(sessionStorage.getItem("customerData"));
		userCid = cData._id;
		setCustomerData(cData);
		checkIfPanelSubscribed();
  }, []);


	async function checkIfPanelSubscribed() {
		//	http://localhost:4000/addon/hassubscribedpaneldoctor/61454cba236fba38bc29bce4
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/addon/hassubscribedpaneldoctor/${userCid}`;
			let resp = await axios.get(myUrl);
			setPanelSubscribed(resp.data.status);
		} catch (e) {
			console.log(e)
			alert.error(`Error in checking panel subscription.`);
		}
	}

  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
			case 0:
				myMsg = "";
				break;
      case 200:
        // setCustName("");
        // setPassword("");
        // setRepeatPassword("");
        // setEmail("");
        myMsg = `User ${custName} successfully regisitered.`;
        break;
      case 602:
        myMsg = "User Name already in use";
        break;
      case 603:
        myMsg = "Email id already in use";
        break;
			case 1001:
				myMsg = "Festival date should be part of atleast 1 Pack";
				break;
			case 1002:
					myMsg = "Selected festival date already added";
					break;
			default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }


	async function updateCustomer(rec) {
		let myData = encodeURIComponent(JSON.stringify(rec));
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/update/${myData}`);
			return {success: true, data: resp.data}
		} catch (e) {
			console.log(e);
			return {success: false}
		}
	}


	function addNewPanelDoctor() {
		setEmurText1("");
		setEmurText2("");
		setIsDrawerOpened("ADDPANEL");
	}

	function editPanelDoctor(d)  {
		setEmurData(d);
		setEmurText1(d.name);
		setEmurText2(d.mobile);
		setIsDrawerOpened("EDITPANEL");
	}

	function removelPanelDoctor(name) {
		vsDialog("Remove Panel Doctor", `Are you sure you want to remove ${name} from Panel?`,
			{label: "Yes", onClick: () => removePanelDoctorConfirm(name) },
			{label: "No" }
		);
	}

	function removePanelDoctorConfirm(name) {
		
		let myIndex = customerData.doctorPanel.indexOf(name);
		let myDoctor = customerData.doctorPanel.filter(x => x !== name);

		let mobile = customerData.doctorMobile[myIndex];
		let myMobile = customerData.doctorMobile.filter(x => x !== mobile);
	
		console.log(myDoctor, myMobile);
		updatePanelDoctors(myDoctor, myMobile);
	}

	async function handleAddEditPanel() 
	{
		let newDocList = customerData.doctorPanel;
		let newMobList = customerData.doctorMobile;
		if (isDrawerOpened === "ADDPANEL") {
			// check for duplicate
			let tmp = customerData.doctorPanel.find( x => x === emurText1);
			if (tmp) return alert.error(`${emurText1} already in the panel list.`);
			newDocList = newDocList.concat([emurText1]);
			newMobList = newMobList.concat([emurText2]);
		} else {
			// Check if name of doctor changed
			if (emurText1.toLowerCase() !== emurData.name.toLowerCase()) {
				let tmp = customerData.doctorPanel.find( x => x === emurText1);
				if (tmp) {
					return alert.error(`${emurText1} already in the panel list.`);
				}
			}
			let myIndex = newDocList.indexOf(emurData.name);
			newDocList[myIndex] = emurText1;
			newMobList[myIndex] = emurText2;
		}
		updatePanelDoctors(newDocList, newMobList);
		setIsDrawerOpened("");
	}

	async function updatePanelDoctors(newDocList, newMobList) {
		let tmp = encodeURIComponent(JSON.stringify({name: newDocList, mobile: newMobList}));;
		try {
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/customer/updatepaneldoctors/${userCid}/${tmp}`);
			setCustomerData(resp.data);
			sessionStorage.setItem("customerData", JSON.stringify(resp.data));
		} catch (e) {
			alert.error("Error updating panel doctors");
		}
	}

	function DisplayPanelDoctors() {
		//console.log(customerData.doctorPanel);
		//console.log(customerData.doctorMobile);
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsButton name="Add new Doctor" align="right" onClick={addNewPanelDoctor} />
	<Container component="main" maxWidth="sm">
	{customerData.doctorPanel.map( (d, index) => {
		//console.log(d);
		//console.log(customerData.doctorMobile[index]);
	return(
		<Box key={"PD"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1}>
		<Grid className={gClasses.noPadding} key={"PANEL"+index} container >
		<Grid align="left" item xs={5} sm={5} md={5} lg={5} >
			<span className={gClasses.patientInfo2Blue}>{d}</span>
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<span className={gClasses.patientInfo2Blue}>{customerData.doctorMobile[index]}</span>
		</Grid>
		<Grid align="right" item xs={2} sm={2} md={2} lg={2} >
			<EditIcon color="primary" size="small" onClick={() => editPanelDoctor({ name: d, mobile: customerData.doctorMobile[index] } )} />
			<CancelIcon color="secondary" size="small" onClick={() => removelPanelDoctor(d) } />
		</Grid>
		</Grid>
		</Box>
	)})}
	</Container>
	</Box>	
	)}

	function handleDate1(d) {
		//console.log(d);
		setEmurDate1(d);
	}

	return (
  <div className={gClasses.webPage} align="center" key="main">
	<br />
	<DisplayPageHeader headerName="Patient Directory" groupName="" tournament=""/>
	<br />
	{(!panelSubscribed) &&
		<Typography>Panel not subscribed</Typography>
	}
	{(panelSubscribed) &&
		<DisplayPanelDoctors customer={customerData} />
	}
	<Drawer anchor="right" variant="temporary"	open={isDrawerOpened !== ""} >
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	{((isDrawerOpened === "ADDPANEL") || (isDrawerOpened === "EDITPANEL")) &&
	<ValidatorForm className={gClasses.form} onSubmit={handleAddEditPanel}>
 		<Typography className={gClasses.title}>{(isDrawerOpened === "ADDPANEL") ? "Add New Panel Doctor" : "Edit Panel Doctor details"}</Typography>
		 <br />
		<TextValidator fullWidth label="Panel Doctor Name" className={gClasses.vgSpacing}
			value={emurText1}
			onChange={(event) => setEmurText1(event.target.value)}
			validators={['noSpecialCharacters']}
			errorMessages={[`Special Characters not permitted`]}
		/>
		<TextValidator required fullWidth label="Panel Doctor Mobile Number" type="number" className={gClasses.vgSpacing}
			value={emurText2}
			onChange={(event) => setEmurText2(event.target.value)}
			validators={['minNumber:1000000000', 'maxNumber:9999999999']}
			errorMessages={['Invalid Mobile Number','Invalid Mobile Number']}
		/>
		<ShowResisterStatus/>
		<BlankArea/>
		<VsButton align="center"  type="submit" name={(isDrawerOpened === "ADDPANEL") ? "Add Panel Doctor" : "Edit Panel Doctor"} />
		<ValidComp /> 
	</ValidatorForm>
	}
	</Box>
	</Drawer>		
 </div>
  );    
}