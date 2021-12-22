var customerRouter = express.Router();
const { MathDenominator } = require('docx');
const { 
	checkDate,
	dbToSvrText,
	svrToDbText,
	generateOrder,
	akshuClearCustomer,
	akshuGetCustomer,
	akshuAddCustomer,
	akshuUpdateCustomer,
	akshuGetAllCustomer,
	rechargeCount,
	compareDate,
} = require('./functions');

const { getPatientByPid  } = require("./patient");
 
const { makeIstDateTimeString,
	sendExpirySms, generateSMSLogs, 
	akshuGetSmsLog, akshuUpdSmsLog,
	fast2SmsSendFestival, fast2SmsSendBirthday, sendReminderSms, fast2SmsReminder, fast2SmsSendAppointment,
} = require("./sms");

const { hasSubscribed  } = require("./addon");``
const { getAllPatients  } = require("./patient");
const { all } = require('.');


const EARLYMORNINGSCHEDULEAT=2; 
const MORNINGSCHEDULEAT=2;
const AFTERNOONSCHEDULEAT=5;
const OLDAPPTBACKDATE=3;

customerRouter.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

customerRouter.get('/list', async function(req, res, next) {
  setHeader(res);
	let rec = await akshuGetAllCustomer();
	//console.log(rec);
	sendok(res, rec);
}); 

customerRouter.get('/getinfo/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await akshuGetCustomer(cid);
	if (rec)	sendok(res, rec);
	else      senderr(res, 601, "Invalid cid");
})

customerRouter.get('/add/:userName', async function(req, res, next) {
  setHeader(res);
	var {userName} = req.params;

	let rec = new M_Customer();
	rec.name = userName;
	rec.plan = "YEARLY"
	rec.expiryDate = new Date(2030, 12, 31);
	rec.enabled = true;
	akshuAddCustomer(rec);
	sendok(res, rec);
});

customerRouter.get('/update/:custData', async function(req, res, next) {
  setHeader(res);
	var {custData} = req.params;
	
	custData = JSON.parse(custData);
	//console.log(custData);

	let oldName = "";
	let rec = null;

	if (custData.customerNumber > 0) {
		rec = await M_Customer.findOne({customerNumber: custData.customerNumber});
		if (!rec) return senderr(res, 601, "Customer record not found");
		oldName = rec.name;
	} else {
		let tmp = await M_Customer.find({}, {_id: 0, customerNumber: 1}).limit(1).sort({customerNumber: -1});
		//console.log(tmp);
		rec = new M_Customer();
		rec.customerNumber = (tmp.length > 0) ? tmp[0].customerNumber+1 : 999;
		rec.doctorPanel = [];
		rec.doctorMobile = [];
	}

	rec.enabled = true;
	rec.name =  custData.name;
	rec.type = custData.type;
	rec.email = svrToDbText(custData.email)
	rec.mobile = custData.mobile;

	rec.doctorName = custData.doctorName;
	rec.clinicName = custData.clinicName;

	rec.addr1 = custData.addr1;
	rec.addr2 = custData.addr2;
	rec.addr3 = custData.addr3;

	rec.location = custData.location;
	rec.pinCode = custData.pinCode;

	rec.commission = custData.commission;
	rec.referenceCid = custData.referenceCid;

	rec.welcomeMessage = custData.welcomeMessage;
	rec.plan = custData.plan;
	rec.fee = custData.fee;

	//console.log(custData.expiryDate);
	let d = new Date(custData.expiryDate);
	//console.log(d);

	rec.expiryDate = d;

	// now create user 

	if (oldName !== "")
		akshuUpdateCustomer(rec);
	else
		akshuAddCustomer(rec); 
	await rec.save();
	
	rec.email = dbToSvrText(rec.email);
	sendok(res, rec);
}); 

 
customerRouter.get('/setworkinghours/:cid/:workingHours', async function(req, res, next) {
  setHeader(res);
	var {cid, workingHours} = req.params;
	
	let rec = await akshuGetCustomer(cid);
	rec.workingHours = JSON.parse(workingHours);
	akshuUpdateCustomer(rec);
	sendok(res, rec);
})

customerRouter.get('/updatepaneldoctors/:cid/:docList', async function(req, res, next) {
  setHeader(res);
	var {cid, docList} = req.params;
	
	return senderr(res, 601, "Currently not implemented");

	let newList = JSON.parse(docList);
	let rec = await akshuGetCustomer(cid);
	
	rec.doctorPanel = newList.name;
	rec.doctorMobile = newList.mobile;``
	
	akshuUpdateCustomer(rec);
	sendok(res, rec);
})


customerRouter.get('/closevisit', async function(req, res, next) {
  setHeader(res);
	await closeVisit();
	sendok(res, "Done");
})

customerRouter.get('/expireappointment', async function(req, res, next) {
  setHeader(res);
	await expireAppoint();
	sendok(res, "Done");
})

customerRouter.get('/expireinventory', async function(req, res, next) {
  setHeader(res);
	await expireInventory();
	sendok(res, "Done");
})

customerRouter.get('/clearoldappointment', async function(req, res, next) {
  setHeader(res);
	await clearOldAppointment();
	sendok(res, "Done");
})

customerRouter.get('/greeting', async function(req, res, next) {
  setHeader(res);
	// birthday wishes
	console.log("Starting BIRTHDAY wishes ........................");
	await doBirthdayWishes();

	// festival wishes
	console.log("Starting FESTIVAL wishes ........................");
	await doFestivalWishes();

	console.log("All done dana-dna-dan-dan")
	sendok(res, "Done");
})

customerRouter.get('/reminder', async function(req, res, next) {
  setHeader(res);
	await doApptReminder();
	sendok(res, "Done");
})


async function doBirthdayWishes() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	
	let allCustomers = await akshuGetAllCustomer();
	for(let ccc=0; ccc <allCustomers.length; ++ccc) {
		customerRec = allCustomers[ccc];
		cid = customerRec._id;
		console.log(cid);

		// find if customer has subscribed birthday  pack
		var sts = await hasSubscribed(cid, AddOnList.birthday);
		//console.log("BDaySts: "+stsf);
		if (sts === 0 ) continue;
		console.log("Has subscribed for birthday");
		
		/*
		let allPatients = await M_Patient.find({
			cid: cid,
			"$expr": { 
				"$and": [
					{ "$eq": [ { "$dayOfMonth": "$dob" }, { "$dayOfMonth": today } ] },
					{ "$eq": [ { "$month"     : "$dob" }, { "$month"     : today } ] }
				]
			}
		});
		*/
		
		let allPatients = await M_Patient.find({
			cid: cid,
			"$expr": { 
				"$and": [
					{ "$eq": [ { "$dayOfMonth": "$dob" }, tDate ] },
					{ "$eq": [ { "$month"     : "$dob" }, tMonth+1 ] }
				]
			}
		});
		//console.log(allPatients);
		if (allPatients.length === 0) continue;

		//let customerSmsLog = await akshuGetSmsLog(cid, tMonth, tYear);
		for(let ppp=0; ppp<allPatients.length; ++ppp) {
			patRec = allPatients[ppp];

			// send sms wishes to patient
			if (patRec < 1000000000) {
				console.log("Mobile number not configured");
				continue;
			}
		
			fast2SmsSendBirthday(
				patRec.mobile, 
				patRec.displayName,
				customerRec.clinicName,
			).
			then((body) => {
				if (body.return) {
					// send sms success
					//++customerSmsLog.birthDayCount;
				}
			}).
			catch((error) => {
				console.log("Error sending message. ", error.status_code);
			})
		}
		//await akshuUpdSmsLog(customerSmsLog);
	}
}

async function doFestivalWishes() {
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	
	let festRecord = await M_Festival.findOne({date: tDate, month: tMonth,  year: tYear});
	if (!festRecord) return;

	// today is festival. So find out all customers who have subscribed festial pack
	let allCustomers = await akshuGetAllCustomer();
	for(let ccc=0; ccc <allCustomers.length; ++ccc) {
		customerRec = allCustomers[ccc];
		cid = customerRec._id;

		// find if customer has subscribed festival pack
		var sts = await hasSubscribed(cid, AddOnList.festival);
		if (sts === 0) continue;

		//let customerSmsLog = await akshuGetSmsLog(cid, tMonth, tYear);
		// customer has subscribed. Now get all patient of this customer
		let allPatients = await getAllPatients(cid);
		for(let ppp=0; ppp<allPatients.length; ++ppp) {
			patRec = allPatients[ppp];

			// send sms wishes to patient
			if (patRec < 1000000000) {
				console.log("Mobile number not configured");
				continue;
			}
		
			/*
				Note: Festival greeting MessageId is stored in Greeting.
				Convert it to number and provide it to fast2SmsSendFestival.
				Festival greeting text is part of the template.
			*/
			fast2SmsSendFestival(
				patRec.mobile, 
				Number(festRecord.greeting),		// This is message Id of festival greeting
				customerRec.clinicName,
			).
			then((body) => {
				if (body.return) {
					// send sms success
					//++customerSmsLog.festivalCount;
				}
			}).
			catch((error) => {
				console.log("Error sending message. ", error.status_code);
			})
		}
		//akshuUpdSmsLog(customerSmsLog);
	}
}

async function doApptReminder() {
	let today = new Date();
	let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
	let tDate = tomorrow.getDate();
	let tMonth = tomorrow.getMonth();
	let tYear = tomorrow.getFullYear();

	// calculate Order (which is used for appointments)
	//let todayOrder = await generateOrder(tYear,  tMonth, tDate, 0, 0)
	//let tomorrowOrder = await generateOrder(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0);
	//console.log(todayOrder, tomorrowOrder);
	
	// Next step. Send reminder those who have appointment today and filter per customer
	//let all2morrowAppt = await M_Appointment.find({visit: 'pending', order: { $gte: todayOrder, $lt: tomorrowOrder } });

	let all2morrowAppt = await M_Appointment.find({visit: 'pending', year: tYear, month: tMonth, date: tDate });
	// get the doctor list to which patients belongs
	let cidList = _.map(all2morrowAppt, 'cid');
	cidList = _.uniqBy(cidList);

	console.log(cidList);
	for(let c=0; c<cidList.length; ++c) {
		let cid = cidList[c];
		let myReminders = all2morrowAppt.filter(x => x.cid === cid);
		//console.log(myReminders);
		//continue;

		let customerSmsLog = await akshuGetSmsLog(cid, tMonth, tYear);
		// loop 1 by 1 to send reminder
		for(let i=0; i<myReminders.length; ++i) {
			let patRec = await getPatientByPid(cid, myReminders[i].pid);
			//console.log(patRec);
			
			if (patRec.mobile < 1000000000) {
				console.log("Mobile number not configured");
				continue;
			}

			if (customerSmsLog.bulkSmsCount >= defaultPatientSms) {
				// if default count has passed. CHeck if subscribed for bulk sms for patients
				if (await hasSubscribed(cid, AddOnList.bulk) === 0) {
					console.log("Bulk Sms count Over");
					continue;
				}
			}

				// now prepare to send SMS
			let customerRec = await akshuGetCustomer(cid);
			//console.log(customerRec);
			//console.log("Sending remoder to "+patRec.mobile);

			fast2SmsReminder(
				patRec.mobile, 
				customerRec.doctorName,
				customerRec.clinicName,
				makeIstDateTimeString(myReminders[i].apptTime),
				customerRec.mobile
			).
			then( (body) =>  {
				++customerSmsLog.bulkSmsCount;
				//akshuUpdSmsLog(customerSmsLog);
			}).
			catch((error) => {
				console.log("Error sending message. ", error.status_code);
			})
		}	
		akshuUpdSmsLog(customerSmsLog);
	}

}

async function closeVisit() {
	/*
	In early monring.
	1) Close all investigation, viist etc. which are opened (i.e. number is MAGICNUMBER)
	2) On 1st of every month generate SMS Logs for all customer
	*/

	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	let allCustomers = await akshuGetAllCustomer();

	// STEP 1 ---> Create sms log records on 1st of every month
	if (tDate === 1) {
		await generateSMSLogs(allCustomers, tMonth, tYear);
	}

	// STEP 2 ---> all visits to be closed
	let allOpenVisits = await M_Visit.find({visitNumber: MAGICNUMBER});
	for(let i=0; i<allOpenVisits.length; ++i) {
		let visitRec = allOpenVisits[i];
		//console.log(visitRec);
		let countQuery = [
			{ $match: { cid: visitRec.cid, pid: visitRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let countRec = await M_Visit.aggregate(countQuery)
		//console.log(countRec);
		visitRec.visitNumber = countRec[0].count;
		//console.log(visitRec);
		visitRec.save();
	}
	
	// STEP 3 ---> all investigation to be closed
	let allOpenInvest = await M_Investigation.find({investigationNumber: MAGICNUMBER});
	for(let i=0; i<allOpenInvest.length; ++i) {
		let investRec = allOpenInvest[i];
		let countQuery = [
			{ $match: { cid: investRec.cid, pid: investRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let investCount = await M_Investigation.aggregate(countQuery)
		investRec.investigationNumber = investCount[0].count;
		investRec.save();
	}

	// STEP 4 ---> all treatment to be closed  (1 loop each for doctor type)
	let allOpenTreat = await M_DentalTreatment.find({treatmentNumber: MAGICNUMBER});
	for(let i=0; i<allOpenTreat.length; ++i) {
		let myRec = allOpenTreat[i];
		let countQuery = [
			{ $match: { cid: myRec.cid, pid: myRec.pid } },
			{ $group: { _id: '$pid', count: { $sum: 1 } } }
		];
		let treatCount = await M_DentalTreatment.aggregate(countQuery)
		myRec.treatmentNumber = treatCount[0].count;
		myRec.save();
	}

	// Last Step ---> update age based on date of birth
	// will be done of 1st of every month
	if (tDate === 1) {
		let todayTime = today.getTime();
		let allPatients = await M_Patient.find({});
		for(let i=0; i<allPatients.length; ++i) {
			if (allPatients[i].dob.getFullYear() !== 1900) {
				let timeDifference = Math.abs(todayTime - allPatients[i].dob.getTime())
				let differentYears = Math.round(timeDifference / (1000 * 3600 * 24 * 365));
				//console.log(allPatients[i].dob, differentYears);
				allPatients[i].age = differentYears;
			} else
				allPatients[i].age = 0;
			allPatients[i].save();
		}
	}

	// all over
}

async function expireAppoint() {
	// all appointments which were not honured by patients need to be set as expred
	let today = new Date();
	let tDate = today.getDate();
	let tMonth = today.getMonth();
	let tYear = today.getFullYear();
	//let allCustomers = await akshuGetAllCustomer();

	// early morning. send sms to patients whose appointment has expired
	// calculate Order (which is used for appointments)
	let todayOrder = generateOrder(tYear,  tMonth, tDate, 0, 0)

	// STEP 2 ---> any old pending appointment to be set as expired
	let allOldPendingAppts = await M_Appointment.find({visit: VISITTYPE.pending, order: {$lte: todayOrder} } );	
	//console.log(allOldPendingAppts);

	for(let i=0; i<allOldPendingAppts.length; ++i) {
		//console.log(allOldPendingAppts[i]);
		if (process.env.SENDEXPIRY === "TRUE") {
			await sendExpirySms(allOldPendingAppts[i].cid, allOldPendingAppts[i].pid, allOldPendingAppts[i].apptTime);
		} else {
			console.log("Sending Expired SMS is disabled by management");
		}
		allOldPendingAppts[i].visit = VISITTYPE.expired;
		allOldPendingAppts[i].save();
	}
	

}


async function expireInventory() {
	let today = new Date();
	//console.log(today);
	let allPurchases = await M_InventoryList.find({subId: 0});
	for(let i=0; i<allPurchases.length; ++i) {
		//console.log(allPurchases[i].expiryDate);
		let status = compareDate(allPurchases[i].expiryDate, today);
		//console.log(status);
		if (status < 0) {
			allPurchases[i].expired = true;
			await allPurchases[i].save();

			// this items has expired
			let countQuery = [
				{ $match: { cid: allPurchases[i].cid, inventoryId: allPurchases[i].inventoryId, id: allPurchases[i].id } },
				{ $group: { _id: '$inventoryId', count: { $sum: '$quantity' } } }
			];
			//console.log(countQuery);
			let countRec = await M_InventoryList.aggregate(countQuery)
			console.log(countRec);
			if (countRec[0].count > 0) {
				let expRec = new M_InventoryList();
				expRec.cid = allPurchases[i].cid;

				expRec.inventoryId = allPurchases[i].inventoryId;
				expRec.id = allPurchases[i].id;
				expRec.subId = 99999;

				expRec.vendor = '';
				expRec.unitRate = 0;
				expRec.quantity = -countRec[0].count;
				expRec.date = today;

				expRec.expiryDate = allPurchases[i].expiryDate;
				expRec.expired = true;
				expRec.enabled = true;
				await expRec.save();
			}
		}
	}
}


async function clearOldAppointment() {

	let myTime = new Date();
	myTime.setDate(myTime.getDate()-OLDAPPTBACKDATE);
	console.log(myTime);
	await M_Appointment.deleteMany({apptTime: {$lt: myTime}, visit: {$ne: "pending"} });
	
	let balanceApptList = await M_Appointment.find({});
	console.log(balanceApptList.length);

}



customerRouter.get('/test', async function(req, res, next) {
  setHeader(res);
/*
	await doBirthdayWishes();
*/

/*
	let allCustomers = await M_Customer.find({});
	for(let i=0; i<allCustomers.length; ++i) {
		allCustomers[i].doctorPanel = [];
		allCustomers[i].doctorMobile = [];
		allCustomers[i].save();
	}
*/

	// update doctor name and mobile in appt document
	let allAppt = await M_Appointment.find({});
	for(let i=0; i<allAppt.length; ++i) {
		let customerRec = await M_Customer.findOne({_id: allAppt[i].cid});
		allAppt[i].doctorName = customerRec.doctorName;
		allAppt[i].doctorMobile = customerRec.mobile;
		allAppt[i].save();
	}
	sendok(res, "all birthday wishes");
});

/*
cron.schedule('5 * * * *', async () => {	
	let today = new Date();
	console.log(today);
	let tHour = today.getHours();
	console.log("It is "+tHour);
	if (![EARLYMORNINGSCHEDULEAT, MORNINGSCHEDULEAT, AFTERNOONSCHEDULEAT].includes(tHour))
		return;
	console.log("Proceed to work for "+tHour);
	let retry = 30;
	while (retry > 0) {
		if (db_connection) break;
		//await sleep(1000);	// sleep for 1 second
		--retry;
  }
	if (!db_connection) return;
	console.log("Db connection found!!!!");

	if (tHour === EARLYMORNINGSCHEDULEAT)
		await closeVisit();
	
	if (tHour === MORNINGSCHEDULEAT)
		await doMorningSchedule()
	
	if (tHour === AFTERNOONSCHEDULEAT)
		await doAfternoonSchedule();

	return;
});
*/

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 


module.exports = {
	customerRouter,
	//closeVisit, doMorningSchedule, doAfternoonSchedule
}