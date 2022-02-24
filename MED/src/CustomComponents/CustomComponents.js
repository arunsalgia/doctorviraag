import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from "react-tooltip";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import PDFViewer from 'pdf-viewer-reactjs';
import lodashSumBy from 'lodash/sumBy';
import lodashMapBy from 'lodash/map';
//import VsCancel from "CustomComponents/VsCancel";

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {red, blue, green, deepOrange, yellow} from '@material-ui/core/colors';
import {
  validateSpecialCharacters, validateEmail, validateMobile, validateInteger, validateUpi,
	dateString,
  encrypt, decrypt, isMobile,
  currentAPLVersion, latestAPLVersion,
	getImageName,
	dispOnlyAge, dispAge, dispEmail, dispMobile,
	checkIfBirthday,
	ordinalSuffix,
} from "views/functions.js";

import {
HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR, INR,
} from "views/globals.js";


import globalStyles from "assets/globalStyles";


//Icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from 			'@material-ui/icons/Edit';

import InfoIcon from 			'@material-ui/icons/Info';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';

const useStyles = makeStyles((theme) => ({
  title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300],
	},
	paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
	logo: {
    //margin: theme.spacing(1),
    //backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
		//backgroundColor: deepOrange[200],
		borderWidth: 4,
		borderStyle: 'solid',
		margin: 'none',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  jumpButton: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(20),
  },
  jumpButtonFull: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  groupName:  {
    // right: 0,
    fontSize: '14px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  balance:  {
    // right: 0,
    marginRight: theme.spacing(3),
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[900],
    // // position: 'absolute',
    // alignItems: 'center',
    // marginTop: '0px',
  },
  version:  {
    //marginRight: theme.spacing(3),
    fontSize: '18px',
    color: blue[900],
  },
  error:  {
    // right: 0,
    fontSize: '12px',
    color: red[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  successMessage: {
    color: green[300],
  }, 
  failureMessage: {
    color: red[300],
  }, 
  table: {
    // minWidth: 650,
  },
  th: { 
    border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA326',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
	allBlue: {
		backgroundColor: blue[100],
	},
	tdBlue : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300]
	},  
  ngHeader: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  ngCard: {
    backgroundColor: '#B3E5FC',
  },
  divider: {
    backgroundColor: '#000000',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  }
}));

export class BlankArea extends React.Component {
  render() {return <h5></h5>;}
}



export class ValidComp extends React.Component {

  componentDidMount()  {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return (value === this.props.p1)
    });

    ValidatorForm.addValidationRule('minLength', (value) => {
      return (value.length >= 6)
    });

    ValidatorForm.addValidationRule('noSpecialCharacters', (value) => {
      // console.log("Special chars test for: ", value);
      return validateSpecialCharacters(value);
    });

    ValidatorForm.addValidationRule('isNumeric', (value) => {
      // console.log("string: ", value);
      // console.log(value.toString());
      return validateInteger(value.toString());
    });

    ValidatorForm.addValidationRule('isEmailOK', (value) => {
      return validateEmail(value);
    });

    ValidatorForm.addValidationRule('mobile', (value) => {
      return validateMobile(value);
    });

    ValidatorForm.addValidationRule('checkbalance', (value) => {
      return (value >= this.props.balance);
    });

    ValidatorForm.addValidationRule('isUpiOK', (value) => {
      return validateUpi(value);
    });
  }

  
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.removeValidationRule('isEmailOK');
    ValidatorForm.removeValidationRule('mobile');
    ValidatorForm.removeValidationRule('minLength');
    ValidatorForm.removeValidationRule('noSpecialCharacters');   
    ValidatorForm.removeValidationRule('checkbalance'); 
    ValidatorForm.removeValidationRule('isNumeric');    
    ValidatorForm.removeValidationRule('isUpiOK');
  }

  render() {
    return null;
  }

}


export function DisplayPageHeader (props) {
    let msg = "";
    if (props.groupName.length > 0) 
      msg = props.groupName + '-' + props.tournament;
    return (
    <div>
			<br />
      <Typography align="center" component="h1" variant="h5">{props.headerName}</Typography>
    </div>
  );
}

export function DisplayBalance (props) {
  const classes = useStyles();
  return (
  <div>
    <Typography align="right" className={classes.balance} >{`Wallet balance: ${props.balance}`}</Typography>
  </div>
  );
}


export function MessageToUser (props) {
  const gClasses = globalStyles();

  let myClass = props.mtuMessage.toLowerCase().includes("success") ? gClasses.successMessage : gClasses.failureMessage;
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={props.mtuOpen}
        onClose={() => {props.mtuClose(false)}} >
        <DialogTitle id="simple-dialog-title" className={myClass}>{props.mtuMessage}</DialogTitle>
    </Dialog>
  );
}


export class Copyright extends React.Component {
  render () {
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
        Viraag Services
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  }
}

export function DisplayLogo(props) {
	let mylogo = `${process.env.PUBLIC_URL}/image/${props.image}`;
	const gClasses = globalStyles();
	var _label = (props.label !== null) ? props.label : "";
  return (
		<div>
    <Avatar variant="square" onClick={props.onClick} className={gClasses.logo}  src={mylogo}/>
		{(_label != "") &&
			<Typography className={gClasses.title} align="center">{_label}</Typography>
		}
		</div>
);
}

export function CricDreamLogo () {
  let mylogo = `${process.env.PUBLIC_URL}/image/DVLOGO.PNG`;
  const gClasses = globalStyles();
  return (
    <Avatar variant="square" className={gClasses.avatar}  src={mylogo}/>
);
}

export function DisplayVersion(props) {
  const classes = useStyles();
  let ver = props.version.toFixed(1);
  let msg =  `${props.text} ${ver}`;
  return <Typography align="center" className={classes.version} >{msg}</Typography>
}

export async function DisplayCurrentAPLVersion() {
  let version = await currentAPLVersion();
  return <DisplayVersion text="Current APL version" version={version}/>
}

export async function DisplayLatestAPLVersion() {
  let version = await latestAPLVersion();
  return <DisplayVersion text="Latest APL version" version={version}/>
}



export function DisplayPatientDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.patient.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.patient.pid}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Age: </span>
			<span className={gClasses.patientInfo2}>{dispAge(props.patient.age, props.patient.gender)}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.patient.email)}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.patient.mobile)}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}

export function DisplayPatientBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography onClick={props.onClick} >
		<span className={gClasses.patientName} >{props.patient.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography onClick={props.onClick} >
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.patient.pid}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Age: </span>
			<span className={gClasses.patientInfo2}>{dispAge(props.patient.age, props.patient.gender)}</span>
		</Typography>
		{(false) &&
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.patient.email)}</span>
		</Typography>
		}
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.patient.mobile)}</span>
		</Typography>
		<BlankArea />
		</div>
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</Box>
	)}

export function DisplayMedicineDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div key={"MEDDETAILS"+props.medicine.name}align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.medicine.name}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Description: </span>
			<span className={gClasses.patientInfo2}>{props.medicine.description}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Precaution : </span>
			<span className={gClasses.patientInfo2}>{props.medicine.precaution}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayDocumentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.document.date);
	let myDate = DATESTR[d.getDate()] + "/" + MONTHNUMBERSTR[d.getMonth()] + "/" + d.getFullYear().toString().slice(-2);
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
	let _notbrief = (props.brief == null)
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(_notbrief) &&
			<div>
			<div align="center" >
			<Typography>
			<span className={gClasses.patientName}>{props.document.title}</span>
			</Typography>
			</div>
			<div align="left" >
			<Typography>
				<span className={gClasses.patientInfo}>Date: </span>
				<span className={gClasses.patientInfo2}>{myDate+' '+myTime}</span>
			</Typography>
			<Typography>
				<span className={gClasses.patientInfo}>Desc: </span>
				<span className={gClasses.patientInfo2}>
					{(props.document.desc !== "ARUNANKIT") ? props.document.desc : ""}
				</span>
			</Typography>
			<Typography> 
				<span className={gClasses.patientInfo}>Type: </span>
				<span className={gClasses.patientInfo2}>{props.document.type}</span>
			</Typography>
			<BlankArea />
			</div>
			<div align="right">
				{(!_button1) && props.button1}
				{(!_button2) && props.button2}
				{(!_button3) && props.button3}
				{(!_button4) && props.button4}
				{(!_button5) && props.button5}
			</div>
			</div>
		}
		{(!_notbrief) &&
			<Typography>
			<span className={gClasses.patientName}>{props.document.title} {props.button1}</span>
			</Typography>
		}
	</Box>
)}


export function DisplayAppointmentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear();
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.appointment.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.appointment.pid}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Date: </span>
			<span className={gClasses.patientInfo2}>{myDate}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Time: </span>
			<span className={gClasses.patientInfo2}>{myTime}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayAppointmentBox(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear().toString().slice(-2);
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="left">
		<Typography> 
		{/*<span className={gClasses.patientName}>{"Appt.: "}</span>*/}
		<span className={gClasses.patientInfo2}>{myDate+" "+myTime}</span>
		<span style={{paddingLeft: 10}}>
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</span>
		</Typography>
	
		</div>
	</Box>
)}

export function DisplayCustomerBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography >
		<span className={gClasses.patientName} >{props.customer.doctorName+" ("+props.customer.type+")"}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography > 
			<span className={gClasses.patientInfo2}>{props.customer.clinicName}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.customer.email)}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.customer.mobile)}</span>
		</Typography>
		<BlankArea />
		</div>
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</Box>
	)}


export function DisplayHolidayDetails(props) {
	const gClasses = globalStyles();
	
	let myDate = ordinalSuffix(props.holiday.date) + " " + MONTHSTR[props.holiday.month] + " " + props.holiday.year;
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center">
			<Typography>
			<span className={gClasses.patientName}>{myDate}</span>
			</Typography>
		</div>
		<div align="left">
			<Typography > 
			<span className={gClasses.patientInfo}>Desc: </span>
			<span className={gClasses.patientInfo2}>{props.holiday.desc}</span>
		</Typography>
		</div>
		<div align="right">
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
		</div>
	</Box>
)}


export function DisplayPatientName(props) {
	let myText = props.name;
	if (props.id) myText + " (Id: " + props.id
return (
<Typography></Typography>
)}


	
export function DisplayUserDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.user.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.user.email)}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.user.mobile)}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}

export function DisplayImage(props) {
const classes = useStyles();
//console.log(props);
return(	
<Box align="center" width="100%">
	<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
	<BlankArea />
	<img src={`data:${props.mime};base64,${props.file}`}/>
</Box>
)}
	
export function DisplayPDF(props) {
	const classes = useStyles();
	return(	
	<Box align="center" width="100%">
		<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
		<BlankArea />
		<PDFViewer 
			document={{base64: props.file }}
		/>
	</Box>
	)}

export function LoadingMessage() {
return(
<div align="center">
	<Typography>Sorry to keep you waiting. Just give a moment. Loading information from server.....</Typography>
</div>
)}


export function DisplayProfChargeBalance(props) {
	const gClasses = globalStyles();	
	//console.log(props.balance);
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid container className={gClasses.noPadding} key="BALANCE" >
			<Grid key={"BAL1"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.dateSelection} >
					{"Billing: "+INR+props.balance.billing}
				</Typography>
			</Grid>
			<Grid key={"BAL2"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.dateSelection} >
					{"Payment: "+INR+props.balance.payment}
				</Typography>
			</Grid>
			<Grid key={"BAL3"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.dateSelection} >
					{"Due: "+INR+Math.abs(props.balance.due)+((props.balance.due < 0) ? " (Cr)" : "")}
				</Typography>
			</Grid>
			<Grid key={"BAL11"} align="center" item xs={12} sm={12} md={12} lg={12} >
				<Typography className={gClasses.patientInfo2Green} >{"(balance details as on date)"}</Typography>
			</Grid>
		</Grid>	
		</Box>
	);
}

	
export function DisplayProfCharge(props) {
	const gClasses = globalStyles();	
	let _edit =   (props.handleEdit == null);
	let _cancel = (props.handleCancel == null);
	let _receipt = (props.handleReceipt == null);

	let allPids = lodashMapBy(props.patientArray, 'pid');
	let myProfChargeArray = props.profChargeArray.filter(x => allPids.includes(x.pid) );

	let tmp = myProfChargeArray.filter(x => x.amount > 0);
	let myCollection = lodashSumBy(tmp, 'amount');
	tmp = myProfChargeArray.filter(x => x.amount < 0);
	let myBilling = Math.abs(lodashSumBy(tmp, 'amount'));
	let myTotal = myCollection - myBilling;
	//console.log(myCollection, myBilling, myTotal);
	//console.log(myProfChargeArray);
	return (
		<div>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<div>
		<Grid  key={"HDR"} container alignItems="center" >
			<Grid item  align="left" xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Orange}>Date</Typography>
			</Grid>
			<Grid item align="left" xs={5} sm={5} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2Orange}>Name</Typography>
			</Grid>
			{(!isMobile()) &&
			<Grid item align="left" xs={false} sm={false} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Orange}>Description</Typography>
			</Grid>
			}
				<Grid item  align="center" xs={false} sm={false} md={1} lg={1} >
			{(!isMobile()) &&
				<Typography className={gClasses.patientInfo2Orange}>Mode</Typography>
			}
			</Grid>
			{(isMobile()) &&
			<Grid item align="right" xs={4} sm={4} md={false} lg={false} >
				<Typography className={gClasses.patientInfo2Orange}>Amount</Typography>
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="right" xs={false} sm={false} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Orange}>Billing</Typography>
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item  xs={false} sm={false} md={1} lg={1} >
			<Typography align="right" className={gClasses.patientInfo2Orange}>Payment</Typography>
			</Grid>
			}
		</Grid>
		{myProfChargeArray.map( (p, index) => {
			let tmp = props.patientArray.find(x => x.pid === p.pid);
			if (!tmp) return null;
			let myName = tmp.displayName;

			let myDate = dateString(p.date);
			let isBilling = (p.treatment !== "");
			
			let myInfo = "";
			for(let i=0; i<p.treatmentDetails.length; ++i) {
			myInfo += p.treatmentDetails[i].name + ": " + INR +
				(p.treatmentDetails[i].amount - p.treatmentDetails[i].discount);
			if (p.treatmentDetails[i].isDiscount) {
				myInfo += " (after ";
				myInfo += (p.treatmentDetails[i].isPercent) ?
					Math.floor(p.treatmentDetails[i].discount*100/p.treatmentDetails[i].amount) + "% discount)" :
					(INR + p.treatmentDetails[i].discount) + " discount)";
				myInfo += "<br />";
			}
		}

			let myMode = "-";
			if ((p.paymentMode) && (p.paymentMode !== ""))
				myMode =  p.paymentMode;
			let myDesc = (p.description !== "") ? p.description : "Payment by patient"
		//console.log(myMode);
		//console.log(myDesc);
		return (
			<Grid  key={"PAY"+index} container alignItems="center" align="center">
			<Grid item align="left" xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
			</Grid>
			<Grid item align="left" xs={5} sm={5} md={3} lg={3} >
			<Typography>
				<span className={gClasses.patientInfo2}>{myName}</span>
			</Typography>
			</Grid>
			{(!isMobile()) &&
			<Grid item align="left" xs={false} sm={false} md={4} lg={4} >
				<Typography >
				<span className={gClasses.patientInfo2}>{myDesc}</span>
				{(isBilling) &&
					<span align="left"
						data-for={"TREAT"+p.tid}
						data-tip={myInfo}
						data-iscapture="true"
					>
					<InfoIcon color="primary" size="small"/>
					</span>
				}
				</Typography>
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="center" xs={false} sm={false} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myMode}</Typography>
			</Grid>
			}
			{(isMobile()) &&
			<Grid item align="right" xs={3} sm={3} md={false} lg={false} >
				<Typography>
					<span className={gClasses.patientInfo2}>
					{INR+Math.abs(p.amount)}
					</span>
				</Typography>
			</Grid>
			}
			{(isMobile()) &&
			<Grid item align="center" xs={1} sm={1} md={false} lg={false} >
				<Typography>
					<span className={gClasses.patientInfo2}>
					{(p.amount > 0) ? " CR" : ""}
					</span>
					{(isBilling) &&
					<span align="left"
							data-for={"TREAT"+p.tid}
							data-tip={myInfo}
							data-iscapture="true"
						>
						<InfoIcon color="primary" size="small"/>
					</span>
					}
				</Typography>
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="right" xs={false} sm={false} md={1} lg={1} >
				{(p.amount <= 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
				}
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="right" xs={3} sm={3} md={1} lg={1} >
				{(p.amount > 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+p.amount}</Typography>
				}
			</Grid>
			}
			</Grid>
		)}
		)}
		{(!isMobile()) &&
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={4} sm={4} md={9} lg={9} >
				<Typography className={gClasses.patientInfo2Green}>{"Grand Total"}</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myBilling}</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myCollection}</Typography>
			</Grid>
		</Grid>
		}
		{(isMobile()) &&
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={8} sm={8} md={false} lg={false} >
				<Typography className={gClasses.patientInfo2Green}>{"Amount Due: "}</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={false} lg={false} >
				<Typography className={gClasses.patientInfo2Green}>{INR+Math.abs(myTotal)+((myTotal > 0) ? " CR" : "")}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={false} lg={false} />
			</Grid>
		}
		</div>
		</Box>
		<DisplayAllToolTips profChargeArray={props.profChargeArray} />
		</div>
)}

	
export function DisplayProfCharge_WO_Name(props) {
	const gClasses = globalStyles();	
	let _edit =   (props.handleEdit == null);
	let _cancel = (props.handleCancel == null);
	let _receipt = (props.handleReceipt == null);
	let tmp = props.profChargeArray.filter(x => x.amount > 0);
	let myCollection = lodashSumBy(tmp, 'amount');
	tmp = props.profChargeArray.filter(x => x.amount < 0);
	let myBilling = Math.abs(lodashSumBy(tmp, 'amount'));
	let myTotal = myCollection - myBilling;
	return (
		<div>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<div>
		<Grid  key={"HDR"} container alignItems="center" >
			<Grid item  align="left" xs={3} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Date</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={5} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2Orange}>Description</Typography>
			</Grid>
			{(!isMobile()) &&
			<Grid item  align="left" xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Mode</Typography>
			</Grid>
			}
			{(isMobile()) &&
			<Grid item align="right" xs={2} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Amount</Typography>
			</Grid>
			}
			{(isMobile()) &&
			<Grid item align="right" xs={1} sm={1} md={2} lg={2} >
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="right" xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Orange}>Billing</Typography>
			</Grid>
			}
			{(!isMobile()) &&			
			<Grid item  xs={3} sm={3} md={2} lg={2} >
			<Typography align="right" className={gClasses.patientInfo2Orange}>Collection</Typography>
			</Grid>
			}
			<Grid item xs={2} sm={1} md={1} lg={1} >
			</Grid>
		</Grid>
		{props.profChargeArray.map( (p, index) => {
			let tmp = props.patientArray.find(x => x.pid === p.pid);
			if (!tmp) return null;
			let myName = tmp.displayName;
			let myDate = dateString(p.date);
			let isBilling = (p.treatment !== "");
			let myInfo = "";
			for(let i=0; i<p.treatmentDetails.length; ++i) {
				myInfo += p.treatmentDetails[i].name + ": " + INR +
					(p.treatmentDetails[i].amount - p.treatmentDetails[i].discount);
				if (p.treatmentDetails[i].isDiscount) {
					myInfo += " (after ";
					myInfo += (p.treatmentDetails[i].isPercent) ?
						Math.floor(p.treatmentDetails[i].discount*100/p.treatmentDetails[i].amount) + "% discount)" :
						(INR + p.treatmentDetails[i].discount) + " discount)";
				}
				myInfo += "<br />";
			}
			//let myDIscount = lodashSumBy(p.treatmentDetails,'amount')+p.amount;
			//if (myDIscount !== 0)	myInfo += "Discount: "+myDIscount;
			//console.log(myInfo);
			
			let myMode = ((p.paymentMode) && (p.paymentMode !== "")) ? p.paymentMode : "-";
			//console.log(myMode);
			
			//console.log(p.description);
			let myActualDesc = p.description.startsWith("Professional charges") ? p.description.substr(0, p.description.length - 17) : p.description;
			if (myActualDesc === "") myActualDesc = "payment";
			
			
		return (
			<Grid  key={"PAY"+index} container alignItems="center" align="center">
			<Grid item align="left" xs={3} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={6} md={3} lg={3} >	
			<Typography>
				<span className={gClasses.patientInfo2}>{myActualDesc}</span>
				{(isBilling) &&
					<span align="left"
						data-for={"TREAT"+p.tid}
						data-tip={myInfo}
						data-iscapture="true"
					>
					<InfoIcon color="primary" size="small"/>
					</span>
				}
			</Typography>
			</Grid>
			{(!isMobile()) &&
			<Grid item align="left" xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{myMode}</Typography>
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item item align="right"  xs={4} sm={4} md={2} lg={2} >
				{(p.amount < 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
				}
			</Grid>
			}
			{(!isMobile()) &&
			<Grid item align="right" xs={3} sm={3} md={2} lg={2} >
				{(p.amount > 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+p.amount}</Typography>
				}
			</Grid>
			}
			{(isMobile()) &&			
			<Grid item align="right" xs={2} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
			</Grid>
			}
			{(isMobile()) &&			
			<Grid item xs={1} sm={1} md={2} lg={2} >
				<div>
				{(isBilling) &&
					<Typography>
					<span align="left"
						data-for={"TREAT"+p.tid}
						data-tip={myInfo}
						data-iscapture="true"
					>
					<InfoIcon color="primary" size="small"/>
					</span>
					</Typography>
				}
				{(!isBilling) &&
					<Typography className={gClasses.patientInfo2}> CR</Typography>
				}
				</div>
			</Grid>
			}
			<Grid item xs={2} sm={1} md={1} lg={1} >
				{(!isBilling) &&
				<div>
					{(!_edit) &&  
						<EditIcon color="primary" size="small" onClick={() =>  props.handleEdit(p)}  />
					}
					{(!_cancel) &&  
						<CancelIcon color="secondary" size="small" onClick={() =>  props.handleCancel(p)}  />
					}
				</div>
				}
				{((isBilling) && (!_receipt)) &&
					<div>
					<ReceiptRoundedIcon color="primary" size="small" onClick={() =>  props.handleReceipt(p)}  />
					</div>
				}				
			</Grid>
			</Grid>
		)}
		)}
		<br />
		{(!isMobile()) &&
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={4} sm={4} md={7} lg={7} >
				<Typography className={gClasses.patientInfo2Green}>{"Grand Total"}</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myBilling}</Typography>
			</Grid>
			<Grid item align="right" xs={3} sm={3} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myCollection}</Typography>
			</Grid>
			<Grid item align="right" xs={2} sm={2} md={1} lg={1} />
		</Grid>
		}
		{(isMobile()) &&
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={7} sm={8} md={7} lg={7} >
				<Typography className={gClasses.patientInfo2Green}>{"Amount Due"}</Typography>
			</Grid>
			<Grid item align="right" xs={2} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Green}>{INR+Math.abs(myTotal)}</Typography>
			</Grid>
			<Grid item align="center" xs={1} sm={1} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Green}>{(myTotal > 0) ? "CR" : ""}</Typography>
			</Grid>
			<Grid item align="right" xs={2} sm={1} md={1} lg={1} />
		</Grid>
		}
		</div>
		</Box>
		<DisplayAllToolTips profChargeArray={props.profChargeArray} />
		</div>
)}


export function DisplayAllToolTips(props) {
	let myArray = props.profChargeArray.filter(x => x.treatment !== "");
	return(
		<div>
		{myArray.map( t =>
			<ReactTooltip key={"TT"+t.tid} type="info" effect="float" id={"TREAT"+t.tid} multiline={true}/>
		)}
		</div>
	)}	

export function DisplayPatientHeader(props) {
const gClasses = globalStyles();	
let patRec = props.patient;
let isBirthday = checkIfBirthday(patRec.dob);
return (
<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
<Grid className={gClasses.noPadding} key="AllPatients" container align="left">
	<Grid key={"PAT0"} item xs={12} sm={6} md={4} lg={4} >
		<Typography>
			<span className={gClasses.patientInfo}>Patient: </span>
			<span className={gClasses.patientInfo2Green}>{patRec.displayName+" ("+dispAge(patRec.age, patRec.gender)+")"}</span>
		</Typography>
	</Grid>
	<Grid key={"PAT1"} item xs={12} sm={6} md={2} lg={2} >
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2Green}>{patRec.pid}</span>
		</Typography>
	</Grid>
	<Grid key={"PAT2"} item xs={12} sm={6} md={3} lg={3} >
		<Typography>
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2Green}>{dispEmail(patRec.email)}</span>
		</Typography>
	</Grid>		
	<Grid key={"PAT3"} item xs={12} sm={6} md={3} lg={3} >
		<Typography>
			<span className={gClasses.patientInfo}>Contact: </span>
			<span className={gClasses.patientInfo2Green}>{dispMobile(patRec.mobile)}</span>
		</Typography>
	</Grid>	
	{(isBirthday) &&
	<Grid key={"PAT11"} item xs={12} sm={12} md={12} lg={12} >
		<Typography>
			<span className={gClasses.patientInfo2Blue}>{"Many many happy returns of the day "+patRec.displayName}</span>
		</Typography>
	</Grid>
	}
</Grid>	
</Box>
)}	

export function DisplayCustomerHeader(props) {
	const gClasses = globalStyles();	
	let patRec = props.customer;
	//let isBirthday = checkIfBirthday(patRec.dob);
	//console.log(patRec);
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
	<Grid className={gClasses.noPadding} key="AllPatients" container align="left">
		<Grid key={"PAT0"} item xs={12} sm={6} md={3} lg={3} >
			<Typography>
				<span className={gClasses.patientInfo2Green}>{patRec.doctorName}</span>
			</Typography>
		</Grid>
		<Grid key={"PAT1"} item xs={12} sm={6} md={3} lg={3} >
			<Typography>
				<span className={gClasses.patientInfo2Green}>{patRec.clinicName}</span>
			</Typography>
		</Grid>
		<Grid key={"PAT2"} item xs={12} sm={6} md={3} lg={3} >
			<Typography>
				<span className={gClasses.patientInfo}>Email: </span>
				<span className={gClasses.patientInfo2Green}>{dispEmail(patRec.email)}</span>
			</Typography>
		</Grid>		
		<Grid key={"PAT3"} item xs={12} sm={6} md={3} lg={3} >
			<Typography>
				<span className={gClasses.patientInfo}>Mob.: </span>
				<span className={gClasses.patientInfo2Green}>{dispMobile(patRec.mobile)}</span>
			</Typography>
		</Grid>	
	</Grid>	
	</Box>
	)}