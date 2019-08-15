const AXIOS = require('axios')

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
const nameGenerator = (seed) => {
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
//FIXME: this will think a sub doesn't exist if it has just been banned
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
        console.log(`    Checking ${name}...`)
        found = await subDoesNotExist(name)
      }
      return name
    }
  }
}

async function getUnusedSubList(findCount, seed) {
  const finder = unusedSubFinder(seed)
  const subs = []
  while (subs.length < findCount) {
    const name = await finder.next() 
    console.log(`FOUND: ${name}`)
    subs.push(name)
  }
  return subs
}

// the amount of subreddits to find, defaulting to 1
let findCount = process.argv[2] || 1
// -1 indicates that this should run continuously
if (findCount === '-1') findCount = Infinity

const seed = process.argv[3] || FIRST_CHAR.repeat(3)

console.log(`Finding ${findCount} unused subreddit${findCount===1 ? '' : 's'} starting from ${seed}`)

getUnusedSubList(findCount, seed).then(subs => {
  console.log(`Unused subreddits: ${subs.join(', ')}`)
})
