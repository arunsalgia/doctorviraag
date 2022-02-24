import React from 'react';
//import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import BorderWrapper from 'react-border-wrapper'
import globalStyles from "assets/globalStyles";

import {AdultToothNumber } from "views/globals.js";

function isMobile() {
  return (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone/i.test(navigator.userAgent)) ? true : false;
}

export default function VsAdultTeeth(props) {
const gClasses = globalStyles();
let _Click = (props.onClick == null) ? dummy : props.onClick;
//let urArray = 
return (
	<Box className={gClasses.boxStyle} border={1} width="100%">
	<TableContainer>
	<Table style={{ width: '100%' }}>
	<TableBody>  
	{(!isMobile()) &&
	<div>
	<TableRow align="center" key={"TROW1"}>
		<TableCell key={"TD11"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>UR</span>
		</TableCell>
		<TableCell key={"TD1"} align="center" component="td" scope="row" align="center" padding="none" >
			{AdultToothNumber.upperRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
		<TableCell key={"TD12"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>UL</span>
		</TableCell>
		<TableCell key={"TD2"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.upperLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	<TableRow align="center" key={"TROW2"}>
		<TableCell key={"TD13"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>LR</span>
		</TableCell>
		<TableCell key={"TD3"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.lowerRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
		<TableCell key={"TD14"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>LL</span>
		</TableCell>

		<TableCell key={"TD4"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.lowerLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	</div>
	}
	{(isMobile()) &&
	<div>
	<TableRow align="center" key={"TROW1"}>
		<TableCell key={"TD11"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>UR</span>
		</TableCell>
		<TableCell key={"TD1"} align="center" component="td" scope="row" align="center" padding="none" >
			{AdultToothNumber.upperRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	<TableRow align="center" key={"TROW2"}>
		<TableCell key={"TD12"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>UL</span>
		</TableCell>
		<TableCell key={"TD2"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.upperLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	<TableRow align="center" key={"TROW3"}>
		<TableCell key={"TD13"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>LR</span>
		</TableCell>
		<TableCell key={"TD3"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.lowerRight.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	<TableRow align="center" key={"TROW4"}>
		<TableCell key={"TD14"} align="center" component="td" scope="row" align="center" padding="none" >
		<span className={gClasses.toothType}>LL</span>
		</TableCell>

		<TableCell key={"TD4"} align="center" component="td" scope="row" align="center" padding="none">
			{AdultToothNumber.lowerLeft.map( (t) => {
					let myClass = (props.toothArray.includes(t)) ? gClasses.selectedTooth : gClasses.normalTooth;
					return (
						<BorderWrapper key={"TEETH"+t} borderColour="#000000" borderWidth="2px" borderRadius="0px" 
							borderType="solid" innerPadding="0px" padding="10px" margin="10px" >
							<span className={myClass} onClick= {() => _Click(t) }>{t}</span>
						</BorderWrapper>								
					)}
			)}
		</TableCell>
	</TableRow>
	</div>
	}
	</TableBody> 
	</Table>
	</TableContainer>
</Box>
)
}