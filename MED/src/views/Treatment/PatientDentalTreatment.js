import React, { useEffect, useState, useContext } from 'react';
import { TextareaAutosize, TextField, CssBaseline } from '@material-ui/core';
import axios from "axios";


import lodashSortBy from "lodash/sortBy"
import lodashSumBy from "lodash/sumBy"


import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';


// import the stylesheet
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";

// icons
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';



import {
DATESTR, MONTHNUMBERSTR, MAGICNUMBER, INR,
} from "views/globals.js";



const MAXDISPLAYTEXTROWS=12;
const MAXEDITTEXTROWS=25;

var userCid;
export default function PatientDentalTreatment(props) {
  
  //const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState("Treatment");

	//const [currentPatient, setCurrentPatient] = useState("");
	//const [currentPatientData, setCurrentPatientData] = useState({});
	
	const [treatmentIndex, setTreatmentIndex] = useState(0);
	const [treatmentArray, setTreatmentArray] = useState([]);
	
	//const [myToothArray, setmyToothArray] = useState([11, 13, 26, 28, 41, 47, 33, 34]);


	
  useEffect(() => {	
		//console.log("P1");
		userCid = sessionStorage.getItem("cid");
		let patRec = props.patient;	
		//setCurrentPatientData(patRec);
		//setCurrentPatient(patRec.displayName);
		getPatientTreatment(patRec);
		//console.log("P2");
		//checkPatient();
		//getAllTreatType();
  }, []);

	
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
			//setCurrentSelection("Treatment");	
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
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="Treatment" />
		<DisplayFunctionItem item="Plan" />
		{/*<DisplayFunctionItem item="Notes" />*/}
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

	function DisplayTreatmentDates() {
		let myDate = "No Treatment history available";
		if (treatmentArray.length > 0) {
			//console.log(treatmentIndex, treatmentArray);
			let v = treatmentArray[treatmentIndex];
			let d = new Date(v.treatmentDate);
			myDate = `Treatment dated ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			if (v.treatmentNumber === MAGICNUMBER)
					myDate += "(New)";
			else {
			}
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
				<Typography className={gClasses.dateSelection} >
					{myDate}
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

	

	function ArunTreatment() {
		if (treatmentArray.length === 0) return null;
		let x = treatmentArray[treatmentIndex];
		//console.log(x.treatment);
		return (
			<div> 
			<Box borderColor="primary.main" border={1}>
			{x.treatment.map( (un, index) => {
				let arr = lodashSortBy(un.toothArray).toString();
				//console.log(arr);
				return (
					<Grid  key={"NOTES"+index} container >
					<Grid item align="left" xs={12} sm={3} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2}>{"Treatment: "+un.name}</Typography>
					</Grid>
					<Grid item align="left" xs={12} sm={7} md={7} lg={7} >
						{/*\<DisplayTeeth toothArray={un.toothArray} />*/}
						<Typography className={gClasses.patientInfo2}>{arr}</Typography>
					</Grid>
					<Grid item align="right" xs={10} sm={1} md={1} lg={1} >
						<Typography className={gClasses.patientInfo2}>{INR+un.amount}</Typography>
					</Grid>
					<Grid item xs={2} sm={1} md={1} lg={1} >
					</Grid>
					</Grid>
				)}
			)}
			</Box>
			{/*<Box borderColor="primary.main" border={1}>*/}
			<Grid  key={"PC"} container >
			<Grid item align="right" xs={9} sm={9} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{"Total Professional Charges: "}</Typography>
			</Grid>
			<Grid item xs={3} sm={3} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{INR+" "+lodashSumBy(x.treatment, 'amount')}</Typography>
			</Grid>
			</Grid>
			{/*</Box>*/}
			</div>
		)}
		


	function ArunPlan() {
		if (treatmentArray.length === 0) return null;
		let myPlan =  treatmentArray[treatmentIndex].plan;
		//console.log(myPlan)
		//let myNumber = treatmentArray[treatmentIndex].treatmentNumber;
		//setTreatmentPlan(myPlan);
		return (
		<Box borderColor="primary.main" border={1}>
		<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed} readOnly value={myPlan} />
		</Box>
	)}

	return (
	<div>
	<DisplayTreatmentDates />
	<DisplayFunctionHeader />
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(currentSelection === "Treatment") &&
			<ArunTreatment />
		}
		{(currentSelection === "Plan") &&
			<ArunPlan />
		}
	</Box>
	</div>
 );    
}
