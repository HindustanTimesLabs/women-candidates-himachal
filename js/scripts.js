var isMobile = false; //initiate as false

// responsiveness
var w=window,
dw=document,
ew=dw.documentElement,
gw=dw.getElementsByTagName('body')[0]
var ww = w.innerWidth||ew.clientWidth||gw.clientWidth
if (ww <= 768){
  // mobile
  isMobile = true;

} else {
  //desktop 
  
}

keys_one = ['female_con_per', 'male_con_per'], keys_two = ['female_win_per', 'male_win_per']

var q = d3.queue()
    .defer(d3.csv, "data/data-summary.csv?v1")
    .await(ready);

function ready(error, summary){
    var x_var = "year";
    var setup = d3.marcon()
        .top(20)
        .bottom(20)
        .left(10)
        .right(10)
        .element('.chart-image-con')
        .width(window.innerWidth<=850?ww*0.97:850)
        .height(window.innerWidth<=850?300:380);

    setup.render();

    var width = setup.innerWidth(), height = setup.innerHeight(), svg = setup.svg();

    var color = d3.scaleOrdinal(["#BD313E","#D3D3D3"])

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .domain(_.pluck(summary,'year'))
        .padding(.25);

    var x2 = d3.scaleBand()
        .rangeRound([0, width])
        .domain(_.pluck(summary,'year').slice(0, -1))
        .padding(.25);

    var y = d3.scaleLinear()
        .rangeRound([ height, 0])
        .domain([0,100]);

    var x_axis = d3.axisBottom(x).ticks(2).tickFormat(function(d,i){
      if (ww<600){
        if (i==0 || d=='2017'){
          return d
        } else {
          return "'"+d.toString().slice(-2);
        }
      } else {
        return d
      }
    });

    var x_axis_2 = d3.axisBottom(x2).ticks(2).tickFormat(function(d,i){
      if (ww<600){
        if (i==0 || d=='2017'){
          return d
        } else {
          return "'"+d.toString().slice(-2);
        }
      } else {
        return d
      }
    });

    var y_axis = d3.axisRight(y)
      .tickSize(width)
      .ticks(window.innerWidth<=850?5:10)
      .tickFormat(function(d, i, ticks){ return i == ticks.length - 1 ? d + "%" : d; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis);

    svg.append("g")
        .attr("class", "y axis")
        .call(customYAxis);

    var stack = d3.stack()
        .keys(keys_one)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    function customYAxis(g) {
      g.call(y_axis);
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#bbb").attr("stroke-dasharray", "2,2");
      g.selectAll(".tick text").attr("x", -10).attr("dy", -4);
    }

    keys_one.forEach(function(key, key_index){

        var bar = svg.selectAll(".bar-" + key)
            .data(stack(summary)[key_index], function(d){ return d.data[x_var] + "-" + key; });

        bar
          .transition()
            .attr("x", function(d){ return x(d.data[x_var]); })
            .attr("y", function(d){ return y(d[1]); })
            .attr("height", function(d){ return y(d[0]) - y(d[1]); });

        bar.enter().append("rect")
            .attr("class", function(d){ return "bar bar-" + key; })
            .attr("x", function(d){ return x(d.data[x_var]); })
            .attr("y", function(d){ return y(d[1]); })
            .attr("height", function(d){ return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("fill", function(d){ return color(key); })

      });    

    // second chart
    var setup2 = d3.marcon()
        .top(20)
        .bottom(20)
        .left(10)
        .right(10)
        .element('.chart-image-win')
        .width(window.innerWidth<=850?ww*0.97:850)
        .height(window.innerWidth<=850?300:380);

    setup2.render();
    svg2 = setup2.svg()

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis_2);

    svg2.append("g")
        .attr("class", "y axis")
        .call(customYAxis);

    var stack2 = d3.stack()
        .keys(keys_two)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    keys_two.forEach(function(key, key_index){

        var bar2 = svg2.selectAll(".bar-" + key)
            .data(stack2(_.filter(summary,function(d){
              return d.year!=2017
            }))[key_index], function(d){ return d.data[x_var] + "-" + key; });

        bar2
          .transition()
            .attr("x", function(d){ return x2(d.data[x_var]); })
            .attr("y", function(d){ return y(d[1]); })
            .attr("height", function(d){ return y(d[0]) - y(d[1]); });

        bar2.enter().append("rect")
            .attr("class", function(d){ return "bar bar-" + key; })
            .attr("x", function(d){ return x2(d.data[x_var]); })
            .attr("y", function(d){ return y(d[1]); })
            .attr("height", function(d){ return y(d[0]) - y(d[1]); })
            .attr("width", x2.bandwidth())
            .attr("fill", function(d){ return color(key); })

      });    
}


