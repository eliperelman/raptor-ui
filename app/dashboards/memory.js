/* global _ */

var ARGS;
var settings = _.extend({
  device: 'flame-kk',
  memory: '319',
  branch: 'master',
  suite: 'coldlaunch'
}, ARGS);
var title = [
  'Cold Launch: Memory',
  settings.device,
  settings.memory + 'MB',
  settings.branch
].join(' | ');
var annotationQuery = [
  "select title, tags, text",
  "from events",
  "where device='" + settings.device + "'",
  "and memory='" + settings.memory + "'",
  "and branch='" + settings.branch + "'",
  "and $timeFilter"
].join(' ');
var dashboard = {
  id: 10,
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
    from: 'now-3d',
    to: 'now'
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
    "enable": true
  },
  refresh: false,
  version: 7,
  hideAllLegends: false
};
var basePanel = {
  error: false,
  span: 4,
  editable: false,
  type: 'graph',
  datasource: 'raptor',
  renderer: 'flot',
  'x-axis': true,
  'y-axis': true,
  y_formats: [
    'bytes',
    'none'
  ],
  grid: {
    leftMax: null,
    rightMax: null,
    leftMin: 0,
    rightMin: null,
    threshold1: null,
    threshold2: null,
    threshold1Color: 'rgba(216, 200, 27, 0.27)',
    threshold2Color: 'rgba(234, 112, 112, 0.22)'
  },
  lines: true,
  fill: 0,
  linewidth: 1,
  points: true,
  pointradius: 2,
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
  seriesOverrides: [],
  links: [],
  height: '300px',
  leftYAxisLabel: 'bytes, average'
};
var apps = [
  ['Calendar', 'calendar.gaiamobile.org'],
  ['Camera', 'camera.gaiamobile.org'],
  ['Clock', 'clock.gaiamobile.org'],
  ['Contacts', 'communications.gaiamobile.org'],
  ['E-Mail', 'email.gaiamobile.org'],
  ['FM Radio', 'fm.gaiamobile.org'],
  ['Gallery', 'gallery.gaiamobile.org'],
  ['Messages', 'sms.gaiamobile.org'],
  ['Music', 'music.gaiamobile.org'],
  ['Phone', 'communications.gaiamobile.org'],
  ['Settings', 'settings.gaiamobile.org'],
  //['Usage', 'costcontrol.gaiamobile.org'],
  ['Video', 'video.gaiamobile.org']
];

var rows = Math.ceil(apps.length / 3);

var query = function(series, context, appName) {
  return [
    "select mean(value)",
    "from /" + series + "/",
    "where device='" + settings.device + "'",
    "and memory='" + settings.memory + "'",
    "and branch='" + settings.branch + "'",
    "and context='" + context + "'",
    "and appName='" + appName + "'",
    "and entryType='memory'",
    "and $timeFilter",
    "group by time($interval)",
    "order asc"
  ].join(' ');
};

for (var i = 1; i <= rows; i++) {

  var row = {
    title: 'Row ' + i,
    height: '250px',
    editable: false,
    collapse: false,
    panels: []
  };

  var ordinal = i * 3;

  for (var o = ordinal - 3; o < ordinal; o++) {
    var app = apps[o];
    var appName = app[0];
    var context = app[1];

    var panel = _.extend({
      id: o,
      title: appName,
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: settings.suite + '.uss',
        query: query(settings.suite + '.uss', context, appName),
        alias: 'USS'
      }, {
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: settings.suite + '.pss',
        query: query(settings.suite + '.pss', context, appName),
        alias: 'PSS'
      }, {
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: settings.suite + '.rss',
        query: query(settings.suite + '.rss', context, appName),
        alias: 'RSS'
      }]
    }, basePanel);

    row.panels.push(panel);
  }

  dashboard.rows.push(row);
}

return dashboard;