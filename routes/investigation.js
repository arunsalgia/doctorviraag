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

router.post('/update/:cid/:pid/:newInfo', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid, newInfo } = req.params;
	pid = Number(pid);
	newInfo = JSON.parse(newInfo);
	//console.log(newInfo.symptom);
	//console.log(newInfo.diagnosis);
  var iRec = await M_Investigation.findOne({cid: cid, pid: pid, investigationNumber: MAGICNUMBER});
  if (!iRec) {
		iRec = new M_Investigation();
		iRec.cid = cid;
		iRec.pid = pid;
		iRec.investigationNumber = MAGICNUMBER;
		iRec.enabled = true;
		//iRec.save();
  }
	iRec.investigationDate = new Date();
	iRec.symptom = newInfo.symptom;
	iRec.diagnosis = newInfo.diagnosis;
	console.log(iRec);
	await iRec.save();
	sendok(res, 'Done');
});

router.get('/close/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var {cid, pid } = req.params;
	pid = Number(pid);
	
  var iRec = await M_Investigation.findOne({cid: cid, pid: pid, investigationNumber: MAGICNUMBER});
  if (!iRec) return sendok(res, {investigationNumber: -1});

	let tmp = await M_Investigation.find({cid: cid, pid: pid, investigationNumber: {$lt: MAGICNUMBER} }).limit(1).sort({investigationNumber: -1});	
	console.log(tmp);
	let newNumber = (tmp.length > 0) ? tmp[0].investigationNumber + 1 : 1;
	console.log(newNumber);			
	iRec.investigationNumber = newNumber;
	await iRec.save();
	sendok(res, {investigationNumber: newNumber});
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
  
  var { cid, pid } = req.params;
	pid = Number(pid);
	
	let allRecs = await M_Investigation.find({cid: cid, pid: pid}).sort({investigationNumber: 1})
	//if (allRecs.length > 0) {
	//	if (allRecs[allRecs.length-1].investigationNumber === 0) {	
	//		allRecs = [allRecs[allRecs.length-1]].concat(allRecs.slice(0, allRecs.length-1));
	//	}
	//}
	//console.log(allRecs);
	sendok(res, allRecs);
});




function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;