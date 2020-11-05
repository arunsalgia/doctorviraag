router = express.Router();
var PlayerStatRes;
var _group = 1;
var _tournament = "IPL2020";
const doMaxRun = 1;
const doMaxWicket = 2;

// user these keys in rotation for fetch data from cricapi
// const keylist = [
// "O9vYC5AxilYm7V0EkYkvRP5jF9B2","RTf9weNrX8Xn2ts1ksdzAXcuxnE3","H2ObZFee6BVMN5kCjLxYCMwcEp52",
// "kAWvFxmpeJZmbtyNeDLXtxUPrAH3","EstH4EqbfEXMKXcS9M83k7cqUs13","ApVnpFFO6kgxTYXVwWQTEeiFVCO2",
// "72QuFkQezxf5IdqxV1CtGJrAtcn1","mggoPlJzYFdVbnF9FYio5GTLVD13","AdHGF0Yf9GTVJcofkoRTt2YHK3k1",
// "4mtu16sveyTPWgz5ID7ru9liwE12","iEsdTQufBnToUI1xVxWMQF6wauX2","bbdCNNOKBtPnL54mvGSgpToFUlA2",
// "AM690XluFdZJ85PYvOP7IxgcxUI2","85L3mbm1GiXSfYmQWZJSeayoG2s1","LrNnasvQp0e2p5JfpAI5Q642o512",
// "UsE0jiSe6ZbLSQlO6k9W8ePWT043","ySAewUr5vLamX7LLdfzYD7jTWiJ2","ilzY7ckWVyQfjtULC8uiU2ciSW93",
// "fvxbB9BLVNfxatmOaiseF7Jzz6B2","Klr0NkJuG3YpZ1KburbMBNpfO1q1"
// ]; 

// use for testing
const keylist= [ "M3Fg7CfVEkXYSQvDRKP3NwgJIuv1" ];

// const keylist = [
// "O9vYC5AxilYm7V0EkYkvRP5jF9B2","mggoPlJzYFdVbnF9FYio5GTLVD13","AdHGF0Yf9GTVJcofkoRTt2YHK3k1",
// "4mtu16sveyTPWgz5ID7ru9liwE12","iEsdTQufBnToUI1xVxWMQF6wauX2","bbdCNNOKBtPnL54mvGSgpToFUlA2",
// "AM690XluFdZJ85PYvOP7IxgcxUI2","85L3mbm1GiXSfYmQWZJSeayoG2s1","LrNnasvQp0e2p5JfpAI5Q642o512",
// "UsE0jiSe6ZbLSQlO6k9W8ePWT043","apuLbsy7PVddDnb4vAe72X3K10Z2","ZfX9ln4lqYaEEtxJprOTceDW9rx2",
// "93WLPVtYJIOLRKXzb3LJYfrd2Z72","iiyI0vNqKaS4Srie6thRQZe5hIi1","r4ZAGKxe9pdy9AuYzViW486eGI83",
// "ySAewUr5vLamX7LLdfzYD7jTWiJ2","ilzY7ckWVyQfjtULC8uiU2ciSW93","fvxbB9BLVNfxatmOaiseF7Jzz6B2"
// ]

// list provided by ANKIT
// const keylist = [
//   "AE75dwPUs5RAw6ZVHvGfveFj0n63","zB5FK5Ww8UPau4KVTAHSD3qcZNz1","UN4rwRREijNQKKcy8DPYRYRdLA42",
//   "fmGPySXZIPbtA1Y5Rcj08XhtjFF3","GhRdKp2UaiPFHOHPHWSvODKfpJR2","cSL8p8DghkRHx2rMHtvAOCN4J2w1",
//   "z3Pw3sUAgcZtPLlsP7Mtmcpxdcw1","E4OCcOrhlaPr0tJHHJfcBocJC0f2","z1hiMw3yqEUsKPY7O7yKx4op6iI2",
//   "qegGL046YXT4GYH65MlaJb9KCSi2","HQdd1WU2jocSF8enWZR0gHsLMtG2","CkC4tzLl0aM9D5Bm9DDNpmejGVJ3",
//   "8LweszMN9vMnjb4W9UjjeQzTgEx1"
// ]

// to get Matches
const cricapiMatchInfo_prekey = "https://cricapi.com/api/matches?apikey=";
const cricapiMatchInfo_postkey = "";
// to get match statistics
const cricapi_MatchDetails_prekey = "https://cricapi.com/api/fantasySummary?apikey=";
const cricapi_MatchDetails_postkey = "&unique_id=";

var g_groupRec;
var g_captainlist;
var g_gmembers;
var g_allusers;
var g_auctionList;
var g_statList;
var g_tournamentStat;

/* GET all users listing. */
router.use('/', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();
  if (!db_connection) { senderr(DBERROR, ERR_NODB); return; }

  if (forceGroupInfo) {
    var tmp = req.url.split("/")
    var tmpgroup = parseInt(tmp[1]);
    var myrec = null;
    if (!isNaN(tmpgroup))
      myrec = await IPLGroup.findOne({gid: tmpgroup});
    //console.log(tmp.length);
    if (!myrec) {
      senderr(722, `Invalid gourp number specified`);
      return; 
    }
    //console.log(myrec);
    _group = myrec.gid;
    _tournament = myrec.tournament;
    tmp.splice(1, 2);
    req.url = tmp.join("/");
    if (req.url.length === 0) req.url = '/';
  }
  else {
    _group = 1;
    _tournament = "IPL2020";
  }

  if (req.url == "/")
    publish_stats();
  else
    next('route');
});



router.use('/xxxxxxswap/:gid1/:gid2', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();
  var {gid1, gid2} = req.params;
  if (isNaN(gid1)) { senderr(400, "Invalid GID1"); return}
  if (isNaN(gid2)) { senderr(400, "Invalid GID2"); return}
  var igid1 = parseInt(gid1);
  var igid2 = parseInt(gid2);

  var tmp = await IPLGroup.findOne({gid: igid1});
  if (!tmp) { senderr(400, "Invalid GID1"); return}
  tmp = await IPLGroup.findOne({gid: igid2});
  if (!tmp) { senderr(400, "Invalid GID2"); return}

  // swap GROUP 
  var allRecs = await IPLGroup.find({gid: {$in: [igid1, igid2]} })
  //console.log(allRecs);
  allRecs.forEach( x => {
    if      (x.gid == igid1)  x.gid = igid2;
    else if (x.gid == igid2)  x.gid = igid1;
    x.save();   
  })
  // swap GROUP Members
  var allRecs = await GroupMember.find({gid: {$in: [igid1, igid2]} })
  //console.log(allRecs);
  allRecs.forEach( x => {
    if      (x.gid == igid1)  x.gid = igid2;
    else if (x.gid == igid2)  x.gid = igid1;
    x.save();   
  })
  // swap Auction
  var allRecs = await Auction.find({gid: {$in: [igid1, igid2]} })
  allRecs.forEach( x => {
    if      (x.gid == igid1)  x.gid = igid2;
    else if (x.gid == igid2)  x.gid = igid1;
    x.save();   
  })
  // swap Captain
  var allRecs = await Captain.find({gid: {$in: [igid1, igid2]} })

  allRecs.forEach( x => {
    if      (x.gid == igid1)  x.gid = igid2;
    else if (x.gid == igid2)  x.gid = igid1;
    x.save();   
  })
  sendok("OK");
});

router.use('/test/:myGroup', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();
  var {myGroup} = req.params;
  var myData = await statCalculation(parseInt(myGroup));
  console.log(myData);
  sendok(myData.maxWicket);
});


router.use('/reread/:matchid', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();
  var {matchid} = req.params;
  if (isNaN(matchid)) { sendok("Invalid Match Id"); return}
  var mymid = parseInt(matchid)
  var mmm = await CricapiMatch.findOne({mid: mymid});
  if (mmm == null) { sendok("Invalid Match Id"); return}
  
  const cricData = await fetchMatchStatsFromCricapi(mmm.mid);
  console.log(cricData.data);
  if (cricData == null)
    sendok("cricData is NULL");
  else if (cricData.data == null)
    sendok(cricData);
  else {
    var newstats = updateMatchStats_r1(mmm, cricData.data);
    console.log(`Match Id: ${mmm.mid}  Start: ${mmm.matchStartTime}  End: ${mmm.matchEndTime}`);
    if (mmm.matchEndTime < new Date()) {
      mmm.matchEnded = true;
      mmm.save();
    }
    sendok("OK");
  }     
});

router.use('/sendmystat/:myGroup', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();
 var {myGroup} = req.params;

  var groupRec = await IPLGroup.findOne({gid: myGroup});
  if (groupRec) {
    var tmp = _.filter(myStatGroup, x => x === groupRec.gid);
    if (tmp.length === 0)
      myStatGroup.push(groupRec.gid);
    sendMyStat = true;
    sendok("OK");
  } else {
    senderr(722, `Invalid group ${myGroup}`);
  }
});

router.use('/sendmydashboard/:myGroup', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();
  var {myGroup} = req.params;
  sendok("OK");
  return;
  var groupRec = await IPLGroup.findOne({gid: myGroup});
  // console.log(groupRec);
  if (groupRec) {
    var tmp = _.filter(myDashboardGroup, x => x === groupRec.gid) 
    if (tmp.length === 0)
      myDashboardGroup.push(groupRec.gid);
    // console.log(myDashboardGroup);
    sendDashboard = true;
    sendok("OK");
  } else {
    senderr(722, `Invalid group ${myGroup}`);
  }
});

router.use('/test', async function(req, res, next) {
  PlayerStatRes = res;  
  setHeader();

  await update_cricapi_data_r1(true);
  sendok("OK");
});

// provide scrore of users beloging to the group
// currently only group 1 supported

router.use('/junked/internal/score', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();

  // get list of users in group
  var igroup = _group;
  var myGroup = await IPLGroup.findOne({gid: igroup})
  var gmembers = await GroupMember.find({gid: igroup});
  var auctionList = await Auction.find({gid: igroup});
  var captainlist = await Captain.find({gid: igroup});

  // Set collection name 
  var tournamentStat = mongoose.model(myGroup.tournament, StatSchema);
  var statList = await tournamentStat.find({});
  
  var userScoreList = [];    
  // now calculate score for each user
  gmembers.forEach( u  => {
    var userPid = u.uid;
    //console.log(`User: ${userPid}`);
    //var myUserScore = [];

    // find out captain and vice captain selected by user
    var capinfo = _.find(captainlist, x => x.gid == igroup && x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    // find out players of this user
    var myplayers = _.filter(auctionList, a => a.gid === igroup && a.uid === userPid); 
    //console.log(myplayers);
    //console.log("Just shown my players")
    //var playerScoreList = [];
    myplayers.forEach( p => {
      var MF = 1;
      if (p.pid === capinfo.viceCaptain)
        MF = ViceCaptain_MultiplyingFactor;
      else if (p.pid === capinfo.captain)
        MF = Captain_MultiplyingFactor;
      //console.log(`Mul factor: ${MF}`);

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(statList, x => x.pid === p.pid);
      //console.log(myplayerstats)

      // update score of each match played by user
      // myplayerstats.forEach(s => {
      //   s.score = calculateScore(s)*MF;
      // })
      //var myScore = _.sumBy(myplayerstats, x => x.score);
      var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      var tmp = { uid: userPid, pid: p.pid, playerScrore: myScore, stat: myplayerstats};
      //console.log(tmp);
      userScoreList.push(tmp);
    });
  })
  //console.log(userScoreList);
  sendok(userScoreList);
});


router.use('/maxrun/:myGroup/:myuser', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();

  var {myGroup , myuser} = req.params;

  var groupRec = await IPLGroup.findOne({gid: myGroup});
  if (!groupRec) { senderr(722, `Invalid group ${myGroup}`); return;  }

  var iuser;
  if (myuser.toUpperCase() === "ALL")
    iuser = 0;
  else {
    if (isNaN(myuser)) {
      senderr(721, `Invalid user id ${myuser}`);
      return;      
    }
    iuser = parseInt(myuser);
  }
  var myData = await statMax(groupRec.gid, iuser, doMaxRun, SENDRES);
  sendok(myData);
});

router.use('/maxwicket/:myGroup/:myuser', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();

  var {myGroup, myuser} = req.params;

  var groupRec = await IPLGroup.findOne({gid: myGroup});
  if (!groupRec) { senderr(722, `Invalid group ${myGroup}`); return;  }

  var iuser;
  if (myuser.toUpperCase() === "ALL")
    iuser = 0;
  else {
    if (isNaN(myuser)) {
      senderr(721, `Invalid user id ${myuser}`);
      return;      
    }
    iuser = parseInt(myuser);
  }
  var myData = await statMax(groupRec.gid, iuser, doMaxWicket, SENDRES);
  sendMatchInfoToClient(myData);
});


router.use('/brief/:myGroup/:myuser', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();

  var {myGroup, myuser} = req.params;
  var iuser;

  groupRec = await IPLGroup.findOne({gid: myGroup});
  if (!groupRec) { senderr(722, `Invalid user id ${myGroup}`); return;  }

  if (myuser.toUpperCase() === "ALL")
    iuser = 0;
  else {
    if (isNaN(myuser)) {
      senderr(721, `Invalid user id ${myuser}`);
      return;      
    }
    iuser = parseInt(myuser);
  }
  var myData = await statBrief(groupRec.gid, iuser, SENDRES);
  sendok(myData);

});


router.use('/score/:myuser', function(req, res, next) {
  PlayerStatRes = res;
  setHeader();
  var {myuser} = req.params;
  var iuser;
  if (myuser.toUpperCase() === "ALL")
    iuser = 0;
  else {
    if (isNaN(myuser)) {
      senderr(721, `Invalid user id ${myuser}`);
      return;      
    }
    iuser = parseInt(myuser);
  }
  statScore(iuser);
});

router.use('/rank/:myGroup/:myuser', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();
  var {myGroup,myuser} = req.params;
  var iuser;

  var groupRec = await IPLGroup.findOne({gid: myGroup});
  if (!groupRec) { senderr(722, `Invalid group ${myGroup}`); return; }

  if (myuser.toUpperCase() === "ALL")
    iuser = 0;
  else {
    if (isNaN(myuser)) {
      senderr(721, `Invalid user id ${myuser}`);
      return;      
    }
    iuser = parseInt(myuser);
  }
  var myData = 
  sendok(statRank(groupRec.gid, iuser, SENDRES));
});

router.use('/updatemax', async function(req, res, next) {
  PlayerStatRes = res;
  setHeader();

  // first check if tournament is over (END has been signalled)
  var myTournament = await Tournament.findOne({name: _tournament});
  if (!myTournament.over) {
    senderr(723, "Tournament not yet over. Cannot assign Bonus point for Tournament Max Run and Wicket");
    return;
  }

  var tournamentStat = mongoose.model(_tournament, StatSchema);
  var tdata = await tournamentStat.find({});
  var tmp = _.filter(tdata, x => x.mid == MaxRunMid);
  if (tmp.length > 0) {
    senderr(724, "Bonus point for Maximum run already assigned");
    return;
  }
  var tmp = _.filter(tdata, x => x.mid == MaxWicketMid);
  if (tmp.length > 0) {
    senderr(724, "Bonus point for Maximum wicket already assigned");
    return;
  }
  pidList = _.map(tdata, 'pid');
  pidList = _.uniqBy(pidList);

  // calculate total runs and total wockets of each player (played in tournament matches)
  var sumList = [];
  pidList.forEach( mypid => {
    tmp = _.filter(tdata, x => x.pid === mypid);
    if (tmp.length > 0) {
      var iRun = _.sumBy(tmp, 'run');
      var iWicket = _.sumBy(tmp, 'wicket');
      sumList.push({pid: mypid, playerName: tmp[0].playerName, totalRun: iRun, totalWicket: iWicket});
    }
  });

  // now get list of players who have score max runs (note there can be more than 1)
  var tmp = _.maxBy(sumList, x => x.totalRun);
  //console.log(tmp);
  var maxList = _.filter(sumList, x => x.totalRun == tmp.totalRun);
  var bonusAmount  = BonusMaxRun / maxList.length;
  maxList.forEach( mmm => {
    var myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxRunMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentRun = mmm.totalRun;  
    myrec.save(); 
  });

  // now get list of players who have taken max wickets (note there can be more than 1)
  var tmp = _.maxBy(sumList, x => x.totalWicket);
  //console.log(tmp);
  var maxList = _.filter(sumList, x => x.totalWicket == tmp.totalWicket);
  bonusAmount  = BonusMaxWicket / maxList.length;
  maxList.forEach( mmm => {
    var myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxWicketMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentWicket = mmm.totalWicket;
    myrec.save(); 
  });
  
  sendok("OK");
  // allocate bonus points to player with maximum run and maximum wicket
});

async function getTournameDetails(igroup) {
  var retVal = "";
  try {
    g_groupRec = await IPLGroup.findOne({gid: igroup});
    g_tournamentStat = mongoose.model(g_groupRec.tournament, StatSchema);
    retVal = g_groupRec.tournament
  } catch (err) {
    console.log(err);
  }
  return(retVal);
}

async function readDatabase(igroup) {
  // console.log("read started");
  try {
  var PstatList = g_tournamentStat.find({});
  } catch (err) {
    // console.log("Stat read error");
    return(false);
  }
  var PauctionList = Auction.find({gid: igroup});
  var Pallusers = User.find({});
  var Pgmembers = GroupMember.find({gid: igroup});
  var Pcaptainlist = Captain.find({gid: igroup});

  g_captainlist = await Pcaptainlist;
  g_gmembers = await Pgmembers;
  g_allusers = await Pallusers;
  g_auctionList = await PauctionList;
  g_statList = await PstatList;
  // if (!g_statList)
  //   console.log("Stat list in null");
  // else {
  //   console.log("Stat ok");
    // console.log(g_statList);
  // }

  return  ( (g_captainlist) &&
           (g_gmembers) &&
           (g_allusers) && 
           (g_auctionList) &&
           (g_statList.length > 0))  ? true : false;
}

async function statBrief(igroup, iwhichuser, doWhatSend)
{
  // Set collection name 
  // var tournamentStat = mongoose.model(_tournament, StatSchema);
  // var igroup = _group;
  
  // get list of users in group
  /*
  var PgroupRec = IPLGroup.findOne({gid: igroup});
  var PauctionList = Auction.find({gid: igroup});
  var Pallusers = User.find({});
  var Pgmembers = GroupMember.find({gid: igroup});
  var Pcaptainlist = Captain.find({gid: igroup});

  // first read group record and start data fetch for tournament stats
  var groupRec = await PgroupRec;
  var tournamentStat = mongoose.model(groupRec.tournament, StatSchema);
  var PstatList = tournamentStat.find({});

  var captainlist = await Pcaptainlist;
  var gmembers = await Pgmembers;
  var allusers = await Pallusers;
  var auctionList = await PauctionList;
  var statList = await PstatList;
*/

  // var groupRec = g_groupRec
  // var captainlist = g_captainlist;
  // var gmembers = g_gmembers;
  // var allusers = g_allusers;
  // var auctionList = g_auctionList;
  // var statList = g_statList;

  var userScoreList = [];    
  // now calculate score for each user
  g_gmembers.forEach( gm  => {
    var userPid = gm.uid;
    var urec = _.find(g_allusers, x => x.uid == userPid);
    // find out captain and vice captain selected by user
    var capinfo = _.find(g_captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    // find out players of this user
    var myplayers = _.filter(g_auctionList, a => a.uid === userPid); 
    var playerScoreList = [];
    myplayers.forEach( p => {
      var MF = 1;
      var nameSufffix = "";
      if (p.pid === capinfo.viceCaptain) {
        MF = ViceCaptain_MultiplyingFactor;
        nameSufffix = " (VC)";
      } else if (p.pid === capinfo.captain) {
        MF = Captain_MultiplyingFactor;
        nameSufffix = " (C)";
      }

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(g_statList, x => x.pid === p.pid);
      //console.log(myplayerstats);
      // var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myScore2 = _.sumBy(myplayerstats, x => x.run)*BonusRun*(MF-1);
      var myScore3 = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt*(MF-1);
      var myScore = myScore1 + myScore2 + myScore3;
      // var myplayerstats = _.map(myplayerstats, o => _.pick(o, ['mid', 'pid', 'score']));
      var myplayerstats = _.map(myplayerstats, o => _.pick(o, ['pid', 'score']));
      var tmp = { 
        // uid: userPid, 
        // userName: urec.userName,
        // displayName: urec.displayName,
        pid: p.pid, 
        playerName: p.playerName + nameSufffix,
        playerScore: myScore
        //matchStat: myplayerstats
      };
      playerScoreList.push(tmp);
      // playerScoreList.push(_.sortBy(tmp, x => x.playerScore).reverse());
    });
    playerScoreList = _.sortBy(playerScoreList, x => x.playerScore).reverse();
    var userScoreValue = _.sumBy(playerScoreList, x => x.playerScore);
    userScoreList.push({uid: userPid, 
      gid: igroup,
      userName: urec.userName, 
      displayName: urec.displayName, 
      userScore: userScoreValue,
      playerStat: playerScoreList});
  })
  if (iwhichuser != 0) {
    userScoreList = _.filter(userScoreList, x => x.uid == iwhichuser);
  }
  userScoreList = _.sortBy(userScoreList, x => x.userScore).reverse();
  //console.log(userScoreList);
  // if (doWhatSend === SENDRES) {
  //   sendok(userScoreList); 
  // } else {
  //   const socket = app.get("socket");
  //   socket.emit("brief", userScoreList)
  //   socket.broadcast.emit('brief', userScoreList);    
  // //   console.log(userScoreList);
  // }
  return(userScoreList);
}


async function statScore(iwhichUser) {
  // get list of users in group
  var tournamentStat = mongoose.model(_tournament, StatSchema);
  var igroup = _group;

  var PstatList =  tournamentStat.find({});
  var PauctionList =  Auction.find({gid: igroup});
  var Pallusers =  User.find({});
  var Pgmembers =  GroupMember.find({gid: igroup});
  var Pcaptainlist =  Captain.find({gid: igroup});

  // wait for data fetch to be over
  captainlist = await Pcaptainlist;
  gmembers = await Pgmembers;
  allusers = await Pallusers;
  auctionList = await PauctionList;
  statList = await PstatList;

  // now calculate score for each user
  var userScoreList = [];    
  gmembers.forEach( u  => {
    var userPid = u.uid;
    var urec = _.find(allusers, u => u.uid === userPid);
    var curruserName = urec.userName;
    var currdisplayName = urec.displayName;

    // find out captain and vice captain selected by user
    var capinfo = _.find(captainlist, x => x.gid == igroup && x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    // find out players of this user
    var myplayers = _.filter(auctionList, a => a.gid === igroup && a.uid === userPid); 
    //console.log(myplayers);
    //console.log("Just shown my players")
    //var playerScoreList = [];
    myplayers.forEach( p => {
      var MF = 1;
      var nameSufffix = "";
      if (p.pid === capinfo.viceCaptain) {
        MF = ViceCaptain_MultiplyingFactor;
        nameSufffix = " (VC)"
      } else if (p.pid === capinfo.captain) {
        MF = Captain_MultiplyingFactor;
        nameSufffix = " (C)"
      }
      //console.log(`Mul factor: ${MF}`);

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(statList, x => x.pid === p.pid);
      //console.log(myplayerstats)

      // var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      // Only RUN & WICKET will be 2 times for caption and 1.5 time for Vice Captai
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myScore2 = _.sumBy(myplayerstats, x => x.run)*BonusRun*(MF-1);
      var myScore3 = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt*(MF-1);
      var myScore = myScore1 + myScore2 + myScore3;
      var tmp = { 
        uid: userPid, 
        userName: curruserName,
        displayName: currdisplayName,
        pid: p.pid, 
        playerName: p.playerName + nameSufffix, 
        playerScore: myScore, 
        stat: myplayerstats};
      //console.log(tmp);
      userScoreList.push(tmp);
    });
  })
  if (iwhichUser != 0)
    userScoreList = _.filter(userScoreList, x => x.uid === iwhichUser);
  sendok(userScoreList);
}



async function statRank (igroup, iwhichUser, doSendWhat) {
  // find out users belnging to Group 1 (this is default). and set in igroup
  // Set collection name 
  // var igroup = _group;
  // make async mongose calls
  const PgroupRec = IPLGroup.findOne({gid: igroup});
  const PauctionList = Auction.find({gid: igroup });
  const Pallusers = User.find({});
  const Pgmembers = GroupMember.find({gid: igroup});
  const Pcaptainlist = Captain.find({gid: igroup});

  groupRec = await PgroupRec;
  var tournamentStat = mongoose.model(groupRec.tournament, StatSchema);
  const PstatList = tournamentStat.find({});

  captainlist = await Pcaptainlist;
  gmembers = await Pgmembers;
  allusers = await Pallusers
  auctionList = await PauctionList
  statList = await PstatList;

  // now calculate score for each user
  var userRank = [];
  gmembers.forEach( gm => {
    userPid = gm.uid; 
    var urec = _.filter(allusers, u => u.uid === userPid);
    var curruserName = (urec) ? urec[0].userName : "";
    var currdisplayName = (urec) ? urec[0].displayName : "";
    // find out captain and vice captain selected by user
    var capinfo = _.find(captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});
    //console.log(capinfo);
    // find out players of this user
    var myplayers = _.filter(auctionList, a => a.uid === userPid); 
    //console.log(myplayers);
    //console.log("Just shown my players")
    //var playerScoreList = [];
    var userScoreList = [];    
    myplayers.forEach( p => {
      var MF = 1;
      //console.log(capinfo);
      if (p.pid === capinfo.viceCaptain) {
        //console.log(`Vice Captain is ${capinfo.viceCaptain}`)
        MF = ViceCaptain_MultiplyingFactor;
      } else if (p.pid === capinfo.captain) {
        //console.log(`Captain is ${capinfo.captain}`)
        MF = Captain_MultiplyingFactor;
      } else {
        //console.log(`None of the above: ${p.pid}`);
      }
      //console.log(`Mul factor: ${MF}`);

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(statList, x => x.pid === p.pid);
      // var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myScore2 = _.sumBy(myplayerstats, x => x.run)*BonusRun*(MF-1);
      var myScore3 = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt*(MF-1);
      var myScore = myScore1 + myScore2 + myScore3;
      //console.log(`Player: ${p.pid}   Score: ${myScore}  MF used: ${MF}`);
      userScoreList.push({ uid: userPid, pid: p.pid, playerName: p.name, playerScore: myScore});
    });
    var totscore = _.sumBy(userScoreList, x => x.playerScore);
    //if (userPid === 9) totscore = 873;  // for testing
    // do not assign rank. Just now. Will be assigned when info of all user grad score is available
    userRank.push({ 
      uid: userPid, 
      gid: igroup,
      userName: curruserName, 
      displayName: currdisplayName,
      grandScore: totscore, 
      rank: 0});
  })
  userRank = _.sortBy(userRank, 'grandScore').reverse();

  // assign ranking
  var nextRank = 0;
  var lastScore = 99999999999999999999999999999;  // OMG such a big number!!!! Can any player score this many points
  userRank.forEach( x => {
    if (x.grandScore < lastScore)
      ++nextRank;
    x.rank = nextRank;
    lastScore = x.grandScore;
  });

  if (iwhichUser != 0)
    userRank = _.filter(userRank, x => x.uid == iwhichUser);

  // console.log(userRank);
  // if (doSendWhat === SENDRES) {
  //   sendok(userRank);
  // } else {
  //   const socket = app.get("socket");
  //   socket.emit("rank", userRank)
  //   socket.broadcast.emit('rank', userRank);
  //   // console.log(userRank);
  // }
  return(userRank);
}


async function statMax(igroup, iwhichuser, doWhat, sendToWhom)
{
  // var igroup = _group;
  // get list of users in group
  var PgroupRec = IPLGroup.findOne({gid: igroup});
  var PauctionList = Auction.find({gid: igroup});
  var Pallusers = User.find({});
  var Pgmembers = GroupMember.find({gid: igroup}); 
  var Pcaptainlist = Captain.find({gid: igroup});
  
  groupRec = await PgroupRec;
  console.log(groupRec);
  var tournamentStat = await mongoose.model(groupRec.tournament, StatSchema);
  var PstatList = tournamentStat.find({});
 
  var captainlist = await Pcaptainlist;
  var gmembers = await Pgmembers;
  var allusers= await Pallusers;
  var auctionList = await PauctionList;
  var statList = await PstatList;

  // get all players auctioned by this group 
  //var allplayerList = _.map(auctionList, 'pid');
  // now calculate score for each user
  var userScoreList = [];    
  gmembers.forEach( gm  => {
    userPid = gm.uid;

    // find out captain and vice captain selected by user
    var capinfo = _.find(captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});
  
    var urec = _.find(allusers, x => x.uid == userPid);
    // find out players of this user
    var myplayers = _.filter(auctionList, a => a.uid == userPid); 
    myplayers.forEach( p => {
      var MF = 1;
      if (p.pid === capinfo.viceCaptain)
        MF = ViceCaptain_MultiplyingFactor;
      else if (p.pid === capinfo.captain)
        MF = Captain_MultiplyingFactor;

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(statList, x => x.pid === p.pid);
      var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      var totRun = _.sumBy(myplayerstats, x => x.run);
      var totWicket = _.sumBy(myplayerstats, x => x.wicket);
      var tmp = { 
        uid: userPid, 
        gid: igroup,
        userName: urec.userName,
        displayName: urec.displayName,
        pid: p.pid, 
        playerName: p.playerName,
        playerScrore: myScore, 
        totalRun: totRun,
        totalWicket: totWicket
      };
      //console.log(tmp);
      userScoreList.push(tmp);
    });
  })

  if (iwhichuser != 0)
    userScoreList = _.filter(userScoreList, x => x.uid == iwhichuser);

  var maxarray = [];
  gmembers.forEach( gm => {
    var tmp = _.filter(userScoreList, x => x.uid == gm.uid);
    //if (tmp.length == 0) return

    var tmpRun = _.maxBy(tmp, x => x.totalRun);
    var tmpWicket = _.maxBy(tmp, x => x.totalWicket);
    //console.log(tmpRun);
    if ((doWhat === doMaxRun)) { // && (tmpRun.totalRun > 0)) {
      //console.log("In total run");
      if (tmpRun.totalRun === 0) {
        maxarray.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "",
        maxRunPlayerId: 0,  maxRunPlayerName: "", maxRun: 0});
      } else {
        var maxRun = _.filter(tmp, x => x.totalRun == tmpRun.totalRun );
        maxRun.forEach( runrec => {
          maxarray.push({ 
            uid: gm.uid, 
            gid: igroup,
            userName: runrec.userName,
            displayName: runrec.displayName,
            maxRunPlayerId: runrec.pid,
            maxRunPlayerName: runrec.playerName,
            maxRun: runrec.totalRun,
          });
        });
      }
    } else if ((doWhat === doMaxWicket)) {  //&& (tmpWicket.totalWicket > 0)) {
      //console.log(`in else  ${tmpWicket.totalWicket}`);
      if (tmpWicket.totalWicket === 0) {
        maxarray.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "", maxWicketPlayerId: 0,
        maxWicketPlayerName: "", maxWicket: 0});
      } else {
        var maxWicket = _.filter(tmp, x => x.totalWicket === tmpWicket.totalWicket );
        maxWicket.forEach( wktrec => {
          maxarray.push({ 
            uid: gm.uid, 
            gid: igroup,
            userName: wktrec.userName,
            displayName: wktrec.displayName,
            maxWicketPlayerId: wktrec.pid,
            maxWicketPlayerName: wktrec.playerName,
            maxWicket: wktrec.totalWicket
          });
        });
      }
    }
  });
  //console.log(maxarray);
  // if (sendToWhom === SENDRES)  {
  //   sendok(maxarray);
  // } else {
  //   const socket = app.get("socket");
  //   if (doWhat === doMaxRun) {
  //     socket.emit("maxRun", maxarray)
  //     socket.broadcast.emit('maxRun', maxarray);
  //   } else {
  //     socket.emit("maxWicket", maxarray)
  //     socket.broadcast.emit('maxWicket', maxarray);
  //   }
  //   // console.log(maxarray);
  // }
  return(maxarray)
}

async function statCalculation (igroup) {
  var calStart = new Date();

  /*
  const groupRec = await IPLGroup.findOne({gid: igroup});
  var tournamentStat = mongoose.model(groupRec.tournament, StatSchema);
  const PstatList = tournamentStat.find({});
  const Pgmembers = GroupMember.find({gid: igroup});
  const PauctionList = Auction.find({gid: igroup });
  const Pallusers = User.find({});
  const Pcaptainlist = Captain.find({gid: igroup});

  var beforeAwait = new Date();
  gmembers = await Pgmembers;
  allusers = await Pallusers
  auctionList = await PauctionList
  captainlist = await Pcaptainlist;
  var beforeStat = new Date();
  statList = await PstatList;
*/

  var dataRead = new Date();
  // now calculate score for each user
  var userRank = [];
	var userMaxRunList = [];
	var userMaxWicketList = [];

  g_gmembers.forEach( gm => {
    userPid = gm.uid; 
    var urec = _.filter(g_allusers, u => u.uid === userPid);
    var myplayers = _.filter(g_auctionList, a => a.uid === userPid); 
	
	// user name and dislay name from User record
    var curruserName = (urec) ? urec[0].userName : "";
    var currdisplayName = (urec) ? urec[0].displayName : "";

    // find out captain and vice captain selected by user
    var capinfo = _.find(g_captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    //console.log(capinfo);
    // find out players of this user
    //console.log(myplayers);
    //console.log("Just shown my players")
    //var playerScoreList = [];

    var userScoreList = []; 
	var userMaxList = [];
	
    myplayers.forEach( p => {

      var MF = 1;
      //console.log(capinfo);
      if (p.pid === capinfo.viceCaptain) {
        //console.log(`Vice Captain is ${capinfo.viceCaptain}`)
        MF = ViceCaptain_MultiplyingFactor;
      } else if (p.pid === capinfo.captain) {
        //console.log(`Captain is ${capinfo.captain}`)
        MF = Captain_MultiplyingFactor;
      } else {
        //console.log(`None of the above: ${p.pid}`);
		MF = 1;
      }
      //console.log(`Mul factor: ${MF}`);

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(g_statList, x => x.pid === p.pid);
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myRunsBonus = _.sumBy(myplayerstats, x => x.run)*BonusRun*(MF-1);
      var myWicketsBonus = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt*(MF-1);
      var myScore = myScore1 + myRunsBonus + myWicketsBonus;
      userScoreList.push({ uid: userPid, pid: p.pid, playerName: p.name, playerScore: myScore});

		// now find out max of each player
	  var totRun = _.sumBy(myplayerstats, x => x.run);
      var totWicket = _.sumBy(myplayerstats, x => x.wicket);
      var tmp = { 
        gid: igroup,
        uid: userPid, 
        userName: urec.userName,
        displayName: urec.displayName,
        pid: p.pid, 
        playerName: p.playerName,
        playerScrore: myScore, 
        totalRun: totRun,
        totalWicket: totWicket
      };
      //console.log(tmp);
      userMaxList.push(tmp);

    });
	
	// calculation of player belonging to user is done.
	// Now do total score, run and wicket
    var totscore = _.sumBy(userScoreList, x => x.playerScore);
    userRank.push({ 
      uid: userPid, 
      gid: igroup,
      userName: curruserName, 
      displayName: currdisplayName,
      grandScore: totscore, 
      rank: 0});

	var tmpRun = _.maxBy(userMaxList, x => x.totalRun);
	  if (tmpRun.totalRun === 0) {
		userMaxRunList.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "",
		maxRunPlayerId: 0,  maxRunPlayerName: "", maxRun: 0});
	  } else {
		var maxRun = _.filter(userMaxList, x => x.totalRun == tmpRun.totalRun );
		maxRun.forEach( runrec => {
		  userMaxRunList.push({ 
			uid: gm.uid, 
			gid: igroup,
			userName: runrec.userName,
			displayName: runrec.displayName,
			maxRunPlayerId: runrec.pid,
			maxRunPlayerName: runrec.playerName,
			maxRun: runrec.totalRun,
		  });
		});
	  }

    var tmpWicket = _.maxBy(userMaxList, x => x.totalWicket);
      if (tmpWicket.totalWicket === 0) {
        userMaxWicketList.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "", maxWicketPlayerId: 0,
        maxWicketPlayerName: "", maxWicket: 0});
      } else {
        var maxWicket = _.filter(userMaxList, x => x.totalWicket === tmpWicket.totalWicket );
        maxWicket.forEach( wktrec => {
          userMaxWicketList.push({ 
            uid: gm.uid, 
            gid: igroup,
            userName: wktrec.userName,
            displayName: wktrec.displayName,
            maxWicketPlayerId: wktrec.pid,
            maxWicketPlayerName: wktrec.playerName,
            maxWicket: wktrec.totalWicket
          });
        });
      }
  });
  
  // assign ranking. Sort by score. Highest first
  userRank = _.sortBy(userRank, 'grandScore').reverse();
  var nextRank = 0;
  var lastScore = 99999999999999999999999999999;  // OMG such a big number!!!! Can any player score this many points
  userRank.forEach( x => {
    if (x.grandScore < lastScore)
      ++nextRank;
    x.rank = nextRank;
    lastScore = x.grandScore;
  });

  calcEnd = new Date();

  var totDur = calcEnd.getTime() - calStart.getTime();
  // var duration2 = beforeStat.getTime() - beforeAwait.getTime();
  // var duration3 = dataRead.getTime() - beforeStat.getTime();
  // var duration4 = calcEnd.getTime() - dataRead.getTime();
  // var totDur = calcEnd.getTime() - calStart.getTime();

  // console.log(`Start calc: ${calStart}`);
  // console.log(`Beforeawai: ${beforeAwait} Duration: ${duration1}`);
  // console.log(`BeforeStat: ${beforeStat}  Duration: ${duration2}`);
  // console.log(`Read over : ${dataRead}  Duration: ${duration3}`);
  // console.log(`End   calc: ${calcEnd}  Duration: ${duration4}`);
  console.log(`Total Time: ${totDur}`) 

  return({rank: userRank, maxRun: userMaxRunList, maxWicket: userMaxWicketList});
}

async function update_cricapi_data_r1(logToResponse)
{
    let myindex;

    // 1st if time is up then get match details from cricapi
    if (timeToFetchMatches()) {
      console.log("time to fetch match details");
      var existingmatches = await CricapiMatch.find({});
        
      // now fetch fresh match details from cricapi
      var matchesFromCricapi = await fetchMatchesFromCricapi();
      if (matchesFromCricapi.matches == undefined) {
        console.log(matchesFromCricapi);
        var errmsg = "Could not fetch Match details from CricAPI"
        if (logToResponse)  senderr(CRICFETCHERR, errmsg)
        else                console.log(errmsg);
        return; 
      }

      // get all tournamnet and their teams
      allTournament = await Tournament.find({over: false});
      var tournamentList = _.map(allTournament, 'name'); 
      var allTeams = await Team.find({tournament: {$in: tournamentList} });

      // process each match found in cricapy
      matchesFromCricapi.matches.forEach(x => {
        var myTeam1 = x['team-1'].toUpperCase();
        var myTeam2 = x['team-2'].toUpperCase();
        //console.log(`${myTeam1} ${myTeam2}`);
        if ((myTeam1 === "TBA") || (myTeam2 === "TBA")) return;

        var matchTournament = '';
        var mytype = x.type.toUpperCase();

        // special case for IPL
        if (mytype.length === 0) {
          let xxxtmp = _.find(IPLSPECIAL,  x => myTeam1.includes(x));
          if (xxxtmp) {
            xxxtmp = _.find(IPLSPECIAL,  x => myTeam2.includes(x));
            if (xxxtmp) { x.type = "T20";  mytype = "T20"; }
          }
        }
        // console.log(`${myTeam1} ${myTeam2} Match type is ${mytype}`);
        // ipl special offer complete

        allTournament.forEach(t => {
          var typeHasMatched = false;
          switch (t.type) {
            case "TEST":
              if (mytype.includes("TEST"))
                typeHasMatched = true;
              break;
            case "ODI":
              if (mytype.includes("ODI"))
                typeHasMatched = true;
              break;
            case "T20":
              if (mytype.includes("20") || mytype.includes("TWENTY"))
                typeHasMatched = true;
              break;
          }
          if (!typeHasMatched) return;

          //console.log(`Two teams are ${myTeam1} and ${myTeam2}`);
          var myteams = _.filter(allTeams, tm => tm.tournament == t.name);
          //console.log(myteams);
          // find team 1  is part of this tournament
          var myindex = _.findIndex(myteams, (x) => { return x.name.toUpperCase() === myTeam1});
          //console.log(`My Index for team 1 is ${myindex}`)
          if (myindex < 0) return;

          // find team 2  is part of this tournament
          myindex = _.findIndex(myteams, (x) => { return x.name.toUpperCase() === myTeam2});
          //console.log(`My Index for team 2 is ${myindex}`)
          if (myindex < 0) return;

          // both the teams belong to this tournament. 
          //console.log(`Team: ${myTeam1} and ${myTeam2} are part of tournament ${t.name}`);
          matchTournament = t.name;
        });
        if (matchTournament.length === 0) return;
        console.log(`Tournament: ${matchTournament} Match Team1: ${myTeam1}  Team2: ${myTeam2}`)

        var mymatch = _.find(existingmatches, m => m.mid == parseInt(x.unique_id));
        if (mymatch === undefined) mymatch = new CricapiMatch();
        console.log(`dating match of ${x.unique_id}`)
        mymatch = getMatchDetails(x, mymatch, matchTournament);
        // console.log(mymatch);
        mymatch.save();
      });
      // end of check if this match part of our tournament

      // set next fetch time
      updateMatchFetchTime(matchesFromCricapi.provider); 
    }
    else 
      console.log("Match details not to be fetched now");

    // match update job done. Now get all matches which have started before current time
    var currtime = new Date(); 
    console.log(`Curr time ${currtime}`);
    let myfilter = { matchStartTime: {$lt: currtime }, matchEnded: false};
    //let myfilter = { matchEnded: false};
    var matchesFromDB = await CricapiMatch.find(myfilter);
    // console.log("My Matches");
    // console.log(matchesFromDB);
    // console.log(`Matches started count ${matchesFromDB.length}`)

    // get stas of all these matches
    await matchesFromDB.forEach(async (mmm) => {
      const cricData = await fetchMatchStatsFromCricapi(mmm.mid);
      if (cricData != null)
      if (cricData.data != null) {
        var newstats = updateMatchStats_r1(mmm, cricData.data);
        // if pasrt end time. Then set matchended as true
        var currdate = new Date();
        console.log(`Match Id: ${mmm.mid}  Start: ${mmm.matchStartTime}  End: ${mmm.matchEndTime}`);
        if (mmm.matchEndTime < new Date()) {
          mmm.matchEnded = true;
          mmm.save();
        }     
      }
    });
    return;
}


async function updateMatchStats_r1(mmm, cricdata)
{
  var currMatch = mmm.mid;
  console.log(`Match: ${currMatch} data update. Tournamen; ${mmm.tournament}`)  
  // from tournament name identify the name
  var tournamentStat = mongoose.model(mmm.tournament, StatSchema);

  
  var bowlingArray;
  if (!(cricdata.bowling === undefined))
    bowlingArray = cricdata.bowling;
  else
    bowlingArray = [];

  var battingArray;
  if (!(cricdata.batting === undefined))
    battingArray = cricdata.batting;
  else
    battingArray = [];

  var manOfTheMatchPid = 0;  
  if (cricdata["man-of-the-match"] != undefined) 
  if (cricdata["man-of-the-match"].pid != undefined)
  if (cricdata["man-of-the-match"].pid.length > 0)
    manOfTheMatchPid = parseInt(cricdata["man-of-the-match"].pid);
  console.log(`Man of the match is ${manOfTheMatchPid} as per cric api ${cricdata["man-of-the-match"]}`)

  var allplayerstats = await tournamentStat.find({mid: mmm.mid});
  // update bowling details
  //console.log("Bowlong Started");
  // console.log(bowlingArray);
  bowlingArray.forEach( x => {
    x.scores.forEach(bowler => {
      // ***********************  IMP IMP IMP ***********************
      // some garbage records are sent by cricapi. Have found that in all these case Overs ("O") 
      // was set as "Allrounder", "bowler" "batsman".
      // ideally it should have #overs bowled i.e. numeric
      if (isNaN(bowler.O)) {
        //console.log(`Invalid Over ${bowler.O}. Skipping this recird`);
        return;
      }

      myindex = _.findIndex(allplayerstats, {mid: currMatch, pid: parseInt(bowler.pid)});
      if (myindex < 0) {
        var tmp = getBlankStatRecord(tournamentStat);
        tmp.mid = currMatch;
        tmp.pid = bowler.pid;
        tmp.playerName = bowler.bowler;
        allplayerstats.push(tmp);
        myindex = allplayerstats.length - 1;
      }
      allplayerstats[myindex].wicket = (bowler.W === undefined) ? 0 : bowler.W;
      allplayerstats[myindex].wicket5 = (bowler.W >= 5) ? 1 : 0;
      allplayerstats[myindex].wicket3 = ((bowler.W >= 3) && (bowler.W < 5)) ? 1 : 0;
      allplayerstats[myindex].hattrick = 0;
      allplayerstats[myindex].maiden = (bowler.M === undefined) ? 0 : bowler.M
      allplayerstats[myindex].maxTouramentRun = 0;
      allplayerstats[myindex].maxTouramentWicket = 0;
      console.log(`Wicket by ${allplayerstats[myindex].pid} : ${allplayerstats[myindex].wicket}`)
      if (!(bowler.O === undefined)) {
        var i = parseInt(bowler.O);
        if (isNaN(i))
          allplayerstats[myindex].oversBowled = 0;
        else
          allplayerstats[myindex].oversBowled = bowler.O;
      }
      if (allplayerstats[myindex].pid === manOfTheMatchPid)
        allplayerstats[myindex].manOfTheMatch = true;
      
      var myscore = calculateScore(allplayerstats[myindex]);
      allplayerstats[myindex].score = myscore;
    });
  });

  // update batting details
  // console.log("Batting started");
  // console.log(battingArray);
  battingArray.forEach( x => {
    x.scores.forEach(batsman => {
      myindex = _.findIndex(allplayerstats, {mid: currMatch, pid: parseInt(batsman.pid)});
      if (myindex < 0) {
        var tmp = getBlankStatRecord(tournamentStat);
        tmp.mid = currMatch;
        tmp.pid = batsman.pid;
        tmp.playerName = batsman.batsman;
        allplayerstats.push(tmp);
        myindex = allplayerstats.length - 1;
      }
      allplayerstats[myindex].run = (batsman.R === undefined) ? 0 : batsman.R;
      allplayerstats[myindex].fifty = ((batsman.R >= 50) && (batsman.R < 100)) ? 1 : 0;
      allplayerstats[myindex].hundred = (batsman.R >= 100) ? 1 : 0;
      allplayerstats[myindex].four = (batsman["4s"] === undefined) ? 0 : batsman["4s"];
      allplayerstats[myindex].six = (batsman["6s"] === undefined) ? 0 : batsman["6s"];
      allplayerstats[myindex].maxTouramentRun = 0;
      allplayerstats[myindex].maxTouramentWicket = 0;

      console.log(`Runs by ${allplayerstats[myindex].pid} : ${allplayerstats[myindex].run}`)

      if (!(batsman.B === undefined)) {
        var i = parseInt(batsman.B);
        if (isNaN(i))
          allplayerstats[myindex].ballsPlayed = 0;
        else
        allplayerstats[myindex].ballsPlayed = i;
      }
      if (allplayerstats[myindex].pid === manOfTheMatchPid) {
        allplayerstats[myindex].manOfTheMatch = true;
        console.log(`Man of the match is ${allplayerstats[myindex].pid}`);
      }

      var myscore = calculateScore(allplayerstats[myindex]);
      allplayerstats[myindex].score = myscore;
      //console.log(`Score; ${myscore} `);
    });
  });

  // update statistics in mongoose
  //console.log(allplayerstats.length);
  //console.log("Saveing statsu");
  allplayerstats.forEach(ps => {
    ps.save();
  })

  return;
}


function getMatchDetails(cricapiRec, mymatch, tournamentName) {
  var stime = getMatchStartTime(cricapiRec);
  var etime = getMatchEndTime(cricapiRec);
  var myweekday = weekDays[stime.getDay()];
  
  //var tmp = new CricapiMatch({
    mymatch.mid = cricapiRec.unique_id;
    mymatch.tournament = tournamentName;
    mymatch.team1 = cricapiRec['team-1'].toUpperCase();
    mymatch.team2 = cricapiRec['team-2'].toUpperCase();
    // mymatch.team1Description = cricapiRec['team-1'];
    // mymatch.team2Description = cricapiRec['team-2'];
    mymatch.matchStartTime = stime;
    mymatch.weekDay = myweekday;
    mymatch.type = cricapiRec.type;
    //toss_winner_team: "",   //x.toss_winner_team, 
    mymatch.squad = cricapiRec.squad;
    mymatch.matchStarted = cricapiRec.matchStarted;
    mymatch.matchEndTime = etime;
    var currtime = new Date();
    if (etime < currtime)
      mymatch.matchEnded = true;
    else
      mymatch.matchEnded = false;
    //if (mymatch.mid === 1198246) mymatch.matchEnded = false;
    //console.log(`Match-ID: ${mymatch.mid}  Started: ${mymatch.matchStarted}  Ended: ${mymatch.matchEnded}`)
    return mymatch;
}


function getBlankStatRecord(tournamentStat) {
  return new tournamentStat( {
    mid: 0,
    pid: 0,
    score: 0,
    inning: 0,
    playerName: "",
  // batting details
    run: 0,
    four: 0,
    six: 0,
    fifty: 0,
    hundred:  0,
    ballsPlayed: 0,
    // bowling details
    wicket: 0,
    wicket3: 0,
    wicket5: 0,
    hattrick: 0,
    maiden: 0,
    oversBowled: 0,
    maxTouramentRun: 0,
    maxTouramentWicket: 0,
    // overall performance
    manOfTheMatch: false
  });
}

function calculateScore(mystatrec) {
  //console.log(mystatrec);
  var mysum = 0;
  mysum += 
    (mystatrec.run * BonusRun) +
    (mystatrec.four * Bonus4) +
    (mystatrec.six * Bonus6) +
    (mystatrec.fifty * Bonus50) +
    (mystatrec.hundred * Bonus100) +
    (mystatrec.wicket * BonusWkt) +
    (mystatrec.wicket3 * BonusWkt3) +
    (mystatrec.wicket5 * BonusWkt5) +
    (mystatrec.maiden * BonusMaiden) +
    //((mystatrec.wicket == 0) ? BonusDuck : 0) +
    ((mystatrec.manOfTheMatch) ? BonusMOM : 0) + 
    ((mystatrec.maxTouramentRun > 0) ? BonusMaxRun : 0) +
    ((mystatrec.maxTouramentWicket > 0) ?  BonusMaxWicket : 0);

    // if ((mystatrec.ballsPlayed > 0) && (mystatrec.run == 0))
    //   mysum += BonusDuck;

    // if ((mystatrec.oversBowled > 0) && mystatrec.wicket == 0)
    //   mysum += BonusNoWkt;

  //console.log(`sum is ${mysum}`);
  return  mysum
}


// get details of match (batting and bowling)
async function fetchMatchStatsFromCricapi(matchId) { // (1)
  let cricres = await fetch(get_cricapi_MatchDetails_URL(matchId)); 

  if (cricres.status == 200) {
    let json = await cricres.json(); // (3)
    return json;
  }
  console
  throw new Error(cricres.status);
}

// get match details from cricapi
async function fetchMatchesFromCricapi() {
  let matchres = await fetch(  get_cricapiMatchInfo_URL() );
  
  if (matchres.status == 200) { 
    let json = await matchres.json(); // (3)
    return json;
  }
  throw new Error(matchres.status); 
}

async function sendMatchInfoToClient(igroup, doSendWhat) {
  // var igroup = _group;
  var currTime = new Date();
  currTime.setDate(currTime.getDate())
  var myGroup = await IPLGroup.find({"gid": igroup})
  var myMatches = await CricapiMatch.find({tournament: myGroup[0].tournament});

  var currMatches = _.filter(myMatches, x => _.gte (currTime, x.matchStartTime) && _.lte(currTime,x.matchEndTime));
  var upcomingMatch = _.find(myMatches, x => _.gte(x.matchStartTime, currTime));

  if (doSendWhat === SENDRES) {
    sendok(currMatches);
    console.log(upcomingMatch);
  } else {
    const socket = app.get("socket");
    socket.emit("currentMatch", currMatches)
    socket.broadcast.emit('curentMatch', currMatches);
    socket.emit("upcomingMatch", upcomingMatch)
    socket.broadcast.emit('upcomingMatch', upcomingMatch);
  }
}

async function sendDashboardData() {
  var gidList = _.map(connectionArray, 'gid');
  var gidList = _.uniqBy(gidList);
  clientData = [];

  // console.log(gidList);
  for(i=0; i<gidList.length; ++i)  {
    var myTournament = await getTournameDetails(gidList[i]);
    if (myTournament.length === 0) continue;
    // console.log(myTournament);
    var myData = _.find(clientData, x => x.tournament === myTournament);
    var sts = false;
    if (!myData) {
      sts = await readDatabase(gidList[i]);
      // console.log(`Status is ${sts}`);
      if (!sts) continue;
      let myDB_Data = await statCalculation(gidList[i]);
      let mySTAT_Data = await statBrief(gidList[i], 0 , SENDSOCKET);
      myData = {tournament: myTournament, dbData: myDB_Data, statData: mySTAT_Data}
      clientData.push(myData);
    }

    let sockList = _.filter(connectionArray, x => x.page === "DASH" && x.gid === gidList[i]);
    sockList.forEach(x => {
      io.to(x.socketId).emit('rank', myData.dbData.rank);
      io.to(x.socketId).emit('maxRun', myData.dbData.maxRun);
      io.to(x.socketId).emit('maxWicket', myData.dbData.maxWicket);
      console.log("Sendt data to " + x.socketId);
    })

    sockList = _.filter(connectionArray, x => x.page === "STAT" && x.gid === gidList[i]);
    sockList.forEach(x => {
      io.to(x.socketId).emit('brief', myData.statData);
      console.log("Sent statistics to " + x.socketId);
    })
  }
}

// schedule task
cron.schedule('*/1 * * * * *', () => {
  if (!db_connection) {
    console.log("============= No mongoose connection");
    return;
  }   

  if (++clientUpdateCount > CLIENTUPDATEINTERVAL) {
    // console.log("Updateing of these connection");
    console.log(connectionArray);
    sendDashboardData();
    clientUpdateCount = 0;
  }

  // cricTimer += count;
  // if (++cricTimer >= cricUpdateInterval) {
  //   cricTimer = 0;
  //   console.log("TIme to getch cric data");
  //   update_cricapi_data_r1(false);
  // }


  // serverTimer += count;
  // if (serverTimer >= serverUpdateInterval) {
  //   serverTimer = 0;
  //   console.log("Time toi send send to data to server")
  //   console.log(myDashboardGroup);
  //   // var x = 1;
  //   myDashboardGroup.forEach( x => {
  //     statMax(x, 0, doMaxRun, SENDSOCKET);
  //     statMax(x, 0, doMaxWicket, SENDSOCKET);
  //     statRank(x, 0, SENDSOCKET);
  //     statBrief(x, 0, SENDSOCKET);
  //     // sendMatchInfoToClient(x, SENDSOCKET);
  //   })
  // }
  // else {    
  //   sendMyStat = false;
  //   sendDashboard = false;
  //   if (sendMyStat) {
  //     console.log(`send My stat ${sendMyStat}`)
  //     sendMyStat = false;
  //     myStatGroup.forEach( x => {
  //       console.log(`Sending stat of group ${x}`)
  //       statBrief(x, 0, SENDSOCKET);
  //     })
  //   }
    
  //   if (sendDashboard) {
  //     sendDashboard = false;
  //     myDashboardGroup.forEach( x => {
  //       console.log(`Sending dashboard of group ${x}`)
  //       statMax(x, 0, doMaxRun, SENDSOCKET);
  //       statMax(x, 0, doMaxWicket, SENDSOCKET);
  //       statRank(x, 0, SENDSOCKET);
  //       // sendMatchInfoToClient(x, SENDSOCKET);
  //     })
  //   }
  // }
});


var keyIndex = 0;
function nextapikey() {
  if (++keyIndex >= keylist.length) 
    keyIndex = 0;
  console.log(`Key used is ${keylist[keyIndex]}`);
  return keylist[keyIndex];
}

// function to generate URL for data fetch from cric api
function get_cricapiMatchInfo_URL()
{ 
  return cricapiMatchInfo_prekey + nextapikey() + cricapiMatchInfo_postkey
}

function get_cricapi_MatchDetails_URL(matchid)
{
  return cricapi_MatchDetails_prekey + nextapikey() + cricapi_MatchDetails_postkey + matchid;
}

// time based functions:

function timeToFetchMatches() {
  var currtime = new Date();
  //console.log(`Next FetchTime: ${nextMatchFetchTime}`);
  if (currtime >= nextMatchFetchTime)
    return true;
  else
    return false;
}

// not used now. obsolete
function tomorrowFetchTime() {
  const tomorrowAtHours = 7;
  var newdt = new Date();
  newdt.setDate(newdt.getDate() + 1);
  newdt.setHours(tomorrowAtHours);
  newdt.setMinutes(0);
  newdt.setSeconds(0);
  return newdt;
}


function updateMatchFetchTime(provider) {
  var newdt;
  /**
  //console.log(`Published date is ${provider.pubDate}`);
  if (isItToday(provider.pubDate)) {
    // if match data received today then set it for tomorrow at 7
    newdt = tomorrowFetchTime();
  } else {
    // advance match fetch time by 3 hours
    // if end of day then set it to tomorrow at 7
    var newhr = nextMatchFetchTime.getHours() + 3;
    if (newhr > 23) {
      newdt = tomorrowFetchTime();
    } else {
      newdt = new Date();     //(nextMatchFetchTime.getTime());
      newdt.setHours(newhr);
      newdt.setMinutes(0);
      newdt.setSeconds(0);
    }
  }
  */
  //nextMatchFetchTime = newdt;

  nextMatchFetchTime.setHours(nextMatchFetchTime.getHours() + MATCHREADINTERVAL);
  console.log(`New match fetch fime is ${nextMatchFetchTime}`);
}


// if the date is today. Ignore 
function isItToday(mytimestr) {
  //console.log(`String: ${mytimestr}`);

  var currtime = new Date();
  var mytime = new Date(mytimestr);
  console.log(`=============> Time String: ${mytimestr}  Date: ${mytime}`);
  var sts = (
    (currtime.getFullYear() === mytime.getFullYear()) && 
    (currtime.getMonth() === mytime.getMonth()) && 
    (currtime.getDate() === mytime.getDate()))
  //console.log(`${mytime} is today: ${sts}`);
  return sts;
}

function getMatchStartTime(cricapiRec) {
  var mytime = new Date(cricapiRec.dateTimeGMT);        // clone start date
  //mytime.setMinutes(mytime.getMinutes() + minutesIST);
  return mytime;
}

const OdiHours = 9;
const testHours = 9;
const t20Hours = 5;

function getMatchEndTime(cricapiRec) {
  var tmp = getMatchStartTime(cricapiRec);       // clone start date
  var etime = new Date(tmp.getTime());
  var matchHours;

  var typeUpper = cricapiRec.type.toUpperCase();
  // if test match advance date by 4 days (to make it 5th day)
  if (typeUpper.includes("TEST")) {
    etime.setDate(etime.getDate()+4);     // test match is for 5 days. set date to 5th day
    matchHours = testHours;
  } else if (typeUpper.includes("ODI")) {
    matchHours = OdiHours;
  } else if (typeUpper.includes("20")) {
    matchHours = t20Hours;
  } else
    matchHours = OdiHours;

  // addd match time to end date
  etime.setHours(etime.getHours() + matchHours);

  return etime;
}

async function publish_stats()
{
  // Set collection name 
  var tournamentStat = mongoose.model(_tournament, StatSchema);
  var statList = await tournamentStat.find({});
  sendok(statList);
  // //console.log(filter_stats);
  // Stat.find(filter_stats,(err,slist) =>{
  //   if(slist) sendok(slist);
  //   else      senderr(DBFETCHERR, "Unable to fetch statistics from database");
  // });
}

async function tournamentOver(groupno) {
  var myrec = await IPLGroup.findOne({gid: groupno});
  var tournamentName = myrec.tournament;
  var tRec = await Tournament.findOne({name: tournamentName});
  if (myrec)
    return (myrec.enabled == false);
  return;
}

async function get_userDisplayName(userId) {
  var myuser = "";
  var myrec = await User.findOne({uid: userId});
  if (myrec) 
    myuser = myrec.displayName;
  return myuser;
}

function sendok(usrmsg) { PlayerStatRes.send(usrmsg); }
function senderr(errcode, errmsg) { PlayerStatRes.status(errcode).send(errmsg); }
function setHeader() {
  PlayerStatRes.header("Access-Control-Allow-Origin", "*");
  PlayerStatRes.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  _group = 1;
  _tournament = "IPL2020";

}
module.exports = router;