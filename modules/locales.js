const { PLATFORM } = require("./platform");
const fs = require("fs");
module.exports = JSON.parse(fs.readFileSync(PLATFORM.LOCALES_FILE_PATH, {encoding:'utf8', flag:'r'}));