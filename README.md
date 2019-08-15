# small-subreddit-finder
A node script to find short named subreddits that aren't used.

> This project uses [Yarn](https://yarnpkg.com) as a package manager

## Quickstart

1. Clone the repo
2. Navigate to this directory in a termal
3. Run `yarn` to install dependencies
4. Run `yarn main` to find an unused subreddit

## Different ways to run the program

* `yarn main [find-count] [seed]` - find the first `find-count` unused subreddits, if `find-count` is not specified then it will default to `1`
* `yarn find-first [seed]` - find the first unused subreddit
* `yarn nonstop [seed]` - continually find unused subreddits 

If not provided, `find-count` will default to 1, and `seed` will default to `aaa`.

## Notes

This `ssed` parameter is helpful because **there are currently false positives for subreddits that have been banned**. For example, [aa1](https://www.reddit.com/r/aa1) comes up as an usused subreddit, but it is just banned.
