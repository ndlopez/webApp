import {buildProgressCircle, buildGaugeMeter } from "./build_svg.js";

let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
/* Fetch observation data from jma site and plot */
const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/";
const city_idx = [{city:"Nagoya",code:51106},{city:"Takayama",code:52146}];
const sun_time = ["https://dayspedia.com/api/widget/city/11369/?lang=en",
"https://dayspedia.com/api/widget/city/4311/?lang=en"];
const cdx = 1;

// this position: 北緯: 35度10.0分 東経: 136度57.9分 標高: 51m
// Kongos - Take it from me, sounds kinda country, mixed w/pop
// NeedtoBreathe - into the mistery
// JENNIFER McCARTER - Better Be Home Soon
/*current date and time*/
let myDate = new Date();
const yearn = myDate.getFullYear();
const monty = myDate.getMonth() + 1;
const tag = myDate.getDate();
var currHH = myDate.getHours();
var currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

let result = []; //store per hour weather data
let curr_weather = []; //store last entry of JSON weather data
let maxmin = []; // Max/Min temp from obs data
var dataHours = [];
//const toRadians = Math.PI/180.0;
//const maxValue = 6; //m/s when 10m/s too many scales, should display half or add ticks

const prediction_data = [{xp:0,yp:2.0},{xp:7,yp:1.0},{xp:14,yp:8.0},{xp:23,yp:3.0}];
var hours = [];
for (let idx = 0; idx < 24; idx++) hours.push(idx);
/* build array of hours: 0 ~ hh */
for (let idx=0;idx < currHH;idx++){
    //hours.push(idx);
    if(idx % 3 == 0){
        dataHours.push(idx);
    }
}
function zeroPad(tit){return (tit<10)?"0"+tit:tit;}

/* wind Direction -> JPchar */
const allDirs = {0:"静穏",1:"北北東",2:"北東",3:"東北東",4:"東",5:"東南東",6:"南東",7:"南南東",8:"南",
9:"南南西",10:"南西",11:"西南西",12:"西",13:"西北西",14:"北西",15:"北北西",16:"北"};
function windChar(number=0){    
    for (let dat in allDirs){
        if(dat == number){
            return allDirs[number];
        }
    }
}
// wind description according to Beaufort scale up to 6 in m/s
const desc_wind = [{"speed":0.28,"en_desc":"calm","jp_desc":"静穏"},
{"speed":1.38,"en_desc":"Light Air","jp_desc":"至軽風"},{"speed":3.05,"en_desc":"Light Breeze","jp_desc":"軽風"},
{"speed":5.28,"en_desc":"Gentle Breeze","jp_desc":"軟風"},{"speed":7.78,"en_desc":"Moderate Breeze","jp_desc":"和風"},
{"speed":10.56,"en_desc":"Fresh Breeze","jp_desc":"疾風"},{"speed":13.6,"en_desc":"Strong Breeze","jp_desc":"雄風"}];
//more at https://www.i-kahaku.jp/friend/kagaku/0306/kaze/index.html

function get_wind_desc(wspeed){
    // wspeed is float
    var thisWind = "";
    for (let item in desc_wind) {
        if(wspeed <= desc_wind[item].speed){
            thisWind = desc_wind[item].en_desc;
            break;
        }
    }
    return thisWind;
}

/* Functions to build data Paths */
function build_path(jdx){
    //0 < jdx < 8:
    var path = jma_url + city_idx[cdx].code + "/"+ yearn + zeroPad(monty) + zeroPad(tag) + "_"+zeroPad(dataHours[jdx]) + ".json";
    //console.log("thisURL",path);
    return path;
}
function build_attrib(tit){
    //console.log("gotTHIS",String(yearn),zeroPad(monty),zeroPad(tag),zeroPad(tit),"0000");
    return String(yearn)+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+"0000";
}
function get_min_attr(tit){
    if((currMin%10) == 0){
        return yearn+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+zeroPad(currMin)+"00";
    }else{
        return yearn+zeroPad(monty)+zeroPad(tag)+zeroPad(tit)+zeroPad(currMin)+"00";
    }
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
            console.log("GotErr",error);
        }
    }
    //console.log("curr",curr_weather.length);
    build_plot(result);
    //var img_url = "";
    //let temp_max_min = maxmin[0];//the date: myData.curr_weather[0][0]
    const lastElm = curr_weather.length-1;
    var text = "<h2 id='this_place' class='align-left'>Takayama"+"</h2><h4>"+ months[monty-1] + " " + 
    tag + " "+curr_weather[lastElm].hour_min+"</h4>";
    text += "<div class='clearfix'><span class='large'>" + 
    "&emsp;"+curr_weather[lastElm].temp + "&#8451;</span><span id='now_weather'></span>" +
    "<p><span id='wind_info'></span></p>" + 
    "<h4>Max "+ maxmin[0] + "&#8451;&emsp;Min " + maxmin[1] +  "&#8451;</h4></div>";
    document.getElementById("curr_weather").innerHTML = text;

    var detailsDiv = document.getElementById("weather_details");
    text = "<h4>mm</h4>";
    var rainDiv = buildGaugeMeter(curr_weather[lastElm].rain,"RAIN",text);
    detailsDiv.appendChild(rainDiv);

    text = "<h2><br><br>" + curr_weather[lastElm].humid + "%</h2>";
    var humidDiv = buildProgressCircle(curr_weather[lastElm].humid,"HUMIDITY",text);
    detailsDiv.appendChild(humidDiv);

    text = "<h4>m/s</h4><h2>"+ windChar(curr_weather[lastElm].windDir) + "</h2><p>" +
    get_wind_desc(curr_weather[lastElm].wind) +"</p>";
    var kelly = Math.round(curr_weather[lastElm].wind);// ~~float_var -> int_var 
    var windDiv = buildGaugeMeter(kelly,"WIND",text);
    detailsDiv.appendChild(windDiv);
    console.log("now wind:",curr_weather[lastElm].wind,get_wind_desc(curr_weather[lastElm].wind)); 
})();

function build_array(hour,gotData){
    // void function, 
    // fills "result" array with data/hour, and "zoey" Obj with currentData
    const limit = 2;
    for(let idx = hour; idx <= hour + limit; idx++){
        var aux = build_attrib(idx);
        //console.log("this_attrib",aux);
        if (gotData[aux] === undefined){break;}
        const abby = {"hour":idx,"temp":gotData[aux].temp[0],"humid":gotData[aux].humidity[0],
        "wind":Math.round(gotData[aux].wind[0]) ,"windDir":gotData[aux].windDirection[0],
        "rain":gotData[aux].precipitation1h[0],"snow":gotData[aux].snow1h[0]};
        result.push(abby);
    }
    //console.log("json_data",result);
    //get last data of each JSON object
    var lena = Object.keys(gotData)[Object.keys(gotData).length-1];
    //console.log(hour,lena,gotData[lena].temp[0]);
    /*if(currMin < 20){currMin = 60;currHH = currHH -1;}*/
    //console.log(lena.slice(-6,-4),lena.slice(-4,-2));
    const zoey = {"hour_min":lena.slice(-6,-4)+":"+lena.slice(-4,-2),"temp":gotData[lena].temp[0],
    "humid":gotData[lena].humidity[0],"wind":gotData[lena].wind[0],"windDir":gotData[lena].windDirection[0],
    "rain":gotData[lena].precipitation1h[0]};
    curr_weather.push(zoey);

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
    //.domain(json_array.map(function(d){return d.hour;}))
    .domain(hours)
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
    .domain([Math.round(tMin)-2,Math.round(tMax)+2]).range([h,0]);
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
    .attr("x",function(d){return xScale(d.hour);})
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
    .append("rect")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d)=>{return yScale(d.temp);})
    .attr("width","10")
    .attr("height","10")
    /*.append("circle")
    .attr("cx",function(d){return xScale(d.hour)+13;})
    .attr("cy",function(d){return yScale(d.temp);})
    .attr("r",5)*/
    .style("fill","#cc274c");
    // add curve to dots
    /*const fillLine = d3.line()
    .x((d)=>{return xScale(d.hour);})
    .y((d)=>{return yScale(d.temp);})
    .curve(d3.curveBasis);
    svg2.append("path")
    .attr("d",fillLine(json_array))
    .attr("stroke","#cc274c")
    .attr("stroke-width","4px")
    .attr("fill","none");*/
    // add text to dots
    let adjHeight = 20;
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
    .attr("y",(d)=>{return h+10;}) //prev: h-5
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

    //adding sunrise/sunset img and times
    svg2.append("g").append("text").text("6:07").attr("x",180).attr("y",-20).style('fill','#E8B720');
    svg2.append("svg:image")
    .attr('xlink:href','../svg/sunrise.svg')
    .attr('width','32').attr('height','32')
    .attr('transform','translate('+178+','+0+')');
    svg2.append("g").append("text").text("17:05").attr("x",490).attr("y",-20).style('fill','#E8B720');
    svg2.append("svg:image")
    .attr('xlink:href','../svg/sunset.svg')
    .attr('width','32').attr('height','32')
    .attr('transform','translate('+490+','+0+')');

    /* snow amount in the last hour */
    svg2.append("g").selectAll(".txtSnow").data(json_array).enter()
    .append("text").attr("class","txtSnow")
    .text((d)=>{return d.snow+"cm";})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+11;})
    .attr("y",(d)=>{return h-15;})
    .style("fill","#87ceeb")
    .attr("font-size","11px");
    
    //prediction curve
    var thisCurve = d3.line()
    .x((d)=> xScale(d.xp))
    .y((d)=> yScale(d.yp))
    .curve(d3.curveCardinal);
    /*d3.select("#weather_bar")*/
    svg2.append("path")
    .attr("d",thisCurve(prediction_data))
    .attr("fill","none")
    .attr("stroke","red")
    .attr("stroke-width","3px")
    .attr("stroke-dasharray","5,5");
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
