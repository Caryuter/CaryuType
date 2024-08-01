export {randomTextArray}
const wordsTuple = [
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", 
    "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", 
    "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", 
    "watermelon", "xigua", "yellowfruit", "zucchini", "almond", "blueberry", 
    "coconut", "dragonfruit", "eggplant", "feijoa", "guava", "huckleberry", 
    "jackfruit", "kumquat", "lime", "mulberry", "nutmeg", "olive", "pomegranate", 
    "quinoa", "rhubarb", "soursop", "tomato", "uvas", "violet", "walnut", 
    "xanthan", "yam", "zebrafruit"
  ];

let wordsNum = 20;

/**
 * Retrieves a random string from a defined tuple
 * @returns String
 */
function randomWord() {
    let randNum = Math.floor(Math.random() * wordsTuple.length)
    return wordsTuple[randNum]
}

/**
 * Generates an array with random words to generate text with
 * @returns {Array<String>} Array with Strings
 */
function randomTextArray(){
  let textArray = []
  for (let i = 0; i <= wordsNum; i++){
    textArray.push(randomWord)
  }
  return textArray
}
