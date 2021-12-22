var patientRouter = express.Router();
const { 
	ALPHABETSTR,
	getLoginName, getDisplayName,
	svrToDbText, dbToSvrText,
	dbencrypt, dbdecrypt,
	getMaster, setMaster,
	getNewPid, getCustomerNumber, checkCustomerExpiry,
} = require('./functions'); 


let arun_patient = {};

function clearPatient(cid)  {arun_patient[cid] = []};

async function loadPatient(cid) {
	let hasData = false;
	if (arun_patient[cid]) 
	if (arun_patient[cid].length > 0)
		hasData = true;

	//console.log(hasData);

	if (!hasData) {
		console.log("Reading patient for ", cid);
		let hRec = await M_Patient.find({cid: cid, enabled: true}).sort({displayName: 1});
		hRec = emailForClient(hRec);
		arun_patient[cid] = hRec;
		//console.log(arun_patient[cid]);
	}
}

async function getAllPatients(cid) {
	await loadPatient(cid);
	return arun_patient[cid];
}

async function getPatientByPid(cid, pid) {
	await loadPatient(cid);
	let ppp = arun_patient[cid].find(x => x.pid == pid);
	return ppp;
}

patientRouter.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is configured in MEDBLOCK
function emailForClient(myArray) {
	for(let i=0; i<myArray.length; ++i) {
		myArray[i].email = dbToSvrText(myArray[i].email);
	}
	return myArray;
}

function getDob(age) {
	let myBirthYear;
	if (age === 0) {
		myBirthYear = new Date(1900, 1, 1, 0, 0);
	} else {
		myBirthYear = new Date();
		myBirthYear = myBirthYear.setYear(myBirthYear.getFullYear()-age);
	}
	return myBirthYear;
}

function getAge(birthDate) 
{
	let age = 0;
	if (birthDate.getFullYear() !== 1900) {
		let tmp = (new Date().getTime() - birthDate.getTime()) / 86400000;
    age = Math.round(tmp / 365);
	}
	return age;
}

patientRouter.get('/checkexpiry/:cid', async function(req, res, next) {
  setHeader(res);
  
  var {cid} = req.params;
	let tmp = await checkCustomerExpiry(cid);
	let mRec = {status: tmp};
	sendok(res, mRec);
});


patientRouter.get('/add/:cid/:pName/:pAge/:pGender/:pEmail/:pMobile', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pName, pGender, pAge, pEmail, pMobile} = req.params;
	let mRec;
	let lname = getLoginName(pName);
	
	clearPatient(cid);

	// verify if name already exists
	mRec = await M_Patient.findOne({cid: cid, name: lname});
  if (mRec) { senderr(res, 601, 'Patient name already in database.'); return; }
	
	let dname = getDisplayName(pName);
	console.log(lname, dname);
	console.log(pEmail);
  pEmail = svrToDbText(pEmail);
	console.log(pEmail);
  let age = Number(pAge);
	
	let newPid = await getNewPid(cid);
	console.log("New Pid", newPid);
	
	mRec = new M_Patient();
	mRec.cid = cid;
	mRec.name = lname;
	mRec.displayName = dname;
	mRec.email= pEmail;
	mRec.mobile = pMobile;
	mRec.age = age;
	mRec.dob = getDob(age);
	mRec.gender = pGender;
	mRec.enabled = true;
	mRec.pid = newPid;
	mRec.pidStr = newPid.toString();
	mRec.save();
	sendok(res, mRec);
});


patientRouter.get('/addwithdob/:cid/:pName/:pDob/:pGender/:pEmail/:pMobile', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pName, pGender, pDob, pEmail, pMobile} = req.params;
	let mRec;
	let lname = getLoginName(pName);
	
	clearPatient(cid);
	
	// verify if name already exists
	mRec = await M_Patient.findOne({cid: cid, name: lname});
  if (mRec) { senderr(res, 601, 'Patient name already in database.'); return; }
	
	let dname = getDisplayName(pName);
	console.log(lname, dname);
	console.log(pEmail);
  pEmail = svrToDbText(pEmail);
	console.log(pEmail);
  let myDob = new Date(Number(pDob.substr(0, 4)), Number(pDob.substr(4, 2))-1, Number(pDob.substr(6, 2)))
	let myAge = getAge(myDob);
	
	let newPid = await getNewPid(cid);
	console.log("New Pid", newPid);
	
	mRec = new M_Patient();
	mRec.cid = cid;
	mRec.name = lname;
	mRec.displayName = dname;
	mRec.email= pEmail;
	mRec.mobile = pMobile;
	mRec.age = myAge;
	mRec.dob = myDob
	mRec.gender = pGender;
	mRec.enabled = true;
	mRec.pid = newPid;
	mRec.pidStr = newPid.toString();
	mRec.save();
	sendok(res, mRec);
});

patientRouter.get('/edit/:cid/:oldName/:pName/:pAge/:pGender/:pEmail/:pMobile', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldName, pName, pGender, pAge, pEmail, pMobile} = req.params;
	var mRec;

	clearPatient(cid);
	

	let old_lname = getLoginName(oldName);
	let new_lname = getLoginName(pName);
	
	if (old_lname != new_lname) {
		// just check that of new patient already in database
		mRec = await M_Patient.findOne({cid: cid, name: new_lname});
		if (mRec) {
			senderr(res, 601, "New Medicine name already in database");
			return;
		}
	} 
	
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_Patient.findOne({cid: cid, name: old_lname});
	if (!mRec) {
		senderr(res, 611, "Old Patient name not found in database");
		return;
	}
	
	mRec.name = getLoginName(pName);
	mRec.displayName = getDisplayName(pName);
	mRec.email= svrToDbText(pEmail);
	mRec.mobile = pMobile;
	mRec.age = Number(pAge);
	mRec.dob = getDob(Number(pAge));
	mRec.gender = pGender;
	mRec.enabled = true;
	console.log(mRec);
	mRec.save();
	sendok(res, mRec);
});

patientRouter.get('/editwithdob/:cid/:oldName/:pName/:pDob/:pGender/:pEmail/:pMobile', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldName, pName, pGender, pDob, pEmail, pMobile} = req.params;
	var mRec;

	clearPatient(cid);
	
	let old_lname = getLoginName(oldName);
	let new_lname = getLoginName(pName);
	
	if (old_lname != new_lname) {
		// just check that of new patient already in database
		mRec = await M_Patient.findOne({cid: cid, name: new_lname});
		if (mRec) {
			senderr(res, 601, "New Medicine name already in database");
			return;
		}
	} 
	
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_Patient.findOne({cid: cid, name: old_lname});
	if (!mRec) {
		senderr(res, 611, "Old Patient name not found in database");
		return;
	}
	
	let myDob = new Date(Number(pDob.substr(0, 4)), Number(pDob.substr(4, 2))-1, Number(pDob.substr(6, 2)))
	let myAge = getAge(myDob);
	
	mRec.name = getLoginName(pName);
	mRec.displayName = getDisplayName(pName);
	mRec.email= svrToDbText(pEmail);
	mRec.mobile = pMobile;
	mRec.age = myAge;
	mRec.dob = myDob;
	mRec.gender = pGender;
	mRec.enabled = true;
	console.log(mRec);
	mRec.save();
	sendok(res, mRec);
});

patientRouter.get('/new/:cid/:pName', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pName} = req.params;
	
	let lname = getLoginName(pName);
	let dname = getDisplayName(pName);
	//console.log(lname, dname);
	
	// Check if patient already registered
  var tmp = await M_Patient.find({cid: cid, name: lname});
  if (tmp.length > 0)  { senderr(res, 601, `Patient ${dname} already in database.`); return; }
	
	let newPid = await getNewPid(cid);
	console.log("New Pid", newPid);
	
	mRec = new M_Patient();
	mRec.cid = cid;
	mRec.name = lname;
	mRec.displayName = dname;
	mRec.email= svrToDbText("-");
	mRec.mobile = 0;
	mRec.age = 0;
	mRec.dob = getDob(0);
	mRec.gender = 'Male';
	mRec.enabled = true;
	mRec.pid = newPid;
	mRec.save();
	sendok(res, mRec);
});

patientRouter.get('/update/:cid/:pName/:pAge/:pGender/:pEmail/:pMobile', async function(req, res, next) {
  setHeader(res);
  var {cid, pName, pGender, pAge, pEmail, pMobile} = req.params;
	
	clearPatient(cid);
	

	let lname = getLoginName(pName);
	let dname = getDisplayName(pName);
	let email = svrToDbText(pEmail);
	
  var tmp = await M_Patient.findOne({cid: cid, name: lname});
	console.log(tmp);

  if (tmp) {
		tmp.age = Number(pAge);
		tmp.dob = getDob(Number(pAge));
		tmp.gender = pGender;
		tmp.email = email;
		tmp.mobile = pMobile;
		tmp.save();
    sendok(res, tmp);
  }
	else
    senderr(res, 601, `Patient ${pName} not in database.`);
});

patientRouter.get('/delete/:cid/:patient', async function(req, res, next) {
  setHeader(res);
  
  var { cid, patient } = req.params;
	
	clearPatient(cid);
	
	let id = getLoginName(patient);
	console.log(id);
	
	M_Patient.deleteOne({cid: cid, name: id}).then(function(){
    console.log("Data deleted"); // Success
		sendok(res, "1 document deleted");
	}).catch(function(error){
    console.log(error); // Failure
		senderr(res, 601, `Patient ${patient} not found in database.`);
	});
});



patientRouter.get('/listbypid/:cid/:pid', async function(req, res, next) { 
  setHeader(res);
  
  var { cid, pid } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	var allPatient = await getPatient({cid: cid, pid: Number(pid), enabled: true});
	sendok(res, allPatient);
});

patientRouter.get('/listbyname/:cid/:partid', async function(req, res, next) { 
  setHeader(res);
  
  var { cid, partid } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	partid = getLoginName(partid);
	var allPatient = await getPatient({ cid: cid, name: { $regex: partid, $options: "i" }, enabled: true });
	sendok(res, allPatient);
});

patientRouter.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  var {cid} = req.params;
	
	let sts = await checkCustomerExpiry(cid);
	if (sts) return senderr(res, PLANEXIREDERR, "Expiry");

	//var allPatient = await getPatient({cid: cid, enabled: true})
	let allPatients = await getAllPatients(cid);
	//console.log(allPatients);
	sendok(res, allPatients);
});

patientRouter.get('/alphabetlist/:cid/:myChar', async function(req, res, next) {
  setHeader(res);
  
  var { cid, myChar } = req.params;
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	myChar = myChar.toUpperCase( );
	let allPatient = await M_Patient.find({name: new RegExp('^'+myChar, "i"), cid: cid, enabled: true }).sort({name: 1});
	allPatient = emailForClient(allPatient);
	sendok(res, allPatient);
});

patientRouter.get('/count/:cid', async function(req, res, next) {
  setHeader(res);
	var { cid } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	let myQuery, test;
	myQuery = [		//example
		{ $match: { name: /^J/} },
		{ $group: { _id: 'J' , count: { $sum: 1 } } }
  ];
	let allData = [];

	allData=[];
	for(let i=0; i<ALPHABETSTR.length; ++i) {
		myQuery = [
			{ $match: { name: new RegExp('^'+ALPHABETSTR[i], "i"), cid: cid } },
			{ $group: { _id: ALPHABETSTR[i] , count: { $sum: 1 } } }
		];
		test = await M_Patient.aggregate(myQuery);
		allData = allData.concat(test);
	}
	sendok(res, allData);
});


patientRouter.get('/filter/:cid/:partname', async function(req, res, next) { 
  setHeader(res);
  
  var { cid, partname } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	let myQuery = { name: { $regex: partname, $options: "i" }, cid: cid, enabled: true };		
	let allPatient = await M_Patient.find(myQuery).sort({'name': 1});
	allPatient = emailForClient(allPatient);
	sendok(res, allPatient);
});

patientRouter.get('/filter/:cid', async function(req, res, next) { 
  setHeader(res);
  var {cid} = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	let myQuery = { enabled: true, cid: cid };
	let allPatient = await M_Patient.find(myQuery).sort({'name': 1});
	allPatient = emailForClient(allPatient);
	sendok(res, allPatient);
});
 
patientRouter.get('/visitcount/:cid/:pid', async function(req, res, next) { 
  setHeader(res);
  var {cid, pid} = req.params;
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	pid = Number(pid);
	let p, c, o;

	let pendingQuery = [
		{ $match: { cid: cid, pid: pid, visit: 'pending' } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let calcelledQuery = [
		{ $match: { cid: cid, pid: pid, visit: 'cancelled' } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let visitQuery = [
		{ $match: { cid: cid, pid: pid } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	
	
	p = await M_Appointment.aggregate(pendingQuery)
	c = await M_Appointment.aggregate(calcelledQuery)
	o = await M_Visit.aggregate(visitQuery)
	
	let pCount = (p.length > 0) ? p[0].count : 0;
	let cCount = (c.length > 0) ? c[0].count : 0;
	let oCount = (o.length > 0) ? o[0].count : 0;

	let finalData = {pending: pCount, cancelled: cCount, visit: oCount};
	console.log(finalData);
	sendok(res, finalData);
});


patientRouter.get('/test', async function(req, res, next) { 
  setHeader(res);
  
	let allRecs = await M_Visit.find({});
	for(let i=0; i<allRecs.length; ++i) {
		let customerNumber = await getCustomerNumber(allRecs[i].cid);
		let tmp = Math.floor(allRecs[i].pid / 1000) * 100 + (allRecs[i].pid % 100);
		let sss = tmp.toString().substr(2);
		let pid2 = customerNumber*CUSTMF + Number(sss);
		console.log(customerNumber, allRecs[i].pid, tmp, sss, pid2);
		allRecs[i].pid = pid2;
		//allRecs[i].save();
	}
	sendok(res, "Done");
});

patientRouter.get('/pidtest', async function(req, res, next) { 
  setHeader(res);
  
	let allRecs = await M_Patient.find({});
	for(let i=0; i<allRecs.length; ++i) {
		console.log(allRecs[i].pid, allRecs[i].pidStr);
		allRecs[i].pidStr =  allRecs[i].pid.toString();
		allRecs[i].save();
	}
	sendok(res, "Done");
});

async function getPatient(filter) {
	//console.log(filter);
	var allPatient =  await M_Patient.find(filter).sort({displayName: 1});
	//console.log(allPatient);
	allPatient = emailForClient(allPatient);
	return allPatient;
}

 
function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = {
	patientRouter,
	getPatientByPid,
	getAllPatients,
}