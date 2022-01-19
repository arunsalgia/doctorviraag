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
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsTextSearch from "CustomComponents/VsTextSearch";

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


import lodashSumBy from 'lodash/sumBy';
import lodashSortBy from 'lodash/sortBy';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MinusIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import InfoIcon from 			'@material-ui/icons/Info';

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
	isMobile,
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


var userCid;
var customerData;

export default function Inventory() {
	//const history = useHistory();	
  //const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [registerStatus, setRegisterStatus] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState("Items");
	const [inventoryMasterItems, setInventoryMasterItems] = useState([]);
	const [inventoryItems, setInventoryItems] = useState([]);
	const [inventorySummary, setInventorySummary] = useState([]);
	const [inventoryTransactions, setInventoryTransactions ] = useState([])
	const [emurData1, setEmurData1] = useState("");
	const [emurData2, setEmurData2] = useState("");
	const [emurBalance, setEmurBalance] = useState("");
	const [emurInventory, setEmurInventory] = useState( {inventoryId: -1, id: -1 });
	const [emurPurchaseDate, setEmurPurchaseDate] = useState(moment());
	const [emurExpireDate, setEmurExpireDate] = useState(moment());
	const [emurRate, setEmurRate] = useState("0");
	const [emurVendor, setEmurVendor] = useState("");
	const [neverExpire, setNeverExpire] = useState(true);
	// 
	const [emurQuantityPerBox, setEmurQuantityPerBox] = useState(1);
	
	const [emurMaxMin, setEmurMaxMin] = useState( {min: 1, max: 1} );
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
  const [expandedPanel, setExpandedPanel] = useState(false);

	// for pagination
	const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
	const [inventoryItemFilter, setInventoryItemFilter] = useState("");


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

	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


	async function getInventoryItems() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/list/${userCid}`;
			let resp = await axios.get(myUrl);
			setInventoryMasterItems(resp.data);
			setInventoryItems(resp.data);
		} catch (e) {
			console.log(e);
			alert.error("Error fetching Inventory Items");
			//setInventoryItems([]);
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

	function incrementDiscard(item) {
		let tmpArray = inventoryTransactions;
		for(let i=0; i<tmpArray.length; ++i) {
			if (tmpArray[i].inventoryId === item.inventoryId && tmpArray[i].id == item.id && tmpArray[i].subId === 0) {
				++tmpArray[i].discarded;
				--tmpArray[i].inUse;
				setInventoryTransactions(tmpArray);
				break;
			}
		}
	}

	function DisplayInventoryUsages(props) {
		return (
		<Table>
		<TableBody>
		{props.list.map( (i, index) => {
			//console.log(i);
		return (
		<TableRow align="Center" key={"DATA"+index} className={gClasses.selectedAccordian} >
		<TableCell align="center" >
				<Typography className={gClasses.patientInfo2Red}>{(i.expired) ? "Expired" : ""}</Typography>
		</TableCell>
		<TableCell align="left" >
			<Typography className={gClasses.patientInfo2}>{"In Use : " + ((i.expired) ? "-" : i.inUse)}</Typography>
		</TableCell>
		<TableCell align="left" >
			<Typography className={gClasses.patientInfo2}>{"Discarded : " + ((i.expired) ? "-" : i.discarded)}</Typography>
		</TableCell>
		<TableCell align="right">
			{(!props.expired) &&
			<EditIcon color="primary" size="small" onClick={() => { handleInuseDiscardedInventory(i)}} />
			}
		</TableCell>
		</TableRow>
		)}
		)}
	</TableBody>
		</Table>
	)}



	function DisplayInventoryToolTips(props) {
	if (isMobile()) return null;
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
		//console.log(props.list.length);
		if (props.list.length === 0) return null;
		let myShopping = props.list;		//.filter( x => x.subId === 0);
	return (
		<div className={gClasses.fullWidth} >
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<DisplayInventoryToolTips list={myShopping} />
		{myShopping.map((i, index) => {
			//console.log(i.boxes);
			let d = new Date(i.date);
			let myPurchaseStr = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
			
			d = new Date(i.expiryDate);
			let expiryStr =  (d.getFullYear() == 2030) ? "Never Expire" :
				`Expiry: ${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;

			var myId = "INV" + ("00" + i.inventoryId).slice(-3) + ("00" + i.id).slice(-3);
			let myInfo = "";
			myInfo += "Date     : " + myPurchaseStr + "<br />";
			myInfo += "Boxes    : " + i.boxes + "<br />";
			myInfo += "Qty/Box  : " + i.quantity + "<br />";
			myInfo += "Tot.Qty. : " + (i.quantity * i.boxes) + "<br />";
			myInfo += "Rate/Box : " + parseFloat(i.unitRate).toFixed(2) + "/- <br />";
			// rate is per box
			myInfo += "Value: " + parseFloat(i.unitRate * i.boxes).toFixed(2) + "/- <br />";
			//myInfo += "Expiry: " + expiryStr;

			//let myUsage = props.list.filter( x => x.id === i.id && x.subId !== 0);
			let myUsage = props.list.filter( x => x.id === i.id);
			let balance = (i.quantity*i.boxes) - i.inUse - i.discarded;
			let myStr1 = props.name + ("00" + i.inventoryId).slice(-3);
			let myStr2 = myStr1 +  ("00" + index).slice(-3);
		return (
		<Accordion className={gClasses.fullWidth} key={"INVAC"+myStr2} expanded={expandedPanel2 === myStr2} onChange={handleAccordionChange2(myStr2)}>
				<AccordionSummary  className={(expandedPanel2 === myStr2) ? gClasses.selectedAccordian : gClasses.normalAccordian} key={"INVAS"+myStr2} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Grid className={gClasses.noPadding} container align="center">
				<Grid align="left" key={"INVITEM1"+myStr2} item xs={8} sm={8} md={4} lg={4} >
					{(isMobile()) &&
					<Typography >
						<span className={gClasses.patientInfo2}>{"Vendor: "+i.vendor}</span>
					</Typography>
					}
					{(!isMobile()) &&
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
					}
				</Grid>	
				{(!i.expired) &&
					<Grid align="right" key={"INVITEM2"+myStr2} item xs={4} sm={4} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2}>{expiryStr}</Typography>
					</Grid>	
				}
				{(i.expired) &&
					<Grid align="right" key={"INVITEM2"+myStr2} item xs={4} sm={4} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2Red}>{"Expired"}</Typography>
					</Grid>	
				}				
				<Grid align="left" key={"INVITEM3"+myStr2} item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.patientInfo2}>{"Balance: " + balance }</Typography>
				</Grid>	
				<Grid align="right" key={"INVITEM4"+myStr2} item xs={6} sm={6} md={2} lg={2} >
					{(!i.expired) &&
					<div>
					<EditIcon color="primary" size="small" onClick={() => { handleEditPurchaseInvevtory(i)}} />
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
	let grandAmount = inventoryTransactions.reduce(
		(sum, t) => sum + t.boxes*t.unitRate,
		0
	);
	grandAmount = parseFloat(grandAmount).toFixed(2);
	return (
		<div>
		<Box align="right" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Typography className={gClasses.patientInfo2}>{"Total Inventory value: "+grandAmount+"/-"}</Typography>
		</Box>
			{inventoryItems.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((i, index) => {
				let myTransactions = inventoryTransactions.filter(x => x.inventoryId === i.id);
				//let balance =  lodashSumBy(myTransactions, 'quantity');
				// calculate grand balance
				let balance = myTransactions.reduce(
						(sum, t) => sum + ((!t.expired) ? (t.boxes*t.quantity - t.inUse - t.discarded) : 0),
						0
					);
				let totalAmount = myTransactions.reduce(
						(sum, t) => sum + t.boxes*t.unitRate,
						0
					);
				totalAmount = parseFloat(totalAmount).toFixed(2);
			return (
			<Accordion key={"AC"+i.name} expanded={expandedPanel === i.name} onChange={handleAccordionChange(i.name)}>
          <AccordionSummary className={(expandedPanel === i.name) ? gClasses.selectedAccordian : gClasses.normalAccordian} key={"AS"+i.name} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Grid className={gClasses.noPadding} container align="center">
					<Grid key={"ITEM1"+index} align="left" item xs={6} sm={6} md={4} lg={4} >
						<Typography className={gClasses.patientInfo2}>{i.name}</Typography>
					</Grid>	
					<Grid align="left" key={"ITEM2"+index} item xs={6} sm={6} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2}>{"Balance Qty: " + balance }</Typography>
					</Grid>	
					<Grid align="left" key={"ITEM3"+index} item xs={9} sm={9} md={3} lg={3} >
						<Typography className={gClasses.patientInfo2}>{"Inventory Value: " + totalAmount + "/-"}</Typography>
					</Grid>	
					<Grid align="right" key={"ITEM4"+index} item xs={3} sm={3} md={2} lg={2} >
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
			<TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          component="div"
					labelRowsPerPage="Inventory items per page"
          count={inventoryItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
		</div>
	)}

	function handleAddToInventory(item) {
		setRegisterStatus(0);
		//console.log(item);
		setEmurData1(item.name);
		setEmurData2(1);
		setEmurVendor("");
		setEmurRate("1");
		//setEmurBalance(10000000);
		setEmurMaxMin({min: 1, max: 10000000});
		setEmurInventory({inventoryId: item.id, id: -1 });
		setEmurQuantityPerBox(1);
		
		setEmurPurchaseDate(moment());
		setEmurExpireDate(moment().add(3, "M"))
		setNeverExpire(true);

		setIsDrawerOpened("ADDINVENTORY");
	}


	function handleEditPurchaseInvevtory(item) {
		setRegisterStatus(0);
		setEmurInventory({inventoryId: item.inventoryId, id: item.id});
		//console.log(item);
		let tmp = inventoryItems.find(x => x.id === item.inventoryId);
		// item name
		setEmurData1(tmp.name);
		// vendor
		setEmurVendor(item.vendor);
		// rate/box, qty/box and #boxes
		setEmurRate(item.unitRate);
		setEmurData2(item.boxes);
		setEmurQuantityPerBox(item.quantity);
		
		//tmp = inventoryTransactions.filter(x => x.inventoryId === item.inventoryId && x.id === item.id && x.subId !== 0);
		//setEmurMaxMin({min: Math.abs(lodashSumBy(tmp, 'quantity')), max: 10000000});
		// purchase & expiry date
		setEmurPurchaseDate(moment(new Date(item.date)));
		
		let edate = new Date(item.expiryDate);
		console.log(edate);
		if (edate.getFullYear() === 2030) {
			setNeverExpire(true);
			setEmurExpireDate(moment().add(3, "M"));
		} else {
			setNeverExpire(false);
			setEmurExpireDate(moment(new Date(item.expiryDate)));
		}
		setIsDrawerOpened("EDITINVENTORY");
	}

	function handleInuseDiscardedInventory(item) {
		setRegisterStatus(0);
		setEmurInventory({inventoryId: item.inventoryId, id: item.id, subId: item.subId});
		let tmp = inventoryTransactions.find(x => x.inventoryId === item.inventoryId && x.id === item.id && x.subId === 0);
		setEmurMaxMin({min: 0, max: tmp.boxes*tmp.quantity});
		setEmurData1(item.inUse);
		setEmurData2(item.discarded);
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
			// purchase date string
			let d = emurPurchaseDate.toDate();
			let purDateStr = `${d.getFullYear()}${MONTHNUMBERSTR[d.getMonth()]}${DATESTR[d.getDate()]}`;
			// expiry date string
			let expDateStr = "20300101";
			if (!neverExpire) {
				d = emurExpireDate.toDate();
				expDateStr = `${d.getFullYear()}${MONTHNUMBERSTR[d.getMonth()]}${DATESTR[d.getDate()]}`;
			}
			
			myUrl += `/${emurVendor}/${purDateStr}/${expDateStr}/${emurRate}/${emurQuantityPerBox}/${emurData2}`;
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

	
	async function handleSubmitInuseDiscardedInventory() {

		let tmp = inventoryTransactions.find(x => x.inventoryId === emurInventory.inventoryId &&
			x.id === emurInventory.id && x.subId === 0);
		if ((emurData2 + emurData1) > (tmp.boxes * tmp.quantity)) return setRegisterStatus(5001);
		
		try {
			let myCmd;
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/updatesubinventory/${userCid}/${emurInventory.inventoryId}/${emurInventory.id}/${emurData1}/${emurData2}`;
			let resp = await axios.get(myUrl);
			let tmpArray = inventoryTransactions;	
			for(let i=0; i<tmpArray.length; ++i) {
				if ((tmpArray[i].inventoryId === emurInventory.inventoryId) &&
					(tmpArray[i].id === emurInventory.id) &&
					(tmpArray[i].subId === 0)) {
					//console.log("found");
					//console.log(tmpArray[i].quantity, resp.data.quantity);
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
		if (subId !== 0) alert.error("Invalid delete command");
		// delete all inventory items.
		let myMsg;
		if (id === 0) {
			let tmp = inventoryItems.find(x => x.id === inventoryId);
			myMsg = `Are you sure, you want to delete inventory ${tmp.name} `;			
		} else {
			let tmp = inventoryTransactions.find(x => x.inventoryId === inventoryId && x.id === id && x.subId === 0);
			myMsg = `Are you sure, you want to delete transactions of vendor ${tmp.vendor} `;
		}
		vsDialog("Delete Transaction", myMsg,
		{label: "Yes", onClick: () => handleDeleteTransactionConfirm(inventoryId, id, subId) },
		{label: "No" });
		
	}

	async function handleDeleteTransactionConfirm(inventoryId, id, subId) {
		//let tStr = `${inventoryId}/${id}/${subId}`
		console.log(inventoryId, id, subId);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inventory/delinventory/${userCid}/${inventoryId}/${id}/${subId}`;
			let resp = await axios.get(myUrl);
			//setInventoryTransactions(resp.data);
			if (id == 0) {
				setInventoryTransactions(inventoryTransactions.filter(x => x.inventoryId !== inventoryId));
				setInventoryItems(inventoryItems.filter(x => x.id !== inventoryId))
			} else {
				setInventoryTransactions(inventoryTransactions.filter(x => x.inventoryId !== inventoryId || x.id !== id));				
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
			case 5001:
        myMsg = "Discarded quantity cannot be greater than is use quantity";
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


	function filterInventory(newText) {
		newText = newText.trim().toLowerCase();
		let tmpArray;
		if (newText.length !== "") {
			tmpArray = inventoryMasterItems.filter(x => x.name.toLowerCase().includes(newText));
		} else {
			tmpArray = inventoryMasterItems;
		}
		setInventoryItemFilter(newText);
		setInventoryItems(tmpArray);
	}

	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName="Inventory" groupName="" tournament=""/>
		<CssBaseline />
		<Grid className={gClasses.noPadding} container align="center" alignItems='center'>
		<Grid align="left" item xs={12} sm={12} md={4} lg={4} >
			<VsTextSearch label="Filter Inventory by name" value={inventoryItemFilter}
				onChange={(event) => filterInventory(event.target.value)}
				onClear={(event) => filterInventory("")}
			/>
		</Grid>
		<Grid align="right" item xs={false} sm={false} md={4} lg={4} />
		<Grid align="right" item xs={12} sm={12} md={4} lg={4} >
			<VsButton name="Add new Inventory Item" onClick={handleAddItem} />
		</Grid>
		</Grid>
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
			<Typography className={gClasses.title}>{(isDrawerOpened === "ADDINVENTORY")  ? `Add Inventory (number of boxes) of ${emurData1}` : `Edit Inventory  (number of boxes) of ${emurData1}`}</Typography>
			<TextValidator fullWidth className={gClasses.vgSpacing}
				id="vendor" label="Vendor" 
				value={emurVendor} 
				onChange={(event) => { setEmurVendor(event.target.value) }}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="Rate" label="Rate Per Box" type="number"
				value={emurRate} 
				onChange={(event) => { setEmurRate(event.target.value) }}
				validators={['minNumber:1']}
				errorMessages={['Invalid Amount']}
			/>
			<br/>
			<div align="left" >
			<Typography className={gClasses.patientInfo2Blue}>Purchase Date</Typography>
			<br />
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurPurchaseDate}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={setEmurPurchaseDate}
				closeOnSelect={true}
			/>
			</div>
			<br />
			<VsCheckBox align="left" label="Never Expire" checked={neverExpire} onClick={() => setNeverExpire(!neverExpire)} /> 
			{(!neverExpire) &&
				<div align="left">
				<Typography className={gClasses.patientInfo2Blue}>Expiry Date</Typography>
				<br />
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={emurExpireDate}
					dateFormat="DD/MM/yyyy"
					isValidDate={disablePastDt}
					onClose={setEmurExpireDate}
					closeOnSelect={true}
				/>	
				</div>
			}
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="Rate" label="Quantity per Boxes" type="number"
				value={emurQuantityPerBox} 
				onChange={(event) => { setEmurQuantityPerBox(event.target.value) }}
				validators={['minNumber:1']}
				errorMessages={['Invalid Number']}
			/>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Number of Boxes" type="number"
				value={emurData2} 
				onChange={(event) => { setEmurData2(Number(event.target.value)) }}
				validators={["minNumber:1"]}
				errorMessages={['Invalid Number']}
      />
			<ShowResisterStatus />
			<BlankArea />
			<VsButton type="submit" name={(isDrawerOpened === "ADDINVENTORY") ? "Add" : "Update"} />
			</ValidatorForm>    						
		}
		{(isDrawerOpened === "EDITSUBINVENTORY") &&
			<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmitInuseDiscardedInventory}>
			<Typography className={gClasses.title}>{"Update In use / Discarded quantity"}</Typography>
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="In Use Quantity" type="number"
				value={emurData1} 
				onChange={(event) => { setEmurData1(Number(event.target.value)) }}
				validators={[`minNumber:${emurMaxMin.min}`, `maxNumber:${emurMaxMin.max}`]}
				errorMessages={['Invalid Amount', 'Invalid Amount']}
      />
			<br />
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				id="newPatientName" label="Discarded Quantity" type="number"
				value={emurData2} 
				onChange={(event) => { setEmurData2(Number(event.target.value)) }}
				validators={[`minNumber:${emurMaxMin.min}`, `maxNumber:${emurMaxMin.max}`]}
				errorMessages={['Invalid Amount', 'Invalid Amount']}
      />
			<ShowResisterStatus />
			<br />
			<VsButton type="submit" name={"Update"} />
			</ValidatorForm>    						
		}
		</Box>
		</Drawer>
  </div>
  );    
}

