define(['settings'], function (Settings) {
  return new Settings({
    datasources: {
      raptor: {
        default: true,
        type: 'influxdb',
        url: 'http://goldiewilson-onepointtwentyone-1.c.influxdb.com:8086/db/raptor',
        username: 'heroku',
        password: 'heroku'
      }
    },
    default_route: '/dashboard/file/raptor.json',
    window_title_prefix: 'Raptor - ',
    timezoneOffset: null,
    grafana_index: 'grafana-dash',
    unsaved_changes_warning: true,
    plugins: {
      panels: []
    },
    admin: 'ASK :ELI FOR ACTUAL PASSWORD'
  });
});
