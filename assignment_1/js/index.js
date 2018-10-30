var data = [
	{
date: "2018-09-24",
	m: 1.7
  },
  {
date: "2018-09-23",
	m: 1.2
  },
  {
date: "2018-09-22",
	m: 3.6
  },
	{
date: "2018-09-21",
	m: 8
},
	{
date: "2018-09-20", 
	m: 4.3
},
	{
date: "2018-09-19", 
	m: 1.9
},
	{
date: "2018-09-18", 
	m: 2.2
},
	{
date: "2018-09-21", 
	m: 8
},
	{
date: "2018-09-17", 
	m: 2.2
},
	{
date: "2018-09-16", 
	m: 3.7
},
	{
date: "2018-09-15", 
	m: 5
},
	{
date: "2018-09-14", 
	m: 2.4
}
 ,
	{
date: "2018-09-13", 
	m: 0.02
},
	{
date: "2018-09-12", 
	m: 2.6
},
	{
date: "2018-09-11", 
	m: 1.6
},
	{
date: "2018-09-10", 
	m: 1.9
},
	{
date: "2018-09-09", 
	m: 1
},
	{
date: "2018-09-08", 
	m: 1.8
},
	{
date: "2018-09-07", 
	m: 7.3
},
	{
date: "2018-09-06", 
	m: 0.12
},
	{
date: "2018-09-05", 
	m: 0.1
},
	{
date: "2018-09-04", 
	m: 2
},
	{
date: "2018-09-03", 
	m: 0.93
},
	{
date: "2018-09-02", 
	m: 3
}
];



var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
  .x(function(d) {return x(parseTime(d.date));})
	.y(function(d) {return y(d.m);});

  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y.domain(d3.extent(data, function(d) { return d.m; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
     .attr("transform", "translate(" + (width)/2 + ",15)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Date (September 2018)");


  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Distance, Miles");

 g
  .selectAll("path.pt")
  .data(data)
  .enter()
  .append("path")
  .datum(data.sort(function (a, b) {
        return x(parseTime(a.date)) - x(parseTime(b.date));
        }))
      .attr("d", line)
      .attr("stroke", "steelblue")
      .attr("fill", "none")
      .attr("stroke-width", "2")
      .attr("stroke-dasharray", "5 5");

 g.append("text")
        .text("Jog & dancing (Cambridge)")
        .attr("y", y(7.3))
        .attr("x", x(parseTime('2018-09-07')));

g.append("text")
        .text("Party (Nolita)")
        .attr("y", y(5))
        .attr("x", x(parseTime('2018-09-15')));

 g.append("text")
        .text("Walk Midtown->Tribeca")
        .attr("y", y(8))
        .attr("x", x(parseTime('2018-09-21')));