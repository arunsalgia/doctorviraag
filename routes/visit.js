var router = express.Router();
//original import { Document, Packer, Paragraph, TextRun } from "docx";
const { Document, Packer, Paragraph, TextRun, Header, Footer,
	AlignmentType,
 } = require("docx");

const { 
	getLoginName, getDisplayName,
	svrToDbText, dbToSvrText,
	getMaster, setMaster,
	base64ToString,
	setOldPendingAppointment,
	generateOrder, generateOrderByDate, akshuGetCustomer,
} = require('./functions'); 

const { sendVisitSms } = require("./sms");

const MYFONT="Arial";
const MYSIZE=12*2;


const str1by4 = String.fromCharCode(188)
const str1by2 = String.fromCharCode(189)
const str3by4 = String.fromCharCode(190)
let medQty=[];

function medStr(qtyNum) {
	if (qtyNum == 0) return "0";
	
	var retStr = (qtyNum >= 2) ? Math.floor(qtyNum / 2).toString() : "";

	switch (qtyNum % 2) 
	{
		case 1: retStr += str1by2; break;
	}
	return retStr;
}

function setMedQty(num) {
	if (medQty.length == 0) {
		for(let i=0; i<=20; ++i) {
			medQty.push({num: i, str: medStr(i)});
		}
	}
	return medQty[num].str;
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
	console.log("In visist");
  next('route');
});

function getBlankVisit(cid, pid, name) {
	let vRec = new M_Visit();
	vRec.cid = cid;
	vRec.pid = pid;
	vRec.displayName = name;
	vRec.visitNumber = MAGICNUMBER;
	vRec.visitDate = new Date();
	vRec.medicines = [];
	vRec.userNotes = [];
	vRec.remarks = [];
	//vRec.info = [];
	vRec.enabled = true;
	vRec.nextVisitTime = 0;
	vRec.nextVisitUnit = "Day";
	return vRec;
}

async function decodeVisitInfo(jsonData) {
	let myData = JSON.parse(jsonData);

	// convert base64 to string
	for(let i=0; i<myData.visit.medicines.length; ++i) {
		myData.visit.medicines[i].name = base64ToString(myData.visit.medicines[i].name);
	}
	for(let i=0; i<myData.visit.userNotes.length; ++i) {
		myData.visit.userNotes[i].name = base64ToString(myData.visit.userNotes[i].name);
	}
	for(let i=0; i<myData.visit.remarks.length; ++i) {
		myData.visit.remarks[i].name = base64ToString(myData.visit.remarks[i].name);
	}
	
	return myData;
}

router.get('/printdoc/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid } = req.params;
	pid = Number(pid);
	
	let myVisit = await M_Visit.findOne({cid: cid, pid: pid, visitNumber: MAGICNUMBER});
	if (!myVisit) return senderr(res, 601, "No new visit");
	pRec = await getPatient({cid: cid, pid: pid});
	//console.log(pRec);
	
	// need doctor name in the end
	//let pCustomerRec = M_Customer.findOne({_id: cid});
	
	
	// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
	// This simple example will only contain one section
	
	let allPara = [];
	let text = [];
	let pata = [];
	
	// leave initial few lines for header
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());

	// Write date 
	text = [];
	text.push(normalText("Date: "));
	text.push(boldText(dateString(myVisit.visitDate.toString())));
	allPara.push(rightAlignedPara(text));
	
	// give 2 blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());

	text = [];
	text.push(normalText("Patient Id:\t\t"));
	text.push(boldText(pRec.pid.toString()));
	allPara.push(normalPara(text));
	allPara.push(blankLine());
	
	text = [];
	text.push(normalText("Patient Name:\t"));
	text.push(boldText(pRec.displayName));
	allPara.push(normalPara(text));	
	allPara.push(blankLine());
	
	text = [];
	text.push(normalText("Age / Gender:\t"));
	if (pRec.age > 0) {
		text.push(boldText(pRec.age.toString()));
		text.push(normalText(" / "));
		text.push(boldText(pRec.gender));
	}
	allPara.push(normalPara(text));
	
		// give blank lines
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// Medicines start here
	text = [];
	text.push(boldUnderlineText("Medicines:"));
	allPara.push(normalPara(text));
	allPara.push(blankLine());
	
	for(let i=0; i<myVisit.medicines.length; ++i) {
		allPara.push(medicinePara(myVisit.medicines[i]));
		allPara.push(blankLine());
	}
	
	// medicines over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// notes start here
	let allNotes = myVisit.userNotes.filter(x => x.name.trim() !== "");
	if (allNotes.length > 0) {
		text = [];
		text.push(boldUnderlineText("Advice:"));
		allPara.push(normalPara(text));
		allPara.push(blankLine());
		
		for(let i=0; i<allNotes.length; ++i) {
			allPara.push(notesPara(allNotes[i]));
			//allPara.push(blankLine());
		}
	}
	// advice over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	// test to be taken starts here
	let allTest = myVisit.remarks.filter(x => x.name.trim() !== "");
	if (allTest.length > 0) {
		text = [];
		text.push(boldUnderlineText("Test to be taken for next visit:"));
		allPara.push(normalPara(text));
		allPara.push(blankLine());
		
		for(let i=0; i<allTest.length; ++i) {
			allPara.push(testPara(allTest[i]));
			//allPara.push(blankLine());
		}
	}
	// test  over
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	//next review
	let reviewDate = new Date();
	
	switch (myVisit.nextVisitUnit.substr(0,1).toUpperCase()) {
		case "D": reviewDate.setDate(reviewDate.getDate() + myVisit.nextVisitTime); break;
		case "W": reviewDate.setDate(reviewDate.getDate() + (7*myVisit.nextVisitTime)); break;
		case "M": reviewDate.setMonth(reviewDate.getMonth() + myVisit.nextVisitTime); break;
	}
	
	let myDate = reviewDate.getDate();
	let myMonth = reviewDate.getMonth();
	++myMonth;	// (change 0-11 to 1-12)
	let myYear = reviewDate.getFullYear();
	
	let dateStr = "";
	dateStr += ((myDate < 10) ? "0" : "") + myDate.toString() + " / ";
	dateStr += ((myMonth < 10) ? "0" : "") + myMonth.toString()+ " / ";
	dateStr += myYear.toString();
	
	text = [];
	text.push(boldText("Next review: "));
	text.push(boldText(dateStr));
	allPara.push(normalPara(text));
	
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	
	let customerRec = await akshuGetCustomer(cid);
	text = [];
	text.push(boldText(customerRec.doctorName+"   "));
	allPara.push(rightAlignedPara(text));
	
	
	const visitDoc = new Document({
		sections: [{
			properties: {}, 
			children: allPara,
			/*
			footers: {
				default: new Footer({ 
						children: [boldText("Arun Salgia"),],
				}),
        },
			*/
		}]
	});
	
	//console.log("PWD is ",process.cwd())
	// Used to export the file into a .docx file
	await Packer.toBuffer(visitDoc).then((buffer) => {
			fs.writeFileSync(process.cwd() + `/temp/${pRec.cid}_${pRec.pid}_patientVisit.docx`, buffer);
	});
		
	sendok(res, "ok");
});


router.post('/update/:cid/:visitInfo', async function(req, res, next) {
  setHeader(res);
  var {cid, visitInfo} = req.params;
	visitInfo = JSON.parse(visitInfo);
	//console.log(visitInfo);
	
	let myRec = await M_Visit.findOne({cid: cid, pid: visitInfo.pid, visitNumber: MAGICNUMBER});
	if (!myRec) {
		myRec = getBlankVisit(cid, visitInfo.pid, visitInfo.displayName);
	}
	myRec.visitDate = new Date();
	myRec.medicines = visitInfo.medicine;
	myRec.userNotes = visitInfo.userNote;
	myRec.remarks = visitInfo.remark;
	myRec.nextVisitTime = visitInfo.nextTime;
	myRec.nextVisitUnit = visitInfo.nextUnit;
	//console.log(myRec)
	myRec.save();
	
	// now check if any pending appointment of this patient
	// if found, declare it as over by writing visit record id in appointment
	setOldPendingAppointment(cid, visitInfo.pid, myRec._id)
	
	// added entry in pending visit
	let nvRec = await M_NextVisit.findOne({cid: cid, pid: visitInfo.pid});
	if (!nvRec) {
		nvRec = new M_NextVisit();
		nvRec.cid = cid;
		nvRec.pid = visitInfo.pid;
		nvRec.enabled = true;
	}
	let myNextVisit = new Date();
	switch (visitInfo.nextUnit.substr(0, 1).toUpperCase()) {
		case 'D' : myNextVisit.setDate(myNextVisit.getDate()+visitInfo.nextTime);  break;
		case 'W' : myNextVisit.setDate(myNextVisit.getDate()+(7*visitInfo.nextTime));  break;
		case 'M' : myNextVisit.setMonth(myNextVisit.getMonth()+visitInfo.nextTime);  break;
		case 'Y' : myNextVisit.setYear(myNextVisit.getFullYear()+visitInfo.nextTime);  break;
	}
	console.log(myNextVisit);
	nvRec.nextVisitDate = myNextVisit;
	nvRec.save();

	sendok(res, "Ok");
	return;
	
	// ---------------- old junk not to be used ---------------------------
	console.log(visitNumber);
	//let tmp = JSON.parse(visitInfo);
	let tmp = await decodeVisitInfo(visitInfo);
	//console.log(tmp);

	let info = tmp.visit;
	//let apptRec = tmp.appointment;
	let nextVisitInfo =  tmp.nextVisit;
	console.log(visitNumber);

	// just check if already exists
	myRec = await M_Visit.findOne({cid: cid, pid: info.pid, visitNumber: visitNumber});
	console.log(myRec);
	if (!myRec) {
		updatefirstTime = true;
		console.log("1st time update");
		// updating 1st time
		myRec = new M_Visit({ 
		enabled: true,
		cid: cid,
		pid: info.pid,
		displayName: info.displayName,
		visitDate: '',
		visitNumber: 0,
		medicines: [],
		remarks: [],
		userNotes: [],
		appointment: '',
		});
	} else {
		console.log("Already there");
	}
	
	// common update
	myRec.pid = info.pid;
	myRec.visitDate = info.visitDate;
	myRec.visitNumber = Number(visitNumber);	
	myRec.medicines = info.medicines;
	myRec.remarks = info.remarks;
	myRec.userNotes = info.userNotes;

	console.log(myRec);
	
	// now check for appt
	let apptRec;
	if (updatefirstTime) {
		let allPending = await M_Appointment.find({cid: cid, pid: info.pid, visit: VISITTYPE.pending}).sort({order: 1}).limit(1);
		if (allPending.length === 0) {
			let today = new Date();
			let myYear = today.getFullYear();
			let myMonth = today.getMonth();
			let myDate = today.getDate();
			let myHour = today.getHours();
			let myMin = today.getMinutes();
			
			let myOrder = ((myYear * 100) + myMonth)*100 + myDate;
			myOrder = (myOrder*100 + myHour) * 100 + myMin;
			console.log("myOrder", myOrder);
			
			apptRec =  new M_Appointment();
			apptRec.cid = cid;
			//apptRec.data = newData.data;
			apptRec.apptTime  = today;
			apptRec.order = myOrder;
			
			//apptRec.pid = newData.data.pid;
			apptRec.pid = myRec.pid;
			apptRec.displayName = myRec.displayName
			
			apptRec.date = myDate;
			apptRec.month = myMonth;
			apptRec.year = myYear;	
			apptRec.hour = myHour;
			apptRec.minute = myMin;
			
		} else {
			//apptRec = await M_Appointment.findOne({_id: apptRec._id});
			apptRec = allPending[0];
		}
		apptRec.visit = myRec._id;
		await apptRec.save();
		myRec.appointment = apptRec._id;
		await myRec.save();
	} 
	
	
	
	
	// now save both appt and visit. now update next visit
	
	// next visit date 
	myNextVisit = new Date();
	console.log(myNextVisit);
	switch (nextVisitInfo.unit.substr(0, 1).toUpperCase()) {
		case 'D' : myNextVisit.setDate(myNextVisit.getDate()+nextVisitInfo.after);  break;
		case 'W' : myNextVisit.setDate(myNextVisit.getDate()+(7*nextVisitInfo.after));  break;
		case 'M' : myNextVisit.setMonth(myNextVisit.getMonth()+nextVisitInfo.after);  break;
		case 'Y' : myNextVisit.setYear(myNextVisit.getFullYear()+nextVisitInfo.after);  break;
	}
	console.log(myNextVisit);
	console.log(myNextVisit);
	
	// update next visit 
	let newNext;
	if (updatefirstTime) {
		// update previous pending visit to over with new time
		let prevVisit = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		if (prevVisit) {
			prevVisit.visitDate = new Date(myRec.visitDate);
			prevVisit.status = VISITTYPE.over;
			prevVisit.save()
		}
		newNext = new M_NextVisit();
		newNext.cid = myRec.cid;
		newNext.pid = myRec.pid;
		newNext.displayName = myRec.displayName;
		newNext.status = VISITTYPE.pending;
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	} else {
		newNext = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	}
	sendok(res, myRec);
});

router.get('/close/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  var {cid, pid} = req.params;
	pid = Number(pid); 
	
	// visistNUmber as MAGICNUMER is current active visist. Get it
	let myRec = await M_Visit.findOne({cid: cid, pid: pid, visitNumber: MAGICNUMBER});
	if (!myRec) return sendok(res, {visitNumber: -1 })
	
	// change MAGICNUMBer to latest visit number
	let tmp = await M_Visit.find({cid: cid, pid: pid, visitNumber: {$lt: MAGICNUMBER} }).limit(1).sort({visitNumber: -1});
	myRec.visitNumber = (tmp.length > 0) ? tmp[0].visitNumber + 1	: 1;						//visitCountRec.length;
	await myRec.save();
	sendVisitSms(cid, pid, myRec.nextVisitTime, myRec.nextVisitUnit);
	sendok(res, {visitNumber: myRec.visitNumber});	
});

router.get('/setdate/:cid/:pid/:newDate', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, newDate} = req.params;
	
	let myRec = await M_Visit.findOne({cid: cid, pid: pid, visitNumber: MAGICNUMBER});
	if (!myRec) return senderr(res, 601, 'Invalid cid / pid');
	
	let visitDate = new Date(
		Number(newDate.substr(0, 4)),
		Number(newDate.substr(4, 2))-1,
		Number(newDate.substr(6, 2)),
		0, 0, 0
	);
	myRec.visitDate = visitDate;
	myRec.save();
	sendok(res, myRec);
});

router.get('/updatenewvisit/:cid/:visitNumber/:visitInfo', async function(req, res, next) {
  setHeader(res);
  var {cid, visitNumber, visitInfo} = req.params;
	let updatefirstTime = false;
	visitNumber = Number(visitNumber);
	
	//console.log(visitNumber);
	//let tmp = JSON.parse(visitInfo);
	let tmp = await decodeVisitInfo(visitInfo);
	//console.log(tmp);

	let info = tmp.visit;
	//let apptRec = tmp.appointment;
	let nextVisitInfo =  tmp.nextVisit;
	//console.log(visitNumber);

	// just check if already exists
	let myRec = await M_Visit.findOne({cid: cid, pid: info.pid, visitNumber: visitNumber});
	//console.log(myRec);
	if (!myRec) {
		updatefirstTime = true;
		//console.log("1st time update");
		// updating 1st time
		myRec = new M_Visit({ 
		enabled: true,
		cid: cid,
		pid: info.pid,
		displayName: info.displayName,
		visitDate: '',
		visitNumber: 0,
		medicines: [],
		remarks: [],
		userNotes: [],
		appointment: '',
		});
	} else {
		console.log("Already there");
	}
	
	// common update
	myRec.pid = info.pid;
	myRec.visitDate = info.visitDate;
	myRec.visitNumber = Number(visitNumber);	
	myRec.medicines = info.medicines;
	myRec.remarks = info.remarks;
	myRec.userNotes = info.userNotes;

	//console.log(myRec);
	
	// now check for appt
	let apptRec;
	if (updatefirstTime) {
		let allPending = await M_Appointment.find({cid: cid, pid: info.pid, visit: VISITTYPE.pending}).sort({order: 1}).limit(1);
		if (allPending.length === 0) {
			let today = new Date();
			let myYear = today.getFullYear();
			let myMonth = today.getMonth();
			let myDate = today.getDate();
			let myHour = today.getHours();
			let myMin = today.getMinutes();
			
			let myOrder = ((myYear * 100) + myMonth)*100 + myDate;
			myOrder = (myOrder*100 + myHour) * 100 + myMin;
		//console.log("myOrder", myOrder);
			
			apptRec =  new M_Appointment();
			apptRec.cid = cid;
			//apptRec.data = newData.data;
			apptRec.apptTime  = today;
			apptRec.order = myOrder;
			
			//apptRec.pid = newData.data.pid;
			apptRec.pid = myRec.pid;
			apptRec.displayName = myRec.displayName
			
			apptRec.date = myDate;
			apptRec.month = myMonth;
			apptRec.year = myYear;	
			apptRec.hour = myHour;
			apptRec.minute = myMin;
			
		} else {
			//apptRec = await M_Appointment.findOne({_id: apptRec._id});
			apptRec = allPending[0];
		}
		apptRec.visit = myRec._id;
		await apptRec.save();
		myRec.appointment = apptRec._id;
		await myRec.save();
	} 
	
	
	
	
	// now save both appt and visit. now update next visit
	
	// next visit date 
	let myNextVisit = new Date();
	//console.log(myNextVisit);
	switch (nextVisitInfo.unit.substr(0, 1).toUpperCase()) {
		case 'D' : myNextVisit.setDate(myNextVisit.getDate()+nextVisitInfo.after);  break;
		case 'W' : myNextVisit.setDate(myNextVisit.getDate()+(7*nextVisitInfo.after));  break;
		case 'M' : myNextVisit.setMonth(myNextVisit.getMonth()+nextVisitInfo.after);  break;
		case 'Y' : myNextVisit.setYear(myNextVisit.getFullYear()+nextVisitInfo.after);  break;
	}
	//console.log(myNextVisit);
	//console.log(myNextVisit);
	
	// update next visit 
	let newNext;
	if (updatefirstTime) {
		// update previous pending visit to over with new time
		let prevVisit = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		if (prevVisit) {
			prevVisit.visitDate = new Date(myRec.visitDate);
			prevVisit.status = VISITTYPE.over;
			prevVisit.save()
		}
		newNext = new M_NextVisit();
		newNext.cid = myRec.cid;
		newNext.pid = myRec.pid;
		newNext.displayName = myRec.displayName;
		newNext.status = VISITTYPE.pending;
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	} else {
		newNext = await M_NextVisit.findOne({cid: myRec.cid, pid: myRec.pid, status: VISITTYPE.pending});
		newNext.nextVisit = myNextVisit;
		await newNext.save();
	}
	sendok(res, myRec);
});


router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
	var {cid, pid} = req.params;
	
	//console.log(cid, pid)
	let allRecs = await M_Visit.find({cid: cid, pid: Number(pid)}).sort({visitNumber: 1});
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/revlist/:cid/:pid', async function(req, res, next) {`	`
  setHeader(res);
  
	var {cid, pid} = req.params;
	
	//console.log(cid, pid)
	let allRecs = await M_Visit.find({cid: cid, pid: Number(pid)}).sort({visitNumber: -1});
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
	var {cid} = req.params;
	
	let allRecs = await M_Visit.find({cid: cid}).sort({visitNumber: 1});
	//console.log(allRecs);
	sendok(res, allRecs);
});


router.get('/fromtolist/:cid/:myFrom/:myTo', async function(req, res, next) {
  setHeader(res);
  
	var {cid, myFrom, myTo} = req.params;
	console.log(myFrom, myTo);
	
	//console.log(cid, pid)
	let startDate = new Date(Number(myFrom.substr(0, 4)), Number(myFrom.substr(4,2))-1, Number(myFrom.substr(6,2)), 0, 0, 0);
	let endDate = new Date(Number(myTo.substr(0, 4)), Number(myTo.substr(4,2))-1, Number(myTo.substr(6,2))+1, 0, 0, 0);
	console.log(startDate, endDate);

	let allRecs = await M_Visit.find({cid: cid, visitDate: {$gte: startDate, $lte: endDate} }).sort({visitDate: -1});
	//let allRecs = await M_Visit.find({cid: cid, $and: [ 
	//	{visitDate: {$gte: startDate}}
	//	{visitDate: {$lte: endDate  }}
	//]}).sort({visitDate: -1});
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/nextVisit/list/:cid', async function(req, res, next) {
  setHeader(res);
  var {cid,} = req.params;
	let allRecs = await M_NextVisit.find({cid: cid}).sort({nextVisit: 1});
	sendok(res, allRecs);

});

router.get('/downloadvisit/:cid/:pid', async function (req, res) {
  setHeader(res);
	var {cid, pid} = req.params;
  console.log("in download");
  
  let myFile = process.cwd() + `/temp/${cid}_${pid}_patientVisit.docx`;		// getFileName(pname, myProduct[0].versionNumber, ptype);
  console.log(myFile);

  if (fs.existsSync(myFile)) {
    res.contentType("application/docx");
		console.log("..............file found", myFile);
    await res.status(200).sendFile(myFile);
  } else
    senderr(res, 601, "Doc not found");  
})

async function getPatient(filter) {
	var pRec =  await M_Patient.findOne(filter);
	return pRec;
}

function digit2(num) {
	let tmp = "00"+num;
	return tmp.substr(tmp.length-2, 2);
}

const SPACE = "                                                                                        ";

function fixedString(xxx, num) {
	let bal= num - xxx.length;
	if (bal > 0 )
		xxx += SPACE.substr(0, bal);
	return xxx;
}

function dateString(dddstr) {
	let xxx = dddstr.split(" ");
	return xxx[2] + " / " + xxx[1] + " / " + xxx[3];
}

function normalText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt });
	return tmp;
}

function boldText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt, bold: true, });
	return tmp;
}

function boldUnderlineText(txt) {
	let tmp = new TextRun({font: MYFONT, size: MYSIZE, text: txt, bold: true, underline: {type: "single",}});
	return tmp;
}


function blankLine() {
	let para = new Paragraph({children: [new TextRun(""),],});
	return para;				
}

function normalPara(text) {
	let para = new Paragraph({children: text});
	return para;
}
						
function boldBulletPara(text) {
	//console.log(text);
	let para = new Paragraph({
		children: [boldText(text), ],
		//text: text,
		//font: MYFONT, 
		//size: MYSIZE,
		//bold: true,
		bullet: {level: 0 }, //How deep you want the bullet to be 
	})
	return para;
}

function normalBulletPara(text) {
	//console.log(text);
	let para = new Paragraph({
		children: [normalText(text), ],
		//text: text,
		//font: MYFONT, 
		//size: MYSIZE,
		//bold: true,
		bullet: {level: 0 }, //How deep you want the bullet to be 
	})
	return para;
}

function rightAlignedPara(text) {
	let para = new Paragraph({children: text, alignment: AlignmentType.RIGHT,});
	return para;
}

//{name: 'Crocin',  dose1: 3, dose2: 2, dose3: 4, time: 7, unit: "Day(s)"}
function medicinePara(med) {
	//console.log(med);
	let tmp = 	med.name + "  ";			// fixedString(med.name,30);
	tmp += setMedQty(med.dose1)+" -- "+setMedQty(med.dose2)+" -- "+setMedQty(med.dose3)+"  ";
	tmp += "for "+med.time+" "+med.unit+((med.time > 1) ? "s" : "");
	return normalBulletPara(tmp);
}

function notesPara(note) {
	let tmp = note.name;			// fixedString(note.name,30);
	return normalBulletPara(tmp);
}

function testPara(test) {
	let tmp = test.name;			// fixedString(note.name,30);
	return normalBulletPara(tmp);
}

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;