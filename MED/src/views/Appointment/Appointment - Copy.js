import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { Container, CssBaseline } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel"
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from 'CustomComponents/VsRadioGroup';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { useAlert } from 'react-alert'
import Drawer from '@material-ui/core/Drawer';
import lodashSortBy from "lodash/sortBy"

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';



// styles
import globalStyles from "assets/globalStyles";

import {DisplayPageHeader, ValidComp, BlankArea,
DisplayPatientBox,
DisplayAppointmentDetails, DisplayAppointmentBox,
DisplayPatientHeader,
} from "CustomComponents/CustomComponents.js"



import {
GENDER,
WEEKSTR, SHORTWEEKSTR,
HOURSTR, MINUTESTR,
MONTHSTR, DATESTR, MONTHNUMBERSTR,
VISITTYPE,
BLOCKNUMBER,
} from 'views/globals';

// icons
import EventNoteIcon from '@material-ui/icons/EventNote';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from 			'@material-ui/icons/Edit';

import { 
	isMobile, 
	disablePastDt, disableFutureDt,
	validateInteger,
	encrypt, decrypt, 
	compareDate,
	getAllPatients,
	vsDialog,
	generateOrder, generateOrderByDate,
} from "views/functions.js";

const MINUTEBLOCK = [0, 15, 30, 45];

//const menuModal = (isMobile()) ? dynamicModal('50%') : dynamicModal('20%');
//const yesNoModal = dynamicModal('60%');

let defaultDirectoryMode=true;

//let aptDate = new Date();
//function setAptDate(d) { aptDate = d; }

//var workingHours;
var timeSlots;

var userCid;
var customerData;

const NUMBEROFDAYS = (isMobile()) ? 2: 5;

export default function Appointment() {
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [searchText, setSearchText] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
  const [patientArray, setPatientArray] = useState([])
	const [patientMasterArray, setPatientMasterArray] = useState([]);
	const [currentPatient, setCurrentPatient] = useState("");
	const [currentPatientData, setCurrentPatientData] = useState({});
	const [allPendingAppt, setAllPendingAppt] = useState([])

	const [modalRegister, setModalRegister] = useState(0)
	const [radioValue, setRadioValue] = useState("Male");
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const	[patientName, setPatientName] = useState("");
	const	[patientAge, setPatientAge] = useState(0);
	const	[patientGender, setPatientGender] = useState("Male");
	const	[patientEmail, setPatientEmail] = useState("");
	const	[patientMobile, setPatientMobile] = useState(0);
	const [patientDob, setPatientDob] = useState(new Date(2000, 1, 1));
	
	const [directoryMode, setDirectoryMode] = useState(defaultDirectoryMode);
	const [monthYearDate, setMonthYearDate] = useState(new Date());

	const [isReschedule, setIsReschedule] = useState(false);
	const [reschedulRec, setReschedulRec] = useState(null);
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	const [selectPatient, setSelectPatient] = useState(false);
	const [year, setYear] = useState("2021");
	const [month, setMonth] = useState("September");
	const [lastDayOfMonth, setLastDayOfMonth] = useState(0);
	const [monthlyMode, setMonthlyMode] = useState(true);
	const [beforeToday, setBeforeToday] = useState(true);
	
	const [apptMatrix, setApptMatrix] = useState([]);
	const [holidayArray, setHolidayArray] = useState([]);
	const [menuData, setMenuData] = useState({});
	const [apptCountArray, setApptCountArray] = useState([]);
	

	const [newErrorMessage, setNewErrorMessage] = useState("");
	const [newAppointment, setNewAppointment] = useState(false);

	
	
	const [apptHour, setApptHour] = useState("");
	//const [apptMinute, setApptMinute] = useState(MINUTESTR[0]);
	const [apptArray, setApptArray] = useState([]);
	const [masterApptArray, setMasterApptArray] = useState([]);
	
	//const [dateArray, setDateArray] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [allTimeSlots, setAllTimeSlots] = useState([]);
	
	const [doctorList, setDoctorList] = useState([]);
	const [mobileList, setMobileList] = useState([]);

	const [currApptInfo, setCurrApptInfo] = useState({});
	const [currSlot, setCurrSlot] = useState({});

	const [currentDoctor, setCurrentDoctor] = useState("");

 
	
	useEffect(() => {			
		userCid = sessionStorage.getItem("cid");
		let PgetAllHolidays;
		let PgetAllPendingAppointment;
		let PgetAllMyPatients;
		let PcheckFromPatient;
		
		//customerData = JSON.parse(sessionStorage.getItem("customerData"));
		const getCustomerDetails  = async () => {
			if (sessionStorage.getItem("userType") !== "Developer") {
				//console.log("starting JSON");
				customerData = JSON.parse(sessionStorage.getItem("customerData"));
				setDoctorList([customerData.doctorName].concat(customerData.doctorPanel));
				setMobileList([customerData.mobile].concat(customerData.doctorMobile));
				//console.log("starting axios");
				//console.log(userCid);
				let rrr =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/checkexpiry/${userCid}`);
				//console.log("over axios");
				if (rrr.data.status) return alert.error('Plan has expired');
			} else {
				customerData = {type: "Developer"};
			}			
		}

		const getAllPendingAppointment  = async () => {
			allPending = await reloadAppointmentDetails();
		}
		
		const getAllHolidays  = async () => {
			let allHolidays;
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/fromtoday/${userCid}`);
				allHolidays = resp.data;
			} catch(e) {
				allHolidays = [];
				console.log(e);
			}
			finally {
				setHolidayArray(allHolidays);
				return allHolidays;
			}
		}
		
		const getAllMyPatients  = async () => {
			let rrr =  await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/patient/checkexpiry/${userCid}`);
			if (rrr.data.status) {
				alert.error('Plan has expired');
				return [];
			}
	
			
			let ppp;
			if (window.sessionStorage.getItem("userType") !== "Patient")  {
				ppp = await getAllPatients(userCid)
			} else {
				ppp = JSON.parse(sessionStorage.getItem("patients"));
				ppp = ppp.filter(x => x.cid === userCid);
			}
			return ppp;				
		}


		const makeSlots  = async () => {
			//let allHolidays = await PgetAllHolidays;
			let allPendingAppt = await PgetAllPendingAppointment;
			await generateSlots(allPendingAppt);			
		}
		
		
		const checkFromPatient = async () => {
			let ppp = await PgetAllMyPatients;	
			setPatientMasterArray(ppp);
			setSearchText("");
			setPatientFilter(ppp, "");
			/*** Now directly called form button and not from patient etc.			
			try {
				// check if has come from patient view.
				let dirPatient = JSON.parse(sessionStorage.getItem("shareData"));
				sessionStorage.setItem("shareData", "");		// clean up
				//console.log(dirPatient);
				
				await getAppointmentsByPid(dirPatient.pid)
				setSearchText(dirPatient.displayName);
				setPatientFilter(ppp, dirPatient.displayName);
				setCurrentPatientData(dirPatient);
				setCurrentPatient(dirPatient.displayName);
			} catch {
				// nothing to be done
				console.log("direct");
				setSearchText("");
				setPatientFilter(ppp, "");
				//setCurrentPatientData({});
				//setCurrentPatient("");
			} 
			***/
		}	
		
		// fetch data 1 by 1 
		getCustomerDetails();
		PgetAllMyPatients = getAllMyPatients();
		PgetAllHolidays = getAllHolidays();
		PgetAllPendingAppointment = reloadAppointmentDetails();
		makeSlots();
		PcheckFromPatient = checkFromPatient();
		//handleMyAppt();

  }, []);



	async function reloadAppointmentDetails() {
		// get all pending apt
		let allPending;
		try {
			//let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/all/${userCid}`);
			let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/list/all/fromtoday/${userCid}`);
			allPending = resp.data;
		} catch(e) {
			allPending = [];
			console.log(e);
		}
		finally {
			setAllPendingAppt(allPending);	
			return	allPending;
		}		
	}
	
	async function generateSlots(allPendingAppt) {
		let d;
		let slotData = [];
		
		for(let i=0; i<NUMBEROFDAYS; ++i) {
			d = (i === 0) ? getFirstDate() : getNextDate(d);
			//console.log(d);
			slotData.push(await prepareData(d, allPendingAppt));
		}
		setAllTimeSlots(slotData);
		setCurrentIndex(0);
	}
	
	function setNewCurrentIndex(idx) {
		let itIsToday = false;
		let today = new Date();
		if (idx === 0) {
			//console.log(idx, allTimeSlots[idx].date, allTimeSlots[idx].month, allTimeSlots[idx].year);
			if ((allTimeSlots[idx].date === today.getDate()) &&
				(allTimeSlots[idx].month === today.getMonth()) &&
				(allTimeSlots[idx].year === today.getFullYear())) {
				itIsToday = true;
				
			}
		}
		
		if (itIsToday) {
			//console.log("It is today", itIsToday);
			let currentSlot = [].concat(allTimeSlots);
			let currentOrder = generateOrderByDate(today);
			// update morning slots
			for(let i=0; i<currentSlot[idx].morningSlots.length; ++i) {
				if (currentSlot[idx].morningSlots[i].visit !== "available") continue;
				//console.log(currentSlot[idx].morningSlots[i]);
				let requestedOrder = generateOrder(
					currentSlot[idx].morningSlots[i].year,
					currentSlot[idx].morningSlots[i].month,
					currentSlot[idx].morningSlots[i].date,
					currentSlot[idx].morningSlots[i].hour,
					currentSlot[idx].morningSlots[i].minute);
					
					//console.log(requestedOrder, currentOrder); 
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].morningSlots[i].name = "-"
					currentSlot[idx].morningSlots[i].visit = 'expired';
			}
			// update afternoon slots
			for(let i=0; i<currentSlot[idx].afternoonSlots.length; ++i) {
				if (currentSlot[idx].afternoonSlots[i].visit !== "available") continue;
				let requestedOrder = generateOrder(
					currentSlot[idx].afternoonSlots[i].year,
					currentSlot[idx].afternoonSlots[i].month,
					currentSlot[idx].afternoonSlots[i].date,
					currentSlot[idx].afternoonSlots[i].hour,
					currentSlot[idx].afternoonSlots[i].minute);
					
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].afternoonSlots[i].name = "-"
					currentSlot[idx].afternoonSlots[i].visit = 'expired';
			}
			// update evening slots
			for(let i=0; i<currentSlot[idx].eveningSlots.length; ++i) {
				if (currentSlot[idx].eveningSlots[i].visit !== "available") continue;
				let requestedOrder = generateOrder(
					currentSlot[idx].eveningSlots[i].year,
					currentSlot[idx].eveningSlots[i].month,
					currentSlot[idx].eveningSlots[i].date,
					currentSlot[idx].eveningSlots[i].hour,
					currentSlot[idx].eveningSlots[i].minute);
					
					if (requestedOrder > currentOrder) break;
					currentSlot[idx].eveningSlots[i].name = "-"
					currentSlot[idx].eveningSlots[i].visit = 'expired';
			}
		
			// now all done. Update all time slots
			setAllTimeSlots(currentSlot);
		}
		setCurrentIndex(idx);
	}
	
	// returns true if appointment of given time
	function checkAppt(year, month, date, hr, min, allAppt) {
		//console.log(allAppt);
		let tmp = allAppt.find( x =>
			x.year === year && x.month === month && x.date === date &&
			x.hour === hr && x.minute === min);
		//console.log(date, hr, min, tmp);
		let retStr = {name: `$HOURSTR[hr]}:${MINUTESTR[min]}`, visit: 'available'};
		if (tmp) {
			retStr.name = tmp.displayName;
			retStr.visit = (tmp.visit === 'pending') ? 'pending' : 'visit';
		} else {
			// if not appointment, then check if appointment of old date time
			let currentOrder = generateOrderByDate(new Date());
			let requestedOrder = generateOrder(year, month, date, hr, min);
			if (requestedOrder < currentOrder) {
				retStr.name = "-"
				retStr.visit = 'expired';
			}
		}
		return (retStr);
	}
	
	async function checkHoliday(year, month, date) {
		let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/holiday/isholiday/${userCid}/${year}/${month}/${date}`)
		return resp.data.status;
	}

	async function prepareData(d, allAppt) {
		let morningSlots = [];
		let afternoonSlots = [];
		let eveningSlots = [];
		let workingHours = customerData.workingHours;
		
		let myYear = d.getFullYear();
		let myMonth = d.getMonth();
		let myDate = d.getDate();
		let myDay = d.getDay();
		// for morning slots
		let todayHoiliday = await checkHoliday(myYear, myMonth, myDate );
		//console.log("HChk",todayHoiliday);

		for(let blk=BLOCKNUMBER.morningBlockStart; blk<=BLOCKNUMBER.morningBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				morningSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
		// for afternoon slots
		for(let blk=BLOCKNUMBER.afternoonBlockStart; blk<=BLOCKNUMBER.afternoonBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				afternoonSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
		// evening slots
		for(let blk=BLOCKNUMBER.eveningBlockStart; blk<=BLOCKNUMBER.eveningBlockEnd; ++blk) {
			if (workingHours.includes(myDay*100+blk)) {
				let hour = Math.floor(blk / 4);
				let minute = MINUTEBLOCK[blk % 4];
				let apptSts = checkAppt(myYear, myMonth, myDate, hour, minute, allAppt);
				eveningSlots.push({year: myYear, month: myMonth, date: myDate,
					hour: hour,
					minute: minute,
					dateTime: d, 
					day: myDay,
					slot: HOURSTR[hour] + ":" + MINUTESTR[minute],
					name: apptSts.name,
					visit: apptSts.visit
				});
			}
		}
	
		let retValue = {dateTime: d, year: myYear, month: myMonth, date: myDate, holiday: todayHoiliday,
			day: myDay, morningSlots: morningSlots, afternoonSlots: afternoonSlots,
			eveningSlots: eveningSlots
		};
		//console.log(retValue);
		return retValue;
	}


	function ShowResisterStatus() {
    //console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 621:
        myMsg = "Invalid patient age";
        break;
			case 1001:
        myMsg = "Invalid date of birth";
        break;
      case 601:
        myMsg = "Patient name already in database";
        break;
      case 611:
        myMsg = "Patient name not found in database";
        break;
    }
    return(
      <div>
        <Typography className={gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }

	
	function clinicOff(d, myHoildays) {
		let tmp = myHoildays.filter(x => x.date === d.getDate() &&
				x.month === d.getMonth() && x.year === d.getFullYear());
		if (tmp.length > 0) return true;
			
		// check if doctor's weekend on this date
		tmp = customerData.workingHours.filter(x => 
			x >= (d.getDay()*100 + BLOCKNUMBER.allBlockStart) &&
			x <= (d.getDay()*100 + BLOCKNUMBER.allBlockEnd)
		);
		let isClosed = (tmp.length === 0);
		return isClosed;
	}
	
	function getNextDate(d) {
		let done = false
		//console.log("I",d)
		while (!done) {
			d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0 , 0);
			//if (clinicOff(d, myHoildays)) { continue; }
			break;
		}
		//console.log("O",d)
		return d;
	}

	function getPrevDate(d) {
		let today = new Date();
		let done = false
		while (!done) {
			d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1, 0 , 0);
			if (compareDate(d, today) < 0) return null;
			//if (clinicOff(d, myHoildays)) continue;
			break;
		}
		return d;
	}
	
	function getFirstDate() {
		//console.log(myHoildays);
		let d = new Date();
		let firstDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1);
		return getNextDate(firstDate);
	}
	

	async function getPatientAppt(rec) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/pendinglist/pid/${userCid}/${rec.pid}`);
			//console.log(resp.data);
			setApptArray(resp.data);
		} catch (e) {
			console.log(e);
			setApptArray([]);
		}
	}

	
	async function prevDate() {
		let d = getPrevDate(allTimeSlots[0].dateTime);
		if (d !== null) {
			let x = [await prepareData(d, allPendingAppt)];
			for (let i=0; i<(NUMBEROFDAYS-1); ++i) {
				x.push(allTimeSlots[i]);
			}
			setAllTimeSlots(x);
			let index = currentIndex + 1;
			if (index === NUMBEROFDAYS) index = NUMBEROFDAYS - 1;
			setCurrentIndex(index);
		}
	}
	
	async function nextDate() {
		let x = [];
		for (let i=1; i<NUMBEROFDAYS; ++i) {
			x.push(allTimeSlots[i]);
		}
		let d = getNextDate(allTimeSlots[NUMBEROFDAYS-1].dateTime);
		let newData = await prepareData(d, allPendingAppt);
		x.push(newData);
		//console.log(x);
		setAllTimeSlots(x);
		let index = currentIndex - 1;
		if (index < 0) index = 0;
		setCurrentIndex(index);

	}
	

	function selectPanelDoctor(slot, apptInfo) {
		setCurrSlot(slot);
		setCurrApptInfo(apptInfo);
		setCurrentDoctor(doctorList[0]);
		setIsDrawerOpened("PANELDOCTOR");
	}

	async function handlePanelDoctorAppointmentSubmit() {
		var myIndex = doctorList.indexOf(currentDoctor);
		var myMobile = mobileList[myIndex];
		console.log(currentDoctor, myMobile);
		setIsDrawerOpened("");
		sendAppointmentRequest(currSlot, currApptInfo, currentDoctor, myMobile)
	}


	async function sendAppointmentRequest(slot, apptInfo, doctorName, doctorMobile) {
		apptInfo["doctorName"] = doctorName;
		apptInfo["doctorMobile"] = doctorMobile;
		apptInfo["_id"] = (isReschedule) ? reschedulRec._id : "";
		
		//console.log(apptInfo);
		//console.log(isReschedule);
		//console.log(apptArray);
		
		let jTmp = JSON.stringify(apptInfo);
		// add this to database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/add/${userCid}/${jTmp}`;
			let resp = await axios.get(myUrl);
			alert.success("Appointment set of "+currentPatientData.displayName);
			
			// update patient appointment list
			let tmpArray = [].concat(apptArray);
			if (isReschedule)
				tmpArray = tmpArray.filter(x => x._id !== reschedulRec._id);
			
			tmpArray.push(resp.data);
			tmpArray = lodashSortBy(tmpArray, ['order']);
			setApptArray(tmpArray);
			
			// now update all pending appointment
			tmpArray = [].concat(allPendingAppt);
			if (isReschedule)
				tmpArray = tmpArray.filter(x => x._id !== reschedulRec._id);
			
			tmpArray.push(resp.data);
			tmpArray = lodashSortBy(tmpArray, ['order']);
			setAllPendingAppt(tmpArray);

			
			// update slot as pending
			let myTmpSlots = [].concat(allTimeSlots);
			
			// check if add apt is in morning
			let ttt = myTmpSlots[currentIndex].morningSlots.find(x => x.hour === slot.hour &&
				x.minute === slot.minute);
			//console.log("morning",ttt);
			if (ttt) {
				ttt.name = currentPatientData.displayName
				ttt.visit = 'pending';
			}

			ttt = myTmpSlots[currentIndex].afternoonSlots.find(x => x.hour === slot.hour &&
				x.minute === slot.minute);
			//console.log("afternoon",ttt);
			if (ttt) {
				ttt.name = currentPatientData.displayName
				ttt.visit = 'pending';
			}
			
			ttt = myTmpSlots[currentIndex].eveningSlots.find(x => x.hour === slot.hour &&
				x.minute === slot.minute);
			//console.log("evening",ttt);
			if (ttt) {
				ttt.name = currentPatientData.displayName
				ttt.visit = 'pending';
			}	
			
			// now free the old appointment slot if reschedule
			if (isReschedule) {
				for(let i=0; i<NUMBEROFDAYS; ++i) {
					// check if date is matching
					if ((myTmpSlots[i].year !== reschedulRec.year) ||
						(myTmpSlots[i].month !== reschedulRec.month) ||
						(myTmpSlots[i].date !== reschedulRec.date))
						continue;

					// now match 
					let myOldDate = new Date(reschedulRec.year, reschedulRec.month, reschedulRec.date, reschedulRec.hour, reschedulRec.minute, 0);
					let justNow = new Date();
					
					let ttt = myTmpSlots[i].morningSlots.find(x => x.hour === reschedulRec.hour && x.minute === reschedulRec.minute);
					if (ttt) {
						if (myOldDate.getTime() < justNow.getTime) {
							ttt.name = '-';
							ttt.visit = 'expired';
						} else {
							ttt.name = HOURSTR[reschedulRec.hour] + ':' + MINUTESTR[reschedulRec.minute];
							ttt.visit = 'available';
						}
					}
					
					ttt = myTmpSlots[i].afternoonSlots.find(x => x.hour === reschedulRec.hour && x.minute === reschedulRec.minute);
					if (ttt) {
						if (myOldDate.getTime() < justNow.getTime) {
							ttt.name = '-';
							ttt.visit = 'expired';
						} else {
							ttt.name = HOURSTR[reschedulRec.hour] + ':' + MINUTESTR[reschedulRec.minute];
							ttt.visit = 'available';
						}
					}
					
					ttt = myTmpSlots[i].eveningSlots.find(x => x.hour === reschedulRec.hour && x.minute === reschedulRec.minute);
					if (ttt) {
						if (myOldDate.getTime() < justNow.getTime) {
							ttt.name = '-';
							ttt.visit = 'expired';
						} else {
							ttt.name = HOURSTR[reschedulRec.hour] + ':' + MINUTESTR[reschedulRec.minute];
							ttt.visit = 'available';
						}
					}
				
				}
			}
			
			setIsReschedule(false);
			setAllTimeSlots(myTmpSlots);
				
		} catch (e) {
			console.log(e);
			alert.error("Error setting appointment of "+currentPatientData.displayName);
			return;
		}

	}

	
	async function handleAddAppointment(slot) {	
		// check if appoint time before current time. If yes then do not allow.
		let myOrder = generateOrder(slot.year, slot.month, slot.date, slot.hour, slot.minute)
		let currentValidOrder = generateOrderByDate(new Date());
		if (myOrder < currentValidOrder) {
			return alert.error("Appointment of past date/time is not permitted");
		}
		console.log(`Panel Count: ${doctorList.length} ${mobileList.length}`);

		let tmp = {
			cid: userCid,
			//data: currentPatientData,
			year: slot.year,
			month: slot.month,
			date: slot.date,
			hour: slot.hour,
			minute: slot.minute,
			order: myOrder,
			pid: currentPatientData.pid,
			displayName: currentPatientData.displayName,
			visit: VISITTYPE.pending,
			apptTime: new Date(slot.year, slot.month, slot.date,
								slot.hour, slot.minute, 0),
		};
		
		
		if (isReschedule) {
			sendAppointmentRequest(slot, tmp, reschedulRec.doctorName, reschedulRec.doctorMobile);
		} else {
			if (doctorList.length === 1) {
				sendAppointmentRequest(slot, tmp, doctorList[0], mobileList[0]);
			} else  {
				selectPanelDoctor(slot, tmp)
			} 
		}
		return;
		
		let jTmp = JSON.stringify(tmp);
		// add this to database
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/add/${userCid}/${jTmp}`;
			let resp = await axios.get(myUrl);
			alert.success("Appointment set of "+currentPatientData.displayName);
			// update patient appointment
			let tmpArray=[resp.data].concat(apptArray);
			tmpArray = lodashSortBy(tmpArray, ['order']);
			setApptArray(tmpArray);
			
			// now update all pending appointment
			tmpArray=[resp.data].concat(allPendingAppt);
			tmpArray = lodashSortBy(tmpArray, ['order']);
			setAllPendingAppt(tmpArray);

			// update slot as pending
			if (true) {
				//console.log(currentIndex);
				
				let myTmpSlots = [].concat(allTimeSlots);
				// check if add apt is in morning
				let ttt = myTmpSlots[currentIndex].morningSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("morning",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}

				ttt = myTmpSlots[currentIndex].afternoonSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("afternoon",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}
				
				ttt = myTmpSlots[currentIndex].eveningSlots.find(x => x.hour === slot.hour &&
					x.minute === slot.minute);
				//console.log("evening",ttt);
				if (ttt) {
					ttt.name = currentPatientData.displayName
					ttt.visit = 'pending';
				}	
				setAllTimeSlots(myTmpSlots);
			}	
		} catch (e) {
			console.log(e);
			alert.error("Error setting appointment of "+currentPatientData.displayName);
			return;
		}
	}
  
	function org_DisplayAvailableAppointments() {
	if (allTimeSlots.length === 0) return null;

	//console.log(currentIndex);
	//console.log(allTimeSlots[currentIndex]);
	let tStr = DATESTR[allTimeSlots[currentIndex].date];
	tStr += "/";
	tStr += MONTHNUMBERSTR[allTimeSlots[currentIndex].month];
	tStr += "/";
	tStr += allTimeSlots[currentIndex].year;

	return (
	<div>
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="ALLDATE" container alignItems="center" >
		{/*<Grid item xs={12} sm={12} md={12} lg={12} >
		<Typography className={gClasses.slotTitle} >{"Appointment Date"}</Typography>
		</Grid>*/}
		<Grid key="LEFT" align="left" item xs={1} sm={1} md={1} lg={1} >
			<LeftIcon color={'primary'} onClick={prevDate}  />
		</Grid>
		{allTimeSlots.map( (t, index) => {
			let dStr = (compareDate(t.dateTime, new Date()) !== 0) 
				? DATESTR[t.date] + "/" + MONTHNUMBERSTR[t.month] + "/" + (t.year % 100)
				: "Today";
			let freeSlots = t.morningSlots.filter(x => x.visit === "available").length + 
				t.afternoonSlots.filter(x => x.visit === "available").length +
				t.eveningSlots.filter(x => x.visit === "available").length;
			let myClass = (index === currentIndex) ? gClasses.blue14 : gClasses.normal14;
		return (
		<Grid key={"TIME"+index} item xs={5} sm={5} md={2} lg={2} >
			<Box onClick={() => {setNewCurrentIndex(index)}} 
			className={(t.holiday) ? gClasses.greenboxStyle : gClasses.boxStyle} 
			borderRadius={7} border={1} >
			<Typography className={myClass}>{dStr+" ("+SHORTWEEKSTR[t.day]+")"}</Typography>
			{/*<Typography className={myClass}>{WEEKSTR[t.day]}</Typography>*/}
			<Typography className={myClass}>{freeSlots+" free Slots"}</Typography>
			</Box>
		</Grid>
		)}
		)}
		<Grid key="RIGHT" align="right" item xs={1} sm={1} md={1} lg={1} >
			<RightIcon color={'primary'} onClick={nextDate}  />
		</Grid>
	</Grid>	
	</Box>
	<BlankArea />
	{/*  Show morningSlots slots */}
	{(allTimeSlots[currentIndex].morningSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="MORNING" container alignItems="center" >
	<Grid key="MORNINGITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={gClasses.slotTitle} >{"Morning Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].morningSlots.map( (t, index) => {
		return (
			<Grid key={"MOR"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={gClasses.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={gClasses.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={gClasses.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	}
	{/*  Show afternoon  slots */}
	{(allTimeSlots[currentIndex].afternoonSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid key="AFTERNOON" container alignItems="center" >
	<Grid key="AFTERNOONITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={gClasses.slotTitle} >{"Afternoon Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].afternoonSlots.map( (t, index) => {
		//console.log("Afternoon slots---------------");
		//console.log(allTimeSlots[currentIndex].afternoonSlots);
		return (
			<Grid key={"AFETR"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={gClasses.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={gClasses.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={gClasses.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>	
	</Box>
	}
	{/*  Show evening  slots */}
	{(allTimeSlots[currentIndex].eveningSlots.length > 0) &&
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="EVENING" container alignItems="center" >
	<Grid key="EVENINGITEM" item xs={12} sm={12} md={12} lg={12} >
	<Typography className={gClasses.slotTitle} >{"Evening Slots of "+tStr}</Typography>
	</Grid>
	{allTimeSlots[currentIndex].eveningSlots.map( (t, index) => {
		return (
			<Grid key={"EVE"+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={gClasses.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={gClasses.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={gClasses.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	}
	</div>
	)}

	function DisplaySlotAppointMent(props) {
	if (props.timeSlots.length === 0) return null;
	return(
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key={props.slotName} container alignItems="center" >
	<Grid item xs={12} sm={12} md={12} lg={12} >
	<Typography className={gClasses.slotTitle} >{props.slotName+" Slots"}</Typography>
	</Grid>
	{props.timeSlots.map( (t, index) => {
		let myClass;
		let clickRequired = false;
		if (t.visit === "expired")
			myClass = gClasses.expiredSlot;
		else if (t.visit === "pending")
			myClass = gClasses.pendingSlot;
		else if (t.visit === "visit")
			myClass = gClasses.visitSlot;
		else if (t.visit === "available") {
			myClass = gClasses.availableSlot
			clickRequired = (currentPatient !== "INFO");
		}
		return (
			<Grid key={props.slotName+index} item xs={4} sm={4} md={2} lg={2} >
				{(t.visit === "expired") &&
					<Box className={gClasses.expiredSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "pending") &&
					<Box className={gClasses.pendingSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{(t.visit === "visit") &&
					<Box className={gClasses.visitSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography id={t.slot}>{t.name}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient === "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography>{t.slot}</Typography>
					</Box>
				}
				{((t.visit === "available") && (currentPatient !== "INFO")) &&
					<Box className={gClasses.availableSlot} borderColor="blue" borderRadius={7} border={1} >
					<Typography onClick={() => {handleAddAppointment(t)}}>{t.slot}</Typography>
					</Box>
				}
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	)}

	function DisplayAvailableAppointments() {
		if (allTimeSlots.length === 0) return null;
	
		//console.log(currentIndex);
		//console.log(allTimeSlots[currentIndex]);
		let tStr = DATESTR[allTimeSlots[currentIndex].date];
		tStr += "/";
		tStr += MONTHNUMBERSTR[allTimeSlots[currentIndex].month];
		tStr += "/";
		tStr += allTimeSlots[currentIndex].year;
	
		return (
		<div>
		<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
		<Grid className={gClasses.noPadding} key="ALLDATE" container alignItems="center" >
			{/*<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography className={gClasses.slotTitle} >{"Appointment Date"}</Typography>
			</Grid>*/}
			<Grid key="LEFT" align="left" item xs={1} sm={1} md={1} lg={1} >
				<LeftIcon color={'primary'} onClick={prevDate}  />
			</Grid>
			{allTimeSlots.map( (t, index) => {
				let dStr = (compareDate(t.dateTime, new Date()) !== 0) 
					? DATESTR[t.date] + "/" + MONTHNUMBERSTR[t.month] + "/" + (t.year % 100)
					: "Today";
				let freeSlots = t.morningSlots.filter(x => x.visit === "available").length + 
					t.afternoonSlots.filter(x => x.visit === "available").length +
					t.eveningSlots.filter(x => x.visit === "available").length;
				let myClass = (index === currentIndex) ? gClasses.blue14 : gClasses.normal14;
			return (
			<Grid key={"TIME"+index} item xs={5} sm={5} md={2} lg={2} >
				<Box onClick={() => {setNewCurrentIndex(index)}} 
				className={(t.holiday) ? gClasses.greenboxStyle : gClasses.boxStyle} 
				borderRadius={7} border={1} >
				<Typography className={myClass}>{dStr+" ("+SHORTWEEKSTR[t.day]+")"}</Typography>
				{/*<Typography className={myClass}>{WEEKSTR[t.day]}</Typography>*/}
				<Typography className={myClass}>{freeSlots+" free Slots"}</Typography>
				</Box>
			</Grid>
			)}
			)}
			<Grid key="RIGHT" align="right" item xs={1} sm={1} md={1} lg={1} >
				<RightIcon color={'primary'} onClick={nextDate}  />
			</Grid>
		</Grid>	
		</Box>
		<BlankArea />
		<DisplaySlotAppointMent date={tStr} slotName="Morning" timeSlots={allTimeSlots[currentIndex].morningSlots} />
		<DisplaySlotAppointMent date={tStr} slotName="Afternoon" timeSlots={allTimeSlots[currentIndex].afternoonSlots} />
		<DisplaySlotAppointMent date={tStr} slotName="Evening" timeSlots={allTimeSlots[currentIndex].eveningSlots} />
		</div>
		)}
	
	async function handleCancelAppt(cancelAppt) {
		
		let myMsg = `Are you sure you want to cancel appointment of ${cancelAppt.displayName} dated `;
		myMsg += `${DATESTR[cancelAppt.date]}/${MONTHNUMBERSTR[cancelAppt.month]}/${cancelAppt.year} at `;
		myMsg += `${HOURSTR[cancelAppt.hour]}:${MINUTESTR[cancelAppt.minute]}?`;
		
		vsDialog("Cancel Appointment", myMsg,
			{label: "Yes", onClick: () => handleCancelApptConfirm(cancelAppt) },
			{label: "No" }
		);
	}
	
	function getSlotIndex(year, month, date) {
		for(let i=0; i<allTimeSlots.length; ++i) {
			if ((allTimeSlots[i].date === date) && 
				(allTimeSlots[i].month === month) &&
				(allTimeSlots[i].year === year))
			return (i)
		}
		return -1;
	}
	
	async function handleCancelApptConfirm(cancelAppt) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/cancel/${userCid}/${cancelAppt.pid}/${cancelAppt.order}`;
			let resp = await axios.get(myUrl);
			//alert.success("Cancelled appointment of "+cancelAppt.displayName);

			// remove from patient appoint 
			let tmpAppt = apptArray.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setApptArray(tmpAppt)
			
			// now remove from all pending apt list
			tmpAppt = allPendingAppt.filter(x => 
				x.pid	!== cancelAppt.pid ||  
				x.order !== cancelAppt.order 
				);
			setAllPendingAppt(tmpAppt);
			//let tmpArray = await reloadAppointmentDetails();
			//generateSlots(tmpArray);
						
			let slotIndex = getSlotIndex(cancelAppt.year, cancelAppt.month, cancelAppt.date);
			if (slotIndex >= 0) {
				let cancelOrder = generateOrder(cancelAppt.year, cancelAppt.month, cancelAppt.date,
					cancelAppt.hour, cancelAppt.minute);
				let currentOrder = generateOrderByDate(new Date());
				let hasExpired = (cancelOrder <= currentOrder);
				let myTmpSlots = [].concat(allTimeSlots);
				
				// check if cancel apt is in morning
				let ttt = myTmpSlots[slotIndex].morningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}

				ttt = myTmpSlots[slotIndex].afternoonSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}
				
				ttt = myTmpSlots[slotIndex].eveningSlots.find(x => x.hour === cancelAppt.hour &&
					x.minute === cancelAppt.minute);
				if (ttt) {
					if (hasExpired) {
						ttt.name = "-"; ttt.visit = 'expired';
					} else {
						ttt.visit = 'available';
					}
				}	
				setAllTimeSlots(myTmpSlots);
			}
		} catch (e) {
			console.log(e);
			alert.error("Error cancelling appointment of "+cancelAppt.displayName);
		}
	}
	
	function handleRescheduleAppt(a) {
		setReschedulRec(a);
		setIsReschedule(true);
	}
	
	function DisplayRescheduleAppointment() {
		if (!isReschedule) return null;
		let d = new Date(reschedulRec.apptTime);
		let myDate = DATESTR[d.getDate()] + "/" +
			MONTHNUMBERSTR[d.getMonth()] + "/" +
			d.getFullYear().toString().slice(-2) + " " +
			HOURSTR[d.getHours()] + ":" + 
			MINUTESTR[d.getMinutes()];
		return (
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		<Grid item xs={false} sm={false} md={1} lg={2} />
		<Grid align="center" item xs={10} sm={10} md={9} lg={7} >
			<Typography>
			<span className={gClasses.patientInfo2}>{`Appointment Reschedule with ${reschedulRec.doctorName} at `}</span>
			<span className={gClasses.patientInfo2Blue}>{myDate}</span>
			<span className={gClasses.patientInfo2}> in progress</span>
			</Typography>
		</Grid>
		<Grid align="left" item xs={2} sm={2} md={1} lg={1} >
		<VsCancel onClick={() => setIsReschedule(false)} />
		</Grid>
		<Grid item xs={false} sm={false} md={1} lg={2} />
		</Grid>
		)
	}
	
	function DisplayPatientAppointments() {
	return (
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	{(apptArray.length === 0) &&
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		<Grid key={"NoApt"} item xs={12} sm={12} md={12} lg={12} >
			<div align="left"><Typography>No Appointment</Typography></div>
		</Grid>
		</Grid>
	}
	{(apptArray.length > 0) &&
		<Grid className={gClasses.noPadding} key="Appt" container alignItems="center" >
		{apptArray.map( (a, index) => 
			<Grid align="left" key={"Apt1"+a.pid+index} item xs={12} sm={6} md={3} lg={2} >
			{(!isReschedule) &&
			<DisplayAppointmentBox 
				appointment={a} 
				button1={
					<EditIcon color={'primary'} size="small" onClick={() => { handleRescheduleAppt(a)}}  />
				}
				button2={
					<CancelIcon color={'secondary'} size="small" onClick={() => { handleCancelAppt(a)}}  />
				}
			/>
			}
			{(isReschedule) &&
			<DisplayAppointmentBox 
				appointment={a} 
			/>
			}
			</Grid>
		)}
		</Grid>
	}
	</Box>
	)}
	
	function DisplayAllPatients() {
	return (
	<Grid className={gClasses.noPadding} key="DATESEL" container alignItems="center" >
	{patientArray.map( (m, index) => 
		<Grid key={"PAT"+m.pid} item xs={12} sm={6} md={3} lg={3} >
		<DisplayPatientBox 
			patient={m} 
			button1={
				<EventNoteIcon className={gClasses.blue} size="small" onClick={() => handleSelectPatient(m) }  />
			}
		/>
		</Grid>
	)}
	</Grid>	
	)}
	
	function setPatientFilter(myArray, filterStr) {
		filterStr = filterStr.trim().toLowerCase();
		let tmpArray = myArray;
		if (filterStr !== "") {
			if (validateInteger(filterStr)) {
				// it is integer. Thus has to be Id
				tmpArray = myArray.filter(x => x.pidStr.includes(filterStr));
			} else {
				tmpArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterStr));
			}
		} 	
		setPatientArray(tmpArray);
	}
	
	function filterPatients(filterStr) {
		setSearchText(filterStr);
		setPatientFilter(patientMasterArray, filterStr);
	}

	async function getAppointmentsByPid(myPid) {
		let myAppt = [];
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/appointment/pendinglist/pid/${userCid}/${myPid}`);
			myAppt = resp.data;
		} catch (e) {
			console.log(e);
		}
		finally {
			setApptArray(myAppt);
			return myAppt;
		}
	}

	async function handleSelectPatient(rec) {
		setCurrentPatient(rec.displayName);
		setCurrentPatientData(rec);
		setSelectPatient(false);
		await getAppointmentsByPid(rec.pid);
		let tmpArray = await reloadAppointmentDetails();	
		await generateSlots(tmpArray); // ARS. This is okay and confirmed
	}
	
	function handleAdd() {
		//console.log("handleAdd");
		setPatientName("");
		setPatientAge("");
		setPatientGender("Male")
		setRadioValue("Male");
		setPatientEmail("");
		setPatientMobile("");
		setPatientDob(moment(new Date(2000, 1, 1)));
		
		//setIsAdd(true);
		setIsDrawerOpened("ADDPATIENT");
	}
	
	async function handleAddEditSubmit() {
		let myDate = patientDob.toDate();
		let testAge = new Date().getFullYear() - myDate.getFullYear();
		//console.log(testAge, myDate);
		if ((testAge >= 100) || (testAge <= 1)) return setRegisterStatus(1001);
		
		let myMobile = (patientMobile !== "") ? patientMobile : 0;
		let myEmail = (patientEmail !== "") ? patientEmail : "-";
		myEmail = encrypt(myEmail);
		let dobStr = myDate.getFullYear() + MONTHNUMBERSTR[myDate.getMonth()] + DATESTR[myDate.getDate()];
		
		//console.log(myEmail);
		//console.log("Addedit", patientName, dobStr, patientGender, myEmail, myMobile);
		
		let resp;
		let myUrl;
	
		try {
			myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/patient/addwithdob/${userCid}/${patientName}/${dobStr}/${patientGender}/${myEmail}/${myMobile}`;
			resp = await axios.get(myUrl);
			alert.success("Successfully added new patient "+patientName);
		} catch (error)  {
			console.log(error.response.status);
			setRegisterStatus(error.response.status);
			return;
		}
		setIsDrawerOpened("");

		let ppp = await getAllPatients(userCid);
		setPatientMasterArray(ppp);
		setPatientFilter(ppp, searchText);
		setIsDrawerOpened("");
		return; 
	}
	


	async function handleMyAppt() {
		let tmpArray = await reloadAppointmentDetails();
		await generateSlots(tmpArray);		// ARS This is required and confirmed
		setCurrentPatient("INFO")
		setApptArray([]);
	}

	function handleDate(d) {
		//console.log(d);
		setPatientDob(d);
	}
	
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Appointment Directory" groupName="" tournament=""/>
		<Container component="main" maxWidth="lg">
		<CssBaseline />
		{((currentPatient === "") && (sessionStorage.getItem("userType") !== "Patient")) && 
			<div>
			<Grid className={gClasses.vgSpacing} key="PatientFilter" container alignItems="center" >
			<Grid key={"F1"} item xs={false} sm={false} md={1} lg={2} />
			<Grid key={"F2"} item xs={12} sm={12} md={4} lg={4} >
				<VsTextSearch label="Search Patient by name or Id" value={searchText}
					onChange={(event) => filterPatients(event.target.value)}
					onClear={(event) => filterPatients("")}
				/>				
			</Grid>
			<Grid key={"F4"} item xs={false} sm={false} md={3} lg={3} >
			</Grid>
			<Grid key={"F5"} item xs={6} sm={6} md={2} lg={1} >
				<VsButton name="New Patient" onClick={handleAdd} />
				
			</Grid>
			<Grid key={"F6"} item xs={6} sm={6} md={2} lg={2} >
				<VsButton name="My Appointments" onClick={handleMyAppt}/> 
			</Grid>
			</Grid>
			</div>
			}
		{(currentPatient === "") && 
			<DisplayAllPatients />
		}
		{(currentPatient !== "") &&
			<VsButton align="right" disabled={isReschedule} name="Select Patient" onClick={() => { setCurrentPatient("")}} />	
		}
		{(currentPatient !== "") &&
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			{(currentPatient === "INFO") &&
				<Typography align="center" className={gClasses.functionSelected}>
					Appointment Information
				</Typography>	
			}
			<BlankArea />
			{(currentPatient !== "INFO") &&
				<div>
				<DisplayPatientHeader patient={currentPatientData} />
				<DisplayPatientAppointments />
				<DisplayRescheduleAppointment />
				</div>
			}
			{(true) &&
				<DisplayAvailableAppointments />
			}
			</Box>
		}
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""}
		>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened == "ADDPATIENT") &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{"Add Patient"}</Typography>
			<TextValidator fullWidth  className={gClasses.vgSpacing}
				id="newPatientName" label="Name" type="text"
				value={patientName} 
				onChange={() => { setPatientName(event.target.value) }}
      />
			<div align="left">
			<Typography className={gClasses.vgSpacing}>Date of Birth</Typography>
			</div>
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={patientDob}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={handleDate}
				closeOnSelect={true}
			/>
			<BlankArea />
			{/*<FormControl component="fieldset">
				<RadioGroup row aria-label="radioselection" name="radioselection" value={radioValue} 
					onChange={() => {setRadioValue(event.target.value); setPatientGender(event.target.value); }}
				>
				<FormControlLabel className={classes.filterRadio} value="Male" 		control={<Radio color="primary"/>} label="Male" />
				<FormControlLabel className={classes.filterRadio} value="Female" 	control={<Radio color="primary"/>} label="Female" />
				<FormControlLabel className={classes.filterRadio} value="Other"   control={<Radio color="primary"/>} label="Other" />
			</RadioGroup>
			</FormControl>*/}
			<VsRadioGroup value={radioValue}
				onChange={() => {setRadioValue(event.target.value); setPatientGender(event.target.value); }}
				radioList={GENDER}
			/>
			<TextValidator   fullWidth   className={gClasses.vgSpacing} 
				id="newPatientEmail" label="Email" type="email"
				value={patientEmail} 
				onChange={() => { setPatientEmail(event.target.value) }}
      />
			<TextValidator fullWidth required className={gClasses.vgSpacing} 
				id="newPatientMobile" label="Mobile" type="number"
				value={patientMobile} 
				onChange={() => { setPatientMobile(event.target.value) }}
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
        errorMessages={['Invalid Mobile number','Invalid Mobile number']}
      />	
			<ShowResisterStatus />
			<BlankArea />
			<VsButton name={"Add"} />
		</ValidatorForm>    		
		}
		{(isDrawerOpened == "PANELDOCTOR") &&
		<ValidatorForm align="center" className={gClasses.form} onSubmit={handlePanelDoctorAppointmentSubmit}>
			<Typography className={gClasses.title}>{"Select Doctor from the Panel List"}</Typography>
			<br />
			{doctorList.map( (d, index) =>
				<VsRadio label={d} checked={currentDoctor === d} align="left" onClick={() => setCurrentDoctor(d)} />
			)}
			<VsButton type="submit" name={"Select Panel Doctor"} /> 
		</ValidatorForm>    		
		}
		</Box>
		</Drawer>		
		</Container>				
  </div>
  );    
}