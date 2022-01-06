var router = express.Router();
//original import { Document, Packer, Paragraph, TextRun } from "docx";
const { Document, Packer, Paragraph, TextRun, Header, Footer,
	Table, TableCell, TableRow, VerticalAlign, HorizontalPositionAlign,
	AlignmentType, ITableCellMarginOptions, WidthType, HeightRule, ITableRowOptions,
 } = require("docx");

const { 
	akshuGetCustomer,
	checksubscription,
} = require('./functions'); 

const MYFONT="Arial";
const MYSIZE=12*2;

function triConvert(num){
	if (num == 0) {
			return 'dontAddBigSufix';
	}
	
	var output = '';
	var numString = num.toString();
	let tmp = "";
	let value;
	// if number 1lakh or above
	//console.log(numString);
	if (numString.length > 3) {
		value = Number(numString.substr(0, numString.length - 3));
		//console.log("Above thousand",value)
		if (value > 0) {
			if (value < 20) {
				tmp += ONESSTR[value];
			} else {
				tmp += TENSSTR[Math.trunc(value / 10)];
				tmp += ONESSTR[value % 10];
			}
			
			output += ((output.length > 0) ? " " : "") + tmp + THOUSANDSTR;
			//console.log(output);
		}
		numString = numString.substr(numString.length-3);
	}
	//100 and more
	if (numString.length === 3) {
		if (numString[0] !== '0') {
			if (output.length > 0) output += " ";
			output += ONESSTR[Number(numString.substr(0,1))] + HUMDREDSTR;
		}
		numString = numString.substr(1);
	}
	value = Number(numString);
	if (value > 0) {
		if (value < 20) {
			output += ONESSTR[value];
		} else {
			output += TENSSTR[Math.trunc(value / 10)];
			output += ONESSTR[value % 10];
		}
	}
	output = output.trim();
	return output.substr(0,1).toUpperCase() + output.substr(1);
}   

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
	//console.log(medQty);
	return medQty[num].str;
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
  next('route');
});


router.get('/amount/:amount', async function(req, res, next) {
	setHeader(res);
	var {amount} = req.params;
	let strstr = triConvert(Number(amount));
	sendok(res, strstr);
})

router.get('/visit/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid } = req.params;
	pid = Number(pid);
	
	let myVisit = await M_Visit.findOne({cid: cid, pid: pid, visitNumber: MAGICNUMBER});
	if (!myVisit) return senderr(res, 601, "No new visit");
	console.log(myVisit);	
	pRec = await getPatient({cid: cid, pid: pid});
	//console.log(pRec);
	
	// need doctor name in the end
	//let pCustomerRec = akshuGetCustomer(cid);
	
	
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
	//console.log(reviewDate);
	
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
	//console.log(customerRec);
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
	
	console.log("PWD is ",process.cwd())
	// Used to export the file into a .docx file
	await Packer.toBuffer(visitDoc).then((buffer) => {
			fs.writeFileSync(process.cwd() + `/temp/${pRec.cid}_${pRec.pid}_patientVisit.docx`, buffer);
	});
		
	sendok(res, "ok");
});

router.get('/receipt/:cid/:pid/:tid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid, tid } = req.params;
	pid = Number(pid);
	tid = Number(tid);

	let sts = await checksubscription(cid, 'Billing');
	if (!sts) return senderr(res, 604, "No subscription");
	
	let myPc = await M_ProfCharge.findOne({cid: cid, tid: tid});
	if (!myPc) return senderr(res, 601, "No Such billiing");
	//console.log(myPc);	

	if (myPc.treatment === "") return senderr(res, 602, "Not professional charge recharge");
	
	//console.log(myPc.date);

	// get total billing amount till this professtional charge
	let billingQuery = [
		{$match: { cid: cid, pid: pid, tid: {$lte: myPc.tid}, amount: {$lt: 0} }},
		{ $group: { _id: '$pid', total: { $sum: '$amount' } } }
  ];
	let billRec = await M_ProfCharge.aggregate(billingQuery);

	// get total payment till date
	let paymentQuery = [
		{$match: { cid: cid, pid: pid, amount: {$gt: 0} }},
		{ $group: { _id: '$pid', total: { $sum: '$amount' } } }
  ];
	let payRec = await M_ProfCharge.aggregate(paymentQuery);

	let balance = billRec[0].total + ((payRec.length > 0) ? payRec[0].total : 0);
	//console.log(balance);
	if (balance < 0) return senderr(res, 603, "Full payment not yet done");

	//console.log(myPc);

	// not get the patient details
	//console.log(ITableRowOptions);

	let patRec = await M_Patient.findOne({cid: cid, pid: pid});
	// now prepare for invoice

	let allPara = [];
	let text = [];
	
	// leave initial few lines for header
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());

	text = [];
	text.push(boldUnderlineText("RECEIPT"));
	allPara.push(centerAlignedPara(text));
	allPara.push(blankLine());
	
	// Write date 
	text = [];
	text.push(normalText("Date: "));
	let myDate = `${DATESTR[myPc.date.getDate()]}/${MONTHNUMBERSTR[myPc.date.getMonth()]}/${myPc.date.getFullYear()}`;
	text.push(boldText(myDate));
	allPara.push(rightAlignedPara(text));

	allPara.push(blankLine());
	allPara.push(blankLine());

	// write received with thanks message
	text = [];
	text.push(normalText("Received with thanks from "));
	text.push(boldUnderlineText(patRec.displayName));
	text.push(normalText(" the sum of "));
	text.push(boldUnderlineText("Rupees "+triConvert(Math.abs(myPc.amount))+" only"));
	text.push(normalText(" towards the following treatment:"));
	allPara.push(normalSpacingPara(text));

	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());

	let myRows = [];
	let hdr = new TableRow({
		height: {height: 1000, rule: HeightRule.ATLEAST },
		children: [
			new TableCell({
				width: {size: 600, type: WidthType.DXA,},
				children: [centerAlignedPara([boldText("  Sr.")])], 
				verticalAlign: VerticalAlign.CENTER}),
			new TableCell({
				width: {size: 3500, type: WidthType.DXA,},
				children: [centerAlignedPara([boldText("  Treatment  ")])], 
				verticalAlign: VerticalAlign.CENTER}),
			new TableCell({
				width: {size: 2000, type: WidthType.DXA,},
				children: [centerAlignedPara([boldText("  Charges  ")])], 
				verticalAlign: VerticalAlign.CENTER}),
		],
	});
	myRows.push(hdr);

	for(let i=0; i<myPc.treatmentDetails.length; ++i) {
		let datarow = new TableRow({
			children: [
					new TableCell({children: [centerAlignedPara([normalText((i+1).toString())])], verticalAlign: VerticalAlign.CENTER}),
					new TableCell({children: [normalPara([normalText(" "+myPc.treatmentDetails[i].name)])], verticalAlign: VerticalAlign.CENTER}),
					new TableCell({children: [normalPara([normalText("  ₹ "+myPc.treatmentDetails[i].amount+"/-")])], verticalAlign: VerticalAlign.CENTER}),
			],
		});
		myRows.push(datarow);
	}
	let finalamountrow = new TableRow({
		children: [
				new TableCell({children: [centerAlignedPara([boldText("Total Amount")])], columnSpan: [2], verticalAlign: VerticalAlign.CENTER}),
				new TableCell({children: [normalPara([boldText("  ₹ "+Math.abs(myPc.amount)+"/-")])], verticalAlign: VerticalAlign.CENTER}),
		],
	});
	myRows.push(finalamountrow);

	const amountTable = new Table({rows: myRows, });
	allPara.push(amountTable);

	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());
	allPara.push(blankLine());

	let customerRec = await akshuGetCustomer(cid);
	console.log(customerRec);

	
	text = [];
	text.push(boldText(customerRec.doctorName));
	allPara.push(normalPara(text));
	
	const receiptDoc = new Document({
		sections: [{
			properties: {}, 
			children: allPara,
		}]
	});
	
	//console.log("PWD is ",process.cwd())
	// Used to export the file into a .docx file
	await Packer.toBuffer(receiptDoc).then((buffer) => {
			fs.writeFileSync(process.cwd() + `/temp/${cid}_${pid}_patientReceipt.docx`, buffer);
	});
		
	sendok(res, myPc);

	return;

	
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


router.get('/downloadreceipt/:cid/:pid', async function (req, res) {
  setHeader(res);
	var {cid, pid} = req.params;
  console.log("in download");
  
  let myFile = process.cwd() + `/temp/${cid}_${pid}_patientReceipt.docx`;		// getFileName(pname, myProduct[0].versionNumber, ptype);
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

function normalSpacingPara(text) {
	let para = new Paragraph({
		children: text, 
	});
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

function justifiedAlignedPara(text) {
	let para = new Paragraph({children: text, alignment: AlignmentType.JUSTIFIED,});
	return para;
}


function centerAlignedPara(text) {
	let para = new Paragraph({children: text, alignment: AlignmentType.CENTER,});
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