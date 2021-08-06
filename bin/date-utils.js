const moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';

const pt_BR_translation = {
  'sempre'       : 'always',
  'hoje'         : 'today',
  'ontem'        : 'yesterday',
  'essasemana'   : 'thisweek',
  'semanapassada': 'lastweek'
};

const formatDate = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function parseInputDate(inputDate) {
  const now = moment();
  switch (inputDate) {
    case 'today':
      return now.startOf('day').format();
    case 'yesterday':
      return now.startOf('day').subtract(1, 'day').format();
    case 'thisweek':
      return now.startOf('week').format();
    case 'lastweek':
      return now.startOf('week').subtract(1, 'week').format();
    case 'always':
      return '01-01-1972';
    default:
      // XXX: Moment tries to parse anything, results might be weird
      return moment(inputDate, DATE_FORMAT).startOf('day').format();
  }
}

module.exports = {formatDate, parseInputDate, pt_BR_translation};
