var router = express.Router();


const SupportedTypes = ["JPG", "PNG", "JPEG", "PDF"];
const FileTypes = ["JPG", "PNG", "JPG", "PDF"];
const ContentTypes = ['image/jpeg', 'image/png', 'image/jpeg', 'application/pdf'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toUpperCase());  // Date.now() + '-' +file.originalname)
  }
})
const upload = multer({ storage: storage }).single('file');
    

/* GET users listing. */
router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

router.get('/list/:cid', async function(req, res, next) {
  setHeader(res);
	var {cid} = req.params;
	
	let rec = await M_Image.find({cid: cid}, {_id: 0, title: 1, name: 1, desc: 1, type: 1, date: 1, pid: 1, displayName: 1}).sort({date: -1});
	sendok(res, rec);
});

router.get('/list/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid} = req.params;
	//console.log(cid, pid);
	let rec = await M_Image.find({cid: cid, pid: pid}, 
		{title: 1, name: 1, desc: 1, type: 1, date: 1, pid: 1, displayName: 1})
		.sort({date: -1});

	//console.log(rec);
	sendok(res, rec);
});


router.get('/delete/:cid/:pid/:title', async function(req, res, next) {
  setHeader(res);
	var {cid, pid, title} = req.params;
	
	let rec = await M_Image.deleteOne({cid: cid, pid: pid, title: title});
	sendok(res, "Ok");
});


router.get('/deletepatient/:cid/:pid', async function(req, res, next) {
  setHeader(res);
	var {cid, pid, title} = req.params;
	
	let rec = await M_Image.deleteMany({cid: cid, pid: pid});
	sendok(res, "Ok");
});

router.post('/upload', (req, res, next) => {
	const newpath = __dirname + "/";
	console.log(req);
  const file = req.files.file;
  const filename = file.name;
	//console.log(newpath, file, filename);
	
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
   
		
    /*M_Image.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });*/
		
});


router.post('/uploadimage/:cid/:pid/:displayName/:fileName/:title/:desc', async function (req, res) {
  setHeader(res);
  var {cid, pid, displayName, fileName, title, desc, } = req.params;
  //fileType = fileType.toUpperCase();
  fileName = fileName.toUpperCase();

	let fileType = path.extname(fileName).substr(1);
	//console.log(fileType);
	let myIndex = SupportedTypes.indexOf(fileType)
	if (myIndex < 0)
		return senderr(res, 601, "Type not supported");
	
	//console.log(fileName, fileType);
  upload(req, res, async (err) => {
    if (err) return res.status(500);

    let xxx = fileName.split(".");
	
    var filePath = getRootDir() + ARCHIVEDIR + fileName;
    console.log(filePath);

		let myQuery = { title: { $regex: "^"+title+"$", $options: "i" }, cid: cid, pid: pid };	
		let myRec = await M_Image.findOne(myQuery);
		if (!myRec) {
			myRec = new M_Image();
			myRec.cid = cid;
			myRec.pid = pid;
			myRec.displayName = displayName;
			myRec.title = title;
		}
		
		myRec.name = fileName;
		myRec.desc = desc;
		myRec.type = FileTypes[myIndex];
		myRec.date = new Date();
    myRec.image = {
			data: fs.readFileSync(filePath),
			contentType: ContentTypes[myIndex]
		}
    await myRec.save();
  
    // now delete the file
    deletefile(filePath);

    return  sendok(res, myRec);                //res.send('File uploaded!');
	});
    
	return;
})


router.get('/downloadimage/:cid/:pid/:title', async function (req, res) {
  setHeader(res);

  var {cid, pid, title } = req.params;
 
	let myObject = await M_Image.findOne({cid: cid, pid: pid, title: title});
 
  // console.log(myObject);
  if (myObject) {
    //myFile = getRootDir() + ARCHIVEDIR + "DOWNLOADIMAGE." + myObject.type;
		//console.log(myFile)
    //fs.writeFileSync(myFile, myObject.image.data);
    //res.contentType("application/x-msdownload");
    sendok(res, myObject.image);
  } else
    senderr(res, 601, "Image not found");
})



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

var ROOTDIR="";
function getRootDir() {
  if (ROOTDIR === "")
    ROOTDIR = process.cwd() + "/"
  return ROOTDIR;
} 

function getFileName(productName, productVersion, productType) {
  let myFile = getRootDir() + ARCHIVEDIR + 
    productName + "_" + 
    productVersion + "." + 
    productType;
  return myFile 
}

function fileExist(myFile) {
  status = fs.existsSync(myFile)
  return status;
}

function renameFile(oldfile, newFile) {
  // if new file already exists delete it
  if (fileExist(newFile))
    fs.unlinkSync(newFile);

    // now rename the file
  fs.renameSync(oldfile, newFile);
}

function deletefile(fileName) {
  if (fileExist(fileName))
    fs.unlinkSync(fileName);
}

module.exports = router;