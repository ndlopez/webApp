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
let dat;//,myObj = [];
const delay = (ms=1000)=>new Promise(r=>setTimeout(r,ms));
let result = [];

var margin = {top:40,right:20,bottom:50,left:40},
w = 500 - margin.left - margin.right,
h = 500 - margin.top - margin.bottom;

var svg2 = d3.select("#weather_bar")
.append("svg")
.attr('width',w+margin.left+margin.right)
.attr('height',h+margin.top+margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

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
        //console.log(myObj);
    }
    console.log("returns sth",result[0].temp);

    /*d3js bar plot
    https://jsfiddle.net/matehu/w7h81xz2/38/*/
    var xScale=d3.scaleBand().range([0,w])
    .domain(result.map(function(d){return d.hour;}))
    .padding(0.2);

    svg2.append("g")
    .attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform","translate(5,0)rotate(0)")
    .attr("font-size","12")
    .style("text-anchor","end");

    const tMin = d3.min(result,(d)=>{return d.temp;});
    const tMax = d3.max(result,(d)=>{return d.temp;});
    //console.log(tMin,tMax);
    var yScale=d3.scaleLinear()
    .domain([tMin-1,parseInt(tMax)+1]).range([h,0]);
    svg2.append("g").call(d3.axisLeft(yScale)).attr("font-size","12");
    svg2.selectAll("bar")
    .data(result).enter()
    .append("rect")
    .attr("x",function(d){
      return xScale(d.hour);})
    .attr("width",xScale.bandwidth())
    .attr("fill","#bed2e040")
    .attr("rx",4)
    .attr("height",function(d){return h-yScale(0);})
    .attr("y",function(d){return yScale(0);})
    svg2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y",function(d){return yScale(d.temp);})
    .attr("height",function(d){return h-yScale(d.temp);})
    .delay(function(d,i){return(i*100)})
    svg2.append("g")
    .append("text")
    .text("\u2103")
    .attr("x",-24)
    .attr("y",-10); 
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
    //return result;
}

/** might be helpful*/
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
main();
