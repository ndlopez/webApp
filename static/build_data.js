const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/51106/2022";
/*current date and time*/
let myDate = new Date();
var monty = myDate.getMonth() + 1;
var tag = myDate.getDate();
var currHH = myDate.getHours();
var hours = [],dataHours = [],ondo=[],myObj = [];
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
    //var myTime = dataHours[dataHours.length-1];//currHH;// hh-1, hh-2
    //Must validate if myTime is within fetched data: if myTime > dataHours[7]
    //var gotThis = build_path_attr(dataHours.length-1,myTime);
    const response = await fetch(thisPath);
    const data = await response.json();
    

    //console.log("jma?",thisHour,data[aux].temp[0]);// currhour
    //aux = build_attrib(thisHour +1);
    //console.log(aux,thisHour+1,data[aux].temp[0]);
    //aux = gotThis.Atrib.replace(myTime,zeroPad(myTime-2));
    //console.log(aux,myTime-2,data[aux].temp[0]);
    
    for(let idx = thisHour; idx < thisHour + 3;idx++){
        var newHour = thisHour + idx
        var aux = build_attrib(newHour);
        var dat = {"hour":newHour,"temp":data[aux].temp[0]};
        myObj.push(dat);
    }
    
    return myObj;
}
//get_data();
async function got_data(){
    for (let idx = 0; idx < dataHours.length; idx++) {
        /*build paths */
        const path = build_path(idx);
        //let jdx = idx;
        const gotData = await get_data(path,dataHours[idx]);
        console.log(path,gotData);
    }
}

got_data();
console.log(hours,dataHours);