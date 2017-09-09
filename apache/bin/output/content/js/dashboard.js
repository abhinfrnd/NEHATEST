/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
			"color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, " 1/ username- 2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05"], "isController": false}, {"data": [0.0, 500, 1500, "34 / username-3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05"], "isController": false}, {"data": [0.0, 500, 1500, "http://www.vedamtech.com/index.html"], "isController": false}, {"data": [0.0, 500, 1500, "34 / username-1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05"], "isController": false}, {"data": [0.0, 500, 1500, " 1/ username- 1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05"], "isController": false}, {"data": [0.0, 500, 1500, "34 / username-2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05"], "isController": false}, {"data": [0.0, 500, 1500, " 1/ username- 3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9, 9, 100.0, 4737.0, 12091.0, 12091.0, 12091.0, 0.3724857213806804, 0.6933585666542506, 0.0, 0, 12091], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "items": [{"data": [" 1/ username- 2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, 100.0, 2219.0, 2219.0, 2219.0, 2219.0, 0.45065344749887337, 0.8889843397926994, 0.0, 2219, 2219], "isController": false}, {"data": ["34 / username-3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05", 1, 1, 100.0, 1.0, 1.0, 1.0, 1.0, 1000.0, 1972.65625, 0.0, 1, 1], "isController": false}, {"data": ["http://www.vedamtech.com/index.html", 3, 3, 100.0, 9440.0, 12021.0, 12021.0, 12021.0, 0.24939728988278326, 0.3928494419735639, 0.0, 4282, 12021], "isController": false}, {"data": ["34 / username-1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, 100.0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN, 0, 0], "isController": false}, {"data": [" 1/ username- 1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, 100.0, 12091.0, 12091.0, 12091.0, 12091.0, 0.08270614506657845, 0.17898126705814243, 0.0, 12091, 12091], "isController": false}, {"data": ["34 / username-2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, 100.0, 1.0, 1.0, 1.0, 1.0, 1000.0, 1972.65625, 0.0, 1, 1], "isController": false}, {"data": [" 1/ username- 3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05", 1, 1, 100.0, 1.0, 1.0, 1.0, 1.0, 1000.0, 1972.65625, 0.0, 1, 1], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Percentile 1
            case 5:
            // Percentile 2
            case 6:
            // Percentile 3
            case 7:
            // Throughput
            case 8:
            // Kbytes/s
            case 9:
            // Sent Kbytes/s
            case 10:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);
    
    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.vedamtech.com", 3, 33.333333333333336, 33.333333333333336], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 6, 66.66666666666667, 66.66666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9, 9, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 6, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.vedamtech.com", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [" 1/ username- 2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 / username-3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["http://www.vedamtech.com/index.html", 3, 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.vedamtech.com", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 / username-1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [" 1/ username- 1 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 / username-2 192.168.190.6 TestingWorld  2017-08-27T11:39:20+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [" 1/ username- 3 192.168.190.6 TestingWorld  2017-08-27T11:39:28+05", 1, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: angular-file-upload.appspot.com", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
