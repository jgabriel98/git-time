# Git-time
Estimate time spent on a git repository.

---------------------------
##### This is a fork from [vmf91/git-time](https://github.com/vmf91/git-time).<br/>Since the original projects seems to be abadoned, this fork aims to maitain, fix bugs, and improve it.

---------------------------

## Install
    npm install -g @jgabriel98/git-time

## Usage
    git-time <path>
    
or

    git time <path>
When `<path>` is omitted, defaults to working directory;

### Examples
from inside a git repository:
 - `$ git time --since lastweek`
 - `$ git-time --since today`

from outside a git repository:
- `$ git time ./my_repo`
- `$ git time ./my_repo --since thisweek`
  
### More info
    Usage: git-time <path>

    Where <path> is the path of your Git repository. Defaults to working directory.
    
    Options:
    
      -h, --help	output usage information
      --max         maximum time diff in minutes between two consecultive commits. Default: 90
      --min         minimum time in minutes for the start commit. Default: 25
      --since       since when do you want to calculate time (inclusive). [always|today|yesterday|thisweek|lastweek|yyyy-mm-dd]
                    supports Brazilian portuguese                         [sempre|hoje|ontem|essasemana|semanapassada|yyyy-mm-dd]
      --author      filter out authors. Value(s) are passed to the git log command.
      
The option `--since` calculates from the last start of the given value, for example:<br/>
 - `--since thisweek` will get all commits from this week, not from the last 7 days.<br/>
 - `--since today` will get all commits since the start of today, not from the last 24 hours.

## Output

Output is grouped by author
```
John Doe <john.doe@example.com>
102 commits found
Total time spent: 103.84 hours

Jane Doe <jane.doe@example.com>
321 commits found
Total time spent: 183.11 hours
```
