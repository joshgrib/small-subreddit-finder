const AXIOS = require('axios')
const FS = require('fs')

const API_ENDPOINT = 'http://www.reddit.com/r/'
// full set of allowed characters
const CHAR_SET = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z',
  '_','0','1','2','3','4','5','6','7','8','9'
]
// store first and last for reference
const FIRST_CHAR = CHAR_SET[0]
const LAST_CHAR = CHAR_SET[CHAR_SET.length-1]

// get the letter following the provided one in the alphabet, looping from z to a
const nextCharacter = char => {
  if (char == LAST_CHAR) return FIRST_CHAR
  const nextIndex = CHAR_SET.indexOf(char) + 1
  return CHAR_SET[nextIndex]
}

// check if the text is all the last allowed character
const allLastChar = text => {
  for (char of text) {
    if (char !== LAST_CHAR) return false
  }
  return true
}

// get the next alphabetical name
const nextName = name => {
  if (allLastChar(name)) {
    return FIRST_CHAR.repeat(name.length+1)
  }
  const lastChar = name[name.length-1]
  const nextChar = nextCharacter(lastChar)
  const withoutLastChar = name.slice(0, -1)
  if (nextChar === FIRST_CHAR) {
    return `${nextName(withoutLastChar)}${nextChar}`
  }
  return `${withoutLastChar}${nextChar}`
}

// generate names 'aaa', 'aab', ..., 'aaaa', 'aaab', 'aaac'...
const nameGenerator = (seed=FIRST_CHAR.repeat(3)) => {
  // subreddits must have at least 3 characters
  let name = seed
  return {
    next () {
      const val = name
      name = nextName(name)
      return val
    }
  }
}

// check if the subreddit does not exist
//FIXME: this will think a sub doesn't exist if it's just been banned
async function subDoesNotExist (name) {
  try {
    const url = `${API_ENDPOINT}${name}`
    await AXIOS.get(url)
    return false
  } catch (e) {
    const statusCode = e.response.status
    return statusCode === 404
  }
}

// a generator for finding unused subreddits, optionally starting from a seed value
function unusedSubFinder (seed) {
  const nameGen = nameGenerator(seed)
  return {
    async next () {
      let found = false
      while (!found) {
        name = nameGen.next()
        console.log(`Checking ${name}...`)
        found = await subDoesNotExist(name)
      }
      return name
    }
  }
}

//the seed if the first one to check, which let's you skip ahead
const seed = nextName('ac_')
const finder = unusedSubFinder(seed)
finder.next().then(name => {
  console.log(`FOUND: ${name}`)
})

/* 

Unused subreddits as of 20190814:
* ab_
* ac_


*/
