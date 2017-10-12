# Assessment 2 - Interactive Bar Chart

For this assignment I've cleaned a self chosen dataset and made it interactive in a bar chart with d3@4.

![][cover]

## Background

First I've chosen a dataset from 'Gemeente Amsterdam'. This data consist all students and the different educations between 2013 and 2017 in Amsterdam. Then I started thinking of the best graph of showing this data.

My choice was a bar chart. I've picked a bar chart in d3@4 from [d3noob - Basic bar chart](https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4) and made the chart working locally.

Then I started cleaning the data and put in the chart. Eventually I've made it interactive. Here a overview of the changes I've made to the different files:

### index.html

- Moved Javascript and CSS into separate files.
- Added D3@4 library
- Linked to Javascript and CSS files.
- Added heading
- Added a section element for the svg
- Added a button wrapper for the sort buttons

### index.css

- Added basic styles to the body and heading
- Removed tick lines from graph
- Changed colors of the graph
- Added button styles

### index.txt

- Put in the data from [ois.amsterdam.nl](http://www.ois.amsterdam.nl/feiten-en-cijfers/amsterdam/bevolking/)

### index.js

- Cleaned the data and stored it in a `data` variable

```javascript

d3.text('index.txt')
  .get(onload);

function onload(err, doc) {
  if (err) throw err;

  var data = [];

  var header = doc.indexOf('2013');
  var headerEnd = doc.indexOf('\n', header);
  doc = doc.slice(headerEnd).trim();

  data = d3.csvParseRows(doc, map);

  function map(d) {
    return {
      date: d[0],
      amount: (Number(d[2])),
      edu: d[1],
    };
  }

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
```

- Picked a basic bar chart from [d3noob - Basic bar chart](https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4) and copy it to the js file and made it work with the parsed data

- Made an index variable which determines the position of the array

```javascript
  var index = 0;
```

- Scale the range of the data in the domains and make it work with the chart

```javascript

x.domain(data.map(function(d) {
  return d.values[index].edu;
}));
y.domain([0, d3.max(data, function(d) {
  return d.values[index].amount;
})]);
```

- Added a tool-tip to the rectangles

  ```javascript
  .on("mouseover", function(d) {
  tooltip.text("Amount:" + " " + d.values[index].amount);
  tooltip.style("visibility", "visible");
  })
  .on("mousemove", function() {
  return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
  })
  .on("mouseout", function() {
  return tooltip.style("visibility", "hidden");
  })
  ```

- Added an intro transition

  ```javascript
  .attr("height", 0)
  .transition()
  .duration(200)
  .delay(function(d, i) {
  return i * 250;
  })
  ```

- Added interactivity trough clickable buttons to switch between data per year for this I have written own javascript functions which fires when the button is clicked

```javascript

d3.select('.button-wrapper').append('button').on('click', nextYear)
  .attr('class', 'trigger-button nextYear')
  .text('Year >');

d3.select('.button-wrapper').append('button').on('click', prevYear)
  .attr('class', 'trigger-button prevYear')
  .text('< Year');
```

- Function that gets called when next year button is clicked

```javascript
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

    update();
  }
```

- Update function to update the data when button is clicked

  ```javascript
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

    d3.select(".year")
      .data(data)
      .text(year);

    function year(d) {
      return d.values[index].date;
    }
  }
  ```

  - Gets year from data index and displays the current year

  ```javascript
  d3.select(".year")
    .data(data)
    .text(year);

  //Get year from data
  function year(d) {
    return d.values[index].date;
  }

  ```

## Data

The data originates from [ois.amsterdam.nl](http://www.ois.amsterdam.nl/feiten-en-cijfers/amsterdam/bevolking/) By downloading this dataset, I got a .txt file that had a lot of information. Consist the year of research, the level of education and the amount of students in Amsterdam

- `date` -- Year of research
- `education` -- The level of education
- `amount` -- Amount of students of a certain education level

## Features

- [d3.scaleBand](https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
- [d3.csvParseRows](https://github.com/d3/d3-dsv/blob/master/README.md#csvParseRows)
- [d3.nest](https://github.com/d3/d3-collection/blob/master/README.md#nest)
- [d3.map](https://github.com/d3/d3-collection/blob/master/README.md#map)
-[d3.transition](https://github.com/d3/d3-transition/blob/master/README.md#transition)
- [d3.select](https://github.com/d3/d3-selection/blob/master/README.md#select)
- [d3.selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll)
- [_selection_.append](https://github.com/d3/d3-selection/blob/master/README.md#selection_append)
- [_selection_.attr](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr)
- [_selection_.enter](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter)
- [d3.pack](https://github.com/d3/d3-hierarchy/blob/master/README.md#pack)
- [_node_.sum](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_sum)
- [_node_.each](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_each)

## License

[MIT](https://opensource.org/licenses/MIT) © Yoeri Pasmans

[cover]: preview.png
