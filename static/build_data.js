let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
/* Fetch observation data from jma site and plot */
const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/51106/2022";
/*current date and time*/
let myDate = new Date();
const monty = myDate.getMonth() + 1;
const tag = myDate.getDate();
var currHH = myDate.getHours();
var currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

let result = []; //store per hour weather data
let curr_weather = []; //store last entry of JSON weather data
let maxmin = []; // Max/Min temp from obs data
var dataHours = [];
const toRadians = Math.PI/180.0;
const maxValue = 6; //m/s when 10m/s too many scales, should display half
/* build array of hours: 0 ~ hh */
for (let idx=0;idx < currHH;idx++){
    //hours.push(idx);
    if(idx % 3 == 0){
        dataHours.push(idx);
    }
}
function zeroPad(tit){return (tit<10)?"0"+tit:tit;}

/* wind Direction -> JPchar */
const allDirs = {1:"北北東",2:"北東",3:"東北東",4:"東",5:"東南東",6:"南東",7:"南南東",8:"南",
9:"南南西",10:"南西",11:"西南西",12:"西",13:"西北西",14:"北西",15:"北北西",16:"北"};
function windChar(number){    
    for (let dat in allDirs){
        if(dat == number){
            return allDirs[number];
        }
    }
}

function build_path(jdx){
    //0 < jdx < 8:
    var path = jma_url + zeroPad(monty) + zeroPad(tag) + "_"+zeroPad(dataHours[jdx]) + ".json";
    return path;
}
function build_attrib(tit){
    return "2022"+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+"0000";
}
function get_min_attr(tit){
    if((currMin%10) == 0){
        return "2022"+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+zeroPad(currMin)+"00";
    }else{

    }
}

function buildProgressCircle(percent,title,texty) {
    let radius = 52;
    const pTitle = document.createElement("p");
    pTitle.innerText = title;
    const subDiv = document.createElement("div");
    subDiv.setAttribute("class","col3 float-left");
    subDiv.appendChild(pTitle);
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    const svgBkgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    svgGroup.setAttribute("width","120");
    svgGroup.setAttribute("height","120");//180
    svgCircle.setAttribute("class","progress-ring-circle");
    svgCircle.setAttribute("id","frontCircle");
    svgCircle.setAttribute("stroke","#cc274c");
    svgCircle.setAttribute("stroke-width","5");
    svgCircle.setAttribute("stroke-linecap","round");
    svgCircle.setAttribute("fill","transparent");
    svgCircle.setAttribute("r",radius);
    svgCircle.setAttribute("cx","60");
    svgCircle.setAttribute("cy","60");//90
    svgBkgCircle.setAttribute("class","progress-ring-circle");
    svgBkgCircle.setAttribute("stroke","#bed2e0");
    svgBkgCircle.setAttribute("stroke-width","4");
    svgBkgCircle.setAttribute("stroke-dasharray","10,10");
    svgBkgCircle.setAttribute("fill","transparent");
    svgBkgCircle.setAttribute("r",radius);
    svgBkgCircle.setAttribute("cx","60");
    svgBkgCircle.setAttribute("cy","60");//90
    svgGroup.appendChild(svgBkgCircle);
    svgGroup.appendChild(svgCircle);
    
    var circumference = radius * 2 * Math.PI;
    svgCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    svgCircle.style.strokeDashoffset = `${circumference}`;
    const offset = circumference - percent / 100 * circumference;
    svgCircle.style.strokeDashoffset = offset;
    subDiv.appendChild(svgGroup);
    var subDivVal = document.createElement("div");
    subDivVal.setAttribute("class","value");
    subDivVal.innerHTML = texty;
    subDiv.appendChild(subDivVal);

    return subDiv;
}
function buildGaugeMeter(value,title,htmlTxt){
    //Path - Text - Path
    //const val = ~~value;
    const radius = 50;
    const pTitle = document.createElement("p");
    pTitle.innerText = title;
    const subDiv = document.createElement("div");
    subDiv.setAttribute("class","col3 float-left");
    subDiv.appendChild(pTitle);
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    const svgBkgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    
    svgGroup.setAttribute("width","120");
    svgGroup.setAttribute("height","180");
    svgPath.setAttribute("class","gauge-value");
    svgPath.setAttribute("id","frontCircle");
    svgPath.setAttribute("stroke","#cc274c");
    svgPath.setAttribute("stroke-width","5");
    svgPath.setAttribute("stroke-linecap","round");
    svgPath.setAttribute("fill","none");

    var posXY = buildPath(value,radius,10);
    var myPath = "M 15 90 A 50 50 0 " + posXY[2] + " 1 " + posXY[0] + " "+ posXY[1];
    svgPath.setAttribute("d",myPath);//60 18
    //console.log(value,posXY[0],myPath);//"M 15 90 A 50 50 0 0 1 95.35 32.64"

    svgBkgPath.setAttribute("class","gauge-dial");
    svgBkgPath.setAttribute("stroke","#bed2e0");
    svgBkgPath.setAttribute("stroke-width","4");
    svgBkgPath.setAttribute("stroke-linecap","round");
    //svgBkgPath.setAttribute("stroke-dasharray","10,10");
    svgBkgPath.setAttribute("fill","none");
    svgBkgPath.setAttribute("d","M 15 90 A 50 50 0 1 1 105 90");//105 90
    
    /*Droplet
    M28.344 17.768L18.148 1.09L8.7 17.654c-2.2 3.51-2.392 8.074-.081 11.854c3.285 5.373 10.363 7.098 15.811 3.857c5.446-3.24 7.199-10.22 3.914-15.597z
    */
    //Adding scale to SVG_gauge_meter
    for (let index = 0; index <= maxValue; index++) {
        //var thisAng = 0;//index/maxValue*180;
        const rr = 30;
        var xx = 0;

        /* if(index < (maxValue/2)){xx = 20 + rr*(1-Math.cos(thisAng*toRadians));}
        else{thisAng = 180 - thisAng;xx = 60 + rr*Math.cos(thisAng*toRadians);} */
        var pos = buildPath(index,rr,20);
        xx = pos[0];
        if (index == maxValue/2){xx = 55;}
        
        var yy = pos[1];
        if(index == maxValue){xx = 85;}
        const myText = buildSVGtext(xx,yy,index);
        svgGroup.appendChild(myText);
    }
    
    svgGroup.appendChild(svgBkgPath);
    svgGroup.appendChild(svgPath);    

    subDiv.appendChild(svgGroup);
    const subDivVal = document.createElement("div");
    subDivVal.setAttribute("class","value");
    subDivVal.innerHTML = htmlTxt;
    subDiv.appendChild(subDivVal);

    return subDiv;
}
function buildPath(inValue,radio,xOffset){
    //calc circ_path based on MaxValue = 6m/s
    var beta = 0; 
    var dx = 0;

    if (inValue < (maxValue/2)){
        beta = inValue * 38.614 - 25.842;
        dx = xOffset + radio*(1 - Math.cos(beta*toRadians));
    }else{
        beta = 90 - (inValue - 3)*38.614;
        //angle = 180 - angle;//231.566
        dx = 60 + radio*Math.cos(beta*toRadians);
    }
    var flag = 0;
    var dy = 68 - radio*Math.sin(beta*toRadians); //68

    if (inValue == 0){dy=90;}
    if (inValue == 6){
        flag = 1;
        dx = 105;
        dy = 90;
    }
    if (inValue == 5){flag = 1;}
    //thisPath = "M 15 90 A 50 50 0 " + flag + " 1 " + String(dx) + " "+ String(dy);

    var arr = [];
    arr.push(dx);
    arr.push(dy);
    arr.push(flag);
    return arr;
}
function buildSVGtext(dx,dy,text){
    const svgText = document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute("x",dx);
    svgText.setAttribute("y",dy);
    svgText.setAttribute("fill","#bed2e0");
    svgText.setAttribute("font-family","Verdana");
    svgText.setAttribute("font-size","large");
    svgText.textContent = String(text);
    return svgText
}

(async ()=>{
    // thisHour = 0, 3, 6,..., 21
    for(let jdx= 0; jdx < dataHours.length; jdx++){
        const path = build_path(jdx);
        try {
            const response = await fetch(path);
            const data = await response.json();
            var newHour = parseInt(dataHours[jdx]);
            build_array(newHour,data);
        } catch (error) {
            console.log(error);
        }
    }
    //console.log("curr",curr_weather.length);
    build_plot(result);
    //var img_url = "";
    //let temp_max_min = maxmin[0];//the date: myData.curr_weather[0][0]
    const lastElm = curr_weather.length-1;
    var text = "<h2 class='align-left'>&emsp;Nagoya, JP<br>&emsp;"+ months[monty-1] + tag +
    " "+curr_weather[lastElm].hour_min+"</h2>";
    text += "<div class='clearfix'><span class='large'>" + 
    "&emsp;"+curr_weather[lastElm].temp + "&#8451;&emsp;</span><span id='now_weather' class='large'></span>" + 
    "<h4>Max "+ maxmin[0] + "&#8451;&emsp;Min " + maxmin[1] +  "&#8451;</h4></div>";
    document.getElementById("curr_weather").innerHTML = text;

    var detailsDiv = document.getElementById("weather_details");
    text = "<h2><br><br>" + curr_weather[lastElm].rain + " mm</h2>";
    var rainDiv = buildProgressCircle(curr_weather[lastElm].rain,"RAIN",text);
    detailsDiv.appendChild(rainDiv);

    text = "<h2><br><br>" + curr_weather[lastElm].humid + "%</h2>";
    var humidDiv = buildProgressCircle(curr_weather[lastElm].humid,"HUMIDITY",text);
    detailsDiv.appendChild(humidDiv);

    text = "<h4>m/s</h4><h2>"+ windChar(curr_weather[lastElm].windDir) + "</h2>";
    var kelly = ~~curr_weather[lastElm].wind;
    var windDiv = buildGaugeMeter(kelly,"WIND",text);
    detailsDiv.appendChild(windDiv);
    
})();

function build_array(hour,gotData){
    const limit = 2;
    //let result = [];
    for(let idx = hour; idx <= hour + limit; idx++){
        var aux = build_attrib(idx);
        if (gotData[aux] === undefined){break;}
        const abby = {"hour":idx,"temp":gotData[aux].temp[0],"humid":gotData[aux].humidity[0],
        "wind":Math.round(gotData[aux].wind[0]) ,"windDir":gotData[aux].windDirection[0],"rain":gotData[aux].precipitation1h[0]};
        result.push(abby);
    }
    //get last data of each JSON object
    var lena = Object.keys(gotData)[Object.keys(gotData).length-1];
    //console.log(hour,lena,gotData[lena].temp[0]);
    /*if(currMin < 20){
        currMin = 60;currHH = currHH -1;
    }*/
    //console.log(lena.slice(-6,-4),lena.slice(-4,-2));
    const zoey = {"hour_min":lena.slice(-6,-4)+":"+lena.slice(-4,-2),"temp":gotData[lena].temp[0],
    "humid":gotData[lena].humidity[0],"wind":gotData[lena].wind[0],"windDir":gotData[lena].windDirection[0],
    "rain":gotData[lena].precipitation1h[0]};
    curr_weather.push(zoey);
    //var lena = get_min_attr(idx);
    //return result;
}

function build_plot(json_array){
    /*d3js bar plot-> https://jsfiddle.net/matehu/w7h81xz2/38/*/
    const xSize = 750,ySize=500;
    var margin = {top:40,right:20,bottom:50,left:40},
    w = xSize - margin.left - margin.right,
    h = ySize - margin.top - margin.bottom;

    var svg2 = d3.select("#weather_bar")
    .append("svg")
    .attr('width',w+margin.left+margin.right)
    .attr('height',h+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);
    var xScale=d3.scaleBand().range([0,w])
    .domain(json_array.map(function(d){return d.hour;}))
    .padding(0.2);
    svg2.append("g")
    .attr("transform","translate(0,"+0+")")
    .call(d3.axisTop(xScale))
    .selectAll("text")
    .attr("transform","translate(0,0)")
    .attr("font-size","12");
    //.style("text-anchor","middle");
    
    /* Y temp axis*/
    const tMin = d3.min(json_array,(d)=>{return d.temp;});
    const tMax = d3.max(json_array,(d)=>{return d.temp;});
    maxmin.push(tMax);
    maxmin.push(tMin);
    //console.log(tMin,tMax);
    const yScale = d3.scaleLinear()
    .domain([~~tMin-1,~~tMax+1]).range([h,0]);
    svg2.append("g").call(d3.axisLeft(yScale)).attr("font-size","12");
    svg2.append("g").append("text").text("\u2103").attr("x",-24).attr("y",-10);
    /* Y2 humid axis */
    const humidMin = d3.min(json_array,(d)=>{return d.humid;});
    const humidMax = d3.max(json_array,(d)=>{return d.humid;});
    const yHumid = d3.scaleLinear()
    .domain([humidMin-5,humidMax+5])
    .range([h,0]);
    svg2.append("g").call(d3.axisRight(yHumid)).attr("transform","translate("+w+",0)");
    svg2.append("g").append("text").text("%").attr("x",w+2).attr("y",-10);
    /* Humidity: bar plot */
    svg2.selectAll("bar")
    .data(json_array).enter()
    .append("rect")
    .attr("x",function(d){
      return xScale(d.hour);})
    .attr("width",xScale.bandwidth())
    .attr("fill","#bed2e040")
    .attr("rx",8)
    .attr("height",function(d){return h-yScale(0);})
    .attr("y",function(d){return yScale(0);})
    svg2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y",function(d){return yHumid(d.humid);})
    .attr("height",function(d){return h-yHumid(d.humid);})
    .delay(function(d,i){return(i*100)})
    /* Temperature: dot plot */
    svg2.append("g")
    .selectAll("dot")
    .data(json_array).enter()
    .append("circle")
    .attr("cx",function(d){return xScale(d.hour)+13;})
    .attr("cy",function(d){return yScale(d.temp);})
    .attr("r",5)
    .style("fill","#cc274c");
    // add text to dots
    let adjHeight = -11;
    svg2.append("g").selectAll(".txtTemp").data(json_array).enter()
    .append("text").attr("class","txtTemp")
    .text((d,i)=>{if((i%2)===0){return d.temp+"\u2103";}})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d)=>{return yScale(d.temp)+adjHeight;})
    .attr("font-size","11px");

    /* windSpeed: text */
    svg2.append("g").selectAll(".txtWind").data(json_array).enter()
    .append("text").attr("class","txtWind").text(function(d){return d.wind+"m";})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d)=>{return h-5;})
    .attr("font-size","11px");

    /* windDirection */
    //adjHeight = 0;
    svg2.append("g").selectAll(".txtWindDir").data(json_array).enter()
    .append("text").attr("class","txtWindDir")
    .text((d)=>{return windChar(d.windDir);})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d,i)=>{
        adjHeight = (i%2) === 0?23:38;
        return h + adjHeight;
    })
    .attr("font-size","11px");
}
/** might be helpful
async function convToUpper(data){
    return data.toUpperCase();
}
async function main(){
    const lowrCase = ["Vicky Vette","Alison Taylor","Armani Black"];
    const upperArr = await Promise.all(await lowrCase.map(async (word)=>{
        return await convToUpper(word)
    }));
    console.log(upperArr);
}
main();*/
