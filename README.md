# small-subreddit-finder
A node script to find short named subreddits that aren't used.

> This project uses [Yarn](https://yarnpkg.com) as a package manager

## Quickstart

1. Clone the repo
2. Navigate to this directory in a termal
3. Run `yarn` to install dependencies
4. Run `yarn main` to find an unused subreddit

## Notes

`index.js` has a `seed` variable near the bottom. This can be used to start searching from a specific name. This is helpful because **there are currently false positives for subreddits that have been banned**. For example [aa1](https://www.reddit.com/r/aa1) comes up as an usused subreddit, so you can set `seed` as `nextName('aa1')` to start from the name after that.
