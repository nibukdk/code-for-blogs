/**
 *The colorDuplicateRows() colors the duplicate rows.
 *Each unique rows and its duplicates are highlighted with different color
 */
function colorDuplicateRows() {
  // get sheet and data
  let sheet = SpreadsheetApp.getActiveSheet();
  let data = sheet.getDataRange().getValues();

  // find lastCol
  let lastCol = Math.max(...data.map((arr) => arr.length));

  // convert nested arrays to string
  data = data.map((arr) => arr.join(""));
  // find unique ones among arrays
  let uniqueRows = [...new Set(data)].filter(String);
  // create unique color for each unique arr
  let uniqueColor = {};
  uniqueRows.forEach((val) => (uniqueColor[val] = getRandomUniqueColor()));

  // console.log(uniqueColor);
  // find duplicate row for each item
  let duplicateRows = data
    .map((x, i) => (isDuplicateRow(x, data) ? i + 1 : ""))
    .filter(String);
  // console.log(duplicateRows);

  // now reset color before highlighting duplicate rows
  colorReset();

  duplicateRows.forEach((rowNum) => {
    for (let i = 0; i < uniqueRows.length; i++) {
      //console.log(range.getValues())
      // compare each item with uniqe items and assing color accordingly
      if (
        sheet.getRange(rowNum, 1, 1, lastCol).getValues().flat().join("") ===
        uniqueRows[i]
      ) {
        sheet
          .getRange(rowNum, 1, 1, lastCol)
          .setBackground(uniqueColor[uniqueRows[i]]);
      }
    }
  });
}

/**
 * Function takes two items x and arr.
 * The parameter "x" is a string to be compared to items in array "arr".
 * @param {String} x
 * @param {Array<String>} arr
 * @returns {Boolean}
 */
function isDuplicateRow(x, arr) {
  return x === "" ? false : arr.indexOf(x) != arr.lastIndexOf(x);
}

/**
 * Menu creates menu UI in spreadsheet.
 */
function menu() {
  let menu = SpreadsheetApp.getUi().createMenu("Duplicate Row Finder"); // Or DocumentApp or SlidesApp or FormApp.

  menu.addItem("Highlight Duplicate Row", "colorDuplicateRows");
  menu.addItem("Reset Colors", "colorReset");
  menu.addToUi();
}

/**
 * OnOpen trigger that creates menu
 * @param {Dictionary} e
 */
function onOpen(e) {
  menu();
}

/**
 * ColorReset is used to reset bg color of spreadsheet to its original color.
 */
function colorReset() {
  let sheet = SpreadsheetApp.getActiveSheet();
  sheet.getDataRange().setBackground("");
}

/**
 * Function creates a unique random color as hashcode.
 * @returns {String}
 */
function getRandomUniqueColor() {
  // thanks to function https://dev.to/rajnishkatharotiya/generate-unique-color-code-in-javascript-3h06
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}
