const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/51106/2022";
/*current date and time*/
let myDate = new Date();
const monty = myDate.getMonth() + 1;
const tag = myDate.getDate();
var currHH = myDate.getHours();
var currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

var dataHours = [];
/* build array of hours: 0 ~ hh */
for (let idx=0;idx < currHH;idx++){
    //hours.push(idx);
    if(idx % 3 == 0){
        dataHours.push(idx);
    }
}
function zeroPad(tit){return (tit<10)?"0"+tit:tit;}
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
let dat;//,myObj = [];
const delay = (ms=1000)=>new Promise(r=>setTimeout(r,ms));
let result = [];
let curr_weather = [];


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
    console.log(curr_weather);
    build_plot(result);
})();

function build_array(hour,gotData){
    const limit = 2;
    //let result = [];
    for(let idx = hour; idx <= hour + limit; idx++){
        var aux = build_attrib(idx);
        if (gotData[aux] === undefined){break;}
        const dat = {"hour":idx,"temp":gotData[aux].temp[0],"humid":gotData[aux].humidity[0],
        "wind":gotData[aux].wind[0],"rain":gotData[aux].precipitation1h[0]};
        result.push(dat);
    }
    //get last data of each JSON object
    var lena = Object.keys(gotData)[Object.keys(gotData).length-1];
    console.log(hour,lena,gotData[lena].temp[0]);
    /*if(currMin < 20){
        currMin = 60;currHH = currHH -1;
    }*/
    //console.log(lena.slice(-6,-4),lena.slice(-4,-2));
    const zoey = {"hour":parseInt(lena.slice(-6,-4)),"min":parseInt(lena.slice(-4,-2)),"temp":gotData[lena].temp[0],
    "humid":gotData[lena].humidity[0],"wind":gotData[lena].wind[0],"rain":gotData[lena].precipitation1h[0]};
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
    const adjHeight = -11;
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
