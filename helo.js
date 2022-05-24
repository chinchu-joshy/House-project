
var test = 0 
/**
 * encapsulated value which can only be modified
 * via setter function and can only be accessed via 
 * getter function
 */




export function selectSample(e){
  console.log(e.value)
  test = e.value
}
/**
 * This is our setter function.
 * This function makes it possible to edit the value of
 * the variable test from another js file which is
 *  only accessable within this file.
 * Or in another words, variable test is in this scope.
 */



export {test}

/**
 * Here this is the getter function. As this enables 
 * to get the value of the variable test in other js
 * files 
 * That is, this makes the variable test which is in 
 * the local scope of this js file availabe in other
 * js files
 */