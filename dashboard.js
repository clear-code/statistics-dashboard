function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

function getYearMonthPairList() {
  var april2017 = new Date("2017/4/1 00:00:00");
  var month = april2017.getMonth()+1;
  var year = april2017.getFullYear();
  var today = new Date();
  var yearList = [];
  var currDate = april2017;
  for (; currDate.getFullYear() < today.getFullYear() ||
           currDate.getMonth() <= today.getMonth();) {
    currDate.setMonth(currDate.getMonth() + 1);
    var forrmattedMonth = currDate.getMonth() < 10 ? '0' + currDate.getMonth() : currDate.getMonth();
    yearList.push(currDate.getFullYear() + '-' + forrmattedMonth);
  }
  return yearList;
}

var contributions = {};
var contributionCountList = [];
var blogs = {};
var blogCountList = [];
var selectableDateList = getYearMonthPairList();

document.addEventListener("DOMContentLoaded", function(event) {
  insertSelectableOption("contribution-selector");
  insertSelectableOption("blog-article-selector");
});

function insertSelectableOption(selector) {
  var contributionSelector = document.getElementById(selector);
  var opt;
  for (var d in selectableDateList)     {
    opt = document.createElement("option");
    opt.value = selectableDateList[d];
    opt.text = selectableDateList[d];
    contributionSelector.appendChild(opt);
  }
}

function displaySelectedMonthContributions(obj)
{
  var urlBase = "https://raw.githubusercontent.com/clear-code/statistics/master/upstream-feedback/";
  var idx = obj.selectedIndex;
  var value = obj.options[idx].value;
  var text  = obj.options[idx].text;

  httpGetAsync(urlBase + value + ".csv", function(data) {
    var lines = data.split("\n");
    contributions[value] = lines.length;
    contributionCountList = [];
    for (var c in contributions) {
      contributionCountList.push(contributions[c]);
    }
    displayBarGraph('.chart', contributionCountList, value);
  });
}

function displaySelectedMonthBlogs(obj)
{
  var urlBase = "https://raw.githubusercontent.com/clear-code/statistics/master/blog/";
  var idx = obj.selectedIndex;
  var value = obj.options[idx].value;
  var text  = obj.options[idx].text;

  httpGetAsync(urlBase + value + ".csv", function(data) {
    var lines = data.split("\n");
    blogs[value] = lines.length;
    blogCountList = [];
    for (var b in blogs) {
      blogCountList.push(blogs[b]);
    }
    displayBarGraph('.blog-chart', blogCountList, value, {width: 10});
  });
}

function displayBarGraph(klass, data, value, params) {
  var baseWidth;
  if(params && params.width)
    baseWidth = params.width;
  else
    baseWidth = 1;
  d3.select(klass)
    .selectAll('div')
    .data(data)
    .enter().append('div')
    .style('width', function(d) {
      return d * 5 * baseWidth + 'px';
    })
    .text(function(d) {
      return d + '(' + value + ')';
    });
}
