/* global d3, crossfilter, timeSeriesChart, barChart */
var colorchart1 = colorChart();
  .x(function (d) { console.log(d.key); return d.key;})
  .y(function (d) { console.log(d.value); return d.value;});

d3.csv("data/lego_sample.csv",
  function (d) {
    d.sort(function (a, b) {
      return a['year'] - b['year'] || a['color_rgb'] - b['color_rgb'];
    })
    return d;
  },
  function (err, data) {

    if (err) throw err;

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


    function update() {
      console.log(data);
      d3.select("#colorChart")
      //tried with .datum(data) also
      //example passes crossfilter object here rather than data object but we need more attributes
        .datum([data])
        .call(colorChart1);
      }

    update();
}
);
