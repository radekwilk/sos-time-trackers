//TIMERS APP CONTROLER
var timerController = (function () {

  var TimeStart = function (id, timeStart, timeStartCalc, timePaid, timePaidCalc, timeStop, timeStopCalc) {
    this.id = id;
    this.timeStart = timeStart;
    this.timeStartCalc = timeStartCalc;
    this.timePaid = timePaid;
    this.timePaidCalc = timePaidCalc;
    this.timeStop = timeStop;
    this.timeStopCalc = timeStopCalc;
    this.OTDTime = -1;
    this.serviceTime = -1;
  };


  var calculateTotal = function (type) {
    var sumTotStart = 0;
    var sumTotOTD = 0;
    var sumTotService = 0;
    var numOfCust = 0;

    data.serviceTimes[type].forEach(function (cur) {
      
      if(cur.timeStopCalc > 0) {
        sumTotStart = sumTotStart + cur.timeStartCalc;
        sumTotOTD = sumTotOTD + cur.timePaidCalc;
        sumTotService = sumTotService + cur.timeStopCalc;
        numOfCust++;
      }

    });
    data.totals.totalStartTime = sumTotStart;
    data.totals.totalOTDTime = sumTotOTD;
    data.totals.totalServiceTime = sumTotService;
    data.totals.totalCustomers = numOfCust;
    // data.totals.totalCustomers = data.serviceTimes[type].length;
  };

  var data = {
    serviceTimes: {
      kfc: [],
      kfc_DT: [],
      kfc_HD: [],
      bk: [],
      ph: []
      // startQ: [],
      // finishPay: [],
      // receivedFood: [],
      // isActive: fasle/true
    },
    totals: {
      totalCustomers: 0,
      totalStartTime: 0,
      totalOTDTime: 0, // Order to Delivery service time
      totalServiceTime: 0 // total service time, from the time of tcustomer joining the queue
    },
    averageOTD: 0,
    averageService: 0
  };

  return {
    addNewCustomer: function (type, timeStr, timeStartCalc, timePaid, timePaidCalc, timeStop, timeStopCalc) {
      var newCustomer, ID;
      ID = 0;
      //create new customer based on time check type (i.e kfc)
      if (data.serviceTimes[type].length > 0) {
        ID = data.serviceTimes[type][data.serviceTimes[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // if (type === 'kfc' || type === 'kfc_DT' || type === 'kfc_HD' || || type === 'bk') { 
        if (type) {// this can be updated later for other time check. i.e BK or PH
        newCustomer = new TimeStart(ID, timeStr, timeStartCalc, timePaid, timePaidCalc, timeStop, timeStopCalc);
      }
      //push it into data structure
      data.serviceTimes[type].push(newCustomer);

      //return new element
      return newCustomer;
    },

    addNewOven: function (type, panIn, panInCalc, panOut, panOutCalc, actSpeed, actSpeedCalc, deck, timeDiff, speedSet, speedSetCalc) {
      var newOvenDeck, ID;
      ID = 0;
      //create new ovens deck
      if (data.serviceTimes[type].length > 0) {
        ID = data.serviceTimes[type][data.serviceTimes[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
        if (type) {
        newOvenDeck = new OvenStart(ID, panIn, panInCalc, panOut, panOutCalc, actSpeed, actSpeedCalc, deck, timeDiff, speedSet, speedSetCalc);
      }
      //push it into data structure
      data.serviceTimes[type].push(newOvenDeck);

      //return new element
      return newOvenDeck;
    },

    deleteItem: function (type, id) {
      var ids, index;

      ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.serviceTimes[type].splice(index, 1);
      }

    },


    calculateTotalTime: function (type) {
      var sosType, OTDTime, startTime, serviceTime, finishTime,custNum;

      //calculate sum of total service time
      calculateTotal(type);
      // calculate the time variance between trans start and finish

      sosType = type;
      custNum = data.totals.totalCustomers;
      startTime = data.totals.totalStartTime;
      OTDTime = data.totals.totalOTDTime;
      serviceTime = data.totals.totalServiceTime;

      if (custNum > 0) {
        data.averageOTD = (serviceTime - OTDTime) / custNum;
        data.averageService = (serviceTime - startTime) / custNum;
      } else {
        data.averageOTD = 0;
        data.averageService = 0;
      }

      return {
        sosType: sosType,
        avgOTD: data.averageOTD,
        avgService: data.averageService,
        custNum: data.totals.totalCustomers
      }
    },

    calculateOTDandServiceTime: function (type, id) {
      var ids, index, newTime;

      ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);
      newTime = Date.parse(moment().format());

      if (index !== -1) {
        data.serviceTimes[type][index].timePaidCalc = newTime;
        data.serviceTimes[type][index].timePaid = moment(newTime).format('hh:mm:ss');
      }

    },

    calculateFinishAndServiceTime: function (type, id) {
      var ids, index, newTime, newOTD, newTotalService, stopTime, paidTime, startTime, setTime, diffTime, actTime, newActTime;

      ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);
      newTime = Date.parse(moment().format());

      if (index !== -1) {

        if(type === 'ph') {
          // calculates time when pan is outerHeight, getting it in miliseconds and time format
          data.serviceTimes[type][index].panOutCalc = newTime;
          data.serviceTimes[type][index].panOut = moment(newTime).format('hh:mm:ss');

          // settings variables based on pan in time, pan out time and ovens speed settings
          stopTime = data.serviceTimes[type][index].panOutCalc; // when pan is out
          setTime = data.serviceTimes[type][index].settingsCalc; // ovens speed settings
          startTime = data.serviceTimes[type][index].panInCalc;  // when pan is in

          // it calculates actual ovens speed
          actSpeedCalc = stopTime - startTime;
          data.serviceTimes[type][index].actSpeedCalc = actSpeedCalc;
          data.serviceTimes[type][index].actSpeed = moment(actSpeedCalc).format('mm:ss');

          // it calculates what is difference between actual speed and its settings
          diffTime = setTime - (stopTime - startTime);
          // insert calculated value into our data structure
          data.serviceTimes[type][index].timeDiff = diffTime;

        } else {
          // for all other accounts except pizza hut
          data.serviceTimes[type][index].timeStopCalc = newTime;
          data.serviceTimes[type][index].timeStop = moment(newTime).format('hh:mm:ss');

          stopTime = data.serviceTimes[type][index].timeStopCalc;
          paidTime = data.serviceTimes[type][index].timePaidCalc;
          startTime = data.serviceTimes[type][index].timeStartCalc;

          newOTD = stopTime - paidTime;
          newTotalService = stopTime - startTime;

          data.serviceTimes[type][index].OTDTime = newOTD;
          data.serviceTimes[type][index].serviceTime = newTotalService;
        }
        

      }

    },

    getOvenSpeed: function(type,id) {
       var ids, index, checkPannIn, checkPanOut;

       ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      checkPanIn = data.serviceTimes[type][index].panInCalc;
      checkPanOut = data.serviceTimes[type][index].panOutCalc;

      return {
        sosType: type,
        ovenSettings: data.serviceTimes[type][index].settingsCalc,
        panInTime: data.serviceTimes[type][index].panInCalc,
        panOutTime: data.serviceTimes[type][index].panOutCalc,
        actSpeedCalc: data.serviceTimes[type][index].actSpeedCalc,
        timeDiff: data.serviceTimes[type][index].timeDiff,
        deckNo: data.serviceTimes[type][index].deck,
        ovenID: id
      };

    },

    getServiceTimes: function (type, id) {
      var ids, index, checkPaidTime, checkFinishTime;

      ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

        checkPaidTime = data.serviceTimes[type][index].timePaidCalc;
        checkFinishTime = data.serviceTimes[type][index].timeStopCalc;
      
      return {
        sosType: type,
        serviceTime: data.serviceTimes[type][index].serviceTime,
        OTDTime: data.serviceTimes[type][index].OTDTime,
        startTime: data.totals.totalStartTime,
        averageOTD: data.averageOTD,
        averageService: data.averageService,
        customers: data.totals.totalCustomers,
        paidTime: data.serviceTimes[type][index].timePaid,
        paidTimeCalc: data.serviceTimes[type][index].timePaidCalc,
        finishTime: data.serviceTimes[type][index].timeStop,
        finishTimeCalc: data.serviceTimes[type][index].timeStopCalc,
        custID: id
      };
    },

    getDeck: function(type, id) {
      var ids, index, delDeck;

      ids = data.serviceTimes[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      delDeck = data.serviceTimes[type][index].deck;
      return delDeck;
    },

    // this will be needed when delating lines, it checks what is an ID of first available position in data 
    getCellZero: function(type) {
      var cellZero = data.serviceTimes[type][0].id;
      return cellZero;
    },

    testing: function () {
      console.log(data);
    }
  };


})();

// User Interface controller
var UIController = (function () {
  var DOMStrings = {
    startBtn: 'start',
    totalTime: 'total__time',
    kfcTimeTableContainer: '.kfc__timesList',
    kfcDTTableContainer: '.kfc__DT_List',
    kfcHDTableContainer: '.kfc__HD_List',
    description: "description",
    serviceTime: 'serviceTime',
    totalServiceTime: 'totalServiceTime',
    kfcTimesList: '.kfc__timesList', // holding div for kfc front counter timers
    kfcDTTimesList: '.kfc__DT_List', // holding div for kfc DT timers
    kfcHDTimesList: '.kfc__HD_List', // holding div for kfc home delivery timers
    bkTimesList: '.bk_List', // holding div for burger king front counter timers
    phTimesList: '.ph_List', // holding div for pizza hut ovens belt speed
    paidTime: 'paid__time',
    paidTimeIcon: 'paid',
    finishTime: 'stop__time',
    finishTimeIcon: 'stop',
    otdTime: 'otd__time',
    totalTime: 'total__time',
    timerServiceTime: 'timer__serviceTime',
    timerTotalTime: 'timer__totalTime',
    totalCustomers: 'totalCustomers',
    startDTBtn: 'start__DT',  // new DT customer
    startHDBtn: 'start__HD' ,  // new Home delvery driver
    startBKBtn: 'start__BK',   // new BUrger King customer
    startPHBtn_top: 'start__ph_top',  //  pizza hut oven - top deck
    startPHBtn_mdl: 'start__ph_middle',   //  pizza hut oven - top deck
    startPHBtn_btm: 'start__ph_bottom',   //  pizza hut oven - top deck
    startPHBtn: 'start__ph', // this will be used as generic start button, addint top, middle or bottom danamically
    ph_speedSet: 'ph-speedSet', // ovens speed settings - will need to add top, middle or bottom at the end to select correct one
    phActSpeed: 'ph-actSpeed__time', // actual ovens speed
    phSpeedDiff: 'ph-difference__time', //difference between actual and set speed
    phCountdownTop: 'ph-countdown_top', //countdown for top deck
    phCountdownMiddle: 'ph-countdown_middle', //countdown for middle deck
    phCountdownBottom: 'ph-countdown_bottom', //countdown for bottom deck
    phAudio: 'myAudio' 
  };

  var kfcServiceTimes = {
    OTD_Time: 60000, //time in miliseconds = 60 seconds
    Total_time: 120000, //time in miliseconds = 120 (2 minutes) seconds
    Total_DT_time: 60000, // Drive thru time in miliseconds = 60 (1 min) seconds
    Total_HD: 300000, // home delivery time in miliseconds = 300 (5 minutes) seconds
    Total_BK_target: 120000, // Burger time in miliseconds = 120 (2 min 00 seconds) seconds => new time for BK front counter
    Max_BK_target: 150000 // BUrger King time  max in miliseconds = 150 (2 min 30 seconds) seconds => new max time for Burger King
    };

    var calculateSOSTargetTime = function(type) {
      var SOSTargetTime, bk_max;

      if(type === 'kfc') {
        SOSTargetTime = kfcServiceTimes.Total_time;
      } else if(type === 'kfc_DT') {
        SOSTargetTime = kfcServiceTimes.Total_DT_time;
      } else if(type === 'kfc_HD') {
        SOSTargetTime = kfcServiceTimes.Total_HD;
      } else if(type === 'bk') {
        SOSTargetTime = kfcServiceTimes.Total_BK_target;
        bk_max = kfcServiceTimes.Max_BK_target;
      }

      return  {
        SOSTargetTime: SOSTargetTime,
        bk_max: bk_max
      }

    };

    var getOvenSettings = function(deck) {
      var deckSetting;

      deckSetting = document.getElementById(DOMStrings.ph_speedSet + '_' + deck).value;
      return deckSetting;
      
    };

  return {
    getNewCustomer: function (type) {
      return {
        timeCheckType: type,
        timeStartCalc: Date.parse(moment().format()),
        timeStart: moment(this.timeStartCalc).format('hh:mm:ss'),
        timePaidCalc: 0,
        timePaid: 0,
        timeStopCalc: 0,
        timeStop: 0
      }

    },

      getNewCar: function (type) {
        return {
          timeCheckType: type,
          timeStartCalc: Date.parse(moment().format()),
          timeStart: moment(this.timeStartCalc).format('hh:mm:ss'),
          timePaidCalc: 0,
          timePaid: 0,
          timeStopCalc: 0,
          timeStop: 0
        }
  
      },

      getNewDelivery: function (type) {
        return {
          timeCheckType: type,
          timeStartCalc: Date.parse(moment().format()),
          timeStart: moment(this.timeStartCalc).format('hh:mm:ss'),
          timePaidCalc: 0,
          timePaid: 0,
          timeStopCalc: 0,
          timeStop: 0
        }
  
      },

      getNewOven: function (type,deck) {
        return {
          timeCheckType: type,
          panInCalc: Date.parse(moment().format()),
          panIn: moment(this.timeStartCalc).format('hh:mm:ss'),
          panOut: 0,
          panOutCalc: 0,
          speedSettings: getOvenSettings(deck),
          speedSettingsCalc: this.calcOvenSettings(deck).settingTime,
          actSpeed: 0,
          actSpeedCalc: 0,
          timeDiff: -1,
          deckNo: deck
        }
  
      },

      // this function calculates entered oven settings time and transformes it into miliseconds
      calcOvenSettings: function (deck) {
        var deckSettings, setMin, setSec, settingTime;
  
        deckSettings = getOvenSettings(deck);
  
        deckSettings = deckSettings.split(':');
        setMin = parseInt(deckSettings[0]);
        setSec = parseInt(deckSettings[1]);
        settingTime = (setMin * 60 * 1000) + (setSec * 1000);
  
        return {
          settingTime: settingTime,
          setSec: setSec
        };
      },

      callErrorMessage: function(errorType, msg) {
        bootbox.alert({
          title: errorType,
          message: msg,
          buttons: {
            ok: {
              className: 'btn-danger'
            }
            
          },
          size: 'large'
      });
      },

    addNewCustomerLine: function (obj, type) {
      var html, newHtml, element, elementID;
      //Create HTML string with placeholder text

      if (type === 'kfc') {
        element = DOMStrings.kfcTimeTableContainer;
        elementID = obj.id; // to be able to start new stopwatch
        html = '<div class="row py-1 info-container times-container" id="kfc-%id%"><div class="col-3 text-center align-content-center"><input type="text" class="form-control timer" placeholder="Customer description" id="kfc-description%id%"></div><div class="col-6"><div class="d-flex justify-content-between"><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer active" id="kfc-start__time%id%">%timeStart%</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc-paid__time%id%" hidden>Order time</p></div><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer" id="kfc-stop__time%id%">Time stop</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc-otd__time%id%" hidden>Window time</p></div><div class="col-4 text-center mr-4 mr-md-0"><p class="form-control timer totalTIme-small" id="kfc-total__time%id%">Service time</p></div></div></div><div class="col-3 text-center"><div class="d-flex justify-content-around"><div class="editBox" id="kfc-paid-%id%" hidden><i class="far fa-money-bill-alt"></i></div><div class="editBox" id="kfc-stop-%id%"><img src="./img/fried-chicken-meal.png" class="food-img"/></div><div class="editBox" id="kfc-trash-%id%"><img src="./img/bin.png" class="food-img"/></div></div></div></div></div>'; 
      }


      /* <i class="far fa-money-bill-alt"></i> */
      // <i class="fas fa-car-side"></i>
      // Drive thru Icons made by <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      if(type === 'kfc_DT') {
        element = DOMStrings.kfcDTTableContainer;
        elementID = obj.id; // to be able to start new stopwatch
        html = '<div class="row py-1 info-container times-container" id="kfc_DT-%id%"><div class="col-3 text-center align-content-center"><input type="text" class="form-control timer" placeholder="Customer description" id="kfc_DT-description%id%"></div><div class="col-6"><div class="d-flex justify-content-between"><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer active" id="kfc_DT-start__time%id%">%timeStart%</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc_DT-paid__time%id%" hidden>Order time</p></div><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer" id="kfc_DT-stop__time%id%">Time stop</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc_DT-otd__time%id%" hidden>Window time</p></div><div class="col-4 text-center mr-4 mr-md-0"><p class="form-control timer totalTIme-small" id="kfc_DT-total__time%id%">Service time</p></div></div></div><div class="col-3 text-center"><div class="d-flex justify-content-around"><div class="editBox" id="kfc_DT-paid-%id%" hidden><i class="far fa-money-bill-alt"></i></div><div class="editBox" id="kfc_DT-stop-%id%"><img src="./img/fried-chicken-meal.png" class="food-img"/></div><div class="editBox" id="kfc_DT-trash-%id%"><img src="./img/bin.png" class="food-img"/></div></div></div></div></div>'; 
      }


      // bike Icon made by <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      // <i class="fas fa-motorcycle"></i>  => motoerbike icon 
      if(type === 'kfc_HD') {
        element = DOMStrings.kfcHDTableContainer;
        elementID = obj.id; // to be able to start new stopwatch
        html = '<div class="row py-1 info-container times-container" id="kfc_HD-%id%"><div class="col-3 text-center align-content-center"><input type="text" class="form-control timer" placeholder="Driver description" id="kfc_HD-description%id%"></div><div class="col-6"><div class="d-flex justify-content-between"><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer active" id="kfc_HD-start__time%id%">%timeStart%</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc_HD-paid__time%id%" hidden>Order time</p></div><div class="col-6 col-md-4 d-none d-md-block text-center"><p class="form-control timer" id="kfc_HD-stop__time%id%">Time stop</p></div><div class="col-0 text-center"><p class="form-control timer" id="kfc_HD-otd__time%id%" hidden>Window time</p></div><div class="col-4 text-center mr-4 mr-md-0"><p class="form-control timer totalTIme-small" id="kfc_HD-total__time%id%">Service time</p></div></div></div><div class="col-3 text-center"><div class="d-flex justify-content-around"><div class="editBox" id="kfc_HD-paid-%id%" hidden><i class="far fa-money-bill-alt"></i></div><div class="editBox" id="kfc_HD-stop-%id%"><img src="./img/bicycle.png" class="food-img"/></div><div class="editBox" id="kfc_HD-trash-%id%"><img src="./img/bin.png" class="food-img"/></div></div></div></div></div>'; 
      }

      if(type === 'bk') {
        element = DOMStrings.bkTimesList;
        elementID = obj.id; // to be able to start new stopwatch
        // <i class="fas fa-hamburger"></i>
        //fast food burger Icon made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        html = '<div class="row py-1 info-container times-container" id="bk-%id%"><div class="col-3 text-center align-content-center"><input type="text" class="form-control timer" placeholder="Customer description" id="bk-description%id%"></div><div class="col-6"><div class="d-flex justify-content-between"><div class="col-4 text-center"><p class="form-control timer active" id="bk-start__time%id%">%timeStart%</p></div><div class="col-0 text-center"><p class="form-control timer" id="bk-paid__time%id%" hidden>Order time</p></div><div class="col-4 text-center"><p class="form-control timer" id="bk-stop__time%id%">Time stop</p></div><div class="col-0 text-center"><p class="form-control timer" id="bk-otd__time%id%" hidden>Window time</p></div><div class="col-4 text-center"><p class="form-control timer" id="bk-total__time%id%">Service time</p></div></div></div><div class="col-3 text-center"><div class="d-flex justify-content-around"><div class="editBox" id="bk-paid-%id%" hidden><i class="far fa-money-bill-alt"></i></div><div class="editBox" id="bk-stop-%id%"><img src="../img/fast-food-burger.png" class="food-img"/></div><div class="editBox" id="bk-trash-%id%"><img src="../img/bin.png" class="food-img"/></div></div></div></div></div>'; 
      }

      if(type === 'ph') {
        element = DOMStrings.phTimesList;
        elementID = obj.id; // to be able to start new stopwatch
        // <i class="fas fa-hamburger"></i>
        //fast food burger Icon made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        html = '<div class="row py-1 info-container times-container" id="ph-%id%"><div class="col-3 text-center d-flex justify-content-between"><div class="col-5 text-center "><p class="form-control timer" id="%deck%-%id%">%deck%</p></div><div class="col-7 text-center "><p class="form-control timer">%settings%</p></div><input type="text" class="form-control timer" placeholder="Customer description" id="ph-description%id%" hidden></div><div class="col-6"><div class="d-flex justify-content-between"><div class="col-3 text-center"><p class="form-control timer active" id="ph-start__time%id%">%panIn%</p></div><div class="col-0 text-center"><p class="form-control timer" id="ph-paid__time%id%" hidden>Pan out</p></div><div class="col-3 text-center"><p class="form-control timer" id="ph-stop__time%id%">Pan out</p></div><div class="col-3 text-center"><p class="form-control timer" id="ph-actSpeed__time%id%" >Ovens speed</p></div><div class="col-3 text-center"><p class="form-control timer" id="ph-difference__time%id%">Difference</p></div></div></div><div class="col-3 text-center"><div class="d-flex justify-content-around"><div class="editBox" id="ph-paid-%id%" hidden><i class="far fa-money-bill-alt"></i></div><div class="editBox" id="ph-stop-%id%"><!-- <i class="fas fa-pizza-slice"></i> --><img src="../img/pizza.png" class="food-img"/></div><div class="editBox" id="ph-trash-%id%"><img src="../img/bin.png" class="food-img"/></div></div></div></div>'; 
      }

       

      //Replace the placeholder text with some actual data

      newHtml = html.replace(/%id%/g, obj.id); //it finds all IDs and then  replaces it with current ID.

      if(type === 'ph') {
        newHtml = newHtml.replace('%panIn%', obj.panIn);
        newHtml = newHtml.replace(/%deck%/g, obj.deck);
        newHtml = newHtml.replace('%settings%', obj.settings);
      } else {
        newHtml = newHtml.replace('%timeStart%', obj.timeStart);
      }
      

      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      return elementID;
    },

    deleteTimesItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    focusOnNewFild: function (fieldID, type) {
      var fields;

      fields = document.getElementById(type + '-' + DOMStrings.description + fieldID);
      fields.focus();
    },

    focusOnSpeedSet: function (deck) {
      var fields;

      fields = document.getElementById(DOMStrings.ph_speedSet + '_' + deck);
      fields.focus();
    },

    convertToTime: function (timeVal) {
      var hours;
      var minutes;
      var seconds;
      var milliseconds;

      // var days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor((timeVal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((timeVal % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((timeVal % (1000 * 60)) / 1000);
      milliseconds = Math.floor((timeVal % (1000 * 60)) / 100);

      return {
        hours: (hours < 10) ? "0" + hours : hours,
        minutes: (minutes < 10) ? "0" + minutes : minutes,
        seconds: (seconds < 10) ? "0" + seconds : seconds
      }

    },

    changeBackground_onTarget: function(bgdID) {
      document.getElementById(bgdID).classList.remove('timeOverTarget');
      document.getElementById(bgdID).classList.remove('timeBetweenTarget');
      document.getElementById(bgdID).classList.add('timeOnTarget');
    },

    changeBackground_offTarget: function(bgdID) {
      document.getElementById(bgdID).classList.remove('timeOnTarget');
      document.getElementById(bgdID).classList.remove('timeBetweenTarget');
      document.getElementById(bgdID).classList.add('timeOverTarget');
    },

    changeBackground_betweenTarget: function(bgdID) {
      document.getElementById(bgdID).classList.remove('timeOnTarget');
      document.getElementById(bgdID).classList.remove('timeOverTarget');
      document.getElementById(bgdID).classList.add('timeBetweenTarget');
    },



    timeCompleted: function(bgdID) {
      bgdID.classList.add('timeChecked');
    },

    displayCountdownBtn: function(deck) {
      if(deck === 'top') {
        counterID = DOMStrings.phCountdownTop;
        element = DOMStrings.startPHBtn_top;
      } else if(deck === 'middle') {
        counterID = DOMStrings.phCountdownMiddle;
        element = DOMStrings.startPHBtn_mdl;
      } else if(deck === 'bottom') {
        counterID = DOMStrings.phCountdownBottom;
        element = DOMStrings.startPHBtn_btm;
      }

       // making deckbutton disabled - avoiding clicking same button at all the time
       document.getElementById(element).classList.toggle('icon-disabled');

       return counterID;
    },

    dispalyTimesUI: function(obj) {
      var sosType, element, finalOTD, finalServiceTime, elOTD, elService, totCustomers;

      elOTD = DOMStrings.serviceTime;
      elService = DOMStrings.totalServiceTime;
      sosType = obj.sosType;

      finalOTD = this.convertToTime(obj.avgOTD).minutes + ':' + this.convertToTime(obj.avgOTD).seconds;
      
      element = sosType + '-' + DOMStrings.serviceTime;
      document.getElementById(element).textContent = finalOTD;
      
      finalServiceTime = this.convertToTime(obj.avgService).minutes + ':' + this.convertToTime(obj.avgService).seconds;
      element = sosType + '-' + DOMStrings.totalServiceTime;
      document.getElementById(element).textContent = finalServiceTime;

      totCustomers = obj.custNum;
      element = sosType + '-' + DOMStrings.totalCustomers;
      document.getElementById(element).textContent = totCustomers;
    },

    displayOvenSpeed: function(obj) {
      var elID, sosType, element, speedDiff, finalSpeedDiff, elDiff, actSpeed, finalActSpeed, panOut, panIn, finalPanOut, speedDiffAbs;

      elID = obj.ovenID;
      sosType = obj.sosType;
      elDiff = obj.timeDiff;
      speedDiff = obj.timeDiff;
      actSpeed = obj.actSpeedCalc;
      panOut = obj.panOutTime;
      panIn = obj.panInCalc;

      // converting speed difference to positive number
      speedDiffAbs = Math.abs(speedDiff);


      // if speed variance is posotive or negative
      if(speedDiff < 0) {
        // if variance is negative
        speedDiff = Math.abs(speedDiff);
        finalSpeedDiff = '- ' + this.convertToTime(speedDiff).minutes + ':' + this.convertToTime(speedDiff).seconds;
      // if variance is positive
      } else {
        finalSpeedDiff = this.convertToTime(speedDiff).minutes + ':' + this.convertToTime(speedDiff).seconds;
      }

      finalActSpeed = this.convertToTime(actSpeed).minutes + ':' + this.convertToTime(actSpeed).seconds;
      finalPanOut = moment(panOut).format('hh:mm:ss'),

      // display time when pan is out
      element = sosType + '-' + DOMStrings.finishTime + elID;
      document.getElementById(element).textContent = finalPanOut;

      // display actual belt speed
      element = DOMStrings.phActSpeed + elID;
      document.getElementById(element).textContent = finalActSpeed;

      // display difference between act and set speed
      element = DOMStrings.phSpeedDiff + elID;
      document.getElementById(element).textContent = finalSpeedDiff;

// it checks if difference between actual speed and set speed is more than 10 seconds (1 sec = 1000 miliseconds)
      if(speedDiffAbs > 10000) {
        element = DOMStrings.phSpeedDiff + elID;
        this.changeBackground_offTarget(element);
      } else {
        element = DOMStrings.phSpeedDiff + elID;
        this.changeBackground_onTarget(element);
      }

    },


    displayServiceTimes: function (obj) {
      var serviceTime_target, serviceTime_max, element, sosType, elementID, elementOTD, elementTotalTime, calcOTD, calcTotServTime, avgOTD, avgService, paidTime, paidTimeCalc, finishTime, finishTimeCalc, custID;

      sosType = obj.sosType;
      paidTimeCalc = obj.paidTimeCalc;
      paidTime = obj.paidTime;
      finishTimeCalc = obj.finishTimeCalc;
      finishTime = obj.finishTime;
      custID = obj.custID;
      serviceTime_target = calculateSOSTargetTime(sosType).SOSTargetTime;
      serviceTime_max = calculateSOSTargetTime(sosType).bk_max;


      avgOTD = this.convertToTime(obj.averageOTD).minutes + ':' + this.convertToTime(obj.averageOTD).seconds;

      avgService = this.convertToTime(obj.averageService).minutes + ':' + this.convertToTime(obj.averageService).seconds;


// if sosTyp is different than Pizza Hut, check the average Order to delivery time
      if(sosType !== 'ph') {
        if (avgOTD) {
          element = sosType + '-' +  DOMStrings.serviceTime;
          document.getElementById(element).textContent = avgOTD;
          elementOTD = sosType + '-' + DOMStrings.timerServiceTime;
            // if(obj.averageOTD > kfcServiceTimes.OTD_Time) {
            //   this.changeBackground_offTarget(elementOTD);
            // } else {
            //   this.changeBackground_onTarget(elementOTD);
            // }
        } else {
          element = sosType + '-' +  DOMStrings.serviceTime;
          document.getElementById(element).textContent = '---';
          this.changeBackground_onTarget(elementOTD);
        }
      }
          
// if sosTyp is different than Pizza Hut, check the average Service time
      if(sosType !== 'ph') {
        if (avgService) {
          element = sosType + '-' +  DOMStrings.totalServiceTime;
          document.getElementById(element).textContent = avgService;
          elementOTD = sosType + '-' + DOMStrings.timerTotalTime;

          if(sosType === 'bk') {
            if(obj.averageService > serviceTime_max) {
              this.changeBackground_offTarget(elementOTD);
            }else if(obj.averageService > serviceTime_target && obj.averageService < serviceTime_max) {
              this.changeBackground_betweenTarget(elementOTD);
              // console.log('Option 1. Time between targets.  Target: ' + serviceTime_target + ', and max time: ' + serviceTime_max + ', actual time: ' + obj.averageService);
            } else {
              // console.log('Option 3. Time below target.  Target: ' + serviceTime_target + ', and max time: ' + serviceTime_max + ', actual time: ' + obj.averageService);
              this.changeBackground_onTarget(elementOTD);
            }

          } else {
            if(obj.averageService > serviceTime_target) {
              this.changeBackground_offTarget(elementOTD);
            } else {
              this.changeBackground_onTarget(elementOTD);
            }
          }
        } else {
          element = sosType + '-' +  DOMStrings.totalServiceTime;
          document.getElementById(element).textContent = '---';
          this.changeBackground_onTarget(elementOTD);
        }
      }
            



      if (paidTimeCalc) {
        element = sosType + '-' +  DOMStrings.paidTime;
        elementID = document.getElementById(element + custID);
        elementID.textContent = paidTime;
        this.timeCompleted(elementID);
      } 

      if (finishTimeCalc) {
        element = sosType + '-' + DOMStrings.finishTime;
        elementID = document.getElementById(element + custID);
        elementID.textContent = finishTime;
        this.timeCompleted(elementID);

        calcOTD = this.convertToTime(obj.OTDTime).minutes + ':' + this.convertToTime(obj.OTDTime).seconds;
        calcTotServTime = this.convertToTime(obj.serviceTime).minutes + ':' + this.convertToTime(obj.serviceTime).seconds;

        elementOTD = sosType + '-' + DOMStrings.otdTime + custID;
        elementTotalTime = sosType + '-' + DOMStrings.totalTime + custID;

        document.getElementById(elementOTD).textContent = calcOTD;
        document.getElementById(elementTotalTime).textContent = calcTotServTime;

        //THIS IS CHECKING IF OTD TIME IS OVER THE TARGET - GARETH WANTED TO BE GREEN AT ALL THE TIME
        // if(obj.OTDTime > kfcServiceTimes.OTD_Time) {

        //   this.changeBackground_offTarget(elementOTD);
        
        // } else {
          
        //   this.changeBackground_onTarget(elementOTD);
        // }

       //OTD time is always green
        this.changeBackground_onTarget(elementOTD);


        if(sosType === 'bk') {
          if(obj.serviceTime > serviceTime_max) {
            this.changeBackground_offTarget(elementTotalTime);
          }else if(obj.serviceTime > serviceTime_target && obj.serviceTime < serviceTime_max) {
            this.changeBackground_betweenTarget(elementTotalTime);
            // console.log('Option 1. Time between targets.  Target: ' + serviceTime_target + ', and max time: ' + serviceTime_max + ', actual time: ' + obj.averageService);
          } else {
            // console.log('Option 3. Time below target.  Target: ' + serviceTime_target + ', and max time: ' + serviceTime_max + ', actual time: ' + obj.averageService);
            this.changeBackground_onTarget(elementTotalTime);
          }

        } else {
          if(obj.serviceTime > serviceTime_target) {
            this.changeBackground_offTarget(elementTotalTime);
          } else {
            this.changeBackground_onTarget(elementTotalTime);
          }
        }
        // if(obj.serviceTime > serviceTime_target) {
        //   this.changeBackground_offTarget(elementTotalTime);
        // } else {
        //   this.changeBackground_onTarget(elementTotalTime);
          
        // }

      } 

    },
    
    getDOMStrings: function () {
      return DOMStrings;
    }

  };

})();


// Global APP controller
var controller = (function (timeCtrl, UICtrl) {
  var SOSType, deck;
  var DOM = UICtrl.getDOMStrings();


  var setupEventListeners = function () {

    // click on New Customer button for KFC front counter
    document.getElementById(DOM.startBtn).addEventListener('click', function() {
      SOSType = 'kfc';
      ctrlNewCustomer(SOSType); //SOSType - determines which of the SOS we checking
    });

    //THIS IS IF WE WANT TO USE ENTER BUTTON (NOT REALLY WORKING WITH SO MANY DIFFERENT START BUTTONS)
    // document.addEventListener('keypress', function (event) {
    //   if (event.keyCode === 13 || event.which === 13) {
    //     ctrlNewCustomer();
    //   }
    // });

    //click on specific items in time editing time in serice timers for kfc front counter => paid time, stop time of delete line
    document.querySelector(DOM.kfcTimesList).addEventListener('click', ctrlDeleteCustomer);

    //click on specific items in time editing time in serice timers for kfc DT=> paid time, stop time of delete line
    document.querySelector(DOM.kfcDTTimesList).addEventListener('click', ctrlDeleteCustomer);

    //click on specific items in time editing time in serice timers for kfc Home delivery=> stop time of delete line
    document.querySelector(DOM.kfcHDTimesList).addEventListener('click', ctrlDeleteCustomer);

    //click on specific items in time editing time in serice timers for burger king=> stop time of delete line
    // **************************** UNCOMMENT THE LINE BELOW IF YOU HAVE HTML SECTION FOR BURGER KING
    // document.querySelector(DOM.bkTimesList).addEventListener('click', ctrlDeleteCustomer);


    // click on New Customer button for KFC Drive Thru
    document.getElementById(DOM.startDTBtn).addEventListener('click', function() {
      SOSType = 'kfc_DT';
      ctrlNewCustomer(SOSType);
    });

    // click on New Customer button for KFC delivery
    document.getElementById(DOM.startHDBtn).addEventListener('click', function() {
      SOSType = 'kfc_HD';
      ctrlNewCustomer(SOSType);
    });

    // click on New Customer button for Burger King front counter
     // **************************** UNCOMMENT THE LINE BELOW IF YOU HAVE HTML SECTION FOR BURGER KING
    // document.getElementById(DOM.startBKBtn).addEventListener('click', function() {
    //   SOSType = 'bk';
    //   ctrlNewCustomer(SOSType);
    // });


  };

  var updateServiceTimes = function (id, type) {
    var clickedBtn = id;

    // Return the service times
    var serviceTimes = timeCtrl.getServiceTimes(type, clickedBtn);

    // Display the budget on the UI
    UICtrl.displayServiceTimes(serviceTimes);
    
  };

   var newPaidTime = function (btnID, type) {

    // Upadate the date structure
        timeCtrl.calculateOTDandServiceTime(type, btnID);
    //Display paid time in UI

  };

  var newFinishTime = function (btnID, type) {

    if(type === 'ph') {
      // only used when checking PH ovens speed
      // **********************TU SKONCZYLEM on 16/03***********************
      // alert('This part is under developemnt.');
      timeCtrl.calculateFinishAndServiceTime(type, btnID);
      var myTimes = timeCtrl.getOvenSpeed(type, btnID);
      // console.log('Below myTimes object');
      // console.log(myTimes);
      UICtrl.displayOvenSpeed(myTimes);
      var deck = myTimes.deckNo;
      stopTheClock(deck);
    } else {
      // for all other accounts is using this part
        // Upadate the date structure
      timeCtrl.calculateFinishAndServiceTime(type, btnID);
      var myTimes = timeCtrl.calculateTotalTime(type);
      //Display paid time in UI
        // console.log(myTimes);
        UICtrl.dispalyTimesUI(myTimes);
    }

    
  };

  var ctrlNewCustomer = function (SOSType) {
    var startNewCustomer, newCustomer, startNewOven, speedSet, secondsSettings, errorType, errorMessage, counterID, element;

    if(SOSType === 'ph') {
      // it checks what user entered into speed settings input
      speedSet = UICtrl.calcOvenSettings(deck).settingTime;
      // it checks how many seconds were entered, ensuring is not more than 59
      secondsSettings = UICtrl.calcOvenSettings(deck).setSec;
      element = DOM.ph_speedSet + deck;

      // if user left input empty, do not proceed and display massage
        if(!speedSet) {
          errorType = 'Speed settings error!';
          errorMessage = 'Speed settings field is empty. Please enter ovens speed settings';
      
          UICtrl.callErrorMessage(errorType, errorMessage);
          

      // if user entered number of seconds larger than 59
        } else if(secondsSettings >= 60) {

          errorType = 'Speed settings error!';
          errorMessage = 'Remember, there is only 60 seconds in a minute. Max value in seconds fileld is 59.';
      
          UICtrl.callErrorMessage(errorType, errorMessage);

        }  //else if (speedSet < 240000) {

        //   errorType = 'Speed settings error!';
        //   errorMessage = 'Ovens speed can not be lower than 4:00 minutes.';
      
        //   UICtrl.callErrorMessage(errorType, errorMessage);
      
       //  } 
      //  if all entered correctly, set up new line
         else {
          startNewOven = UICtrl.getNewOven(SOSType, deck);
          newCustomer = timeCtrl.addNewOven(startNewOven.timeCheckType, startNewOven.panIn, startNewOven.panInCalc, startNewOven.panOut, startNewOven.panOutCalc, startNewOven.actSpeed, startNewOven.actSpeedCalc, startNewOven.deckNo, startNewOven.timeDiff, startNewOven.speedSettings, startNewOven.speedSettingsCalc);
          // console.log(newCustomer);
          newLine = UICtrl.addNewCustomerLine(newCustomer, startNewOven.timeCheckType);
          // UICtrl.focusOnNewFild(newLine, SOSType);

           // updateServiceTimes(newCustomer);
          updateServiceTimes(newLine, SOSType);

          // make countown button disabled and get which deck is in use
          var counterID = UICtrl.displayCountdownBtn(deck);

          // speedSet var is used for countdown clock
          var deadline = new Date(Date.parse(new Date()) + speedSet);
        
          //starting countdown timer based on counterID, belt speed and deck
          initializeClock(counterID, deadline, deck);

          // making deckbutton disabled - avoiding clicking same button at all the time
          element = DOM.startPHBtn + '_' + deck;
          document.getElementById(element).classList.add('icon-disabled');

        }
    } else {
      startNewCustomer = UICtrl.getNewCustomer(SOSType);

      // 2. Add the start time to the timer controller
      newCustomer = timeCtrl.addNewCustomer(startNewCustomer.timeCheckType, startNewCustomer.timeStart, startNewCustomer.timeStartCalc, startNewCustomer.timePaid, startNewCustomer.timePaidCalc, startNewCustomer.timeStop, startNewCustomer.timeStopCalc);
      // console.log(newCustomer);

      // 3. Add the time to UI
      newLine = UICtrl.addNewCustomerLine(newCustomer, startNewCustomer.timeCheckType);

       // 4. Focus on customer description in new field
      UICtrl.focusOnNewFild(newLine, SOSType);

       // updateServiceTimes(newCustomer);
      updateServiceTimes(newLine, SOSType);
    }
    
  };

  var ctrlDeleteCustomer = function (event) {
    var element, itemID, buttonID, splitButtonID, buttonType, toDelate, splitToDelete, toDeleteRow, toDeleteID, SOSType, myDeck;

    itemID = event.target.parentNode.id;
    // console.log(itemID);

    if (itemID) {
      splitButtonID = itemID.split('-');
      SOSType = splitButtonID[0];
      buttonType = splitButtonID[1];
      buttonID = parseInt(splitButtonID[2]);

      if (buttonType === 'paid') {

        newPaidTime(buttonID, SOSType);
        updateServiceTimes(buttonID, SOSType); // need to change splits to include type of the SOS check
        element = SOSType + '-' + DOM.finishTimeIcon + '-' + buttonID;
        document.getElementById(element).classList.remove('icon-disabled');

      } else if (buttonType === 'stop') {

        newFinishTime(buttonID, SOSType);
        updateServiceTimes(buttonID, SOSType); // need to change splits to include type of the SOS check
        element = SOSType + '-' + DOM.paidTimeIcon + '-' + buttonID;
        document.getElementById(element).classList.add('icon-disabled');

      } else if (buttonType === 'trash') {
        toDelete = event.target.parentNode.parentNode.parentNode.parentNode.id; // parent item if we need delete a row
        // console.log('This is want we need to delete: ' + toDelete);
        splitToDelete = toDelete.split('-');
        toDeleteRow = splitToDelete[0];
        toDeleteID = parseInt(splitToDelete[1]);
        myDeck = timeCtrl.getDeck(SOSType, buttonID);
        timeCtrl.deleteItem(toDeleteRow, toDeleteID);
        UICtrl.deleteTimesItem(toDelete);

        // ********************* to wstawilem on 21/02 => te dwie line. Ciagle nie dziala usuwanie srednich

        var myTimes = timeCtrl.calculateTotalTime(SOSType);
        if(SOSType !== 'ph') {
          UICtrl.dispalyTimesUI(myTimes);
        } else if(SOSType === 'ph') {

          // make button available again
         
          var deck = myDeck;

          var counterID = UICtrl.displayCountdownBtn(deck);
          // console.log('Im deletaing this deck now: ' + deck + ', and this is counter ID ' + counterID);
          resetTheClock(deck, counterID);
          
        }
        
        //  ******************************
        
        

        if(myTimes.custNum > 0) {
          var cellZero = timeCtrl.getCellZero(SOSType);
            updateServiceTimes(cellZero, SOSType);
        } else {
          
        }
      }

      //1. delte the item from the data structure

      //2. delete the item from the UI

      //3. Update and display new times 

    }
  };

  return {
    init: function () {
      // console.log('Application has started.');
      UICtrl.displayServiceTimes({
      sosType: 'kfc',
      paidTimeCalc: 0,
      paidTime: 0,
      finishTimeCalc: 0,
      finishTime: 0,
      custID: 0,
      avgOTD: 0,
      avgService: 0

      });
      setupEventListeners();
    }
  };


})(timerController, UIController);

controller.init();