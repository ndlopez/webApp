/*
digital clock from
https://codepen.io/dudleystorey/pen/xxeEvd
*/
//var currentTime = document.getElementById("currtime");
var currentTime="";
function zeropad(e) {
  return (parseInt(e,10) < 10 ? '0' : '')+e;
}
setInterval(function(){
  var timeNow= new Date();
  let hh = timeNow.getHours();
  let mm = timeNow.getMinutes();
  let ss = timeNow.getSeconds();
  //formatAMPM = (hh >= 12?'PM':'AM');
  //hh = hh % 12 || 12;
  currentTime = hh + ":" + zeropad(mm) + ":" + zeropad(ss);// + " " + formatAMPM;
  //console.log(currentTime)
  document.getElementById("currtime").innerHTML = currentTime;
  //setTimeout(updateTime,1000);
},1000);

