"use strict";

function loadData(callback) {
    d3.csv("data/data2010.csv").get(function(error, rows) {
        var data = {};
        for (var i = 0; i < rows.length; ++i) {
            var row = rows[i];
            data[row.kraj] = row;
        }
        callback(data);
    });
}

function getChoropleth(data, columnName, colors) {
    var choropleth = {};
    for (var key in data) {
        var value = data[key][columnName];
        choropleth[key] = colors(value);
    }
    return choropleth;
}

function getCountryPopupTemplate() {
    var source = $("#country-popup-template").html();
    return Handlebars.compile(source);
}

function indicatorsList(obj) {
    var list = [];
    for (var property in obj) {
        var value = obj[property];
        if ($.isNumeric(value)) {
            list.push({name: property, value: Math.round(value * 100) / 100});
        }
    }
    return list;
}

function getAnyKey(obj) {
    for (var property in obj) {
        return property;
    }
}

function getIndicatorNames(data) {
    var list = [];
    var anyData = data[getAnyKey(data)];
    for (var property in anyData) {
        if ($.isNumeric(anyData[property])) {
            list.push({name: property});
        }
    }
    return list;
}

function renderSwitch(data, colors, map) {
    var list = getIndicatorNames(data);
    var source = $("#switch-list-template").html();
    var template = Handlebars.compile(source);
    var html = template({indicators: list});
    $("#switch").html(html);
    for (var i = 0; i < list.length; ++i) {
        var name = list[i].name;
        console.log("! " + name);
        $("[data-indicator-name=" + name + "]").click(function(event) {
            var name = $(event.target).attr("data-indicator-name");
            setLayer(data, colors, map, name);
        });
    }
}

function setLayer(data, colors, map, name) {
    map.updateChoropleth(getChoropleth(data, name, colors));
}

function initMap(data) {
    var countryPopupTemplate = getCountryPopupTemplate();
    var map = new Datamap({
        element: document.getElementById('container'),
        fills: {
            defaultFill: 'lightgrey'
        },
        geographyConfig:  {
         "popupTemplate":  function(geography, data_) {
            var countryData = data[geography.id];
            var name = geography.properties.name;
            var html = countryPopupTemplate({name: name, indicators: indicatorsList(countryData)});
            return html;
          }  
        },
    });

    var colors = d3.scale.quantize()
        .range(colorbrewer.BuPu[7]);

    setLayer(data, colors, map, "QoL");

    renderSwitch(data, colors, map);
};

loadData(initMap);

