/* Fetching data from JMA.go.jp */
const jma_url = "https://www.jma.go.jp/bosai/forecast/data/forecast/230000.json";

const ico_url = "https://www.jma.go.jp/bosai/forecast/img/";

const sun_time = ["https://dayspedia.com/api/widget/city/11369/?lang=en",
"https://dayspedia.com/api/widget/city/4311/?lang=en"];

const hh = [5,11,17,23];

disp_info();

function getDateHour(inStr){
    // inStr: ISO format
    const gotDate = new Date(inStr);
    return {"monty":gotDate.getMonth() + 1,"tag":gotDate.getDate(),"heure":gotDate.getHours()};
}

async function disp_info(){
    const gotData = await get_data();
    const gotTime = await getTimes();
    const currDiv = document.getElementById("thisWeather");
    const currElm = document.createElement("p");
    currElm.setAttribute("class","col3");
    currElm.style.textAlign = "right";
    var texty = "天気 : " + gotData.weather[0] + "<br/><img src='../svg/sunrise.svg' width=32/>" + 
    gotTime.sunrise[0] + ":" + gotTime.sunrise[1] + "&emsp;&emsp;<img src='../svg/sunset.svg' width=32/>"+gotTime.sunset[0]+":"+gotTime.sunset[1];
    currElm.innerHTML = texty;
    currDiv.appendChild(currElm);
    //var currWeather = gotData.weather[1].split("　");
    /*for(let idx=0;idx<gotData.weather.length;idx++){
        var currWeather = gotData.weather[idx].split("　");
        texty += "<h2>"+gotData.time[idx].slice(0,10)+" "+currWeather[0]+"<img src='"+ico_url+gotData.icon[idx]+".svg'/></h2>";
    }*/

    const myDiv = document.getElementById("foreDiv");
    const iconElm = document.createElement("div");
    iconElm.setAttribute("class","col3");

    texty = "<br/><p>"+gotData.weather[1] +"</p>";
    var myMin = gotData.temp[1][2];
    var myMax = gotData.temp[1][3];
    if(myMax === undefined){
        myMax = gotData.temp[1][1];
        myMin = gotData.temp[1][0];
    }
    texty += "<span>Min "+ myMin +"&#8451; | Max "+ myMax+"&#8451;</span>";
    iconElm.innerHTML = "<img src='"+ico_url+gotData.icon[1]+".svg'/>"+texty;
    const tempElm = document.createElement("div");//tomorrow temp
    tempElm.setAttribute("class","col3");
    
    texty = "";
    let jdx = gotData.rain[0].length-1;
    let kdx = 0;
    var textW = "<p>降水確率[%]</p><div class='row'>";
    for(let idx = jdx-3;idx < jdx+1;idx++){
        const get_date = getDateHour(gotData.rain[0][idx]);
        texty += "<p class='col4'>"+get_date.heure+" - "+hh[kdx]+"<br/>"+gotData.rain[1][idx]+"%</p>";
        //console.log(gotData.rain[0].length,texty);
	kdx++;
    }
    texty += "</div>";
    tempElm.innerHTML = textW + texty;
    myDiv.appendChild(iconElm);
    myDiv.appendChild(tempElm);
}
async function get_data(){
    const response = await fetch(jma_url);
    const data = await response.json();
    //0: currDay, 1: nextDay, 2:dayAfter2moro
    var upTime = data[0].timeSeries[0].timeDefines;
    var thisWeather = data[0].timeSeries[0].areas[0].weathers;
    var weatherIcon = data[0].timeSeries[0].areas[0].weatherCodes;
    var winds = data[0].timeSeries[0].areas[0].winds;
    var rainTimes = data[0].timeSeries[1].timeDefines;//6:every 6hrs
    var rainProb = data[0].timeSeries[1].areas[0].pops;//6 data
    var tempTimes = data[0].timeSeries[2].timeDefines;//max/min only
    var temp = data[0].timeSeries[2].areas[0].temps;//currDay:0,1; nextDay:2,3
    //console.log(currWeather[0],weatherIcon);
    return {"time":upTime,"weather":thisWeather,"icon":weatherIcon,
    "wind":winds,"rain":[rainTimes,rainProb],"temp":[tempTimes,temp]};
}

async function getIconCodes(){
    const resp = await fetch("../data/w_codes.json");
    const data = await resp.json();
    return data;
}

function convTime(unixT){
    const myTime = new Date(unixT *1000);
    var minut = myTime.getMinutes();
    if(minut < 10){
        minut = "0" + minut;
    }
    return [myTime.getHours(), minut];
}

async function getTimes(){
    const response = await fetch(sun_time[1]);
    const data = await response.json();
    let sunRise = data["sunrise"];
    let sunSet = data["sunset"];
    
    return {"sunrise":convTime(sunRise),"sunset":convTime(sunSet)}; 
}