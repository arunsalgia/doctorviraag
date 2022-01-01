var router = express.Router();

const { 
	getLoginName, 
} = require('./functions'); 


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});



router.get('/add/:cid/:newInventory', async function(req, res, next) {
  setHeader(res);
  
  var {cid, newInventory } = req.params;
	newInventory = newInventory.trim();
	
	var tmp = getLoginName(newInventory);

  var iRec = await M_Inventory.findOne({cid: cid, loginName: tmp});
	if (iRec) return senderr(res, 601, "Duplicate Inventory Name");
	
	var tmpRec = await M_Inventory.find({cid: cid}).limit(1).sort({id: -1});
	iRec = new M_Inventory();
	iRec.cid = cid;
	iRec.id = (tmpRec.length > 0) ? tmpRec[0].id + 1 : 1;
	iRec.loginName = tmp;
	iRec.name = newInventory;
	iRec.enabled = true;
	iRec.save();
	sendok(res, iRec);

	
});

router.get('/edit/:cid/:oldInventory/:newInventory', async function(req, res, next) {
  setHeader(res);
  
  var {cid, oldInventory, newInventory} = req.params;
	oldInventory = oldInventory.trim();
	newInventory = newInventory.trim();
	
	let old_lname = getLoginName(oldInventory);
	let new_lname = getLoginName(newInventory); 
	
	
	// check if old name really exists!!!! Only then we can modify it
	var mRec = await M_Inventory.findOne({cid: cid, loginName: old_lname});
	if (!mRec) return senderr(res, 601, "Inventory name not found");
	
	// good. now update the details
	mRec.loginName = new_lname;
	mRec.name = newInventory;
	mRec.enabled = true;
	mRec.save();
	sendok(res, mRec);
});

router.get('/delete/:cid/:delInventory', async function(req, res, next) {
  setHeader(res);
  
  var { cid, delInventory } = req.params;
	delInventory = delInventory.trim();
	
	let old_lname = getLoginName(delInventory);
	//console.log(old_lname);
	
	// check if old name really exists!!!! Only then we can delete it
	var mRec = await M_Inventory.findOne({cid: cid, loginName: old_lname});
	if (!mRec) return senderr(res, 601, "Inventory name not found");
	
	await M_Inventory.deleteOne({cid: cid, loginName: old_lname});
	await M_InventoryList.deleteMany({cid: cid, inventoryNumber: mRec.id});
	
	sendok(res, "Delete successful");
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
 let allRecs = await M_Inventory.find({cid: cid}).sort({loginName: 1});
 sendok(res, allRecs);
});


router.get('/inventorysummary/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid  } = req.params;
	
	let inventoryQuery = [
		{$match: { cid: cid }},
		{ $group: { _id: '$inventoryNumber', summary: { $sum: '$quantity' } } }
  ];
	
	let inventoryRecs = await M_InventoryList.aggregate(inventoryQuery).sort({_id: 1});

	sendok(res, inventoryRecs);
});

router.get('/listinventory/:cid/:inventoryNumber', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber } = req.params;
	
	let allRecs = await M_InventoryList.find({cid: cid, inventoryNumber: Number(inventoryNumber)}).sort({date: -1});
	sendok(res, allRecs);
});

router.get('/listallinventory/:cid', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	let allRecs = await M_InventoryList.find({cid: cid, subId: 0}).sort({id: -1, subId: -1});
	sendok(res, allRecs);
});

router.get('/listmasterinventory', async function(req, res, next) {
  setHeader(res);
  
  var { cid } = req.params;
	
	let allRecs = await M_InventoryList.find({}).sort({date: -1});
	sendok(res, allRecs);
});

router.get('/test', async function(req, res, next) {
  setHeader(res);
  
	await M_InventoryList.deleteMany({});

	sendok(res, "Done");
});


router.get('/addinventory/:cid/:inventoryId/:vendor/:purchaseDateStr/:expiryStr/:rate/:qtyPerBox/:numOfBoxes', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryId, vendor, purchaseDateStr, expiryStr, rate,  numOfBoxes, qtyPerBox} = req.params;

	let purchaseDate = new Date(Number(purchaseDateStr.substr(0,4)),
		Number(purchaseDateStr.substr(4,2))-1,
		Number(purchaseDateStr.substr(6,2)),
		0, 0 , 0
	);
	let expiryDate = new Date(Number(expiryStr.substr(0,4)),
			Number(expiryStr.substr(4,2))-1,
			Number(expiryStr.substr(6,2)),
			0, 0 , 0
		);
	//console.log(inventoryId, quantity);

	let tmpRec = await M_InventoryList.find({cid: cid, inventoryId: Number(inventoryId)}).limit(1).sort({id: -1});
	
	let iRec = new M_InventoryList();
	iRec.cid = cid;
	iRec.inventoryId = Number(inventoryId);
	iRec.id = (tmpRec.length > 0) ? tmpRec[0].id + 1 : 1;
	iRec.subId = 0;				// always 0 for purchse	This will be discarded

	iRec.vendor = vendor; 
	iRec.date = purchaseDate;
	iRec.expiryDate = expiryDate;

	iRec.unitRate = Number(rate);				// rate per box
	iRec.boxes = Number(numOfBoxes);			// number of boxes
	iRec.quantity = Number(qtyPerBox);		

	iRec.expired = false;
	iRec.enabled = true;
	
	iRec.inUse = 0;
	iRec.discarded = 0;
	await iRec.save();
	
	
	sendok(res, iRec);
});

router.get('/updateinventory/:cid/:inventoryId/:id/:vendor/:purchaseDateStr/:expiryStr/:rate/:qtyPerBox/:numOfBoxes', async function(req, res, next) {
  setHeader(res);
  
  var { cid, id, inventoryId, vendor, purchaseDateStr, expiryStr, rate,  numOfBoxes, qtyPerBox} = req.params;

	inventoryId = Number(inventoryId);
	id = Number(id);
	
	let iRec = await M_InventoryList.findOne({cid: cid, inventoryId: inventoryId, id: id, subId: 0});
	if (!iRec) return senderr(res, 601, "Not found");
	
	let purchaseDate = new Date(Number(purchaseDateStr.substr(0,4)),
		Number(purchaseDateStr.substr(4,2))-1,
		Number(purchaseDateStr.substr(6,2)),
		0, 0 , 0
	);
	let expiryDate = new Date(Number(expiryStr.substr(0,4)),
			Number(expiryStr.substr(4,2))-1,
			Number(expiryStr.substr(6,2)),
			0, 0 , 0
		);
	
	iRec.vendor = vendor; 
	iRec.date = purchaseDate;
	iRec.expiryDate = expiryDate;

	iRec.unitRate = Number(rate);				// rate per box
	iRec.boxes = Number(numOfBoxes);			// number of boxes
	iRec.quantity = Number(qtyPerBox);		
	
	iRec.expired = false;
	iRec.enabled = true;
		
	await iRec.save();

	sendok(res, iRec);
});

router.get('/subinventory/:cid/:inventoryId/:id/:quantity', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryId, id, quantity} = req.params;
	
	let tmpRec = await M_InventoryList.find({cid: cid, inventoryId: Number(inventoryId), id: Number(id)}).limit(1).sort({subId: -1});
	
	let iRec = new M_InventoryList();
	iRec.cid = cid;

	iRec.inventoryId = Number(inventoryId);
	iRec.id = Number(id);
	iRec.subId = tmpRec[0].subId + 1;

	iRec.vendor = "";
	iRec.unitRate = 0;
	iRec.quantity = -Number(quantity);
	iRec.date = new Date();

	iRec.expiryDate = new Date(2030, 0, 1);
	iRec.expired = false;

	iRec.enabled = true;

	iRec.save();
	
	sendok(res, iRec);
});

router.get('/updatesubinventory/:cid/:inventoryId/:id/:inUseQty/:discardedQty', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryId, id, inUseQty, discardedQty} = req.params;
	inventoryId = Number(inventoryId);
	id = Number(id);
	//subId = Number(subId);
	
	
	let iRec = await M_InventoryList.findOne({ cid: cid, inventoryId: inventoryId, id: id, subId: 0 });
	if (!iRec) return senderr(res, 601, "Not found");
	
	iRec.inUse = Number(inUseQty);
	iRec.discarded = Number(discardedQty);
	
	await iRec.save();
	
	sendok(res, iRec);
});

router.get('/orgeditinventory/:cid/:inventoryNumber/:id/:quantity', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryNumber,  id, quantity} = req.params;
	inventoryNumber = Number(inventoryNumber);
	id = Number(id);
	
	let iRec = await M_InventoryList.findOne({cid: cid, inventoryNumber: inventoryNumber, id: id});
	if (!iRec) return senderr(res, 601, "Invalid Inventory number or Id");
	
	iRec.quantity = (iRec.quantity > 0) ? Number(quantity) : -Number(quantity);
	iRec.enabled = true;
	iRec.save();
	
	sendok(res, iRec);
});


router.get('/delinventory/:cid/:inventoryId/:id/:subId', async function(req, res, next) {
  setHeader(res);
  
  var { cid, inventoryId,  id, subId} = req.params;
	inventoryId = Number(inventoryId);
	id = Number(id);
	subId = Number(subId);

	if (subId === 0) {
		if (id === 0) {
			await M_InventoryList.deleteMany({cid: cid, inventoryId: inventoryId});
			await M_Inventory.deleteOne({cid: cid, id: inventoryId});
		} else {
			await M_InventoryList.deleteMany({cid: cid, inventoryId: inventoryId, id: id});
		}
	} else {
		await M_InventoryList.deleteOne({cid: cid, inventoryId: inventoryId, id: id, subId: subId});
	}

	//let allTrans = await M_InventoryList.find({cid: cid}).sort({id: -1, subId: -1});	
	sendok(res, "Done");
});


router.get('/inuse/:cid', async function(req, res, next) {

	var { cid } = req.params;

	let allInv = await M_InventoryList.find({cid: cid, subId: 0}).sort({inventoryId: 1, id: 1});
	for(let i=0; i<allInv.length; ++i) {
		let tmp = await M_InventoryList.find({cid: cid, inventoryId: allInv[i].inventoryId, id: allInv[i].id, subId: {$ne: 0} });
		let inUse = _.sumBy(tmp, 'quantity');
		console.log(allInv[i].id, allInv[i].inventoryId, allInv[i].id, allInv[i].subId, allInv[i].inUse, inUse);
		allInv[i]["inUse"] = Math.abs(inUse);
		allInv[i]["discarded"] = 0;
		allInv[i]["boxes"] = 1;
		console.log(allInv[i])
		await allInv[i].save();
	}
	sendok(res, "Done");
});


router.get('/ut', async function(req, res, next) {
  setHeader(res);
  var cid = '61777eaa2322fe1efc986116';

	
	let allInv = await M_InventoryList.find({cid: cid, subId: 0}).sort({id: 1});
	//if (allRecs.length > 0) {
	//	if (allRecs[allRecs.length-1].investigationNumber === 0) {	
	//		allRecs = [allRecs[allRecs.length-1]].concat(allRecs.slice(0, allRecs.length-1));
	//	}
	//}
	
	for(let i=0; i<allInv.length; ++i) {
		let tmp = await M_InventoryList.find({cid: cid, inventoryId: allInv[i].inventoryId, id: allInv[i].id, subId: {$ne: 0} });
		let inUse = _.sumBy(tmp, 'quantity');
		allInv[i].inUse = Math.abs(inUse);
		await allInv[i].save();
	}
	
	console.log(allInv.length);
	sendok(res, "DOne");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;