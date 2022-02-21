import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';


export default function VsSelect(props) {
const gClasses = globalStyles();
let _align = (props.align == null) ? 'left' : props.align;
let _label = (props.label == null) ? "" : props.label;
let _field = (props.field == null) ? "" : props.field;
let _style = (props.style == null) ? {} : props.style;
let _disabled = (props.style == null) ? false : props.disabled;
//console.log("OPT", props.options);
return (
	<div align={_align} >
	<FormControl style={_style}>
		<InputLabel id={_label}>{_label}</InputLabel>
		{(_field !== "") &&
			<Select
				disabled={_disabled}
				labelId={_label}
				inputProps={props.inputProps}
				value={props.value}
				label={_label}
				onChange={props.onChange}
			>
			{props.options.map(x => 
			<MenuItem key={x[_field]} value={x[_field]}>{x[_field]}</MenuItem>
			)}
			</Select>
		}
		{(_field === "") &&
			<Select
				labelId={_label}
				inputProps={props.inputProps}
				value={props.value}
				label={_label}
				onChange={props.onChange}
			>
			{props.options.map(x => 
			<MenuItem key={x} value={x}>{x}</MenuItem>
			)}
			</Select>
		}	</FormControl>
	</div>
	)
}

