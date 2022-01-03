import React, { useState, useContext, useEffect } from 'react';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import InputAdornment from "@material-ui/core/InputAdornment";
//import { UserContext } from "../../UserContext";
import axios from "axios";
import red from '@material-ui/core/colors/red';
//import { useHistory } from "react-router-dom";
import { cdRefresh, encrypt} from "views/functions.js";
import { CricDreamLogo, BlankArea, ValidComp } from 'CustomComponents/CustomComponents.js';
import { setTab } from "CustomComponents/CricDreamTabs.js"
import { useAlert } from 'react-alert';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
}));




export default function ResetPassword() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showRepeatPassword, setShowRepeatPassword] = useState(false);
	
	const [disableButton, setDisableButton] = useState(true);
	
	
	useEffect(() => {

    const verifyCode = async () => {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricverifycode/${sessionStorage.getItem("currentUserCode")}`
				// console.log(myUrl);
				let  response = await axios.get(myUrl);
				// console.log(response.data);
				let sts = response.data.status;
				switch (sts) {
					case 1001:
						alert.error("Invalid Link");
						break;
					case 1002:
						alert.error("Link expired. Regenerate link");
						break;
					case 0:
						setDisableButton(false);
						break;
					default:
						alert.error("Invalid code "+sts.toString()+" received from server");
						break;
				}
			} catch (e) {
				console.log("Failed");
				alert.error("Error in response from server");
			}
    }
    verifyCode();
  }, []);



  const handleSubmit = async() => {
    console.log("Submit command provided");
    if (true) {
      //let tmp1 = encrypt(currentPassword);
      let tmp2 = encrypt(newPassword);
      let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricresetpassword/${sessionStorage.getItem("currentUserCode")}/${tmp2}`);
      if (response.status === 200) {
				sessionStorage.setItem("currentLogin","SIGNIN");
        setTab(0);
      } else {
        // error
        setRegisterStatus(response.status);
        console.log(`Status is ${response.status}`);
      }
    } 
  }


  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = ``;
        break;
      case 200:
        myMsg = `Updated Password successfully.`;
        break;
      case 602:
        myMsg = "Invalid Current password";
        break;
      case 611:
        myMsg = "New password cannot be same as Current Password";
      break;
			case 1001:
			case 1002:
        myMsg = "Invalid / Expired Link";
			break; 
			case 99999:
        myMsg = "Reset link expired";
			break; 
      default:
        myMsg = "Unknown Error";
        break;
    }
    return(
      <Typography className={(registerStatus === 200) ? classes.root : classes.error}>{myMsg}</Typography>
    )
	}

	function handleLogin() {
    // console.log("Call for login here");
    // history.push("/signin")
    sessionStorage.setItem("currentLogin", "SIGNIN");
    cdRefresh();

  }
	
	function handleForgot() {
		sessionStorage.setItem("currentLogin", "RESET");
    cdRefresh();
	}
	
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
			<CricDreamLogo /> 
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
			{(showNewPassword) &&
				<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
					label="New Password" type={"text"}
					value={newPassword} 
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<VisibilityIcon onClick={() => { setShowNewPassword(false); }} />
							</InputAdornment>
						),
					}}
					onChange={() => { setNewPassword(event.target.value) }}
					validators={['minLength', 'noSpecialCharacters']}
					errorMessages={['Minimum 6 chars required','Special characters not permitted']}
				/>
			}
			{(!showNewPassword) &&
				<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
					label="New Password" type={"password"}
					value={newPassword} 
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<VisibilityOffIcon onClick={() => { setShowNewPassword(true); }} />
							</InputAdornment>
						),
					}}
					onChange={() => { setNewPassword(event.target.value) }}
					validators={['minLength', 'noSpecialCharacters']}
					errorMessages={['Minimum 6 chars required','Special characters not permitted']}
				/>
			}
			{(showRepeatPassword) &&
				<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
					label="Repeat Password" type={"text"}
					value={repeatPassword} 
					onChange={() => { setRepeatPassword(event.target.value) }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<VisibilityIcon onClick={() => { setShowRepeatPassword(false); }} />
							</InputAdornment>
						),
					}}
          validators={['isPasswordMatch']}
          errorMessages={['password mismatch']}
				/>
			}
			{(!showRepeatPassword) &&
				<TextValidator fullWidth variant="outlined"  required className={gClasses.vgSpacing}
					label="Repeat Password" type={"password"}
					value={repeatPassword} 
					onChange={() => { setRepeatPassword(event.target.value) }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<VisibilityOffIcon onClick={() => { setShowRepeatPassword(true); }} />
							</InputAdornment>
						),
					}}
          validators={['isPasswordMatch']}
          errorMessages={['password mismatch']}
				/>
			}
      <Button type="submit" fullWidth variant="contained" color="primary" disabled={disableButton} >
        Update
			</Button>
			<ValidComp p1={newPassword}/> 
    </ValidatorForm>
    </div>
		<Typography className={classes.root}>
      <Link href="#" onClick={handleLogin} variant="body2">
        Already have an account? Sign in 
      </Link>
    </Typography>		
    </Container>
  );
}
