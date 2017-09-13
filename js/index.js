const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"
const margin = {top: 100, right: 90, bottom: 25, left: 75}
let width = window.innerWidth*.85-margin.left-margin.right,
    height = window.innerHeight*.85-margin.top-margin.bottom;


let x = d3.scaleLinear()//use linear for x since only year data given
    .range([0,width]);
let y = d3.scaleLinear()//use linear for y since only months are used
    .range([0,height]);

let x2=d3.scaleTime()//used for axis display only
    .rangeRound([0, width]);
let y2=d3.scaleTime()//used for axis display only
    .range([0, height])
let xAxis = d3.axisBottom(x2)//xaxis display properties
    .ticks(10)
let yAxis = d3.axisLeft(y2)//yaxis display properties
let toolTipDiv = d3.select("body").append("div")//toolTip div definition, definition in css sheet would not work for me???
            .attr("class", "toolTip")
            .style("position", "absolute")
            .style("padding", "5px")
            .style("color", "darkgreen")
            .style("background-color", "white")
            .style("font-size", "18px")
            .style("border-radius", "3px")
            .style("text-align", "center")
            .style("visibility", "hidden");

let chart = d3.select(".chart")//main chart definition
    .attr("width", width + margin.left + margin.right)//margins added for axis
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url,function(error,forceData){//use d3's own json capabilites to get data
  if (error) throw error;

  const checkKey =9
  let sourceArr=[]
  for(let i=0;i<forceData.links.length;i++){
    let sourceVal = forceData.links[i].source
    if(!sourceArr.includes(sourceVal)){sourceArr.push(sourceVal)}
    if(sourceVal===checkKey){
      let targetVal = forceData.links[i].target
      console.log(targetVal)
      console.log(forceData.nodes[targetVal])
    }
  }
  console.log(sourceArr)
  console.log(forceData)

})
