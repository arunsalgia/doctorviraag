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

router.get('/add/:cid/:newNote', async function(req, res, next) {
  setHeader(res);
  
  var {cid, newNote } = req.params;
	
	let id = getLoginName(newNote);
  var tmp = await M_Note.findOne({cid: cid, id: id});
  if (!tmp) {
		mRec = new M_Note();
		mRec.cid = cid;
		mRec.id = id;
		mRec.name = newNote;
		mRec.enabled = true;
		mRec.save();
    sendok(res, mRec);
  }
	else
    senderr(res, 601, 'Note already in database.');
});

router.get('/edit/:cid/:oldNote/:newNote', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldNote, newNote, desc, precaution} = req.params;
	let id;
	var mRec;
	
	let old_lname = getLoginName(oldNote);
	let new_lname = getLoginName(newNote);
	
	if (old_lname != new_lname) {
		// just check that of new medicine already in database
		mRec = await M_Note.findOne({cid: cid, id: new_lname});
		if (mRec) {
			senderr(res, 601, "New Note already in database");
			return;
		}
	} 
	
	// check if old name really exists!!!! Only then we can modify it
	mRec = await M_Note.findOne({cid: cid, id: old_lname});
	if (!mRec) {
		senderr(res, 611, "Old Note not found in database");
		return;
	}

	// good. now update the details
	mRec.id = new_lname;
	mRec.name = newNote;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.get('/delete/:cid/:delNote', async function(req, res, next) {
  setHeader(res);
  
  var { cid, delNote } = req.params;
	
	let id = getLoginName(delNote);
	console.log(id);
	
	M_Note.deleteOne({cid: cid, id: id}).then(function(){
    //console.log("Data deleted"); // Success
		sendok(res, "1 note deleted");
	}).catch(function(error){
    console.log(error); // Failure
		senderr(res, 601, `Note not found in database.`);
	});
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	M_Note.find({cid: cid}, "name", function(err, objs) {
		objs = _.sortBy(objs, 'name');
		sendok(res, objs);
  });
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;