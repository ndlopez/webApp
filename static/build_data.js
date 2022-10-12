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
let dat,myObj = [];
const delay = (ms=1000)=>new Promise(r=>setTimeout(r,ms));
let results = [];
async function got_data(){
    // thisHour = 0, 3, 6,..., 21
     //myObj = []; //save every 3hours
    
    for(let jdx=0; jdx < dataHours.length;jdx++){
        const path = build_path(jdx);
        //await delay();
        const response = await fetch(path);
        const data = await response.json();
        var newHour = parseInt(dataHours[jdx]);
        console.log(jdx,newHour);
        var limit = 2; //newHour < currHH ? 2:0;

        for(let idx = newHour; idx <= newHour + limit;idx++){
            var aux = build_attrib(idx);
            if (data[aux] === undefined){break;}
            console.log(jdx,path,"atrib",aux,idx,limit);
            dat = {"hour":idx,"temp":data[aux].temp[0],"humid":data[aux].humidity[0],
            "wind":data[aux].wind[0],"rain":data[aux].precipitation1h[0]};
            results.push(dat);
        }
    }
   
    //aux = gotThis.Atrib.replace(myTime,zeroPad(myTime-2));
    //console.log(aux,myTime-2,data[aux].temp[0]);    
    //return results;
}

/*async function got_data(){
    var gotData;
    for (let idx = 0; idx < dataHours.length; idx++) {
        const path = build_path(idx);
        //let jdx = idx;
        gotData = await get_data(path,dataHours[idx]);
        ondo.push(gotData);
        //console.log(path,gotData,ondo.length);//returns good results
    }
    //return gotData;
}*/

console.log(dataHours,"gotDatA?",got_data);
console.log("data?",results);

/*d3js bar plot
https://jsfiddle.net/matehu/w7h81xz2/38/*/
/************ 
var margin = {top:40,right:20,bottom:50,left:40},
w = 500 - margin.left - margin.right,
h = 500 - margin.top - margin.bottom;

var svg2 = d3.select("#weather_bar")
.append("svg")
.attr('width',w+margin.left+margin.right)
.attr('height',h+margin.top+margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

var xScale=d3.scaleBand().range([0,w])
  .domain(data.map(function(d){
    // console.log(d.hour);
    return d.hour;}))
  .padding(0.2);

svg2.append("g")
  .attr("transform","translate(0,"+h+")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform","translate(5,0)rotate(0)")
  .attr("font-size","12")
  .style("text-anchor","end");

const tMin = d3.min(data,(d)=>{return d.temp;});
const tMax = d3.max(data,(d)=>{return d.temp;});
console.log(tMin,tMax);*/