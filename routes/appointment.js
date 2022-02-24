const {  akshuGetUser,  
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
	numberDate, 
	generateOrder, generateOrderByDate,
	setOldPendingAppointment,
	checkCustomerExpiry,
} = require('./functions'); 

const { sendAppointmentSms, sendCancelSms } = require("./sms");

var router = express.Router();

function getOrderNumber(year, month, date, hours, minutes) {
	let chkOrder = ((year* 100) + month)*100 + date;
	console.log("Chkorder", chkOrder);
	chkOrder = ((chkOrder * 100) + hours) * 100 + minutes;
	console.log(chkOrder);
	return chkOrder;
}

/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});


router.get('/delete/:cid/:year/:month/:date/:order/:pid', async function (req, res) {
  setHeader(res);
  var {cid, pid, date, month, year, order } = req.params;
	
	//let myFilter = {date: Number(date), month: Number(month), year: Number(year), order: Number(order), pid: Number(pid)};
	
	let myFilter = { cid: cid, date: Number(date), month: Number(month), year: Number(year),order: Number(order), pid: Number(pid) };
	//console.log(myFilter);
	let hRec = await M_Appointment.deleteOne(myFilter);
	//console.log(hRec);
	sendok(res, "OK");
});


router.get('/cancel/:cid/:pid/:order', async function (req, res) {
  setHeader(res);
  var {cid, pid, order } = req.params;
	
	
	let myFilter = { cid: cid, pid: Number(pid), order: Number(order), visit: VISITTYPE.pending };
	//console.log(myFilter);
	let hRec = await M_Appointment.findOne(myFilter);
	if (hRec) {
		//console.log(hRec);
		hRec.visit = VISITTYPE.cancelled;
		hRec.save();
		sendCancelSms(hRec)
		sendok(res, "OK");
	} else {
		senderr(res, 601, "Appoint not found");
	}
});


router.get('/add/:cid/:apptdata', async function (req, res) {
  setHeader(res);
  var {cid, apptdata} = req.params;
	
	let newData = JSON.parse(apptdata);
	//console.log(newData);
	
	let hRec = await M_Appointment.find({
		cid: cid, order: newData.order, visit: VISITTYPE.pending
	});
	
	if (hRec.length > 0) return senderr(res, 601, "Duplicate Entry");
	
	// find out if reschedule or new appointment
	if (newData._id !== "") {
		// reschedule appt
		hRec = await M_Appointment.findOne({_id: newData._id });
		if (!hRec) return senderr(res, 602, "Invalid old appointment");
	} else {
		// new appointment
		hRec = new M_Appointment();
		hRec.cid = cid;
		hRec.pid = newData.pid;
		hRec.displayName = newData.displayName
	}
	
	let myEndOrder;
	if (newData.endOrder != null) {
		myEndOrder = newData.endOrder
	}
	else {
		let uptoHour = Math.floor(newData.order / 100);
		let onlyMin = (newData.order % 100) + 15;
		if (onlyMin >= 60) {
			++uptoHour;
			onlyMin = 0;
		}
		myEndOrder = uptoHour * 100 + onlyMin;
	}
	//console.log(myEndOrder );
	//return senderr(res, 601, "test");
	
	//hRec.data = newData.data;
	hRec.apptTime  = newData.apptTime;
	hRec.order = newData.order;
	
	hRec.date = newData.date;
	hRec.month = newData.month;
	hRec.year = newData.year;	  
	hRec.hour = newData.hour;
	hRec.minute = newData.minute;
	
	hRec.visit = newData.visit;
	
	hRec.doctorName = newData.doctorName;
	hRec.doctorMobile = newData.doctorMobile;
	hRec.endOrder = newData.endOrder;
	//hRec.bookedSlots = newData.bookedSlots;
	
	console.log(hRec);

	hRec.save();

	sendAppointmentSms(hRec)
	sendok(res, hRec);
});	

router.get('/list/date/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;

	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	
	publishAppointments(res, {cid: cid, date: Number(date), month: Number(month), year: Number(year)})
});		

router.get('/test', async function (req, res) {
  setHeader(res);
	let allRecs = await M_Appointment.find({});
	for(let i=0; i<allRecs.length; ++i) {
		let myStr = allRecs[i].bookedSlots[allRecs[i].bookedSlots.length-1]
		console.log(allRecs[i].pid, myStr);
		let xxx = myStr.split(':');
		let myHour = Number(xxx[0]);
		let myMin = Number(xxx[1]) + 15;
		if (myMin >= 60) {
			myHour += Math.floor(myMin / 60);
			myMin = myMin % 60;
		}
		if (myHour >= 24) { myHour = 24; myMin = 0; }
		let endOrder = generateOrder(allRecs[i].year, allRecs[i].month, allRecs[i].date, myHour, myMin);
		console.log(allRecs[i].pid, myStr, endOrder);
		allRecs[i].endOrder = endOrder;
		await allRecs[i].save();
	}
	sendok(res, 'Done');
});	

router.get('/pendinglist/date/:cid/:year/:month/:date/:days', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year, days } = req.params;

	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");

	let iDate = Number(date);
	let iMonth = Number(month);
	let iYear = Number(year);
	let iDays = Number(days);
	
	let startOrder = generateOrder(iYear, iMonth, iDate, 0, 0);
	
	let endDate = new Date(iYear, iMonth, iDate +iDays);
	let endOrder = generateOrder(
		endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 
		0, 0);
	let myFilter = { cid: cid, visit: VISITTYPE.pending, order: { $lte: endOrder, $gte: startOrder} }
	publishAppointments(res, myFilter);
});		

router.get('/pendinglist/all/:cid', async function (req, res) {
  setHeader(res);
  var { cid } = req.params;
	
	let allRecs = await M_Appointment.find({ cid: cid, visit: VISITTYPE.pending }).sort({order: 1});
	sendok(res, allRecs);
});		

router.get('/list/pid/:cid/:pid', async function (req, res) {
  setHeader(res);
  var { cid, pid } = req.params;
	//console.log(cid, pid);
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments(res, { cid: cid, pid: Number(pid) })
});		

router.get('/pendinglist/pid/:cid/:pid', async function (req, res) {
  setHeader(res);
  var { cid, pid } = req.params;
	console.log(cid, pid);
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments(res, { cid: cid, pid: Number(pid), visit: VISITTYPE.pending})
});		

router.get('/pendinglist/date/:cid/:year/:month/:date', async function (req, res) {
  setHeader(res);
  var {cid, date, month, year } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments(res, { cid: cid, visit: VISITTYPE.pending, date: Number(date), month: Number(month), year: Number(year)})
});		

router.get('/list/month/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments(res, {cid: cid, month: Number(month), year: Number(year)})
});		

router.get('/list/year/:cid/:year', async function (req, res) {
  setHeader(res);
  var { cid, year } = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments(res, {cid: cid, year: Number(year)});
});		

router.get('/list/all/:cid', async function (req, res) {
  setHeader(res);
	var {cid} = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	publishAppointments( res, {cid: cid} );
});		

router.get('/list/all/fromtoday/:cid', async function (req, res) {
  setHeader(res);
	var {cid} = req.params;
	
	if (await checkCustomerExpiry(cid)) return senderr(res, PLANEXIREDERR, "Expiry");
	
	let thisTime = new Date();
	//thisTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate(), 0, 0, 0);
	//console.log(thisTime);
	let myMon = thisTime.getMonth();
	let myDat = thisTime.getDate();
	
	let chkOrder = ((thisTime.getFullYear() * 100) + thisTime.getMonth())*100 + thisTime.getDate();
	chkOrder *= 100 * 100;
	console.log("Chkorder", chkOrder);
	
publishAppointments( res, {cid: cid, order: {$gte: chkOrder}, visit: {$nin: [VISITTYPE.cancelled, VISITTYPE.expired] } } );
});		


router.get('/count/patient/:cid/:pid', async function (req, res) {
  setHeader(res);
  var {cid, pid, year } = req.params;
	pid = Number(pid);
	
	/*
    $group : {
       _id: $date,
       //user_totaldocs: { $sum: "$user_totaldocs"}, // for your case use local.user_totaldocs
       //user_totalthings: { $sum: "$user_totalthings" }, // for your case use local.user_totalthings
       count: { $sum: 1 } // for no. of documents count
    }	
		[
  { $match: { age: { $lt: 30 } } },
  {
    $group: {
      _id: '$age',
      count: { $sum: 1 }
    }
  }
]
*/
	let pendingQuery = [
		{ $match: { cid: cid, pid: pid, visit: VISITTYPE.pending } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let calcelledQuery = [
		{ $match: { cid: cid, pid: pid, visit: VISITTYPE.cancelled } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	let overQuery = [
		{ $match: { cid: cid, pid: pid, visit: {$nin : [VISITTYPE.pending, VISITTYPE.cancelled]} } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	
	let p, c, o;
	p = await M_Appointment.aggregate(pendingQuery)
	c = await M_Appointment.aggregate(calcelledQuery)
	o = await M_Appointment.aggregate(overQuery)
	
	let pCount = (p.length > 0) ? p[0].count : 0;
	let cCount = (c.length > 0) ? c[0].count : 0;
	let oCount = (o.length > 0) ? o[0].count : 0;

	sendok(res, {pending: pCount, cancelled: cCount, visit: oCount});
});		


router.get('/pendingcount/patient/:cid/:pid', async function (req, res) {
  setHeader(res);
  var {cid, pid, year } = req.params;
	pid = Number(pid);
	
	let pendingQuery = [
		{ $match: { cid: cid, pid: pid, visit: VISITTYPE.pending } },
		{ $group: { _id: '$pid', count: { $sum: 1 } } }
  ];
	
	let p = await M_Appointment.aggregate(pendingQuery)
		
	let pCount = (p.length > 0) ? p[0].count : 0;
	
	sendok(res, {pending: pCount});
});		


router.get('/count/month/:cid/:year/:month', async function (req, res) {
  setHeader(res);
  var {cid, month, year } = req.params;
	
	/*
    $group : {
       _id: $date,
       //user_totaldocs: { $sum: "$user_totaldocs"}, // for your case use local.user_totaldocs
       //user_totalthings: { $sum: "$user_totalthings" }, // for your case use local.user_totalthings
       count: { $sum: 1 } // for no. of documents count
    }	
		[
  { $match: { age: { $lt: 30 } } },
  {
    $group: {
      _id: '$age',
      count: { $sum: 1 }
    }
  }
]
*/
	let iy = Number(year);
	let im = Number(month);
	
	let ddd = new Date(iy, im+1, 0);
	let lastDate = ddd.getDate();
	
	
	let pendingQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: VISITTYPE.pending } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	let calcelledQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: VISITTYPE.cancelled } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	let overQuery = [
		{ $match: { cid: cid, year: iy, month: im, visit: {$nin : [VISITTYPE.pending, VISITTYPE.cancelled]} } },
		{ $group: { _id: '$date', count: { $sum: 1 } } }
  ];
	
	let p, c, o;
	p = await M_Appointment.aggregate(pendingQuery)
	c = await M_Appointment.aggregate(calcelledQuery)
	o = await M_Appointment.aggregate(overQuery)

	/***
	let chk = await await M_Appointment.find({visit: {$nin : ["cancelled", "pending"]} });
	if (chk.length > 0) {
		console.log(chk[0].visit);
		let allRecs = await M_Visit.findOne({_id: chk[0].visit});
		console.log(allRecs);
	}
	***/
	
	let finalData = [];
	let pending, cancelled, over;
	let xxx;
	for(let i=1; i<=lastDate; ++i) {
		xxx = p.find(x => x._id === i);
		pending = (xxx) ? xxx.count : 0;
		
		xxx = c.find(x => x._id === i);
		cancelled = (xxx) ? xxx.count : 0;
		
		xxx = o.find(x => x._id === i);
		over = (xxx) ? xxx.count : 0;
		
		//if ((pending + cancelled + over) > 0)
		finalData.push({date: i, pending: pending, cancelled: cancelled, visit: over});
	}
	//console.log(finalData);
	
	sendok(res, finalData);
});		

router.get('/cancel/pending', async function (req, res) {
  setHeader(res);
	await cancelOldAppt();
	sendok(res, "Cancelled");
});
	
async function publishAppointments(res, filter) {
	//console.log(filter)
	let hRec = await M_Appointment.find(filter);
	//console.log(hRec);
	sendok(res, hRec);
};

async function cancelOldAppt() {
	// cancel all appointment as of yesterday
	let thisTime = new Date();
	//thisTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate(), 0, 0, 0);
	console.log(thisTime);
	let myMon = thisTime.getMonth();
	let myDat = thisTime.getDate();
	
	let chkOrder = ((thisTime.getFullYear() * 100) + thisTime.getMonth())*100 + thisTime.getDate();
	//console.log("Chkorder", chkOrder);
	chkOrder *= 100 * 100;
	console.log("Chkorder", chkOrder);
	
	let allPendingAppts = await M_Appointment.find({visit: VISITTYPE.pending, order: {$lte: chkOrder} } );
	console.log("Count: ",allPendingAppts.length);
	
	for(let i=0; i<allPendingAppts.length; ++i) {
		allPendingAppts[i].visit = VISITTYPE.cancelled;
		allPendingAppts[i].save();
		//console.log(allPendingAppts[i].apptTime, allPendingAppts[i].order);
	}
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
