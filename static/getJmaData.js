//import { theseMonths } from "./build_data.js"; SyntaxError!
/* Fetching data from JMA.go.jp */
const jma_data = "https://www.jma.go.jp/bosai/forecast/data/forecast/230000.json";
// data per hour for current day here:
// https://www.jma.go.jp/bosai/amedas/data/point/51106/20221007_09.json
// format seems to be yyyymmdd_hh.json, hh< currHour, hh=0,3,6,9,...
// also https://www.jma.go.jp/bosai/amedas/#area_type=offices&area_code=230000&amdno=51106&format=table1h&elems=53414

const ico_url = "https://www.jma.go.jp/bosai/forecast/img/";

const sun_time = ["https://dayspedia.com/api/widget/city/11369/?lang=en",
"https://dayspedia.com/api/widget/city/4311/?lang=en"];

const hh = [5,11,17,23];

const theseMonths = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const theseDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

disp_info();

function getDateHour(isoStr){
    // inStr: ISO format
    const gotDate = new Date(isoStr);
    return {"monty":gotDate.getMonth() + 1,"tag":gotDate.getDate(),"day":gotDate.getDay(),"heure":gotDate.getHours()};
}

async function disp_info(){
    const gotData = await get_data();
    const gotTime = await getTimes();
    var myMin = gotData.temp[1][2];
    var myMax = gotData.temp[1][3];
    if(myMax === undefined){
        myMax = gotData.temp[1][1];
        myMin = gotData.temp[1][0];
    }
        
    /*const currDiv = document.getElementById("thisWeather");
    const pElem = document.createElement("p");
    pElem.setAttribute("class","column");
    pElem.style.textAlign = "right";
    var texty = "<img src='../svg/sunrise.svg' width=32/>" + gotTime.sunrise[0] + ":" + 
    gotTime.sunrise[1] + "&emsp;&emsp;<img src='../svg/sunset.svg' width=32/>"+
    gotTime.sunset[0]+":"+gotTime.sunset[1];
    pElem.innerHTML = texty;
    currDiv.appendChild(pElem);*/

    var texty = "";
    const nowTenki = document.getElementById("now_weather");
    if(nowTenki !== null){
        nowTenki.innerHTML = gotData.weather[0] + "&emsp;<img src='"+ico_url+gotData.icon[0]+".svg'/>";
    } //var currWeather = gotData.weather[1].split("　");
    /*for(let idx=0;idx<gotData.weather.length;idx++){
        var currWeather = gotData.weather[idx].split("　");
        texty += "<h2>"+gotData.time[idx].slice(0,10)+" "+currWeather[0]+"<img src='"+ico_url+gotData.icon[idx]+".svg'/></h2>";
    }*/
    /* Weekly forecast Max/Min*/
    const colDiv = document.getElementById("forecaster");
    //create as many group div as forecast are available
    for(let idx=0;idx<gotData.forecast[0].length;idx++){
        const groupDiv = document.createElement("div");
        groupDiv.setAttribute("class","row");

        var aux = getDateHour(gotData.forecast[0][idx]);
        var tempMin = gotData.forecast[2][idx], tempMax = gotData.forecast[3][idx];
        texty = "<div class='col3' style='margin:0;border-radius:inherit;'><div class='row'>" + 
        "<h2 class='column'>"+ aux.tag + "</h2><div class='column' style='text-align:left;padding-left:0;'><p>"+theseDays[aux.day] + 
        "</p><p><small>"+theseMonths[aux.monty-1]+"</small></p></div></div></div>";

        texty += "<div class='col3' style='text-align:right;'><img src='"+ico_url+ gotData.forecast[1][idx]+".svg'/></div>";

        if(idx==0){
            tempMin = myMin;
            tempMax = myMax;
        }
        texty += "<div class='col3'><h4>"+tempMin+"&#8451; | "+tempMax+"&#8451;</h4></div>";
        groupDiv.innerHTML = texty;
        colDiv.appendChild(groupDiv);
    }

    /* 2moro forecast + rain Prob */
    const myDiv = document.getElementById("foreDiv");
    const iconElm = document.createElement("div");
    iconElm.setAttribute("class","column");
    texty = "<br/><p>"+gotData.weather[1] +"</p>";
    
    texty += "<span>Min "+ myMin +"&#8451; | Max "+ myMax+"&#8451;</span>";
    iconElm.innerHTML = "<img src='"+ico_url+gotData.icon[1]+".svg'/>"+texty;
    
    const tempElm = document.createElement("div");//tomorrow temp
    tempElm.setAttribute("class","column");
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
    //console.log("forecast:",gotData.forecast);
}
async function get_data(){
    const response = await fetch(jma_data);
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
    //weekly forecast
    var weekDates = data[1].timeSeries[0].timeDefines;// 7dates
    var weekIcons = data[1].timeSeries[0].areas[0].weatherCodes; // 7 code Icons
    //var weekTempDates = data[1].timeSeries[1].timeDefines; //7dates
    var weekTempMin = data[1].timeSeries[1].areas[0].tempsMin;
    var weekTempMax = data[1].timeSeries[1].areas[0].tempsMax;
    //console.log(currWeather[0],weatherIcon);
    return {"time":upTime,"weather":thisWeather,"icon":weatherIcon,
    "wind":winds,"rain":[rainTimes,rainProb],"temp":[tempTimes,temp],
    "forecast":[weekDates,weekIcons,weekTempMin,weekTempMax]};
}

/*async function getIconCodes(){
    const resp = await fetch("../data/w_codes.json");
    const data = await resp.json();
    return data;
}*/

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