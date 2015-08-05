define(['settings', 'jquery'], function (Settings, $) {
  var GAIA_URL = 'https://github.com/mozilla-b2g/gaia/commit/';
  var GECKO_URL = 'http://hg.mozilla.org/mozilla-central/rev/';

  $(document).on('click', '.icon-chevron-down', function() {
    var text = $('#tooltip').html();

    if (!text) {
      return;
    }

    var parts = text.split(/<br>|<\/small>/);

    if (!parts.length) {
      return;
    }

    var gaia = parts[2].replace('Gaia: ', '');
    var gecko = parts[3].replace('Gecko: ', '');

    if (gaia) {
      window.open(GAIA_URL + gaia, '_blank');
    }

    if (gecko) {
      window.open(GECKO_URL + gecko, '_blank');
    }
  });

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
