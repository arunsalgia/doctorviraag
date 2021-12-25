var addOnRouter = express.Router();

const { 
	ALPHABETSTR,
	getLoginName, getDisplayName,
	getMaster, setMaster,
	compareDate,
} = require('./functions'); 


let arun_subscriptionList = {};

function clearSubscritonList(cid)  {arun_subscriptionList[cid] = []};

async function loadSubscriptionList(cid) {
	let hasData = false;
	if (arun_subscriptionList[cid]) 
	if (arun_subscriptionList[cid].length > 0)
		hasData = true;

	//console.log(hasData);

	if (!hasData) {
		console.log("Reading subscription for ", cid);
		let hRec = await M_Subscribe.find({cid: cid});
		arun_subscriptionList[cid] = hRec;
		//console.log(arun_subscriptionList[cid]);
	}
}

async function getAllSubscriptions(cid) {
	await loadSubscriptionList(cid);
	return arun_subscriptionList[cid];
}

async function hasSubscribed(cid, subscriptionPackList) {
	await loadSubscriptionList(cid);
	let hasSub = false;
	let subCount = 0;
	for(let i=0; i<subscriptionPackList.length; ++i) {
		let tmp = arun_subscriptionList[cid].find(x => x.name == subscriptionPackList[i].name);

		if (tmp) {
			// also check if it has not expired. i.e. still active
			if (compareDate(tmp.expiryDate, new Date()) >= 0) {
				//hasSub = true;
				subCount = subscriptionPackList[i].count;
				return subCount;
			}
		}
	}
	//console.log(subCount);
	//	return 	subCount;
	return 0;
}

async function getSubscribed(cid, subscriptionName) {
	await loadSubscriptionList(cid);
	let tmp = arun_subscriptionList[cid].find(x => x.name == subscriptionName);
	return tmp;
}

addOnRouter.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

addOnRouter.get('/add/:newType/:charges/:desc/:planType/:eligible', async function(req, res, next) {
  setHeader(res);
  
  var {newType, charges, desc, planType, eligible } = req.params;
	charges = Number(charges);

  var tmp = await M_AddOn.findOne({name: newType});
  if (tmp) return  senderr(res, 601, 'Add on type already in database.');

	tmp = await M_AddOn.find({}).limit(1).sort({aid: -1});

	mRec = new M_AddOn();
	mRec.aid = (tmp.length > 0) ? tmp[0].aid + 1 : 1;
	mRec.name = newType;
	mRec.doctorType = Number(eligible);
	mRec.charges = charges;
	mRec.enabled = true;
	mRec.description = desc;
	mRec.planType = planType;
	mRec.save();
	sendok(res, mRec);

});

addOnRouter.get('/edit/:oldType/:newType/:charges/:desc/:planType/:eligible', async function(req, res, next) {
  setHeader(res);
  
  var {oldType, newType, charges, desc, planType, eligible } = req.params;
	charges = Number(charges);

	var mRec;
	
	if (oldType !== newType) {
		// just check that of new medicine already in database
		mRec = await M_AddOn.findOne({name: newType});
		if (mRec) return senderr(res, 601, "New Add on type already in database");
	}

		// check if old name really exists!!!! Only then we can modify it
		mRec = await M_AddOn.findOne({name: oldType});
		if (!mRec) return senderr(res, 602, "Old Add on type not found in database");
		
	mRec.name = newType;
	mRec.eligible = Number(eligible);
	mRec.charges = charges;
	mRec.enabled = true;
	mRec.description = desc;
	mRec.planType = planType;
	mRec.save();
	sendok(res, mRec);
});

addOnRouter.post('/delete/:delType', async function(req, res, next) {
  setHeader(res);
  
  var { delType } = req.params;
	
	await M_AddOn.deleteOne({name: delType});
    //console.log("Data deleted"); // Success
	sendok(res, "1 add on type deleted");

});

addOnRouter.get('/subscribe/:cid/:addonname/:amount', async function(req, res, next) {
  setHeader(res);
  
  var { cid, addonname, amount } = req.params;
	amount = Number(amount);
	
	let tmpRec = await getSubscribed(cid, addonname);    //await M_Subscribe.findOne({cid: cid, name: addonname});
	if (!tmpRec) {
		tmpRec = new M_Subscribe();
		tmpRec.cid = cid;
		tmpRec.name = addonname
	}
	let d = new Date();
	d.setFullYear(d.getFullYear()+1);
	tmpRec.expiryDate = d;
	tmpRec.enabled = true;
	tmpRec.save();

	clearSubscritonList(cid);

	// now deduct amount 
	let myTrans = createWalletTransaction(cid);
  myTrans.transType = `Addon ${addonname} subscription`;
  myTrans.transSubType = "Recharge";
  myTrans.amount = -parseFloat(amount);
  await myTrans.save();

	sendok(res, tmpRec);

});


addOnRouter.get('/dvsubscribe/:cid/:addonname/:expiryStr', async function(req, res, next) {
  setHeader(res);
  
  var { cid, addonname, expiryStr } = req.params;
	amount = Number(amount);
	
	let tmpRec = await getSubscribed(cid, addonname);    //await M_Subscribe.findOne({cid: cid, name: addonname});
	if (!tmpRec) {
		tmpRec = new M_Subscribe();
		tmpRec.cid = cid;
		tmpRec.name = addonname
	}
	let d = new Date(
		Number(expiryStr,substr(0,4)),
		Number(expiryStr,substr(4,2)),
		Number(expiryStr,substr(6,2)),
		0,0,0
	);
	tmpRec.expiryDate = d;
	tmpRec.enabled = true;
	tmpRec.save();

	clearSubscritonList(cid);

	sendok(res, tmpRec);

});

addOnRouter.get('/unsubscribe/:cid/:addonname', async function(req, res, next) {
  setHeader(res);
  
  var { cid, addonname } = req.params;
	
	clearSubscritonList(cid);

	let tmpRec = await M_Subscribe.findOne({cid: cid, name: addonname});
	if (!tmpRec) {
		tmpRec = new M_Subscribe();
		tmpRec.cid = cid;
		tmpRec.name = addonname
	}
	tmpRec.enabled = false;
	tmpRec.save();

	sendok(res, tmpRec);

});

addOnRouter.get('/hassubscribedpaneldoctor/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	let count = await hasSubscribed(cid, AddOnList.panel);
	sendok(res, {status: (count > 0) });

});


addOnRouter.get('/subscribelist/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	//let tmpRec = await M_Subscribe.find({cid: cid});
	let tmpRec = await getAllSubscriptions(cid);
	sendok(res, tmpRec);
});

addOnRouter.get('/test', async function(req, res, next) {
  setHeader(res);
  
	
	let allTypes = await M_AddOn.find({});
	for(let i=0; i<allTypes.length; ++i) {
		console.log(allTypes[i]);		//.planType = ADDONPLANTYPE[0];
	}
	sendok(res, "Done");
});
addOnRouter.get('/list', async function(req, res, next) {
  setHeader(res);
  
	
	let allTypes = await M_AddOn.find({}).sort({name: 1});
	sendok(res, allTypes);
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = {
	addOnRouter,
	hasSubscribed,
}