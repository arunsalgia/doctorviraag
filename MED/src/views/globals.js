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

export const ToothLeft =		[8,7,6,5,4,3,2,1];
export const ToothRight =		[1,2,3,4,5,6,7,8];

export const ToothNumber = {
	upperLeft:  [18, 17, 16, 15, 14, 13, 12, 11],
	upperRight: [28, 27, 26, 25, 24, 23, 22, 21],
	lowerRight: [38, 37, 36, 35, 34, 33, 32, 31],
	lowerLeft:  [48, 47, 46, 45, 44, 43, 42, 41],
}