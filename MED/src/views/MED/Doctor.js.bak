import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import RadioGroup from '@material-ui/core/RadioGroup'; 
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Switch from "@material-ui/core/Switch";
//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar"
import { useHistory } from "react-router-dom";
import lodash from 'lodash';

// import CardAvatar from "components/Card/CardAvatar.js";
// import { UserContext } from "../../UserContext";
import { isUserLogged, isMobile, encrypt, decrypt, callYesNo, updatePatientByFilter,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
	cdRefresh ,
 } from "views/functions.js"
import {DisplayYesNo, DisplayPageHeader, BlankArea,
DisplayPatientDetails,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";

// icons
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
//import CancelIcon from '@material-ui/icons/Cancel';

import {red, blue, yellow, orange, deepOrange, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const useStyles = makeStyles((theme) => ({
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	th: { 
		border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
	},  
	tdBonus: {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdWallet : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  wallet : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#B3E5FC',
  },
  bonus : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    backgroundColor: '#FFC0CB',
  },
}));
  


let searchText = "";
function setSearchText(sss) { searchText = sss;}


var userCid;
export default function Doctor() {

  const classes = useStyles();
	const gClasses = globalStyles();

	const [doctorArray, setDoctorArray] = useState([]);
	const [masterDoctorArray, setMasterDoctorArray] = useState([])
	const [categary, setCategary] = useState([]);
	const [radioValue, setRadioValue] = useState("All");
	
  useEffect(() => {
		const getDoctors = async () => {
			try {
			var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/doctor/list`);
				setMasterDoctorArray(response.data);
				setDoctorArray(response.data);
				let allCat = [...new Set(response.data.map(item => item.type))]; // [ 'A', 'B']
				allCat = ["All"].concat(allCat);
				console.log(allCat);
				setCategary(allCat);
			} catch (e) {
				console.log(e);
			}
		}
		userCid = sessionStorage.getItem("cid");
		getDoctors();
  }, [])

	function handleRadioChange(v) {
		console.log(v);
		setRadioValue(v);
		let tmp = (v === "All") ? [].concat(masterDoctorArray) : masterDoctorArray.filter(x => x.type === v);
		setDoctorArray(tmp);
	}
	
	function DisplayFilterRadios() {
	return (	
		<FormControl component="fieldset">
		<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
			onChange={() => {handleRadioChange(event.target.value); }}
		>
		{categary.map( (a, index) =>
			<FormControlLabel className={classes.filterRadio} value={a}	control={<Radio color="primary"/>} label={a} />
		)}
		</RadioGroup>
	</FormControl>
	)}
	
	function DisplayRadios() {
	return (
		<Box className={classes.allAppt} border={1} width="100%">
			<TableContainer>
			<Table style={{ width: '100%' }}>
			<TableHead>
				<TableRow align="center">
					<TableCell key={"TH1"} component="th" scope="row" align="center" padding="none"
					className={classes.th} colSpan={1}>
					{"Doctors Directory"}
					</TableCell>
				</TableRow>
				<TableRow align="center">
					<TableCell key={"TH3"} component="th" scope="row" align="center" padding="none"
						className={classes.th} colSpan={1}>
						<DisplayFilterRadios />
					</TableCell>
				</TableRow>
			</TableHead>
			</Table>
			</TableContainer>
		</Box>		
	)}
	

	function DisplayDoctor(props) {
	console.log(doctorArray);
	return(
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.doctor.name}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
		<span className={gClasses.patientInfo}>{props.doctor.type}</span>
		</Typography>
		<Typography>
		<span className={gClasses.patientInfo}>{props.doctor.clinicName}</span>
		</Typography>
		<Typography className={gClasses.patientInfo}> 
			{props.doctor.addr1}
		</Typography>
		<Typography className={gClasses.patientInfo}> 
			{props.doctor.addr2}
		</Typography>
		<Typography className={gClasses.patientInfo}> 
			{props.doctor.addr3}
		</Typography>
		<Typography className={gClasses.patientInfo}> 
			{"Email: "+ props.doctor.email}
		</Typography>
		<Typography className={gClasses.patientInfo}> 
			{"Mobile: "+ props.doctor.mobile}
		</Typography>
		<BlankArea />
		</div>
		</Box>
	)}

	function handleWelcome() {
		sessionStorage.setItem("currentLogin",""); 
		cdRefresh();
		console.log("Calling welcome");
	}
	
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		<DisplayPageHeader headerName="Doctor Directory" groupName="" tournament=""/>
		<BlankArea />
		<div align="right">
		<Button variant="contained" color="primary" 
		onClick={() => {sessionStorage.setItem("currentLogin",""); cdRefresh();}}
		className={classes.doctorButton}
		>
		Back
		</Button>
		</div>
		<BlankArea />
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<DisplayRadios />
			<BlankArea />
			<Grid className={gClasses.noPadding} key="AllPatients" container alignItems="center" >
			{doctorArray.map( (d, index) => 
				<Grid key={"DR"+d.name} item xs={12} sm={6} md={4} lg={4} >
				<DisplayDoctor 
					doctor={d} 
				/>
				</Grid>
			)}
		</Grid>
		</Box>	
		</ Container>
  </div>
  );    
}

