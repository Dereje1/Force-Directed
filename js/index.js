const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"
const margin = {top: 0, right: 0, bottom: 5, left: 0}
let width = window.innerWidth*.85-margin.left-margin.right,
    height = window.innerHeight*.85-margin.top-margin.bottom;
let standardFontSize = Math.pow((Math.pow(width,2)+Math.pow(height,2)),0.5)*0.01
let toolTipDiv = d3.select("body").append("div")//toolTip div definition, definition in css sheet would not work for me???
            .attr("class", "toolTip")
            .style("position", "absolute")
            .style("padding", "5px")
            .style("color", "darkgreen")
            .style("background-color", "white")
            .style("font-size", "12px")
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

    let simulation = d3.forceSimulation()//new simulation , see exp here https://github.com/d3/d3-force
      .force("link", d3.forceLink().id(function(d) {return d.index }).distance(30))
      .force("collide",d3.forceCollide( function(d){return 10 }).iterations(10) )
      .force("charge", d3.forceManyBody().distanceMin(20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0))

    let link = chart.append("g") //create links
      .attr("class", "links")
      .selectAll("line")
      .data(forceData.links)
      .enter()
      .append("line")

    let node = d3.select("#flags") //use separate div container for flags or can not use sprite css
        .selectAll("img")
        .data(forceData.nodes)
        .enter().append("img")
        .attr("class",function(d){return ("flag flag-"+d.code)})//use sprite css
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(d) {//tool tip functionality
           toolTipDiv.html("<strong>"+d.country +"</strong>")
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY+40) + "px")
             .style("visibility", "visible");
           })
         .on("mouseout", function(d) {
           toolTipDiv.style("visibility", "hidden");
           });

    let ticked = function() {

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .style("left", function(d) { return (d.x+margin.left)+'px' })
            .style("top", function(d) { return (d.y+margin.top)+'px' });
    }

    simulation
      .nodes(forceData.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(forceData.links);

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }


})
chart.append("text")//set title
  .attr("x",width*.5)
  .attr("y",height*.09)
  .attr("text-anchor", "middle")
  .style("font-size", standardFontSize*3)
  .style("fill", "white")
  .text("Force Directed Graph of State Contiguity")
  .style("cursor","pointer")
  .on("click",function(){window.open(url,"_blank")})
