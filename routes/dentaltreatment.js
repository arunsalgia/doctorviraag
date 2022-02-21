var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.post('/update/:cid/:pid/:newInfo', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid, newInfo } = req.params;
	pid = Number(pid);
	newInfo = JSON.parse(newInfo);
	//console.log(newInfo);
  var iRec = await M_DentalTreatment.findOne({cid: cid, pid: pid, treatmentNumber: MAGICNUMBER});
  if (!iRec) {
		iRec = new M_DentalTreatment();
		iRec.cid = cid;
		iRec.pid = pid;
		iRec.treatmentNumber = MAGICNUMBER;
		iRec.enabled = true;
  }
	iRec.treatmentDate = new Date();
	iRec.treatment = newInfo.treatment;
	iRec.plan = newInfo.plan;
	iRec.notes = newInfo.notes;
	iRec.discount = newInfo.discount;
	console.log(iRec);
	await iRec.save();
	
	// now update payment

	// first check if any treatment given
	if (newInfo.treatment.length > 0) {
		let myProfChargeRec = await M_ProfCharge.findOne({treatment: iRec._id});
		if (!myProfChargeRec) {
			myProfChargeRec = new M_ProfCharge();
			myProfChargeRec.cid = cid;
			myProfChargeRec.pid = pid;
			myProfChargeRec.treatment = iRec._id;
			myProfChargeRec.paymentmode = "";
			myProfChargeRec.enable = true;
			
			// get new tid
			let tmp = await M_ProfCharge.find({}).limit(1).sort({tid: -1});
			myProfChargeRec.tid = (tmp.length > 0) ? tmp[0].tid + 1 : "1";
		}
		
		let tmp = "";
		for(let t=0; t<iRec.treatment.length; ++t) {
			tmp += ((tmp !== "") ? " / " : "") + iRec.treatment[t].name;
		}
		myProfChargeRec.description = "Professional charges dated " +
			DATESTR[iRec.treatmentDate.getDate()] + "/" +
			MONTHNUMBERSTR[iRec.treatmentDate.getMonth()] + "/" +
			iRec.treatmentDate.getFullYear();
		myProfChargeRec.date = iRec.treatmentDate;
		myProfChargeRec.amount = -(
			_.sumBy(newInfo.treatment, 'amount') - 
			_.sumBy(newInfo.treatment, 'discount')
		);
		myProfChargeRec.treatmentDetails = _.map(newInfo.treatment,  
			o => _.pick(o, ['name', 'amount', 'isDiscount','isPercent', 'discount'])
		);
		myProfChargeRec.save();
	} else {
		// zero treatment. Thus if entry in payment remove it
		await M_ProfCharge.deleteOne({treatment: iRec._id});
	}
	sendok(res, 'Done');
});

router.get('/setdate/:cid/:pid/:newDate', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, newDate} = req.params;
	
	let myRec = await M_DentalTreatment.findOne({cid: cid, pid: pid, treatmentNumber: MAGICNUMBER});
	if (!myRec) return senderr(res, 601, 'Invalid cid / pid');
	
	let treatDate = new Date(
		Number(newDate.substr(0, 4)),
		Number(newDate.substr(4, 2))-1,
		Number(newDate.substr(6, 2)),
		0, 0, 0
	);
	myRec.treatmentDate = treatDate;
	console.log(myRec);
	myRec.save();
	sendok(res, myRec);
});

router.get('/close/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid } = req.params;
	pid = Number(pid);

  var iRec = await M_DentalTreatment.findOne({cid: cid, pid: pid, treatmentNumber: MAGICNUMBER});
  if (!iRec) return sendok(res, {treatmentNumber: -1});
	
	let tmp = await M_DentalTreatment.find({cid: cid, pid: pid, treatmentNumber: {$lt: MAGICNUMBER} }).limit(1).sort({treatmentNumber: -1});	
	console.log(tmp);

	let newNumber = (tmp.length > 0) ? tmp[0].treatmentNumber + 1 : 1;
	console.log(newNumber);			
	iRec.treatmentNumber = newNumber;
	await iRec.save();

	sendok(res, {treatmentNumber: newNumber});
});


router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var { cid, pid } = req.params;
	pid = Number(pid);
	
	let allRecs = await M_DentalTreatment.find({cid: cid, pid: pid}).sort({treatmentNumber: 1})
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/noteplan', async function(req, res, next) {
  setHeader(res);
  
	let allRecs = await M_DentalTreatment.find({})
	for(let i=0; i<allRecs.length; ++i) {
		allRecs[i]["plan"] = "";
		allRecs[i]["notes"] = "";
		await allRecs[i].save();
	}
	//console.log(allRecs);
	sendok(res, allRecs);
});

router.get('/test', async function(req, res, next) {
  setHeader(res);
  
	let allRecs = await M_ProfCharge.find({treatment: {$ne: ''}});
	for(let i=0; i<allRecs.length; ++i) {
		let myProfChargeRec = allRecs[i];
		let treatRec = await M_DentalTreatment.findOne({_id: myProfChargeRec.treatment})
		//console.log(myProfChargeRec.treatmentDetails);
		myProfChargeRec.treatmentDetails = _.map(treatRec.treatment,  
			o => _.pick(o, ['name', 'amount', 'isDiscount','isPercent', 'discount'])
		);
		myProfChargeRec.amount = -(
			_.sumBy(treatRec.treatment, 'amount') -
			_.sumBy(treatRec.treatment, 'discount')
		);
		await myProfChargeRec.save();
		
		/*for(let t = 0; t < allRecs[i].treatment.length; ++t) {
			allRecs[i].treatment[t]["isDiscount"] = false;
			allRecs[i].treatment[t]["isPercent"] = true;
			allRecs[i].treatment[t]["discount"] = 0;
		}
		await allRecs[i].save();*/
	}
	/*
	myProfChargeRec.treatmentDetails = _.map(newInfo.treatment,  
			o => _.pick(o, ['name', 'amount', 'isDiscount','isPercent', 'discount'])
		);
	//console.log(allRecs);
	*/
	sendok(res, 'Done');
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;