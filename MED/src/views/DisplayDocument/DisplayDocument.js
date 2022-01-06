import React, { useEffect, useState ,useContext} from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from "axios";
import fileDownload  from 'js-file-download';

import { cdRefresh } from "views/functions.js"

export default function DisplayDocuments(props) {		
  useEffect(() => {		
		const generateDocument = async (docName, docId) => {		
      try {
				let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/docx/${docName}/${docId}`;
				let response = await axios({ 
					method: 'get', url: myURL,
						responseType: 'arraybuffer',
				});
				let myFile = `${docName}.pdf`;
				console.log(myFile);
				//console.log(response.data);
				await fileDownload (response.data, myFile);
				//sessionStorage.setItem("currentLogin","SIGNIN");
				//cdRefresh();
			} catch (e) {
				console.log(e);
			}
		}
		switch (props.cmd) {
			case 'receipt':
			case 'prescription':
				generateDocument(props.cmd, props.param1)
				break;
		}
		//genDocument();
		//getDocumentList()
  }, []);


  return (
	<Typography>Downloading</Typography>
  );
}
