import React, { useEffect } from 'react';
//import { createBrowserHistory } from "history";
import { useHistory } from "react-router-dom";
//import { useParams } from 'react-router-dom'
import Modal from 'react-modal';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

/*
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import HomeIcon from '@material-ui/icons/Home';
import GroupIcon from '@material-ui/icons/Group';

import NextVisit from "views/NextVisit/NextVisit";
import Report from "views/Report/Report.js" 
import Wallet from "views/Wallet/Wallet.js"
import Sample from "views/SuperUser/Sample.js"
import Profile from "views/Profile/UserProfile"
*/

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green, deepOrange, white} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

import Visit from "views/Visit/Visit"
import Appointment from "views/Appointment/Appointment"
import Patient from "views/Patient/Patient.js" 
import Summary from "views/Summary/Summary.js"
import Customer from "views/SuperUser/Customer";
import CustomerInformation from 'views/SuperUser/CustomerInformation';

import Report from "views/Report/Report.js" 


import ChangePassword from "views/Login/ChangePassword.js"
import Home from "views/MED/Home.js";
//import ContactUs from "views/MED/ContactUs.js";

import WorkingHours from "views/Settings/WorkingHours";
import Holiday from "views/Settings/Holiday";
import Assistant from "views/Settings/Assistant";
import Inventory from "views/Inventory/Inventory";
import PanelDoctor from "views/PanelDoctor/PanelDoctor";
import Clinic from "views/Clinic/Clinic"
import PatientHome from "views/Patient/PatientHome";

// import download from 'js-file-downloader';
import { BlankArea } from './CustomComponents';
import {cdRefresh, specialSetPos, upGradeRequired, isMobile,
  downloadApk, clearBackupData,
  setIdle,
	handleLogout,
} from "views/functions.js"
import { LocalSee } from '@material-ui/icons';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#000000',
    color                 : '#FFFFFF',
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
	doctor: {
		fontSize: theme.typography.pxToRem(28),
    fontWeight: theme.typography.fontWeightBold,
    color: 'white',
		backgroundColor: green[800],
	},
	userName: {
		fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightBold,
    color: 'white',
		marginLeft: theme.spacing(50),
	},
	ankit: {
		fontSize: theme.typography.pxToRem(22),
    fontWeight: theme.typography.fontWeightBold,
	},
  noSpacing: { 
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  visitButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#B3E5FC',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
	divider: {
		backgroundColor: 'blue',
	},
  title: {
    flexGrow: 1,
		color: 'blue',
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		//paddingTop: theme.spacing(4),
    //paddingBottom: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
  },
	menuStyle: {
		paddingLeft: theme.spacing(2),
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
	},
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },
  avatar1: {
    margin: theme.spacing(0),
    backgroundColor: deepOrange[500],
    color: theme.palette.getContrastText(deepOrange[500]), 
		//paddingLeft: theme.spacing(10),
    // width: theme.spacing(10),
    // height: theme.spacing(10),
		marginLeft: theme.spacing(6),
  },
}));

export function setTab(num) {
  //console.log("Tab is ", num);
  localStorage.setItem("menuValue", num);
  cdRefresh();
}

export function CricDreamTabs() {
  const history = useHistory();
  const classes = useStyles();
  // for menu 
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
	// check if mobile
	const [itIsMobile, SetItIsMobile] = React.useState(isMobile());
	
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

  useEffect(() => {       
    
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      // console.log(upg);
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
    
    function setMenuValue() {
      setValue(parseInt(localStorage.getItem("menuValue")));
      setIdle(false);
    }
		//checkVersion(); 
    setMenuValue();
}, []);


  function DisplayUpgrade() {
    //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        {/* <Typography className={classes.new} align="center">
          Current Version {process.env.REACT_APP_VERSION}
        </Typography> */}
        <Typography className={classes.new} align="center">
          Latest Version {latestApk.version}
        </Typography>
        <BlankArea/>
        <Typography className={classes.new} align="center">
          What is new
        </Typography>
        <TextField variant="outlined" multiline fullWidth disabled
          id="producttext"
          // label="What is new" 
          className={classes.whatIsNew}
          defaultValue={latestApk.text} 
        />
        <BlankArea />
        <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
        className={classes.dashButton} onClick={handleUpgrade}>Update Now
        </Button>
      </Modal>
      )
    else
      return(null);
  }

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    //console.log(event.currentTarget);
		setArunGroup(true);
  };

  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    localStorage.setItem("menuValue", num);
  }


	const handleHome = () => { setMenuValue(1);  }
  const handleAppointment = () => { setMenuValue(2);  }
	const handleInventory = () => { setMenuValue(4);  }
	const handlePanelDoctor = () => { setMenuValue(5);  }
	const handleClinic = () => { setMenuValue(6);  }

  const handlePatient = () => { handleClose(); setMenuValue(901);}
	
  const handleProfile = () => { handleClose(); handleGrpClose(); setMenuValue(101);}
	const handleWallet = () => { handleClose(); handleGrpClose(); setMenuValue(102);}
	const handleChangePassword = () => { handleClose(); handleGrpClose(); setMenuValue(103);}
	const handleSummary = () => { handleClose(); handleGrpClose(); setMenuValue(104);}
	//const handleContactUs = () => { handleClose(); setMenuValue(202);}
	
	
	const handleWorkingHours = () => { handleClose(); setMenuValue(701);}
	const handleHoliday = () => { handleClose(); setMenuValue(702);}
	const handleAssistant = () => { handleClose(); setMenuValue(703);}
  

  function DisplayCdItems() {
		//console.log("CD Value", value);
    switch(value) {
      case 1: 
				if (process.env.REACT_APP_SHOWHOMEPAGE === 'true')
					return <Home />;
				else 
					return <Patient />
      case 2: return <Appointment/>;
      case 3: return <Visit/>; 	
			case 4: return <Inventory />; 
			case 5: return <PanelDoctor />; 
      case 6: return <Clinic />
			case 7: return <PatientHome />
			
      case 101: 
        if (window.sessionStorage.getItem("userType") === "Developer")
          return <Customer />
        else
          return <CustomerInformation />;
      //case 102: return <Wallet />;
			case 103: return <ChangePassword />;
			case 104: return <Summary />;


      case 901: return <Patient />;


			case 701: return <WorkingHours />
			case 702: return <Holiday />
			case 703: return <Assistant />
      //case 704: return <Medicine />;
			
			case 905: return <Report />

      default: return  null;
    }
  }

  async function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }


  function DisplayGroupMenu() {
   //console.log("Group length");
	return (
	<div align="center" key="usergroups">
		<Typography className={classes.title}>{sessionStorage.getItem("userName")}</Typography>
		<Divider className={classes.divider} />
		<MenuItem onClick={handleProfile}>
		<Typography className={classes.menuStyle}>Profile</Typography>
		</MenuItem>
		<MenuItem onClick={handleChangePassword}>
		<Typography className={classes.menuStyle}>Change Password</Typography>
		</MenuItem>
		{(window.sessionStorage.getItem("userType") === "Doctor") &&
			<MenuItem onClick={handleWallet}>
			<Typography className={classes.menuStyle}>Wallet</Typography>
			</MenuItem>
		}
		<Divider className={classes.divider} />
		<MenuItem onClick={() => {handleClose(); handleLogout(); }}>
		<Typography className={classes.menuStyle}>Logout</Typography>
		</MenuItem>
	</div>
	)}
    
  //let mylogo = `${process.env.PUBLIC_URL}/favicon.ico`;
  //let groupCharacter="G";
  //let currencyChar = '₹';
  
	//console.log("menuValue", localStorage.getItem("menuValue"));
	//console.log("value", value);
	//console.log("Is it Mobile", isMobile());

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.noSpacing}>
          {auth && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon className={classes.icon}/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                // keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
								<Typography className={classes.title}>{sessionStorage.getItem("userName")}</Typography>
								<Divider className={classes.divider} />
                {((window.sessionStorage.getItem("userType") !== "Assistant") && (window.sessionStorage.getItem("userType") !== "Patient") )&&
									<MenuItem onClick={handleProfile}>
										<Typography className={classes.menuStyle}>Profile</Typography>
									</MenuItem>
                }
								{(window.sessionStorage.getItem("userType") !== "Patient") &&
									<MenuItem onClick={handleChangePassword}>
										<Typography className={classes.menuStyle}>Change Password</Typography>
									</MenuItem>
								}
                <Divider className={classes.divider}/>
								{((itIsMobile) && (window.sessionStorage.getItem("userType") !== "Patient")) &&
                  <div>
                  <MenuItem onClick={handleAppointment}>
                  <Typography className={classes.menuStyle}>Appointment</Typography>
                  </MenuItem>
                  <MenuItem onClick={handlePatient}>
                  <Typography className={classes.menuStyle}>Patient</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleSummary}>
                  <Typography className={classes.menuStyle}>Summary</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleInventory}>
                  <Typography className={classes.menuStyle}>Inventory</Typography>
                  </MenuItem>
                  <MenuItem onClick={handlePanelDoctor}>
                  <Typography className={classes.menuStyle}>PanelDoctor</Typography>
                  </MenuItem>
									<Divider className={classes.divider} />
                  </div>
                }
                {((false) && (itIsMobile) && (window.sessionStorage.getItem("userType") === "Patient")) &&
                  <div>
                  <MenuItem onClick={handleClinic}>
                    <Typography className={classes.menuStyle}>Clinic</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleAppointment}>
                  <Typography className={classes.menuStyle}>Appointment</Typography>
                  </MenuItem>
                  <MenuItem onClick={handlePatient}>
                  <Typography className={classes.menuStyle}>Patient</Typography>
                  </MenuItem>
                  <Divider className={classes.divider} />
                  </div>
                }
                {(window.sessionStorage.getItem("userType") !== "Patient") &&
								<div align="center">
								<Typography className={classes.title}>Settings</Typography>
								<MenuItem onClick={handleWorkingHours}>
								<Typography className={classes.menuStyle}>Working Hours</Typography>
								</MenuItem>	
								<MenuItem onClick={handleHoliday}>
								<Typography className={classes.menuStyle}>Holidays</Typography>
								</MenuItem>
								<MenuItem onClick={handleAssistant}>
								<Typography className={classes.menuStyle}>User</Typography>
								</MenuItem>
								</div>
                }
                {((false) && (window.sessionStorage.getItem("userType") === "Developer")) &&
									<div>
									<Divider className={classes.divider}/>
									<MenuItem onClick={handleSample}>
									<Typography className={classes.menuStyle}>Sample</Typography>
									</MenuItem>
									<MenuItem onClick={handleCustomer}>
									<Typography className={classes.menuStyle}>Customer</Typography>
									</MenuItem>
									</div>
								}
                {/*<MenuItem onClick={handleContactUs}>Contact Us</MenuItem>*/}
								<Divider className={classes.divider}/>
								<MenuItem onClick={() => {handleClose(); handleLogout(); }}>
									<Typography className={classes.menuStyle}>Logout</Typography>
								</MenuItem>
              </Menu>
            </div>
          )}
					{(sessionStorage.getItem("userType") !== "Patient") &&
					<Typography onClick={handleHome}>
						<span className={classes.doctor}>+</span>
						<span className={classes.ankit}> Doctor Viraag</span>
					</Typography>
					}
					{(sessionStorage.getItem("userType") === "Patient") &&
					<Typography onClick={handleClinic}>
						<span className={classes.doctor}>+</span>
						<span className={classes.ankit}> Doctor Viraag</span>
					</Typography>
					}
          {/*<IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleHome}
            color="inherit"
          >
            <HomeIcon className={classes.icon}/>
          </IconButton>*/}
					{((false) && (itIsMobile === false) && (window.sessionStorage.getItem("userType") === "Patient")) &&
          <div>
            <Button color="inherit" className={classes.statButton} onClick={handleClinic}>Clinic</Button>
            <Button color="inherit" className={classes.statButton} onClick={handleAppointment}>Appt</Button>
            <Button color="inherit" className={classes.visitButton} onClick={handlePatient}>Patient</Button>
          </div>
          }
					{((itIsMobile === false) && (window.sessionStorage.getItem("userType") !== "Patient")) &&
						<div>
              <Button color="inherit" className={classes.statButton} onClick={handleAppointment}>Appt</Button>
              <Button color="inherit" className={classes.visitButton} onClick={handlePatient}>Patient</Button>
              <Button color="inherit" className={classes.visitButton} onClick={handleSummary}>Summary</Button>
              <Button color="inherit" className={classes.visitButton} onClick={handleInventory}>Inventory</Button>
              <Button color="inherit" className={classes.visitButton} onClick={handlePanelDoctor}>PanelDoctor</Button>
            </div>
					}
					{(false) &&
					<div align="right">
					<Avatar 
            aria-label="account of current user"
            aria-controls="user-appbar"
            aria-haspopup="true"
            color="inherit"
            variant="circular" 
						onClick={handleGrpMenu}
						className={classes.avatar1}>{sessionStorage.getItem("userName").substr(0,1)}
          </Avatar>
					<Menu
            id="group-appbar"
            anchorEl={grpAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            // keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={arunGroup}
            onClose={handleGrpClose}
          >
            <DisplayGroupMenu />
          </Menu>
					</div>
					}
					{/*<Typography onClick={handleHome}>
						<span className={classes.userName}>{sessionStorage.getItem("userName")}</span>
					</Typography>*/}
			 </Toolbar>
      </AppBar>
      <DisplayCdItems/>
      <DisplayUpgrade/>
    </div>
  );
}