var test = 0x382c16;
var trimColor = 0xffffff;
var doorType = "Standard_Door";
/**
 * encapsulated value which can only be modified
 * via setter function and can only be accessed via
 * getter function
 */

export function selectSample(e) {
  test = e.value;
}
export function checkTrim(e) {
    trimColor = e.value;
}
export function checkDoor(e) {
    doorType = e.value;
}

/**
 * This is our setter function.
 * This function makes it possible to edit the value of
 * the variable test from another js file which is
 *  only accessable within this file.
 * Or in another words, variable test is in this scope.
 */

export { test ,trimColor,doorType};

/**
 * Here this is the getter function. As this enables
 * to get the value of the variable test in other js
 * files
 * That is, this makes the variable test which is in
 * the local scope of this js file availabe in other
 * js files
 */
