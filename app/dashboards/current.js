/* global _ */

var ARGS;
var settings = _.extend({
  device: 'flame-kk',
  memory: '1024',
  branch: 'master'
}, ARGS);
var title = [
  'Power: Current',
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
  id: 11,
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
    'none',
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
  leftYAxisLabel: 'mA, average'
};

var query = function(series, context, appName) {
  return [
    "select mean(value)",
    "from " + series,
    "where device='" + settings.device + "'",
    "and memory=" + settings.memory + "",
    "and branch='" + settings.branch + "'",
    "and context='" + context + "'",
    "and appName='" + appName + "'",
    "and entryType='current'",
    "and $timeFilter",
    "group by time($interval)",
    "order asc"
  ].join(' ');
};

var row = {
  title: 'Row 1',
  height: '250px',
  editable: false,
  collapse: false,
  panels: [
    _.extend({
      id: 1,
      title: 'Camera Preview',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.camera_preview.current',
        query: query('power.camera_preview.current', 'camera.gaiamobile.org', 'Camera'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 4,
      title: 'Camera Picture',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.camera_picture.current',
        query: query('power.camera_picture.current', 'camera.gaiamobile.org', 'Camera'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 5,
      title: 'Camera Video',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.camera_video.current',
        query: query('power.camera_video.current', 'camera.gaiamobile.org', 'Camera'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 2,
      title: 'Homescreen: Idle screen Off',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.idle_screen_off.current',
        query: query('power.idle_screen_off.current', 'verticalhome.gaiamobile.org', 'Homescreen'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 3,
      title: 'Homescreen: Idle screen On',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.idle_screen_on.current',
        query: query('power.idle_screen_on.current', 'verticalhome.gaiamobile.org', 'Homescreen'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 6,
      title: 'Music: Background Music Playback',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.background_music_playback.current',
        query: query('power.background_music_playback.current', 'music.gaiamobile.org', 'Music'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 8,
      title: 'Music: Playback',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.music_playback.current',
        query: query('power.music_playback.current', 'music.gaiamobile.org', 'Music'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 7,
      title: 'Video: Video Playback',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.video_playback.current',
        query: query('power.video_playback.current', 'video.gaiamobile.org', 'Video'),
        alias: 'current'
      }]
    }, basePanel),
    _.extend({
      id: 9,
      title: 'Video: Background Video Playback',
      targets: [{
        rawQuery: true,
        'function': 'mean',
        column: 'value',
        series: 'power.background_video_playback.current',
        query: query('power.background_video_playback.current', 'video.gaiamobile.org', 'Video'),
        alias: 'current'
      }]
    }, basePanel)
  ]
};

dashboard.rows.push(row);

return dashboard;