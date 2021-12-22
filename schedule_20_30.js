path = require('path');
cookieParser = require('cookie-parser');
const { Console } = require('console');
const { promisify } = require('util')
const sleep = promisify(setTimeout);
logger = require('morgan');
axios = require('axios');

const RETRYCOUNT = 3;
/// make mongoose connection



// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  process.exit(0);
});

function ProgramExit() {
	process.exit(0);
}


// This scriot will actually executed at 8:30PM

async function processMessage(msgname) {
	for(let i=0; i < RETRYCOUNT; ++i) { 
		try {
			let myUrl = `https://doctorviraag.herokuapp.com/customer/${msgname}`;
			console.log(myUrl);
			await axios.get(myUrl);
			console.log(`${msgname} success`);
			break;
		} catch (e) {
			console.log(`Error in ${msgname}. Attempt ${msgname}`);
		}
	}
}



(async () => {

	await processMessage("reminder");

	ProgramExit();

})();




