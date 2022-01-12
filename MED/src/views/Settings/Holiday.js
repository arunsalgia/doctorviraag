import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import { InputAdornment, Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import { borders } from '@material-ui/system';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import {setTab} from "CustomComponents/CricDreamTabs.js"
import Drawer from '@material-ui/core/Drawer';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Avatar from "@material-ui/core/Avatar"
import { useAlert } from 'react-alert'
//import validator from 'validator'

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import {dynamicModal } from "assets/dynamicModal";


import Switch from "@material-ui/core/Switch";
import Link from '@material-ui/core/Link';


import {DisplayPageHeader, ValidComp, BlankArea, DisplayYesNo,
DisplayHolidayDetails,
} from "CustomComponents/CustomComponents.js"

import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';

import {
WEEKSTR, MONTHSTR, SHORTMONTHSTR, 
HOURSTR, MINUTESTR,
VISITTYPE,
str1by4, str1by2,  str3by4,
} from 'views/globals';

// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Cancel';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import EventNoteIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import CancelIcon from '@material-ui/icons/Cancel';

//colours 
import { 
red, blue, grey, yellow, orange, pink, green, brown, deepOrange, lightGreen, blueGrey, lime,
} from '@material-ui/core/colors';

import { 
	isMobile, callYesNo,
	disablePastDt, disableFutureDt, disableAllDt,
	validateInteger,
	encrypt, decrypt, 
	left, right,
	intString,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	ordinalSuffix,
	compareDate, makeTimeString,
	getAllPatients,
	vsDialog,
} from "views/functions.js";



const useStyles = makeStyles((theme) => ({
	
	root: {
		width: '100%',
	}, 
	selIndex: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	unselIndex: {
		fontSize: theme.typography.pxToRem(14),
	},
	freeSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	usedSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: grey[500],
	},
	slotboxStyle: {
		borderColor: 'blue', 
		borderRadius: 7, 
		border: 1,
	},
	dateTime: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		backgroundColor: pink[100],
		align: 'center',
		width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		width: '40%'
	}, 
	info: {
			color: blue[700],
	}, 
	filterRadio: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
			color: '#000000',	
	},
	switchText: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	}, 
		orange: {
			backgroundColor: orange[300],
			color: '#000000',
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
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		accordianSummary: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			//backgroundColor: pink[100],
		},
		zeroAppt: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		normalAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: pink[100],
		},
		selectedAccordian: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			backgroundColor: yellow[100],
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: "none", 
		},
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[700]
	},  
	newAppt: {
		backgroundColor: pink[100],
	},
	allAppt: {
		backgroundColor: blue[100],
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	table: {
    //minWidth: 750,
  },
  td : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdPending : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdCancel : {
		backgroundColor: pink[100],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
	tdVisit : {
		backgroundColor: lime[300],
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
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
	wd: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#E0E0E0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	we: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: '#F8BBD0',
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	today: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: green[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	noday: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: blueGrey[300],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	ho: {
		border: 5,
    align: "center",
    padding: "none",
		backgroundColor: yellow[400],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
}));

let d = new Date();
const MINLEFT={month: d.getMonth(), year: d.getFullYear()};

var userCid;
var customerData;

export default function Holiday() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	//gClasses.drawerPaper.width = 300;
	
	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());	
	const [holidayArray, setHolidayArray] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [holidayDate, setHolidayDate] = useState(new Date())
	const [holidayDesc, setHolidayDesc] = useState("");
	

  useEffect(() => {	
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		userCid = sessionStorage.getItem("cid");
		
		const makeSlots  = async () => {
			// check all holidays			
		}
		getHolidays(month, year);
		makeSlots();
  }, []);

	async function getHolidays(mmm, yyy) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/monthly/${userCid}/${yyy}/${mmm}`;
			var resp = await axios.get(myUrl);
			//console.log(resp.data);
			setHolidayArray(resp.data);
		} catch (e) {
			console.log(e);
			setHolidayArray([]);
		}
	}


	function changMonth(idx) {
		let myYear = year;
		let myMonth = month
		if (idx > 0) {
			 ++myMonth;
			if (myMonth === 12) {
				++myYear;
				myMonth = 0;
			}
		} else {
			// check if already at current month and year. If yes, then no shift to prev month
			if ((myMonth === MINLEFT.month) && (myYear === MINLEFT.year))	return;
			--myMonth;
			if (myMonth < 0) {
				--myYear;
				myMonth = 11;
			}
		}
		
		setMonth(myMonth);
		setYear(myYear);
		getHolidays(myMonth, myYear);
	}
	
	function DisplayMonthSelection() {
	return (
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="DOCTYPE" container alignItems="center" >	
		<Grid key="LEFT" item xs={2} sm={2} md={2} lg={2} >
			<IconButton color={'primary'} onClick={() => {changMonth(-1)}}  >
					<LeftIcon />
				</IconButton>
		</Grid>
		<Grid key={"MONTH"} item xs={8} sm={8} md={8} lg={8} >
			<Typography className={classes.slotTitle} >
				{"Holidays of "+MONTHSTR[month]+" "+year}
			</Typography>
		</Grid>
		<Grid key="RIGHT" item xs={2} sm={2} md={2} lg={2} >
			<IconButton color={'primary'} onClick={() => {changMonth(1)}}  >
					<RightIcon />
				</IconButton>
		</Grid>
	</Grid>
	</Box>
	)}

	function handleCancelHoliday(hol) {
		vsDialog("Delete Holiday", `Are you sure you want to delete holiday ${hol.date}/${hol.month}/${hol.year}?`,	
			{label: "Yes", onClick: () => handleCancelHolidayConfirm(hol) },
			{label: "No" }
		);	
	}
	
	async function handleCancelHolidayConfirm(hol) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/delete/${userCid}/${hol.year}/${hol.month}/${hol.date}`;
			var resp = await axios.get(myUrl);
			// success
			let tmp = holidayArray.filter(x => x.year !== hol.year ||
				x.month !== hol.month || x.date !== hol.date);
			//console.log(tmp);
			setHolidayArray(tmp);
			//alert.success("Successfully deleted holiday "+hol.date+"/"+(hol.month+1)+"/"+hol.year);
		} catch (e) {
			console.log(e);
			alert.success("	Error deleting holiday "+hol.date+"/"+(hol.month+1)+"/"+hol.year);
		}
			
	}
	
	function DisplayMonthlyHolidays() {
	return (
	<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
	{holidayArray.map( (a, index) => 
		<Grid key={"HOL"+index} item xs={12} sm={6} md={3} lg={3} >
		{(sessionStorage.getItem("userType") === "Doctor") &&
			<DisplayHolidayDetails 
				holiday={a} 
				button1={
					<IconButton color={'secondary'} size="small" onClick={() => { handleCancelHoliday(a)}}  >
						<CancelIcon />
					</IconButton>
				}
			/>
		}
		{(sessionStorage.getItem("userType") !== "Doctor") &&
			<DisplayHolidayDetails 
				holiday={a} 
			/>
		}
		</Grid>
	)}
	</Grid>	
	)}
	
	function newHoliday() {
		setHolidayDate(new Date(year, month, 1));
		setHolidayDesc("")
		setIsDrawerOpened("NEWHOLIDAY");
	}

	function handleDate(d) {
		//console.log(d);
		setHolidayDate(d.toDate());
	}
	
	async function addNewSubmit() {
		console.log("Command to add new date");
		let myDate=holidayDate.getDate();
		let myMonth=holidayDate.getMonth();
		let myYear=holidayDate.getFullYear();
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/set/${userCid}/${myYear}/${myMonth}/${myDate}/${holidayDesc}`;
			var resp = await axios.get(myUrl);
			// success
			setIsDrawerOpened("");

			if ((myYear === year) && (myMonth === month)) {
				let tmpArray = holidayArray.filter(x => x.date !== myDate || x.month !== myMonth || x.year !== myYear);
				tmpArray = [resp.data].concat(tmpArray);
				tmpArray.sort((a, b) => { 
					return (((a.year*100+a.month)*100 + a.date)) - ((b.year*100 + b.month)*100+b.date)
				});
				setHolidayArray(tmpArray);
			}
			alert.success("Successfully added holiday "+myDate+"/"+(myMonth+1)+"/"+myYear);
		} catch (e) {
			console.log(e);
			aler.error("Selected date is already set as holiday");
		}
	}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Configure Holidays" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	</Container>
	{(sessionStorage.getItem("userType") === "Doctor") &&
		<VsButton name="Add new holiday" align="right" onClick={newHoliday} />
	}
	<DisplayMonthSelection />	
	<DisplayMonthlyHolidays />
	<Drawer
		open={isDrawerOpened !== ""}
		anchor="right"
		variant="temporary"
		classes={{
			paper: gClasses.drawerPaper,
		}}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
	<ValidatorForm align="center" className={gClasses.form} onSubmit={addNewSubmit} >
	<Typography align="center" className={classes.modalHeader}>
		{"New Holiday"}
	</Typography>
	<BlankArea />
	<Datetime 
		className={classes.dateTimeBlock}
		inputProps={{className: classes.dateTimeNormal}}
		timeFormat={false} 
		initialValue={holidayDate}
		dateFormat="DD/MM/yyyy"
		isValidDate={disablePastDt}
		onClose={handleDate}
		closeOnSelect={true}
	/>
	<BlankArea />
	<TextValidator required fullWidth color="primary"
		id="newName" label="Description" name="newName"
		value={holidayDesc}
		onChange={(event) => setHolidayDesc(event.target.value)}
	/>
	<BlankArea />
	<VsButton type="submit" name= {"Add"} />
	</ValidatorForm>
	</Box>
	</Drawer>
  </div>
  );    
}