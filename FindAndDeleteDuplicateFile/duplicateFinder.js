// Add id of the folder to check for duplicate
const FOLDER_ID = "1XQpsVDtzuwZl7g96V_ZIXRue0JQZFRPH";
/**
 * Function looks for duplicate file names in designated folder and removes them.
 * Then it returns id of remaning one file if exissts else null.
 * @param {String} fileName
 * @returns {String?} fileID
 */
function removeDuplicateFile() {
  let folder = DriveApp.getFolderById(FOLDER_ID);

  let files = folder.getFiles();

  let fileList = [];

  // if no file is found return null
  if (!files.hasNext()) {
    return;
  }

  // else
  while (files.hasNext()) {
    let file = files.next(),
      name = file.getName(),
      size = file.getSize(),
      id = file.getId();
    console.log(name);
    // checking this way always leaves first file not deleted
    if (isDuplicateFile(fileList, name, size)) {
      console.log("Duplicate File Found");
      file.setTrashed(true);
    } else {
      console.log("Duplicate File not Found");

      fileList.push([name, size, id]);
    }
  }
}

/**
 * Function is helper function of removeDuplicateFile function.
 * It checks if theres already a file in the given lst with same name and size and returns true or false
 * @param {List} lst
 * @param {String} name
 * @param {Number} size
 * @returns {Boolean}
 */
function isDuplicateFile(lst, name, size) {
  for (let i = 0; i < lst.length; i++) {
    if (lst[i][0] === name && lst[i][1] === size) return true;
  }
  return false;
}
/**
 * Delete all the triggers if there are any
 */
var deleteTrigger = () => {
  let triggersCollection = ScriptApp.getProjectTriggers();
  if (triggersCollection.length <= 0) {
    console.log(`Event doesnot have trigger id`);
  } else {
    triggersCollection.forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  }
  return;
};

/**
 * Create a trigger function for file which also deletes previous triggers if there are.
 */
function removeDuplicateFileTrigger() {
  // First Delete existing triggers
  deleteTrigger();

  // now remove duplicate files 
  removeDuplicateFile();
}