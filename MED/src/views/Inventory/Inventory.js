import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';

import axios from "axios";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import Modal from 'react-modal';
import Box from '@material-ui/core/Box';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";

import ReactTooltip from "react-tooltip";
import Drawer from '@material-ui/core/Drawer';

//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import { useAlert } from 'react-alert';
import "react-datetime/css/react-datetime.css";
// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MinusIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import InfoIcon from 			'@material-ui/icons/Info';

import lodashSumBy from 'lodash/sumBy';
import lodashSortBy from 'lodash/sortBy';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

//import SearchIcon from '@material-ui/icons/Search';
//import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
//import EventNoteIcon from '@material-ui/icons/EventNote';
//import NoteAddIcon from '@material-ui/icons/NoteAdd';

/*
import GridItem from "components/Grid/GridItem.js";
import Avatar from "@material-ui/core/Avatar"
import { useHistory } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import Datetime from "react-datetime";

import VisibilityIcon from '@material-ui/icons/Visibility';

*/

import {
	DATESTR, MONTHNUMBERSTR,
} from 'views/globals';

// import { UserContext } from "../../UserContext";
import { 
	vsDialog,
	disablePastDt,
	disableFutureDt,
 } from "views/functions.js"

import {
	DisplayPageHeader, BlankArea,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
//import {dynamicModal } from "assets/dynamicModal";



const drawerWidth=800;
const AVATARHEIGHT=4;

/*


import {red, blue, yellow, orange, green, pink } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"

const useStyles = makeStyles((theme) => ({
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
	drawer: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
	boxStyle: {padding: "5px 10px", margin: "4px 2px", backgroundColor: blue[300] },
	radio: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "blue",
	},
    root: {
      width: '100%',
    }, 
		link: {
			backgroundColor: 'transparent',
		},
		switchText: {
			fontSize: theme.typography.pxToRem(14),
			fontWeight: theme.typography.fontWeightBold,
    }, 
    info: {
			backgroundColor: yellow[500],	
			color: blue[700],
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
    }, 
		noinfo: {
			backgroundColor: '#FFFFFF',	
			color: '#000000',
			height: theme.spacing(AVATARHEIGHT),
			width: theme.spacing(AVATARHEIGHT),
			fontSize: '12px',
			fontWeight: theme.typography.fontWeightBold,
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
		},       
    td : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#00E5FF',
		},
		th : {
			border: 5,
			align: "center",
			padding: "none",
			borderWidth: 1,
			borderColor: 'black',
			borderStyle: 'solid',
			backgroundColor: '#FF7043',
		},
		header: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
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
			paddings: '20px',
		},
		NoPatients: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
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
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));
*/


var userCid;
var customerData;

export default function Inventory() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [registerStatus, setRegisterStatus] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState("Items");
	const [inventoryItems, setInventoryItems] = useState([]);
	const [inventorySummary, setInventorySummary] = useState([]);
	const [inventoryTransactions, setInventoryTransactions ] = useState([])
	const [emurData1, setEmurData1] = useState("");
	const [emurData2, setEmurData2] = useState("");
	const [emurBalance, setEmurBalance] = useState("");
	const [emurInventory, setEmurInventory] = useState( {inventoryId: -1, id: -1 });
	const [emurPurchaseDate, setEmurPurchaseDate] = useState(moment());
	const [emurRate, setEmurRate] = useState("0");
	const [emurVendor, setEmurVendor] = useState("");
	const [emurExpiryMonth, setEmurExpiryMonth] = useState("3");
	// 
	const [emurMaxMin, setEmurMaxMin] = useState( {min: 1, max: 1} );
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
		setExpandedPanel2(false);
  };
	
  const [expandedPanel2, setExpandedPanel2] = useState(false);
  const handleAccordionChange2 = (panel) => (event, isExpanded2) => {
    setExpandedPanel2(isExpanded2 ? panel : false);
	};
  
	
	
  useEffect(() => {
		userCid = sessionStorage.getItem("cid");
		getInventoryItems();
		getInventoryTransactions();
  }, [])

	async function getInventoryItems() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/list/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventoryItems(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory Items");
			setInventoryItems([]);
		}		
	}
	
	async function getInventorySummary() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/inventorysummary/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventorySummary(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory Summary");
			setInventorySummary([]);
		}		
	}

		
	async function getInventoryTransactions() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/listallinventory/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventoryTransactions(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory transactions");
			setInventoryTransactions([]);
		}		
	}



	function DisplayInventoryUsages(props) {
		return (
		<Table>
		<TableBody>
		{props.list.map( (i, index) => {
			let d = new Date(i.date);
			let dateStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
		return (
		<TableRow align="Center" key={"DATA"+index} className={(i.subId === 0) ? gClasses.normalAccordian : gClasses.selectedAccordian} >
			<TableCell >
			<Typography className={gClasses.patientInfo2}>{dateStr}</Typography>
			</TableCell>	
			<TableCell align="left" >
			<div>
			{(i.expired) &&
				<Typography className={gClasses.patientInfo2Red}>Expired</Typography>
			}
			{(!i.expired) &&
				<Typography className={gClasses.patientInfo2}>Used</Typography>
			}
			</div>
			</TableCell>
			<TableCell align="left" >
			<Typography className={gClasses.patientInfo2}>{Math.abs(i.quantity)}</Typography>
			</TableCell>
			<TableCell align="right">
				{(!props.expired) &&
				<div>
				<EditIcon color="primary" size="small" onClick={() => { handleSubEditFromInventory(i)}} />
				<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteTransaction(i.inventoryId, i.id, i.subId)}} />
				</div>
				}
			</TableCell>
		</TableRow>
		)}
		)}
	</TableBody>
		</Table>
	)}



	function DisplayInventoryToolTips(props) {
	return(
		<div>
		{props.list.map( t => {
			var myId = "INV" + ("00" + t.inventoryId).slice(-3) + ("00" + t.id).slice(-3);
			return (
			<ReactTooltip key={myId} type="info" effect="float" id={myId} multiline={true}/>
			)}
		)}
		</div>
	)}	
		
	function DisplayInventoryPurchases(props) {
		//console.log(props.list);
		let myShopping = props.list.filter( x => x.subId === 0);

		//console.log(myShopping);
		//let myConsumption = props.list.filter( x => x.subId !== 0);
	return (
		<div className={gClasses.fullWidth} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<DisplayInventoryToolTips list={myShopping} />
		{myShopping.map((i, index) => {

			let d = new Date(i.date);
			let myPurchaseStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			d = new Date(i.expiryDate);
			let expiryStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;

			var myId = "INV" + ("00" + i.inventoryId).slice(-3) + ("00" + i.id).slice(-3);
			let myInfo = "";
			myInfo += "Date: " + myPurchaseStr + "<br />";
			//myInfo += "Vendor: "+ i.vendor + "<br />";
			myInfo += "Quantity: " + i.quantity + "<br />";
			myInfo += "UnitRate: " + parseFloat(i.unitRate).toFixed(2) + "/- <br />";
			myInfo += "Amount: " + parseFloat(i.unitRate*i.quantity).toFixed(2) + "/- <br />";
			//myInfo += "Expiry: " + expiryStr;

			let myUsage = props.list.filter( x => x.id === i.id && x.subId !== 0);
			let balance = i.quantity + lodashSumBy(myUsage, 'quantity');
			let myStr1 = props.name + ("00" + i.inventoryId).slice(-3);
			let myStr2 = myStr1 +  ("00" + index).slice(-3);
		return (
		<Accordion className={gClasses.fullWidth} key={"INVAC"+myStr2} expanded={expandedPanel2 === myStr2} onChange={handleAccordionChange2(myStr2)}>
				<AccordionSummary  className={(expandedPanel2 === myStr2) ? gClasses.selectedAccordian : gClasses.normalAccordian} key={"INVAS"+myStr2} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Grid className={gClasses.noPadding} container align="center">
				<Grid align="left" key={"INVITEM1"+myStr2} item xs={6} sm={6} md={4} lg={4} >
					<Typography >
						<span className={gClasses.patientInfo2}>{"Vendor: "+i.vendor}</span>
						<span align="left"
							data-for={myId}
							data-tip={myInfo}
							data-iscapture="true"
						>
						<InfoIcon color="primary" size="small"/>
						</span>
					</Typography>
				</Grid>	
				{(!i.expired) &&
					<Grid align="left" key={"INVITEM2"+myStr2} item xs={6} sm={6} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2}>{ "Expiry: "+expiryStr}</Typography>
					</Grid>	
				}
				{(i.expired) &&
					<Grid align="left" key={"INVITEM2"+myStr2} item xs={6} sm={6} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2Red}>{"Expired"}</Typography>
					</Grid>	
				}				<Grid align="left" key={"INVITEM3"+myStr2} item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.patientInfo2}>{"Balance: " + balance }</Typography>
				</Grid>	
				<Grid align="right" key={"INVITEM4"+myStr2} item xs={6} sm={6} md={2} lg={2} >
					{(!i.expired) &&
					<div>
					<EditIcon color="primary" size="small" onClick={() => { handleEditPurchaseInvevtory(i)}} />
					<MinusIcon color="primary" size="small" onClick={() => { handleSubFromInventory(i)}} />
					<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteTransaction(i.inventoryId, i.id, 0)}} />
					</div>
					}
					{(i.expired) &&
					<div>
					<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteTransaction(i.inventoryId, i.id, 0)}} />
					</div>
					}
				</Grid>	
				</Grid>
				</AccordionSummary>
				<AccordionDetails>
					<DisplayInventoryUsages list={myUsage} expired={i.expired} />
				</AccordionDetails>
		</Accordion>
		)}
		)}
		</Box>
	</div>
	)}

	
	function DisplayInventorySummary() {
	return (
		<div>
			{inventoryItems.map((i, index) => {
				let myTransactions = inventoryTransactions.filter(x => x.inventoryId === i.id);
				let balance =  lodashSumBy(myTransactions, 'quantity');
				let temp = myTransactions.filter(x => x.subId === 0);
				//console.log(temp);
				let totalAmount =  0; ///temp.quantity * temp.unitRate;
				for(let ar=0; ar<temp.length; ++ar) {
					totalAmount += temp[ar].quantity * temp[ar].unitRate;
				}
				totalAmount = parseFloat(totalAmount).toFixed(2);
			return (
			<Accordion key={"AC"+i.name} expanded={expandedPanel === i.name} onChange={handleAccordionChange(i.name)}>
          <AccordionSummary className={(expandedPanel === i.name) ? gClasses.selectedAccordian : gClasses.normalAccordian} key={"AS"+i.name} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Grid className={gClasses.noPadding} container align="center">
					<Grid key={"ITEM1"+index} item xs={6} sm={6} md={4} lg={4} >
						<Typography className={gClasses.patientInfo2Orange}>{i.name}</Typography>
					</Grid>	
					<Grid align="left" key={"ITEM2"+index} item xs={6} sm={6} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2Orange}>{"Balance Qty: " + balance }</Typography>
					</Grid>	
					<Grid align="left" key={"ITEM3"+index} item xs={8} sm={8} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2Orange}>{"Total Amount: " + totalAmount + "/-"}</Typography>
					</Grid>	
					<Grid align="right" key={"ITEM4"+index} item xs={4} sm={4} md={2} lg={2} >
						<EditIcon color="primary" size="small" onClick={() => { handleEditItem(i)}} />
						<AddIcon color="primary" size="small" onClick={() => { handleAddToInventory(i)}} />
						<CancelIcon color="secondary" size="small" onClick={() => { handleDeleteTransaction(i.id, 0, 0)}} />
					</Grid>	
					</Grid>
          </AccordionSummary>
          <AccordionDetails>
            <DisplayInventoryPurchases name={i.name} list={myTransactions} />
          </AccordionDetails>
      </Accordion>
			)}
			)}
		</div>
	)}

	function handleAddToInventory(item) {
		//console.log(item);
		setEmurData1(item.name);
		setEmurData2(1);
		setEmurVendor("");
		setEmurRate("1");
		//setEmurBalance(10000000);
		setEmurMaxMin({min: 1, max: 10000000});
		setEmurInventory({inventoryId: item.id, id: -1 });
		setEmurPurchaseDate(moment());
		setEmurExpiryMonth("3");
		setIsDrawerOpened("ADDINVENTORY");
	}


	function handleEditPurchaseInvevtory(item) {
		//console.log(item);
		let tmp = inventoryItems.find(x => x.id === item.inventoryId);
		setEmurData1(tmp.name);
		setEmurData2(item.quantity);
		setEmurVendor(item.vendor);
		setEmurRate(item.unitRate);
		tmp = inventoryTransactions.filter(x => x.inventoryId === item.inventoryId && x.id === item.id && x.subId !== 0);
		setEmurMaxMin({min: Math.abs(lodashSumBy(tmp, 'quantity')), max: 10000000});
		setEmurInventory({inventoryId: item.inventoryId, id: item.id});
		let pdate = new Date(item.date);
		let edate = new Date(item.expiryDate);
		setEmurPurchaseDate(moment(pdate));
		tmp = (edate.getFullYear()*12 + edate.getMonth()) - (pdate.getFullYear()*12 +pdate.getMonth());
		console.log(pdate, edate, tmp);
		setEmurExpiryMonth(tmp);
		setIsDrawerOpened("EDITINVENTORY");
	}
	
	function handleSubFromInventory(item) {
		console.log(item);
		let balance = lodashSumBy(
			inventoryTransactions.filter(x => x.inventoryId === item.inventoryId && x.id === item.id), 
			'quantity')
		if (balance == 0) return alert.error("Zero Balance");		// for ${item.name}`);
		let tmp = inventoryItems.find(x => x.id == item.inventoryId);
		console.log(tmp);
		setEmurData1(tmp.name);
		setEmurData2(1);
		//setEmurBalance(balance);
		setEmurMaxMin({min: 1, max: balance});
		setEmurInventory({inventoryId: item.inventoryId, id: item.id});
		setEmurVendor("");
		setEmurRate("1");
		setIsDrawerOpened("NEWSUBINVENTORY");
	}

	function handleSubEditFromInventory(item) {
		setEmurInventory({inventoryId: item.inventoryId, id: item.id, subId: item.subId});
		let balance = lodashSumBy(
			inventoryTransactions.filter(x => x.inventoryId === item.inventoryId && x.id === item.id), 
			'quantity')
		setEmurMaxMin({min: 1, max: balance+Math.abs(item.quantity)});
		setEmurData2(Math.abs(item.quantity));
		setIsDrawerOpened("EDITSUBINVENTORY");
	}


	async function handleAddEditFromInventory() {
		//console.log(emurInventory);
		try {
			let myCmd = (isDrawerOpened === "EDITINVENTORY") ? "updateinventory" : "addinventory";
			let myUrl;
			myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/${myCmd}/${userCid}/${emurInventory.inventoryId}`;
			if (isDrawerOpened === "EDITINVENTORY") {
				myUrl += `/${emurInventory.id}`;
			}
			let d = emurPurchaseDate.toDate();
			let myDateStr = `${d.getFullYear()}${MONTHNUMBERSTR[d.getMonth()]}${DATESTR[d.getDate()]}`;
			myUrl += `/${emurData2}/${emurRate}/${emurVendor}/${myDateStr}/${emurExpiryMonth}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			if (isDrawerOpened === "EDITINVENTORY") {
				let tmpArray = inventoryTransactions;
				//let idx = tmpArray.indexOf(x => x.inventoryId === emurInventory.inventoryId && x.id === emurInventory.id && x.subId === 0);
				for(let i=0; i<tmpArray.length; ++i) {
					if ((tmpArray[i].inventoryId === emurInventory.inventoryId) && 
						(tmpArray[i].id === emurInventory.id) && 
						(tmpArray[i].subId === 0)) 
					{
						tmpArray[i] = resp.data;
						setInventoryTransactions(tmpArray);	
						break;
					}
				}
			} else {
				let tmpArray = [resp.data].concat(inventoryTransactions);			
				setInventoryTransactions(tmpArray);
			}

		} catch (e) {
			console.log(e);
			alert.error("Error adding new Inventory transaction");
		}
		setIsDrawerOpened("");
	}

	async function handleNewWithdrawal() {
		console.log(emurInventory);
		try {
			let myCmd;
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/subinventory/${userCid}/${emurInventory.inventoryId}/${emurInventory.id}/${emurData2}`;
			console.log(myUrl);
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(inventoryTransactions);			
			setInventoryTransactions(tmpArray);
		} catch (e) {
			console.log(e);
			alert.error("Error updating withdrawal of Inventory");
		}
	}
	
	async function handleEditWithdrawals() {
		//console.log(emurInventory);
		try {
			let myCmd;
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/updatesubinventory/${userCid}/${emurInventory.inventoryId}/${emurInventory.id}/${emurInventory.subId}/${emurData2}`;
			let resp = await axios.get(myUrl);
			let tmpArray = inventoryTransactions;	
			for(let i=0; i<tmpArray.length; ++i) {
				if ((tmpArray[i].inventoryId === emurInventory.inventoryId) &&
					(tmpArray[i].id === emurInventory.id) &&
					(tmpArray[i].subId === emurInventory.subId)) {
					//console.log("found");
					console.log(tmpArray[i].quantity, resp.data.quantity);
					tmpArray[i] = resp.data;
					setInventoryTransactions(tmpArray);
					setExpandedPanel2(false);
					break;
				}
			}
		} catch (e) {
			console.log(e);
			alert.error("Error updating withdrawal of Inventory");
		}
	}
	
	async function handleSubFromInventorySubmit() {
		if (isDrawerOpened === "NEWSUBINVENTORY")
			handleNewWithdrawal();
		else 
			handleEditWithdrawals();
		setIsDrawerOpened("");
	}

	function handleAddItem() {
		setEmurData1("");
		setIsDrawerOpened("ADDITEM");
	}
	
	function handleEditItem(item) {
		setEmurData1(item.name);
		setEmurData2(item.name);
		setIsDrawerOpened("EDITITEM");
	}
	
	async function handleAddEditSubmit() {
		if (isDrawerOpened == "ADDITEM") {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/add/${userCid}/${emurData1}`;
				let resp = await axios.get(myUrl);
				let tmpArray = [resp.data].concat(inventoryItems);
				setInventoryItems(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
				alert.error("Error adding new Inventory Item");
			}
		} else {
			//console.log(emurData1, emurData2);
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/edit/${userCid}/${emurData2}/${emurData1}`;
				let resp = await axios.get(myUrl);
				let tmpArray = [resp.data].concat(inventoryItems.filter(x => x.name !== emurData2));
				setInventoryItems(lodashSortBy(tmpArray, 'name'));
			} catch (e) {
				console.log(e);
				alert.error("Error editing Inventory Item");
			}
		}
		setIsDrawerOpened("");
	}
	
	function handleDeleteTransaction(inventoryId, id, subId) {
		// first check if banace goes below zero
		let myMsg = "";
		if (id === 0) {
			// delete all inventory items.
			let tmp = inventoryItems.find(x => x.id === inventoryId);
			myMsg = `Are you sure, you want to delete transactions of ${tmp.name} `;
		} else {
			if (subId === 0) {
				myMsg = `Are you sure, you want to delete all transaction from selected vendor`;
			} else {
				let tmpArray = inventoryTransactions.filter(x => x.inventoryId === inventoryId && x.id === id && x.subId !== subId);
				let newBalance = lodashSumBy(tmpArray, 'quantity') 
				if (newBalance < 0) {
					return alert.show("Cannot delete transaction. Balance goes below 0");
				}
				myMsg = `Are you sure, you want to delete selected transaction`;
			}
		}
		vsDialog("Delete Transaction", myMsg,
		{label: "Yes", onClick: () => handleDeleteTransactionConfirm(inventoryId, id, subId) },
		{label: "No" });
		
	}

	async function handleDeleteTransactionConfirm(inventoryId, id, subId) {
		//let tStr = `${inventoryId}/${id}/${subId}`
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/delinventory/${userCid}/${inventoryId}/${id}/${subId}`;
			let resp = await axios.get(myUrl);
			setInventoryTransactions(resp.data);
			if (id === 0) {
				setInventoryItems(inventoryItems.filter(x => x.id !== inventoryId))
			}
		} catch (e) {
			console.log(e);
			alert.error("Error deleting Inventory transaction");
		}	
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


	
	function handleDate(d) {
		//console.log(d);
		setPatientDob(d);
	}
	
		
	function handlePurchaseDate(d) {
		//console.log(d);
		setEmurPurchaseDate(d);
	}


  return (
  <div className={gClasses.webPage} align="center" key="main">
		<br />
		<DisplayPageHeader headerName="Inventory" groupName="" tournament=""/>
		<br />
		<CssBaseline />
		<VsButton name="Add new Inventory Item" align="right" onClick={handleAddItem} />
		<br />
		<DisplayInventorySummary />
		<Drawer className={gClasses.drawer} anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} /> 
		{((isDrawerOpened === "ADDITEM") || (isDrawerOpened === "EDITITEM")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDITEM")  ? "Add new Inventory Item" : "Edit Inventory Item "}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Inventory Item Name" type="text"
				value={emurData1} 
				onChange={(event) => { setEmurData1(event.target.value) }}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDITEM") ? "Add Inventory Item" : "Update Inventory Item"} />
			</ValidatorForm>    						
		}
		{((isDrawerOpened === "ADDINVENTORY") || (isDrawerOpened === "EDITINVENTORY")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleAddEditFromInventory}>
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDINVENTORY")  ? `Add Inventory of ${emurData1}` : `Edit Inventory of ${emurData1}`}</Typography>
			<TextValidator fullWidth className={gClasses.vgSpacing}
				id="vendor" label="Vendor" 
				value={emurVendor} 
				onChange={(event) => { setEmurVendor(event.target.value) }}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="Rate" label="Unit Rate" type="number"
				value={emurRate} 
				onChange={(event) => { setEmurRate(event.target.value) }}
				validators={['minNumber:1']}
				errorMessages={['Invalid Amount']}
			/>
			<br/>
			<Typography className={gClasses.patientInfo2Blue}>Purchase Date</Typography>
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurPurchaseDate}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={handlePurchaseDate}
				closeOnSelect={true}
			/>
			<br />			
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="Rate" label="Expiry after number of months" type="number"
				value={emurExpiryMonth} 
				onChange={(event) => { setEmurExpiryMonth(event.target.value) }}
				validators={['minNumber:1']}
				errorMessages={['Invalid Expiry Month']}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Inventory Quantity" type="number"
				value={emurData2} 
				onChange={(event) => { setEmurData2(Number(event.target.value)) }}
				validators={[`minNumber:${emurMaxMin.min}`, `maxNumber:${emurMaxMin.max}`]}
				errorMessages={['Invalid Amount', 'Invalid Amount']}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDINVENTORY") ? "Add" : "Update"} />
			</ValidatorForm>    						
		}
		{((isDrawerOpened === "NEWSUBINVENTORY") || (isDrawerOpened === "EDITSUBINVENTORY")) &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubFromInventorySubmit}>
			<Typography className={gClasses.title}>{((isDrawerOpened === "NEWSUBINVENTORY") ? "New" : "Edit")+` withdraw from Inventory of ${emurData1}`}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Inventory Quantity" type="number"
				value={emurData2} 
				onChange={(event) => { setEmurData2(Number(event.target.value)) }}
				validators={[`minNumber:${emurMaxMin.min}`, `maxNumber:${emurMaxMin.max}`]}
				errorMessages={['Invalid Amount', 'Invalid Amount']}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={((isDrawerOpened === "NEWSUBINVENTORY") ? "New" : "Edit")+" Withdrawal"} />
			</ValidatorForm>    						
		}
		</Box>
		</Drawer>
  </div>
  );    
}

