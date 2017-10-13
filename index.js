// set the dimensions and margins of the graph
var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);
var y = d3.scaleLinear()
  .range([height, 0]);

// append the svg object to the body of the page
var svg = d3.select("section").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // append a 'group' element to 'svg'
  .append("g")
  // moves the 'group' element to the top left margin
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("section")
  .append("div")
  .attr("class", "tool-tip");

//Gets txt file
d3.text('index.txt')
  .get(onload);

//Start of cleaning the data
function onload(err, doc) {
  if (err) throw err;

  var data = [];

  // Gets index of the header
  var header = doc.indexOf('2013');
  var headerEnd = doc.indexOf('\n', header);
  //Slices off the header of the doc so there's only data
  doc = doc.slice(headerEnd).trim();

  //Parse the rows to csv
  data = d3.csvParseRows(doc, map);

  //Maps the parsed data as properties and returns it as an object
  function map(d) {
    return {
      date: d[0],
      amount: (Number(d[2])),
      edu: d[1],
    };
  }

  //Group the data by name and values
  data = d3.nest()
    .key(function(d) {
      return d.edu;
    })
    .entries(data)

    .map(function(group) {
      return {
        id: group.key,
        values: group.values
      };
    });
  //Variable with the index of the array with data
  var index = 0;

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) {
    return d.values[index].edu;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.values[index].amount;
  })]);


  // append the rectangles for the bar chart
  svg.selectAll(".bar")
    .data(data)

    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.values[index].edu);
    })
    .attr("width", x.bandwidth())
    .attr("y", height)

    //Tool-tip
    .on("mouseover", function(d) {
      tooltip.text("Amount:" + " " + d.values[index].amount);
      tooltip.style("visibility", "visible");
    })
    //Folows cursor
    .on("mousemove", function() {
      return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
    })
    //Intro transition
    .attr("height", 0)

    .transition()
    .duration(1000)
    .delay(function(d, i) {
      return i * 250;
    })
    // .attr("y", "100")
    .attr("y", function(d) {
      return y(d.values[index].amount);
    })
    .attr("height", function(d) {
      return height - y(d.values[index].amount);
    });

  //Gets year div from html and append the text data to it
  d3.select(".year")
    .data(data)
    .text(year);

  //Get year from data
  function year(d) {
    return d.values[index].date;
  }

  // add the x Axis
  svg.append("g")
    .attr('class', 'axisX')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis with ticks as percentage
  svg.append("g")
    .call(d3.axisLeft(y));

  //Add a trigger button and fires sortTrigger function on click
  d3.select('.button-wrapper').append('button').on('click', prevYear)
    .attr('class', 'trigger-button prevYear')
    .text('< Year');

  //Add a trigger button and fires sortTrigger function on click
  d3.select('.button-wrapper').append('button').on('click', nextYear)
    .attr('class', 'trigger-button nextYear')
    .text('Year >');

  if (index === 0) {
    d3.select('.prevYear')
      .style('display', 'none');
  }

  // Select next year function by adding '1' to the index of the date array
  function nextYear() {
    if (index < 4) {
      index++;
      d3.select('.prevYear')
        .style('display', 'inline');
    }
    if (index > 3) {
      d3.select('.nextYear')
        .style('display', 'none');
    } else {
      d3.select('.nextYear')
        .style('display', 'inline');
    }
    //Call update function
    update();
  }

  // Select next year function by removing '1' to the index of the date array
  function prevYear() {
    if (index > 0) {
      index--;
    }
    //If index = 0 don't display previous year button else display next year button
    if (index === 0) {
      d3.select('.prevYear')
        .style('display', 'none');
    } else {
      d3.select('.nextYear')
        .style('display', 'inline');
    }
    update();
  }
  //Update the bars with the new index value
  function update() {
    svg.selectAll(".bar")
      .attr("x", function(d) {
        return x(d.values[index].edu);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.values[index].amount);
      })
      .attr("height", function(d) {
        return height - y(d.values[index].amount);
      });

    //Update year
    d3.select(".year")
      .data(data)
      .text(year);

    //Gets current year from index
    function year(d) {
      return d.values[index].date;
    }
  }

}

//Based on https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
