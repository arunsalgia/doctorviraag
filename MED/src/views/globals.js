import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const SupportedMimeTypes = ["image/png",  "image/jpeg", "application/pdf"]
export const SupportedExtensions = ["PNG",  "JPG", "PDF"];

export const str1by4 = String.fromCharCode(188)
export const str1by2 = String.fromCharCode(189)
export const str3by4 = String.fromCharCode(190)
export const INR = String.fromCharCode(8377)

export const VISITTYPE = {pending: "pending", expired: "expired", cancelled: "cancelled", visit: ""};
export const WALLETTYPE = {all: "all", wallet: "wallet", bonus: "bonus"};

export const GENDER = ["Male", "Female", "Other"];

export const WEEKSTR = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const SHORTWEEKSTR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHSTR = ["January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December"];	
export const SHORTMONTHSTR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oc", "Nov", "Dec"];	

export const HOURSTR = [
"00", 
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23"
];

export const MINUTESTR = [
"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
"50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
];

export const MINUTEBLOCK=[0, 15, 30, 45];

export const DATESTR = [
"00",
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

//in date function 0 represents JAN I.e. month number 1
export const MONTHNUMBERSTR = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

export const BLOCKNUMBER={
allBlockStart: 0,
allBlockEnd: 95,
morningBlockStart: 0,
morningBlockEnd: 47,
afternoonBlockStart: 48,
afternoonBlockEnd: 63,
eveningBlockStart: 64,
eveningBlockEnd: 95,
}

export const dialogOptions={
  title: 'Title',
  message: 'Message',
  buttons: [
    {label: 'Yes', onClick: () => alert('Click Yes')},
    {label: 'No',  onClick: () => alert('Click No')}
  ],
  childrenElement: () => <div />,
  //customUI: ({ onClose }) => <div>Custom UI</div>,
  closeOnEscape: false,
  closeOnClickOutside: false,
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name"
}

// for dental

//export const ToothLeft =		[8,7,6,5,4,3,2,1];
//export const ToothRight =		[1,2,3,4,5,6,7,8];

export const AdultToothNumber = {
	upperRight:  [18, 17, 16, 15, 14, 13, 12, 11],
	upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
	lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
	lowerRight:  [48, 47, 46, 45, 44, 43, 42, 41]
}

export const ChildToothNumber = {
	upperRight:  [55, 54, 53, 52, 51],
	upperLeft: [61, 62, 63, 64, 65],
	lowerLeft: [71, 72, 73, 74, 75],
	lowerRight:  [85, 84, 83, 82, 81]
}

export const AdultToothRange = {
	upperRight:  {start: 11, end: 18},
	upperLeft: {start: 21, end: 28},
	lowerLeft: {start: 31, end: 38},
	lowerRight:  {start: 41, end: 48}
}

export const ChildToothRange = {
	upperRight:  {start: 51, end: 55},
	upperLeft: {start: 61, end: 65},
	lowerLeft: {start: 71, end: 75},
	lowerRight:  {start: 81, end: 85}
}
export const MAGICNUMBER = 99999;

export const  SELECTSTYLE = {
	marginBottom: 20, 
	marginLeft: 15
} ;

export const APPTBLOCKLIST = [
"00:15","00:30","00:45",
"01:00","01:15","01:30","01:45",
"02:00","02:15","02:30","02:45",
"03:00","03:15","03:30","03:45",
"04:00","04:15","04:30","04:45",
"05:00","05:15","05:30","05:45",
"06:00"
];