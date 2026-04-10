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
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

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
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.98125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxX37e-Pr6PxBdFfY_CC8VTKHmxcJLTMbMvWy7uheBBDt4ZiVtFIoOxlHCwP_-dQnV7vY05dNKVepKXpawnP9IcW90avj8hxDAzf__r0CWzPjNCOJ1luWXIE9oIjiX-hf9nutCxwZydT1iVV7PuJ0vou9qOHugSgsJLP0xV_0YI7KRskbnE-ygeDtqiV/_=adslot&_vodaaffi_cruzing.xyz/adbox__adtech_-360"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-361"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/i/ca-pub-1874186634672982-314"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-362"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-363"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/docs-331"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/lightbulb.svg-346"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/complete/search-291"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809367443&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=2&sr=1920x1080&ul=en-us&_s=3&tag_exp=0~115938465~115938469~117512543~117884344~118442252&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=user_engagement&_et=2005&tfd=27632-315"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/sodar-359"], "isController": false}, {"data": [0.0, 500, 1500, "Dummy JSON/pagead/sodar-316"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/css/docs.css-334"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809367443&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AEAAAAQ&ae=a&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=2&sr=1920x1080&ul=en-us&tag_exp=0~115938465~115938469~117512543~117884344~118442252&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&_s=2&tfd=14457-355"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxU_itGna9oSgmg3OGSKZqc24DdkWd2OtEK6HpFvC-GRlmYU-qQLbhVbE7UzGockmxnLpZHfaFx7GPOrToaFJY2YpNpOwZ-rRQJvgEofv7aaxAlQ4E8-tP_6YhlgQudNg8tXt4PU_g==-358"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/github.svg-298"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/common.min.js-337"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809391421&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=15&sr=1920x1080&ul=en-us&_s=2&tag_exp=0~115616986~115938466~115938469~117266400~117512543~118442251&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=user_engagement&_et=2059&tfd=2245-352"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/sodar-353"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/cdn-cgi/rum?-332"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/star.svg-309"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxXArN8FKp-hesXtZ3EC2836ibTE7CFJZU0dd6Cl2HNT3XFRf3HlvZgdKExCoKPPOQ77GteWj35c0grL-JuN4cnZoleyyDtUkEQce9wm1_gdEygNwHK6jianfCcuAK5mOeSfY4bgb3EAwJhtHr7dCGSpp2n0lK-fgGpqogTJH6Y0tIUiHBa-8WsG9JxK/_/ero.htm.adserver1./ads/rotate_/adscalecontentad._dfp.php-323"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-364"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/github.svg-339"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/custom-response.min.js-297"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/home.svg-342"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxVhYs_odQquyirlDzOLFLVM6imVeGTurAVU9y_0f_N749gBnlVtooYfun_Q2YqQO78f4oCSF1p6ejEwJYzNeP-pAV5dibZbOdC9bfjhqxGWjuXQJTNxs46OhzzqcQbokFrJsYhqAA==-327"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxXiPNtZyDDLNmUHuGnAj5EBY3mRy8sZnboSynVwO1pnGHU4Ut7MnASPHYj6jmpWjNWlW4MCqAOaBViQHkHxUwwL-E433WZKE_4mHO1hWtt19uHAEDEjzDgvYhmUD8MQB2OJD3RVqg==-320"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/sodar-321"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/ads-311"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/star-alt.svg-310"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/link.svg-345"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/common.min.js-295"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/generate_204-354"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/cdn-cgi/rum?-349"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/linkedin.svg-344"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/generate_204-317"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-357"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxXfVCP4UoKF8W32qHJkCSQjG_63AkOordpvR-VdbUxJjMsIBJ8fPN0Kphj9XMy92i8QzThv0TcuWTNJqrWRmXV1kMzGKtnKa-tcmocfEAVYdQmV4AVmUs3aWs0On0x2qzJdt3V5WQ==-329"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/linkedin.svg-308"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/multiple-options.svg-303"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809391421&gcd=13l3l3l3l1l1&npa=0&dma=0&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=15&sr=1920x1080&ul=en-us&_s=1&tag_exp=0~115616986~115938466~115938469~117266400~117512543~118442251&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=page_view&_ee=1&tfd=2245-351"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-356"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/f/AGSKWxVuKljuSi5nU2UCgF_POEGQd7tvPevz8-CRbOxzr-LJdVIrlUJNxn1an40bpjhcR68Uj4F9SRT1O2ASScpxzP6B4HIeVEPtYQNEO39RvVynKilMlwttY73MJqdYSO74qGvEWrtsng==-330"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/prism.min.js-335"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/script.min.js-294"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-325"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/prism.min.js-338"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-326"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-324"], "isController": false}, {"data": [0.5, 500, 1500, "Product Flow"], "isController": true}, {"data": [1.0, 500, 1500, "Dummy JSON/getconfig/sodar-312"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-322"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/docs.min.js-336"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/coffee.svg-340"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/ads-347"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/css/styles.css-293"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/-292"], "isController": false}, {"data": [1.0, 500, 1500, "GET - Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/bar.svg-341"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/cdn-cgi/rum?-313"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-318"], "isController": false}, {"data": [1.0, 500, 1500, "POST - Login"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/twitter_x.svg-307"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-319"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/placeholder-image.svg-304"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/hero-image.svg-301"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/magic-wand.svg-305"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/pagead/ping?e=1-328"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/css/prism.css-333"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/getconfig/sodar-348"], "isController": false}, {"data": [1.0, 500, 1500, "GET - Products"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/js/custom-json-highlight.min.js-296"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/lorem-placeholder.svg-302"], "isController": false}, {"data": [1.0, 500, 1500, "GET - Single Product"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/coffee.svg-306"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/arrow-down-1.svg-300"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/bar.svg-299"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/public/img/icons/twitter_x.svg-343"], "isController": false}, {"data": [1.0, 500, 1500, "Dummy JSON/i/ca-pub-1874186634672982-350"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 79, 0, 0.0, 189.1898734177216, 2, 8284, 91.0, 198.0, 335.0, 8284.0, 0.620508188351726, 2.6606313572634805, 0.6378050381926718], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Dummy JSON/f/AGSKWxX37e-Pr6PxBdFfY_CC8VTKHmxcJLTMbMvWy7uheBBDt4ZiVtFIoOxlHCwP_-dQnV7vY05dNKVepKXpawnP9IcW90avj8hxDAzf__r0CWzPjNCOJ1luWXIE9oIjiX-hf9nutCxwZydT1iVV7PuJ0vou9qOHugSgsJLP0xV_0YI7KRskbnE-ygeDtqiV/_=adslot&_vodaaffi_cruzing.xyz/adbox__adtech_-360", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 20.471305490654206, 6.1970648364485985], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-361", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 16.556766055045873, 6.737385321100917], "isController": false}, {"data": ["Dummy JSON/i/ca-pub-1874186634672982-314", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 237.51302083333334, 1.6373697916666667], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-362", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 17.52123786407767, 7.1298543689320395], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-363", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 16.40625, 6.702769886363637], "isController": false}, {"data": ["Dummy JSON/docs-331", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 249.267578125, 44.64285714285714], "isController": false}, {"data": ["Dummy JSON/public/img/icons/lightbulb.svg-346", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 101.72526041666667, 103.67838541666667], "isController": false}, {"data": ["Dummy JSON/complete/search-291", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 6.0946912650602405, 1.9001788403614457], "isController": false}, {"data": ["Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809367443&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=2&sr=1920x1080&ul=en-us&_s=3&tag_exp=0~115938465~115938469~117512543~117884344~118442252&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=user_engagement&_et=2005&tfd=27632-315", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 5.470069679054054, 6.33445945945946], "isController": false}, {"data": ["Dummy JSON/pagead/sodar-359", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 3.6754261363636362, 14.772727272727273], "isController": false}, {"data": ["Dummy JSON/pagead/sodar-316", 1, 0, 0.0, 8284.0, 8284, 8284, 8284.0, 8284.0, 8284.0, 8284.0, 0.12071463061323032, 0.04880454792370835, 0.06931660429744084], "isController": false}, {"data": ["Dummy JSON/public/css/docs.css-334", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 332.763671875, 97.412109375], "isController": false}, {"data": ["Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809367443&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AEAAAAQ&ae=a&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=2&sr=1920x1080&ul=en-us&tag_exp=0~115938465~115938469~117512543~117884344~118442252&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&_s=2&tfd=14457-355", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.859905946601942, 11.1498786407767], "isController": false}, {"data": ["Dummy JSON/f/AGSKWxU_itGna9oSgmg3OGSKZqc24DdkWd2OtEK6HpFvC-GRlmYU-qQLbhVbE7UzGockmxnLpZHfaFx7GPOrToaFJY2YpNpOwZ-rRQJvgEofv7aaxAlQ4E8-tP_6YhlgQudNg8tXt4PU_g==-358", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 46.688304227941174, 8.401309742647058], "isController": false}, {"data": ["Dummy JSON/public/img/icons/github.svg-298", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 142.04545454545456, 111.15056818181819], "isController": false}, {"data": ["Dummy JSON/public/js/common.min.js-337", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 76.3888888888889, 63.58506944444445], "isController": false}, {"data": ["Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809391421&gcd=13l3l3l3l1l1&npa=0&dma=0&tcfd=10000&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=15&sr=1920x1080&ul=en-us&_s=2&tag_exp=0~115616986~115938466~115938469~117266400~117512543~118442251&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=user_engagement&_et=2059&tfd=2245-352", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 7.637455778301887, 8.936468160377359], "isController": false}, {"data": ["Dummy JSON/pagead/sodar-353", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.8673537234042556, 4.0724734042553195], "isController": false}, {"data": ["Dummy JSON/cdn-cgi/rum?-332", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 72.04861111111111, 224.39236111111111], "isController": false}, {"data": ["Dummy JSON/public/img/icons/star.svg-309", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 116.43629807692308, 95.47776442307693], "isController": false}, {"data": ["Dummy JSON/f/AGSKWxXArN8FKp-hesXtZ3EC2836ibTE7CFJZU0dd6Cl2HNT3XFRf3HlvZgdKExCoKPPOQ77GteWj35c0grL-JuN4cnZoleyyDtUkEQce9wm1_gdEygNwHK6jianfCcuAK5mOeSfY4bgb3EAwJhtHr7dCGSpp2n0lK-fgGpqogTJH6Y0tIUiHBa-8WsG9JxK/_/ero.htm.adserver1./ads/rotate_/adscalecontentad._dfp.php-323", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 21.2890625, 6.436011904761905], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-364", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 17.1875, 6.9940476190476195], "isController": false}, {"data": ["Dummy JSON/public/img/icons/github.svg-339", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 157.421875, 122.65625], "isController": false}, {"data": ["Dummy JSON/public/js/custom-response.min.js-297", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 146.69363839285714, 82.10100446428571], "isController": false}, {"data": ["Dummy JSON/public/img/icons/home.svg-342", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 121.6796875, 122.4609375], "isController": false}, {"data": ["Dummy JSON/f/AGSKWxVhYs_odQquyirlDzOLFLVM6imVeGTurAVU9y_0f_N749gBnlVtooYfun_Q2YqQO78f4oCSF1p6ejEwJYzNeP-pAV5dibZbOdC9bfjhqxGWjuXQJTNxs46OhzzqcQbokFrJsYhqAA==-327", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 28.246454831932773, 9.626116071428571], "isController": false}, {"data": ["Dummy JSON/f/AGSKWxXiPNtZyDDLNmUHuGnAj5EBY3mRy8sZnboSynVwO1pnGHU4Ut7MnASPHYj6jmpWjNWlW4MCqAOaBViQHkHxUwwL-E433WZKE_4mHO1hWtt19uHAEDEjzDgvYhmUD8MQB2OJD3RVqg==-320", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 55.71546052631579, 9.482935855263158], "isController": false}, {"data": ["Dummy JSON/pagead/sodar-321", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 4.083806818181818, 16.276041666666664], "isController": false}, {"data": ["Dummy JSON/pagead/ads-311", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 6.925166560913706, 7.653870558375634], "isController": false}, {"data": ["Dummy JSON/public/img/icons/star-alt.svg-310", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 126.220703125, 103.759765625], "isController": false}, {"data": ["Dummy JSON/public/img/icons/link.svg-345", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 83.13802083333334, 82.6171875], "isController": false}, {"data": ["Dummy JSON/public/js/common.min.js-295", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 91.40625, 76.04166666666667], "isController": false}, {"data": ["Dummy JSON/generate_204-354", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 2.4956597222222223, 7.839626736111112], "isController": false}, {"data": ["Dummy JSON/cdn-cgi/rum?-349", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 3.8828592814371254, 10.923465568862275], "isController": false}, {"data": ["Dummy JSON/public/img/icons/linkedin.svg-344", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 36.63429054054054, 33.203125], "isController": false}, {"data": ["Dummy JSON/generate_204-317", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 1.9745879120879122, 6.202781593406594], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-357", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 15.970685840707963, 6.723589601769912], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxXfVCP4UoKF8W32qHJkCSQjG_63AkOordpvR-VdbUxJjMsIBJ8fPN0Kphj9XMy92i8QzThv0TcuWTNJqrWRmXV1kMzGKtnKa-tcmocfEAVYdQmV4AVmUs3aWs0On0x2qzJdt3V5WQ==-329", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 9.0673828125, 3.6669921875], "isController": false}, {"data": ["Dummy JSON/public/img/icons/linkedin.svg-308", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 123.57954545454547, 111.328125], "isController": false}, {"data": ["Dummy JSON/public/img/multiple-options.svg-303", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 370.0284090909091, 111.50568181818183], "isController": false}, {"data": ["Dummy JSON/g/collect?v=2&tid=G-TPY1RGQLFR&gtm=45je6481v9189409260za200zd9189409260&_p=1775809391421&gcd=13l3l3l3l1l1&npa=0&dma=0&_eu=AAAAAAQ&cid=1985409787.1775735014&frm=0&pscdl=noapi&rcb=15&sr=1920x1080&ul=en-us&_s=1&tag_exp=0~115616986~115938466~115938469~117266400~117512543~118442251&sid=1775809297&sct=4&seg=1&dl=https%3A%2F%2Fdummyjson.com%2F&dt=DummyJSON%20-%20Free%20Fake%20REST%20API%20for%20Placeholder%20JSON%20Data&en=page_view&_ee=1&tfd=2245-351", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 5.433357802013423, 6.226405201342282], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxUpC89kCOJ4MuOD_p3D6_ppfbRcy7J9C6dYkK-OSSxyslGHxOpje_4Dj277IL8vx3EnJIoDQwQvdw0Qo7PGCbk_Xw0M6hEZJqWsFBPkxzLsU8nuhmgD4Rpc4UkyFoSgU2VQuKK2mQ==-356", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 15.830592105263158, 6.681743421052631], "isController": false}, {"data": ["Dummy JSON/f/AGSKWxVuKljuSi5nU2UCgF_POEGQd7tvPevz8-CRbOxzr-LJdVIrlUJNxn1an40bpjhcR68Uj4F9SRT1O2ASScpxzP6B4HIeVEPtYQNEO39RvVynKilMlwttY73MJqdYSO74qGvEWrtsng==-330", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 33.89937789351852, 10.588469328703704], "isController": false}, {"data": ["Dummy JSON/public/js/prism.min.js-335", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 495.6868489583333, 95.29622395833333], "isController": false}, {"data": ["Dummy JSON/public/js/script.min.js-294", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 54.4921875, 38.020833333333336], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-325", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 16.710069444444443, 6.82689525462963], "isController": false}, {"data": ["Dummy JSON/public/js/prism.min.js-338", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 660.2647569444445, 127.06163194444446], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-326", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 17.025353773584907, 6.928066037735849], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-324", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 17.86819306930693, 7.2710396039603955], "isController": false}, {"data": ["Product Flow", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 28.433128384476536, 3.9544317839951866], "isController": true}, {"data": ["Dummy JSON/getconfig/sodar-312", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 41.35960820895522, 1.4546408582089552], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-322", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 14.864561987704919, 6.019467213114754], "isController": false}, {"data": ["Dummy JSON/public/js/docs.min.js-336", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 202.83203125, 114.2578125], "isController": false}, {"data": ["Dummy JSON/public/img/icons/coffee.svg-340", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 166.015625, 111.50568181818183], "isController": false}, {"data": ["Dummy JSON/pagead/ads-347", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 6.749896751101321, 7.059643447136564], "isController": false}, {"data": ["Dummy JSON/public/css/styles.css-293", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 315.19990808823525, 68.64659926470588], "isController": false}, {"data": ["Dummy JSON/-292", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 411.5234375, 80.46875], "isController": false}, {"data": ["GET - Cart", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 11.006673177083334, 6.586710611979167], "isController": false}, {"data": ["Dummy JSON/public/img/icons/bar.svg-341", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 147.216796875, 152.9541015625], "isController": false}, {"data": ["Dummy JSON/cdn-cgi/rum?-313", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 92.07589285714286, 256.4174107142857], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-318", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 9.160850253807107, 3.8665926395939083], "isController": false}, {"data": ["POST - Login", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 6.647518382352941, 0.5399816176470589], "isController": false}, {"data": ["Dummy JSON/public/img/icons/twitter_x.svg-307", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 142.68663194444446, 136.1762152777778], "isController": false}, {"data": ["Dummy JSON/el/AGSKWxU3tL4dpKN8T-OKV72TSUoeyxSN_TkpOUAh8Ev9q3Jpd79aGHZeg-pq6QrRY9Z67L4l6at3LCML3fzu3n-1NLeuJRUGO8dgx9FZ5yvvQSeSU9bJct-si8qqxJNeIeup-CzvGvj1BQ==-319", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 14.776511270491804, 6.227587090163935], "isController": false}, {"data": ["Dummy JSON/public/img/placeholder-image.svg-304", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 219.51729910714286, 87.68136160714286], "isController": false}, {"data": ["Dummy JSON/public/img/hero-image.svg-301", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 368.0752840909091, 110.97301136363637], "isController": false}, {"data": ["Dummy JSON/public/img/icons/magic-wand.svg-305", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 133.49609375, 122.65625], "isController": false}, {"data": ["Dummy JSON/pagead/ping?e=1-328", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 4.631952408256881, 8.986166857798166], "isController": false}, {"data": ["Dummy JSON/public/css/prism.css-333", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 150.5681818181818, 106.3565340909091], "isController": false}, {"data": ["Dummy JSON/getconfig/sodar-348", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 71.88727094240838, 2.551333442408377], "isController": false}, {"data": ["GET - Products", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 81.65640782828282, 4.542495265151515], "isController": false}, {"data": ["Dummy JSON/public/js/custom-json-highlight.min.js-296", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 117.71334134615385, 88.8671875], "isController": false}, {"data": ["Dummy JSON/public/img/lorem-placeholder.svg-302", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 317.138671875, 102.294921875], "isController": false}, {"data": ["GET - Single Product", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 157.5927734375, 55.7861328125], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 357.421875, 0.0], "isController": false}, {"data": ["Dummy JSON/public/img/icons/coffee.svg-306", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 182.03125, 122.265625], "isController": false}, {"data": ["Dummy JSON/public/img/icons/arrow-down-1.svg-300", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 95.6280048076923, 94.50120192307693], "isController": false}, {"data": ["Dummy JSON/public/img/icons/bar.svg-299", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 117.3828125, 121.97265625], "isController": false}, {"data": ["Dummy JSON/public/img/icons/twitter_x.svg-343", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 116.03338068181819, 111.77201704545455], "isController": false}, {"data": ["Dummy JSON/i/ca-pub-1874186634672982-350", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 211.88517011834318, 1.4735114644970413], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 79, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
