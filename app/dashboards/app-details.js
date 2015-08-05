/* global _ */

var ARGS;
var settings = _.extend({
  device: 'flame-kk',
  memory: '319',
  branch: 'master',
  entryType: 'mark'
}, ARGS);
var title = 'Details: ' + settings.appName;
var annotationQuery = [
  "select title, tags, text",
  "from events",
  "where device='" + settings.device + "'",
  "and memory='" + settings.memory + "'",
  "and branch='" + settings.branch + "'",
  "and $timeFilter"
].join(' ');
var dashboard = {
  id: 15,
  rows: [],
  title: title,
  originalTitle: title,
  tags: [],
  style: 'dark',
  timezone: 'browser',
  editable: true,
  hideControls: false,
  sharedCrosshair: false,
  nav: [
    {
      type: 'timepicker',
      enable: true,
      status: 'Stable',
      time_options: [
        '5m',
        '15m',
        '1h',
        '6h',
        '12h',
        '24h',
        '2d',
        '7d',
        '30d'
      ],
      refresh_intervals: [
        '5s',
        '10s',
        '30s',
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '2h',
        '1d'
      ],
      now: true,
      collapse: false,
      notice: false
    }
  ],
  time: {
    from: settings.from,
    to: settings.to
  },
  templating: {
    list: []
  },
  "annotations": {
    "list": [{
      "name": "Revisions",
      "datasource": "raptor",
      "showLine": false,
      "iconColor": "rgb(90, 150, 197)",
      "lineColor": "rgba(255, 96, 96, 0.592157)",
      "iconSize": 13,
      "enable": true,
      "query": annotationQuery,
      "titleColumn": "title",
      "tagsColumn": "tags",
      "textColumn": "text"
    }],
    "enable": false
  },
  refresh: false,
  version: 7,
  hideAllLegends: false
};

// span: 4, lines: true, pointradius: 2, height: '300px', leftYAxisLabel: 'Duration, 95th Percentile'
var basePanel = {
  error: false,
  editable: false,
  type: 'graph',
  datasource: 'raptor',
  renderer: 'flot',
  'x-axis': true,
  'y-axis': true,
  y_formats: [
    'ms',
    'none'
  ],
  fill: 0,
  linewidth: 1,
  points: true,
  bars: false,
  stack: false,
  percentage: false,
  legend: {
    show: true,
    values: false,
    min: false,
    max: false,
    current: false,
    total: false,
    avg: false
  },
  nullPointMode: 'connected',
  steppedLine: false,
  tooltip: {
    value_type: 'cumulative',
    shared: false
  },
  aliasColors: {},
  seriesOverrides: []
};

var query = function(select, series) {
  return [
    "select " + select,
    "from /" + series + "/",
    "where device='" + settings.device + "'",
    "and memory='" + settings.memory + "'",
    "and branch='" + settings.branch + "'",
    "and context='" + settings.context + "'",
    "and appName='" + settings.appName + "'",
    "and entryType='" + settings.entryType + "'",
    "and $timeFilter",
    "group by time($interval)",
    "order asc"
  ].join(' ');
};

//"legend": {
//  "show": true,
//    "values": true,
//    "min": true,
//    "max": true,
//    "current": true,
//    "total": false,
//    "avg": true,
//    "alignAsTable": true
//},

var row = {
  title: 'Row ' + i,
  height: '300px',
  editable: false,
  collapse: false,
  panels: []
};

for (var i = 1; i <= rows; i++) {

  var row = {
    title: 'Row ' + i,
    height: '300px',
    editable: false,
    collapse: false,
    panels: []
  };

  var ordinal = i * 3;

  for (var o = ordinal - 3; o < ordinal; o++) {
    if (o + 1 > apps.length) {
      break;
    }

    var app = apps[o];
    var appName = app[0];
    var context = app[1];
    var baseline = app[2];

    var panel = _.extend({
      id: o + 1,
      title: appName,
      grid: {
        leftMax: null,
        rightMax: null,
        leftMin: settings.detail ? null : 0,
        rightMin: null,
        threshold1: 1000,
        threshold2: baseline,
        threshold1Color: 'rgba(216, 200, 27, 0.40)',
        threshold2Color: 'rgba(234, 112, 112, 0.40)',
        thresholdLine: true
      },
      "links": [{
        "type": "absolute",
        "name": "App Details",
        "title": "Details...",
        "url": "#/",
        "params": "var-wat=3"
      }],
      targets: [{
        rawQuery: true,
        'function': settings.detail ? undefined : 'percentile',
        column: 'value',
        series: settings.series,
        query: query(context, appName),
        alias: '$1'
      }]
    }, basePanel);

    row.panels.push(panel);
  }

  dashboard.rows.push(row);
}

window.EXPOSED_SETTINGS = settings;
window.EXPOSED_DASHBOARD = dashboard;
window.EXPOSED_APPS = apps;

return dashboard;