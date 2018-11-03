/* global d3, crossfilter, timeSeriesChart, barChart */

d3.csv("data/lego_sample.csv",
  function (d) {

  //  console.log(d);
    return d;
  },

  function (err, data) {

    if (err) throw err;

    data = data.sort(function (a, b) {
      return d3.ascending(a['year'],b['year']) || d3.ascending(a['color_rgb'], b['color_rgb']);
    });



//Setup for when we use crossfiltering later
  var csData = crossfilter(data);
    // We create dimensions for each attribute we want to filter by
    csData.dimYear = csData.dimension(function (d) { return d["year"]; });
    csData.dimTheme = csData.dimension(function (d) { return d["theme_name"]; });
    csData.dimColor = csData.dimension(function (d) { return d["color_rgb"]; });
    csData.dimPiece = csData.dimension(function(d) { return d["part_num"];});

    // We bin each dimension
    csData.years = csData.dimYear.group();
    csData.themes = csData.dimTheme.group();
    csData.colors = csData.dimColor.group();
    csData.pieces = csData.dimPiece.group();

//Set variables for colorchart - this would be w/in colorchart function modularly
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800,
        height = 600,
        innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom,
        xValue = function(d) { return d["year"]; },
        xScale = d3.scaleBand().padding(0.1),
        //May need to change yScale
        yScale = d3.scaleLinear(),
        max_yValue = csData.years.top(1)[0].value;
  //Create color chart - would be inner function w/in colorchart function
  // Select the svg element, if it exists.

  var svg = d3.select("#colorChart").selectAll("svg").data([data]);

  // Otherwise, create the skeletal chart.
  var svgEnter = svg.enter().append("svg");
  var gEnter = svgEnter.append("g");

  gEnter.append("g").attr("class", "x axis");
  gEnter.append("g").attr("class", "y axis");

  innerWidth = width - margin.left - margin.right,
  innerHeight = height - margin.top - margin.bottom;

  // Update the outer dimensions - modular
 svg.merge(svgEnter).attr("width", width)
    .attr("height", height);

  // Update the inner dimension - modular.
  var g = svg.merge(svgEnter).select("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //To get xscale, need range of years
  xScale.rangeRound([0, innerWidth])
    .domain(data.map(xValue));

  g.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (innerHeight + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Year");
  //Not sure how to define yScale - range and domain - may need to for axis
  yScale.rangeRound([innerHeight, 0])
    .domain([0, max_yValue]);

    gEnter.select(".x.axis")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .text("Year");

    gEnter.select(".y.axis")
        .call(d3.axisLeft(yScale).ticks(10));
    //y-axis label
    g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Pieces");



    var bars = g.selectAll(".bar")
      .data(function (d) { return d; });

    //setting step size and initial position for each block
    //max y will be set based on function eventually
    //max_y = max_yValue(data)
    max_y = max_yValue
    step_size = innerHeight/max_y;
    console.log(step_size);
    //gets first year in dset
    cur_year = +data[1]['year'];
    console.log(cur_year);
    pos = 0;
    console.log(pos);

    bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        //was using x-accessor function in example, flattened here
        .attr("x", function(d){return xScale(xValue(d));})
        .attr("y", function(d){
          //consolse.log(d['year']);
          //console.log(cur_year);
          if (d['year']>cur_year){
            //console.log("option1");
            pos=step_size;
            cur_year = +d['year'];
          }else{
            //console.log("option2");
            pos = pos + step_size;
          }
        //  console.log(pos);
        //  console.log(innerHeight);
        //  console.log(step_size);
      //    console.log(cur_year);
          return innerHeight-pos; })
        .attr("width", xScale.bandwidth())
        //height for each rect is same
        .attr("height", step_size)
        //pull color from dataset - not working yet
        .attr("fill", function(d){
          return d3.rgb("#"+d["color_rgb"]);})
        //removed accessors for mouseover and mouseout and put functions here instead
        .attr("stroke", "black")
        .attr("stroke-width",1)
        .on("mouseover",function(d) {
          var xPos = d3.select(this).attr("x");
          var yPos = d3.select(this).attr("y");
          g.append("text")
            .attr("id", "tooltip")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("background-color", "white")
            .attr("fill", "black")
            .text("Part: " + d['part_name']
              + "<br><br>Set: " + d['set_name']);})
        .on("mouseout", function(){
          d3.select("#tooltip").remove();
        });
})
