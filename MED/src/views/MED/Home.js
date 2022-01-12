import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import VsButton from "CustomComponents/VsButton";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Avatar from '@material-ui/core/Avatar';
import { spacing } from '@material-ui/system';
import globalStyles from "assets/globalStyles";
import { InputAdornment, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import { Switch, Route, Link } from 'react-router-dom';
// import Table from "components/Table/Table.js";
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { UserContext } from "../../UserContext";
import { DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { encrypt, clearBackupData, hasGroup, upGradeRequired, downloadApk } from 'views/functions';
import { red, blue, deepOrange, grey } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions";
import CardFooter from "components/Card/CardFooter.js";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {setTab} from "CustomComponents/CricDreamTabs.js"
import Divider from '@material-ui/core/Divider';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';


// import NEWTOURNAMENTIMAGE from `${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG`;

const cardStyles = {
  cardImage: {
		padding: "1px 1px", 
		margin: "1px 1px", 
  }
};


const useStyles = makeStyles((theme) => ({
	boxColor: {
		backgroundColor: grey[100],
	},
	cardImage: {
		padding: "1px 1px", 
		margin: "1px 1px", 
  },
	title: {
		margin: "10px", 
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: 'blue',
	},
	message: {
		align: "left",
		margin: "10px", 
		fontSize: theme.typography.pxToRem(16),
	},
	welcome: {
		margin: "30px", 
		fontSize: theme.typography.pxToRem(32),
		fontWeight: theme.typography.fontWeightBold,
		color: deepOrange[900],
	},
}));


//const PATIENTMSG="The patient's anatomy always always should be respected, even if it is absolutely contrary - the decision is contrary to best medical advice and what the physician wahts";
const PATIENTMSG=      "The patient's anatomy always always should be respected by the Doctor, even if it is absolutely contrary.";
const APPOINTMENTMSG = "Events do not just happen, but arrive by appointment. Don't make a wish, make an appointment."
const VISITMSG =       "Remember visit to Dentist is a two-way street, you are in clinic for your Dental health and so is the Doctor."
const REPORTMSG =      "The medical report card helps give us a focus and it frames the dialogue for moving forward.";
const MEDICINEMSG =    "Wherever the art of Medicine is loved, there is also a love of Humanity. Love your medicine";

const cardStyle = {padding: "5px 10px", margin: "4px 4px", backgroundColor: blue[100], color: 'black', fontSize:'14px', borderRadius:7, border: 2};	

const cardData = [
{image: "APPOINTMENT.JPG", 	title: "Appointment", 	message: APPOINTMENTMSG, 	setpos: process.env.REACT_APP_APPT},
{image: "VISIT.JPG",       	title: "Visit",       	message: VISITMSG,       	setpos: process.env.REACT_APP_VISIT},
{image: "PATIENT.JPG",     	title: "Patient",     	message: PATIENTMSG,     	setpos: process.env.REACT_APP_PATIENT},
{image: "REPORT.JPG",     	title: "Report",     		message: REPORTMSG,     		setpos: process.env.REACT_APP_REPORT},
{image: "MEDICINE.JPG",     title: "Medicine",      message: MEDICINEMSG,      setpos: process.env.REACT_APP_MEDICINE},
];


export default function Home() {
    // const { setUser } = useContext(UserContext);
    // window.onbeforeunload = () => setUser("")
	const classes = useStyles();
	const gClasses = globalStyles();
	const [custInfo, setCustInfo] = useState({});

    useEffect(() => {
		const getCustomerInfo = async () => {		
			try {
				let tmp = JSON.parse(sessionStorage.getItem("customerData"));
				setCustInfo(tmp);
				//console.log(tmp)
			} catch (e) {
				console.log(e);
			}
		}
		//console.log(sessionStorage.getItem("cid"));
		getCustomerInfo();
    }, [])

 
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{(sessionStorage.getItem("userType") === "Developer") &&
		<Typography className={classes.welcome}>{"Welcome Doctor Viraag"}</Typography>
	}
	{(sessionStorage.getItem("userType") !== "Developer") &&
		<Typography className={classes.welcome}>{custInfo.welcomeMessage}</Typography>
	}
	<Grid container key="ALLITEMS" >
		<Grid item key={"ITEM0"} xs={false} sm={false} md={false} lg={1} />
		{cardData.map( (item, index) =>
			<Grid item key={"ITEM"+index} xs={12} sm={6} md={6} lg={2} >
				<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} 
				onClick={() => {setTab(item.setpos)}}
				>
				<img className={classes.cardImage} src={`${process.env.PUBLIC_URL}/image/${item.image}`} alt="ARUN" />
				<Typography className={classes.title}>{item.title}</Typography>
				<div align="left">
				<Typography className={classes.message}>{item.message}</Typography>
				</div>
				</Box>
			</Grid>
		)} 
	<Grid item key={"ITEM100"} xs={false} sm={false} md={false} lg={1} />
	</Grid>
	</Container>
	</div>
	);
}
