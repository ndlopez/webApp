/* Fetching data from JMA.go.jp */
const jma_url = "https://www.jma.go.jp/bosai/forecast/data/forecast/230000.json";

const ico_url = "https://www.jma.go.jp/bosai/forecast/img/";

disp_info();

function getDateHour(inStr){
    // inStr: ISO format
    const gotDate = new Date(inStr);
    return {"monty":gotDate.getMonth() + 1,"tag":gotDate.getDate(),"heure":gotDate.getHours()};
}

async function disp_info(){
    const gotData = await get_data();
    const myDiv = document.getElementById("foreDiv");
    const iconElm = document.createElement("p");
    iconElm.setAttribute("class","col3");
    //var currWeather = gotData.weather[1].split("　");
    /*for(let idx=0;idx<gotData.weather.length;idx++){
        var currWeather = gotData.weather[idx].split("　");
        texty += "<h2>"+gotData.time[idx].slice(0,10)+" "+currWeather[0]+"<img src='"+ico_url+gotData.icon[idx]+".svg'/></h2>";
    }*/
    var texty = "<br/><span>Min "+ gotData.temp[1][2]+"&#8451; | Max "+ gotData.temp[1][3]+"&#8451;</span>";

    iconElm.innerHTML = "<img src='"+ico_url+gotData.icon[1]+".svg'/>"+texty;
    const tempElm = document.createElement("p");//tomorrow temp
    tempElm.setAttribute("class","col3");
    tempElm.style.textAlign = "right";
    
    texty = "";
    var textW = "<br/>" + gotData.weather[1] + "<div class='row'>";
    for(let idx = gotData.rain[0].length-1;idx > 4;idx--){
        const get_date = getDateHour(gotData.rain[0][idx-4]);
        texty += "<p class='col4'>"+get_date.heure+":00 "+gotData.rain[1][idx-4]+"%</p>";
    }
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