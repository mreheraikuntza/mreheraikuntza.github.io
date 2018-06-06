var dataForGraph = [];
var dataIndex = 0;
var selected = false;
var selectedIndex = 0;

$(document).ready(function() {
    loadData();
    setInterval(loadData, 10000);
});

function loadData(){
  $.getJSON( "/test.json", function(ardu) {
  var idIndex = 1;
  var sensorIndex = 1;

  $(".info").append("<tr><th>Arduino</th></tr>")
  $.each( ardu, function(key,val){
     $(".info").append("<tr></tr>");
     $(".info").find("tr").eq(idIndex).append("<td>"+key+"</td>");
     idIndex++;
     var tableTitles = $(".info").find("th");
     $.each(val, function(key, val){
        if(sensorIndex == 1){
          $(".info").find("tr").eq(0).append("<th style='text-align:center;'>"+key+"</th>");
	  dataForGraph[dataIndex++] = val.values;
	}

        if(key != "location"){
         data = val.values[val.values.length-1];
        }else{
          data = val;
            $(".info").find("tr").eq(sensorIndex).append("<td style='text-align:center; cursor:pointer' onclick='loadVideo();' onmouseover='onMouse(this, false);' onmouseout='onMouse(this,true);'>"+data+"</td>");
        }
        if(data != undefined && key != "location"){
          data = data.value;
          if(sensorIndex == 1) {
           $(".info").find("tr").eq(sensorIndex).append("<td style='text-align:center; cursor:pointer' onclick='loadGraph(this);' onmouseover='onMouse(this, false);' onmouseout='onMouse(this,true);'>"+data+"</td>");
           $(".info").find("tr").eq(sensorIndex).find("td").eq(dataIndex).attr("abbr", dataIndex);
          }else{
            $(".info").find("tr").eq(sensorIndex).append("<td style='text-align:center;'>"+data+"</td>");
          }
        }else if(data == undefined){
          $(".info").find("tr").eq(sensorIndex).append("<td style='background-color:lightgray;'></td>");
        }
    });
    if(selected){
      loadGraph($(".info").find("tr").eq(sensorIndex).find("td").eq(selectedIndex).get(0));
    }
    sensorIndex++;
  });
});
  $("tr").remove();
  dataForGraph = [];
  dataIndex = 0;
}

function loadGraph(tableCell){
  selectedIndex = tableCell.abbr;
  selected = true;
  var data = dataForGraph[tableCell.abbr-1];
  data = data.slice(Math.max(data.length - 15,1));
  var chart = AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "marginRight": 40,
      "marginLeft": 40,
      "autoMarginOffset": 20,
      "mouseWheelZoomEnabled":true,
      "dataDateFormat": "YYYY-MM-DD HH:MM:SS",
      "valueAxes": [{
          "id": "v1",
          "axisAlpha": 0,
          "position": "left",
          "ignoreAxisWidth":true
      }],
      "balloon": {
          "borderThickness": 1,
          "shadowAlpha": 0
      },
      "graphs": [{
          "id": "g1",
          "balloon":{
            "drop":true,
            "adjustBorderColor":false,
            "color":"#ffffff"
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "bulletSize": 5,
          "hideBulletsCount": 50,
          "lineThickness": 2,
          "title": "red line",
          "useLineColorForBulletBorder": true,
          "valueField": "value",
          "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
      }],
      "chartScrollbar": {
          "graph": "g1",
          "oppositeAxis":false,
          "offset":30,
          "scrollbarHeight": 80,
          "backgroundAlpha": 0,
          "selectedBackgroundAlpha": 0.1,
          "selectedBackgroundColor": "#888888",
          "graphFillAlpha": 0,
          "graphLineAlpha": 0.5,
          "selectedGraphFillAlpha": 0,
          "selectedGraphLineAlpha": 1,
          "autoGridCount":true,
          "color":"#AAAAAA"
      },
      "chartCursor": {
          "pan": true,
          "valueLineEnabled": true,
          "valueLineBalloonEnabled": true,
          "cursorAlpha":1,
          "cursorColor":"#258cbb",
          "limitToGraph":"g1",
          "valueLineAlpha":0.2,
          "valueZoomable":true
      },
      "valueScrollbar":{
        "oppositeAxis":false,
        "offset":50,
        "scrollbarHeight":10
      },
      "categoryField": "timestamp",
      "categoryAxis": {
          "minPeriod": "hh",
          "parseDates": true,
          "dashLength": 1,
          "minorGridEnabled": true
      },
      "export": {
          "enabled": true
      },
      "dataProvider": data
 });
}

function onMouse(tableCell, out){
  if(out){
    tableCell.style.backgroundColor = 'white';
  }else{
    tableCell.style.backgroundColor = 'orange';
  }
}

function loadVideo(){
  $("#my-video").css("display", "block");
}
