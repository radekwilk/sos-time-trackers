var timeinterval_top, timeinterval_middle, timeinterval_bottom;

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    t = Math.ceil(t);
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }
  
  function initializeClock(id, endtime, deck) {
    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
  
    function updateClock() {
      var t = getTimeRemaining(endtime);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if(t.total === 30000) {
       playAudio();
       
      }
        if (deck === 'top' && t.total <= 0) {
          clearInterval(timeinterval_top);
        } else if (deck === 'middle' && t.total <= 0) {
          clearInterval(timeinterval_middle);
        } else if (deck === 'bottom' && t.total <= 0) {
          clearInterval(timeinterval_bottom);
        }

  
      // if (t.total <= 0) {
      //   clearInterval(timeinterval);
      // }
    }
  
    updateClock();

    if(deck === 'top') {
      timeinterval_top = setInterval(updateClock, 1000);
    } else if(deck === 'middle') {
      timeinterval_middle = setInterval(updateClock, 1000);
    } else if(deck === 'bottom') {
      timeinterval_bottom = setInterval(updateClock, 1000);
    }
    
  }

  function playAudio() { 
    var x = document.getElementById("myAudio");
    x.play(); 
  } 


  function stopTheClock(deck) {

    if(deck === 'top') {
      clearInterval(timeinterval_top);
    } else if(deck === 'middle') {
      clearInterval(timeinterval_middle);
    } else if(deck === 'bottom') {
      clearInterval(timeinterval_bottom);
    }

  }

  function resetTheClock(deck, id) {
    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');


    stopTheClock(deck);
  
      minutesSpan.innerHTML = '00';
      secondsSpan.innerHTML = '00';
  }
  
//   var deadline = new Date(Date.parse(new Date()) + 45000);
//   initializeClock('clockdiv', deadline);