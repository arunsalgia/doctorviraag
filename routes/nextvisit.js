const { dbToSvrText } = require("./functions");

var router = express.Router();


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/upcoming/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;

	let d = new Date();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
	let rec = await M_NextVisit.find({cid: cid, nextVisitDate: {$gte: d}}).sort({nextVisitDate: 1});
	//console.log(rec);

	/*
	if (rec.length === 0) return sendok(res, {visit: [], patient: []});

	let allPids = _.map(rec, 'pid');
	allPids = _.uniqBy(allPids);
	let allPatients = await M_Patient.find({cid: cid, pid: {$in: allPids}});
	for(let i=0; i<allPatients.length; ++i) {
		allPatients[i].email = dbToSvrText(allPatients[i].email)
	}
	*/

	sendok(res, {visit: rec, patient: null});
});

router.get('/missed/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;

	let d = new Date();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
	let rec = await M_NextVisit.find({cid: cid, nextVisitDate: {$lte: d}}).sort({nextVisitDate: -1});
	//console.log(rec);

	
	/*
	if (rec.length === 0) return sendok(res, {visit: [], patient: []});

	let allPids = _.map(rec, 'pid');
	allPids = _.uniqBy(allPids);
	let allPatients = await M_Patient.find({cid: cid, pid: {$in: allPids}});
	for(let i=0; i<allPatients.length; ++i) {
		allPatients[i].email = dbToSvrText(allPatients[i].email)
	}
	*/
	sendok(res, {visit: rec, patient: null});
});


router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	
	let rec = await M_NextVisit.findOne({cid: cid, pid: Number(pid)});
	console.log(rec);
	sendok(res, rec);
});

router.get('/update/:cid/:pid/:infoMsg', async function(req, res, next) {
  setHeader(res);
  var {cid, pid, infoMsg} = req.params;

	// just check if already exists
	let myRec = await M_NextVisit.findOne({cid: cid, pid: Number(pid)});
	if (!myRec) {
		// updating 1st time
		myRec = new M_NextVisit();
		myRec.pid = Number(pid);
	};
	myRec.info = infoMsg
	myRec.save();
	
	sendok(res, myRec);
});

router.get('/delete/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {pid} = req.params;
	
	let rec = await M_NextVisit.deleteOne({cid: cid, pid: Number(pid)});
	sendok(res, "done");
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;