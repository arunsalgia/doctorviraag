var router = express.Router();
const { 
	ALPHABETSTR,
	getLoginName, getDisplayName,
	getMaster, setMaster,
} = require('./functions'); 

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

router.get('/add/:newType/:charges/:desc/:eligible', async function(req, res, next) {
  setHeader(res);
  
  var {newType, charges, desc, eligible } = req.params;
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
	mRec.save();
	sendok(res, mRec);

});

router.get('/edit/:oldType/:newType/:charges/:desc/:eligible', async function(req, res, next) {
  setHeader(res);
  
  var {oldType, newType, charges, desc, eligible } = req.params;
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
	mRec.save();
	sendok(res, mRec);
});

router.post('/delete/:delType', async function(req, res, next) {
  setHeader(res);
  
  var { delType } = req.params;
	
	await M_AddOn.deleteOne({name: delType});
    //console.log("Data deleted"); // Success
	sendok(res, "1 add on type deleted");

});

router.get('/subscribe/:cid/:addonname/:amount', async function(req, res, next) {
  setHeader(res);
  
  var { cid, addonname, amount } = req.params;
	amount = Number(amount);
	
	let d = new Date();
	d.setFullYear(d.getFullYear()+1);
	let tmpRec = await M_Subscribe.findOne({cid: cid, name: addonname});
	if (!tmpRec) {
		tmpRec = new M_Subscribe();
		tmpRec.cid = cid;
		tmpRec.name = addonname
	}
	tmpRec.expiryDate = d;
	tmpRec.enabled = true;
	tmpRec.save();

	// now deduct amount 
	let myTrans = createWalletTransaction(cid);
  myTrans.transType = `Addon ${addonname} subscription`;
  myTrans.transSubType = "Recharge";
  myTrans.amount = -parseFloat(amount);
  await myTrans.save();

	sendok(res, tmpRec);

});

router.get('/unsubscribe/:cid/:addonname', async function(req, res, next) {
  setHeader(res);
  
  var { cid, addonname } = req.params;
	
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

router.get('/subscribelist/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	let tmpRec = await M_Subscribe.find({cid: cid});
	sendok(res, tmpRec);
});


router.get('/list', async function(req, res, next) {
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

module.exports = router;