#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const os = require ('os');
const {pt_BR_translation, parseInputDate} = require('./date-utils.js');

// If help or bad usage
if (typeof argv.help == 'boolean' || typeof argv.h == 'boolean') {
  console.log('\nUsage: git-time <path>\n\nWhere <path> is the path of your Git repository. Defaults to working directory.\n')
  console.log('Options:\n')
  console.log('  -h, --help\toutput usage information')
  console.log('  --max\t\tmaximum time in minutes between two consecultive commits. Default: 90')
  console.log('  --min\t\tminimum time in minutes for the start commit. Default: 25')
  console.log('  --since\tsince when do you want to calculate time (inclusive). [always|yesterday|tonight|lastweek|yyyy-mm-dd] Default: always\n'+
	      '         \tsupports Brazilian portuguese                         [sempre|ontem|essanoite|semanapassada|yyyy-mm-dd].');
  console.log('  --author\tfilter out authors. Value(s) are passed to the git log command.')

  return;
}

const { exec } = require('child_process');
const _cliProgress = require('cli-progress');



let dir = argv._[0];
if (!dir || dir == '.')
  dir = process.cwd()
// Wrap in quotes to escape spaces
dir = '"' + dir + '"'

let min = 25
if (typeof argv.min === 'number')
  min = argv.min
min *= 60

let max = 90
if (typeof argv.max === 'number')
  max = argv.max
max *= 60

let since = "";
if (typeof argv.since === 'string') {
  since = pt_BR_translation[argv.since] || argv.since;
  since = parseInputDate(since);
  if (since == 'Invalid date') {
    console.error(`Invalid value '${argv.since}' at --since`);
    process.exit(1);
  }
  since = "--since='" + since + "'";
}


let authors = [];
if (argv.author) {
  if(typeof argv.author.map === 'function')
    authors = argv.author;
  else
    authors = [argv.author];
}

let lsCommand = `ls ${dir}/.git`;
if(os.platform() === 'win32')
  lsCommand = `dir ${dir}\\.git`;


exec(lsCommand, function (err, data) {
  if (err) {
    console.log(`${dir} is not a valid Git directory`)
    return
  }

  const cmd = `cd ${dir} && git log ${since} ${authors.map(author => `--author="${author}"`).join(" ")} --pretty='format:%an <%ae> %ct'`;
  console.log(cmd);
  exec(cmd,{maxBuffer: 1024 * 1024 * 100}, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    let log = data.split('\n')
    log.sort();
    let byAuthor = log.reduce((acc, val) => {
      let logParts = val.split(" ");
      let time = logParts.pop();
      let author = logParts.join(" ");
      acc[author] = acc[author] || [];
      acc[author].push(time);
      return acc;
    }, {});

    Object.keys(byAuthor).forEach(author => {
      let authorLogTimes = byAuthor[author];
      console.log(`${author}`)
      console.log(`${authorLogTimes.length} commits found`)

      // create a new progress bar instance and use shades_classic theme
      const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      bar1.clearOnComplete = true

      // start the progress bar with a total value of 200 and start value of 0
      bar1.start(authorLogTimes.length, 0);

      // Initialize variables
      let barValue = 0;
      let lastCommit = 0;
      let total = 0;
      for (let i = 0; i < authorLogTimes.length; i++) {
        let c = authorLogTimes[i];

        if (lastCommit == 0) {
          total += min;
        } else {
          let diff = c - lastCommit;

          if (diff < max && diff > 0)
            total += diff;
          else
            total += min;
        }

        lastCommit = c;
        barValue++;
        bar1.update(barValue);
      }

      bar1.stop();

      let totalHours = total/3600;
      console.log(`Total time spent: ${totalHours.toFixed(2)} hours\n`)
    })
  })
})



