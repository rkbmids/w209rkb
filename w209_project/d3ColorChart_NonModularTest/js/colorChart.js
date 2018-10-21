/* global d3 */

function colorChart(){
  //console.log("test1");
  //set vars
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 400,
      height = 400,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom,
      xValue = function(d) { return d["year"]; },
      xScale = d3.scaleBand().padding(0.1),
      //May need to change yScale
      yScale = d3.scaleLinear(),
      onMouseOver = function () { },
      onMouseOut = function () { },
      //function to calculate max y for height
      max_yValue = function(d) { cf = crossfilter(data);
        var dimensionYear = cf.dimension(function(d){
            return d['year'];
          });
        var yearcount = dimensionYear.group().reduceCount(function(d){
            return d['inventory_id'];
          });
        return yearcount.top(1).value;};

   console.log("test1");

  function chart(selection) {
        console.log("test2");
        console.log(selection);
        selection.each(function (data) {
          console.log("test3");

          // Select the svg element, if it exists.
          var svg = d3.select(this).selectAll("svg").data([data]);

          // Otherwise, create the skeletal chart.
          var svgEnter = svg.enter().append("svg");
          var gEnter = svgEnter.append("g");

          gEnter.append("g").attr("class", "x axis");
          gEnter.append("g").attr("class", "y axis");

          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom;

          // Update the outer dimensions.
          svg.merge(svgEnter).attr("width", width)
            .attr("height", height);

          // Update the inner dimensions.
          var g = svg.merge(svgEnter).select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          //To get xscale, need range of years
          xScale.rangeRound([0, innerWidth])
            .domain(data.map(xValue));
          //Not sure how to define yScale - range and domain - may need to for axis
        //  yScale.rangeRound([innerHeight, 0])
          //  .domain([0, data.map(yValue)]);

            g.select(".x.axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(d3.axisBottom(xScale))
                .append("text")
                .text("Year");

            g.select(".y.axis")
                .call(d3.axisLeft(yScale).ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Number of Pieces");


            var bars = g.selectAll(".bar")
              .data(function (d) { return d; });

            //setting step size and initial position for each block
            var step_size = innerHeight/data.map(max_yValue);
            //gets first year in dset
            var cur_year = data['year'][1];

            bars.enter().append("rect")
                .attr("class", "bar")
                .merge(bars)
                //was using x-accessor function in example, flattened here
                .attr("x", function(d){return xScale(xValue(d));})
                .attr("y", function(d){
                  if (d['year']>cur_year){
                    var pos = 0;
                    var cur_year = d['year'];
                  }else{
                    var pos = pos + step_size;
                  }
                  return innerHeight-pos; })
                .attr("width", xScale.bandwidth())
                //height for each rect is same
                .attr("height", step_size)
                //pull color from dataset
                .attr("fill", function(d){return d3.rgb(d["color_rgb"]);})
                //removed accessors for mouseover and mouseout and put functions here instead
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
                    .attr("fill", "black")
                    .text("Part: " + d['part_name']
                      + "\nSet: " + d['set_name']);})
                .on("mouseout", function(){
                  d3.select("#tooltip").remove();
                });

            bars.exit().remove();
            });
        }

        console.log("left chart function")
            chart.margin = function(_) {
              if (!arguments.length) return margin;
              margin = _;
              return chart;
            };

            chart.width = function(_) {
              if (!arguments.length) return width;
              width = _;
              return chart;
            };

            chart.height = function(_) {
              if (!arguments.length) return height;
              height = _;
              return chart;
            };

            chart.x = function(_) {
              if (!arguments.length) return xValue;
              xValue = _;
              return chart;
            };

            chart.y = function(_) {
              if (!arguments.length) return yValue;
              yValue = _;
              return chart;
            };


console.log("Test4");
console.log(chart);

return chart;
}
