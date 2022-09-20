/*Weather bars plot*/

var timeNow = new Date();
let currHour = timeNow.getHours();

var margin ={top:40,right:20,bottom:50,left:40},
w = 400 - margin.left - margin.right,
h = 400 - margin.top - margin.bottom;

var svg2=d3.select("#weather_bar")
.append("svg")
.attr('width',w+margin.left+margin.right)
.attr('height',h+margin.top+margin.bottom)
.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

d3.json("data/all_weather.json",function(data){
  var xScale=d3.scaleBand().range([0,w])
  .domain(data.map(function(d){
    /*console.log(d.hour);*/
    return d.hour;}))
  .padding(0.2);

  //console.log(d.hour);
  svg2.append("g")
  .attr("transform","translate(0,"+h+")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform","translate(-10,0)rotate(-45)")
  .style("text-anchor","end");

  /*thisColor=[];
  myColor=["#98A2A9","#CC274C"];*/
  const tMin = d3.min(data,(d)=>{return d.temp;});
  const tMax = d3.max(data,(d)=>{return d.temp;});
  //console.log(parseInt(tMax) +4,tMin-2);
  var yScale=d3.scaleLinear()
  .domain([tMin,parseInt(tMax)+2]).range([h,0]);
  svg2.append("g").call(d3.axisLeft(yScale));
  svg2.selectAll("bar")
  .data(data).enter()
  .append("rect")
  .attr("x",function(d){
    /*if (d.hour < currHour) {thisColor.push(myColor[0]);} else {thisColor.push(myColor[1]);}*/
    return xScale(d.hour);})
  .attr("width",xScale.bandwidth())
  .attr("fill",function(d){return d.color;})
  .attr("height",function(d){return h-yScale(0);})
  .attr("y",function(d){return yScale(0);})

  svg2.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y",function(d){return yScale(d.temp);})
  .attr("height",function(d){return h-yScale(d.temp);})
  /*.attr("class",function(d){return d.class;})*/
  .delay(function(d,i){return(i*100)})

  svg2.append("g")
    .attr("class","tempAxis")
    .append("text")
    .text("\u2103")
    .attr("x",-24)
    .attr("y",-6); //@bottom yMax +15 //top -10
});

/*console.log(thisColor);
randIdx=Math.floor(Math.random()*thisColor.length);*/
