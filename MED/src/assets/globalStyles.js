//import bgImage from ./image/SI_BGD.JPG'

import {
  successColor,
  whiteColor, 
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";
import { red, blue, grey, green, deepOrange, deepPurple, yellow, lightGreen } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';


const globalStyles = makeStyles((theme) => ({
	appbar: {
		backgroundColor: '#04B1EF',
	},
  bgImage: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/image/SI_BGD.JPG)`,
    //backgroundPosition: 'center',
    backgroundSize: 'cover',
    //backgroundRepeat: 'no-repeat',
    width: '50vw',
    height: '100vh'
  },
	logo: {
    width: theme.spacing(10),
    height: theme.spacing(10),
		//borderWidth: 4,
		//borderStyle: 'solid',
		margin: 'none',
  },
	avatar: {
		marginTop: '30%',
    margin: theme.spacing(1),
    backgroundColor: 'EFF7FA', 					//theme.palette.secondary.main,
    width: theme.spacing(25),
    height: theme.spacing(20),
  },
  blue14: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
  normal14: {
		fontSize: theme.typography.pxToRem(14),
    fontSize: theme.typography.pxToRem(14),
	},
	new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    //color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#FFFFFF',
		fontSize: theme.typography.pxToRem(16),
    //color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
  dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
	}, 
  dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	},
  drawer40: {
		width: '40%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
  drawer90: {
		width: '90%',
		flexShrink: 0
		//backgroundColor: "rgba(0,0,0,0.6)" Don't target here
	},
  normalAccordian: {
    backgroundColor: '#FFCCBC',
    borderRadius: 25,
  },
  selectedAccordian: {
    backgroundColor: '#B2EBF2',
    borderRadius: 25,
  },
	indexSelection: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "2px 2px", 
		margin: "2px 2px", 
	},
	dateSelection: {
		color: 'green',
		fontSize: theme.typography.pxToRem(24),
		fontWeight: theme.typography.fontWeightBold,
		padding: "2px 2px", 
		margin: "2px 2px", 
	},
	filterRadio: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		color: '#000000',	
	},
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
  pendingSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	expiredSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: grey[500],
	},
  visitSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		backgroundColor: lightGreen["A400"],
	},
  availableSlot: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		borderColor: 'blue',
		//backgroundColor: blue[300] 
	},
	selectedTooth: {
		backgroundColor: green[900],
		color: 'white',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	normalTooth: {
		//backgroundColor: 'lightGreen',
		fontWeight: theme.typography.fontWeightBold,
		margin: "3px",
	},
	toothNumber: {
		borderColour: 'black',
		borderWidth: "1px",
		borderRadius: "0px",
		borderType: "solid",
		innerPadding: "0px",
		//padding: "10px",
		//margin: "10px",
	},
	tooth: {
		//backgroundColor: 'lightGreen',
		fontSize: theme.typography.pxToRem(12),
		//fontWeight: theme.typography.fontWeightBold,
	},
	toothType: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		margin: "5px",
	},
	blueCheckBox: {
		color: 'blue',
	},
	blueCheckBoxLabel: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	functionSelected: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		//color: "blue",
		borderBottom: "3px solid",
    //width: "100%"
		
	},
	functionUnselected: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: "#BDBDBD",
	},
	green: {
		color: green[900],
	},
	deepOrange: {
		color: deepOrange[900],
	},
	blue: {
		color: 'blue',
	},
	bgRed: {
		backgroundColor: 'red',
	},
	bgBlue: {
		backgroundColor: 'blue',
	},
	divider: {
		backgroundColor: 'blue',
		paddingTop: '5px',
		paddingLeft: '5px',
	},
  root: {
    width: '100%',
    backgroundColor: '#FAF5E9',
  },
	drawerPaper: {
    //position: 'relative',
    whiteSpace: 'nowrap',
    width: 300,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    //background: '#535454',
    //color: '#fff',
  },
	title: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	titleBlack: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'black',
		marginTop: 'none',
		marginBottom: "20px",
	},
	vgSpacing: {
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	boxStyle: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		//backgroundColor: 'green',
		//backgroundColor: blue[300] 
	},
  noPadding: {
    padding: "none", 
  },
  greenboxStyle: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		backgroundColor: lightGreen["A400"],
		//backgroundColor: blue[300] 
	},
	select: {
		padding: "none", 
		backgroundColor: '#B3E5FC',
		margin: "none",
	},
	patientName: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	patientInfo: {
		//marginLeft: theme.spacing(3),
		fontSize: theme.typography.pxToRem(16),
	},
	patientInfo2: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},
  titleOrange: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,	
		color: deepOrange[900],
	},
	patientInfo2Red: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: 'red',
	},
  patientInfo2Orange: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: deepOrange[900],
	},
	patientInfo2Green: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: 'green',
	},
	patientInfo2Blue: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: 'blue',
	},
	patientInfo999: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		marginRight: theme.spacing(5),
	},
	selectForm: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
	selectLabel: {
		color: yellow[700],
	},
	link: {
		backgroundColor: 'transparent',
	},
	webPage: {
		width: '100%',
		height: '100%',
		backgroundColor: 'white',
	},
  fullWidth: {
		display: "flex-root",
    width: "100%"
	},
  textArea: {
		display: "flex-root",
    width: "100%",
    fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},
  textAreaFixed: {
		display: "flex-root",
    width: "100%",
    fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
    resize: 'none',
	},
	signInWelcome: {
		align: "center",
		//position: "fixed",
		//top: "40%",
		//left: "35%",
		color: blue[700],
		backgroundColor: yellow[100],
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		border: 5,
		borderRadius: 7,
		borderWidth: 2,
		margin: 5,
		borderColor: 'black',
		borderStyle: 'solid',
	},
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginLeft: 3,
		marginRight: 3,

  },
  page: {
  },
	yesNoTitle: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
		color: blue[700],
  },
	yesNoNormalMessage: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
  },
	yesNoErrorMessage: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
		color: red[700],
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#FAF5E9',
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
  message18: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message16: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message14: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message12: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message10: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  error:  {
    fontSize: '12px',
    color: red[700],
    alignItems: 'center',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
  },
  nonerror:  {
    fontSize: '12px',
    color: blue[700],
    alignItems: 'center',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
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
  td : {
    border: 5,
    align: "center",
    padding: "none",
    backgroundColor: blue[100],
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',    
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "10px",
      height: "10px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  modalContainer: {
    content: "",
    opacity: 0.8,
    // background: rgb(26, 31, 41) url("your picture") no-repeat fixed top;
    // background-blend-mode: luminosity;
    /* also change the blend mode to what suits you, from darken, to other 
    many options as you deem fit*/
    // background-size: cover;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // position: absolute;
    // z-index: -1;
    // height: 500px;
  },
  modalTitle: {
    color: blue[700],
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
	modalTitle1: {
    color: '#78797A',
    fontSize: theme.typography.pxToRem(28),
    fontWeight: theme.typography.fontWeightBold,
  },
  modalMessage: {
    //color: blue[700],
    fontSize: theme.typography.pxToRem(14),
    //fontWeight: theme.typography.fontWeightBold,
  },
  modalbutton: {
    margin: theme.spacing(2, 2, 2),
  },
  jumpButton: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A237E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(20),
  },
  jumpButtonFull: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A237E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  noSpace: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  show: {
    display: 'block',
  },
  hide: {
    display: 'none',
  },
}));

export default globalStyles;
