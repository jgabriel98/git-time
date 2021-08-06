# Git-time
Estimate time spent on a git repository.

## Install
    npm install -g @jgabriel98/git-time

## Usage
    git-time <path>
    
or

    git time <path>

## Help
    Usage: git-time <path>

    Where <path> is the path of your Git repository. Defaults to working directory.
    
    Options:
    
      -h, --help	output usage information
      --max         maximum time diff in minutes between two consecultive commits. Default: 90
      --min         minimum time in minutes for the start commit. Default: 25
      --since       since when do you want to calculate time. No Default
      --author      filter out authors. Value(s) are passed to the git log command.
      
      
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
