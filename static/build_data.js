const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/51106/2022";
/*current date and time*/
let myDate = new Date();
const monty = myDate.getMonth() + 1;
const tag = myDate.getDate();
var currHH = myDate.getHours();
var currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

var hours = [],dataHours = [],ondo=[];
/* build array of hours: 0 ~ hh */
for (let idx=0;idx < currHH;idx++){
    hours.push(idx);
    if(idx % 3 == 0){
        dataHours.push(idx);
    }
}
function zeroPad(tit){
    return (tit<10)?"0"+tit:tit;
}
function build_path(jdx){
    //0 < jdx < 8:
    var path = jma_url + zeroPad(monty) + zeroPad(tag) + "_"+zeroPad(dataHours[jdx]) + ".json";
    return path;
}
function build_attrib(tit){
    return "2022"+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+"0000";
}
async function get_data(thisPath,thisHour){
    // thisHour = 0, 3, 6,..., 21
    // var myObj = [];
    // Must validate if myTime is within fetched data: if myTime > dataHours[7]
    // var gotThis = build_path_attr(dataHours.length-1,myTime);
    const response = await fetch(thisPath);
    const data = await response.json();
    
    //console.log(aux,thisHour+1,data[aux].temp[0]);
    //aux = gotThis.Atrib.replace(myTime,zeroPad(myTime-2));
    //console.log(aux,myTime-2,data[aux].temp[0]);
    var newHour = parseInt(thisHour);
    var limit = 3;
    if(thisHour == currHH){
        limit = 0;
    }

    for(let idx = newHour; idx < newHour + limit;idx++){
        //newHour = newHour + idx
        var aux = build_attrib(idx);
        var dat = {"hour":idx,"temp":data[aux].temp[0]};
        ondo.push(dat);
    }
    
    return ondo;
}
//get_data();
async function got_data(){
    for (let idx = 0; idx < dataHours.length; idx++) {
        /*build paths */
        const path = build_path(idx);
        //let jdx = idx;
        const gotData = await get_data(path,dataHours[idx]);
        //ondo.push(gotData)
        console.log(path,gotData);
    }
}

got_data();
console.log(hours,dataHours,ondo);