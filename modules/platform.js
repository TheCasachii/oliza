
const homedir = require("os").homedir();
const Enum = require("./enum");
const Preferences = require("./preferences");

const P_TARGET = Enum("WINDOWS", "LINUX", "DARWIN");

const TARGET = P_TARGET.LINUX;

const FILE_PATH_CONNECTOR = (TARGET === P_TARGET.WINDOWS) ? '\\' : '/';

const OLIZA_DIR = `${homedir}${FILE_PATH_CONNECTOR}.oliza${FILE_PATH_CONNECTOR}`;

const LOCALES_DIR = `${__dirname}${FILE_PATH_CONNECTOR}..${FILE_PATH_CONNECTOR}locales${FILE_PATH_CONNECTOR}`;

const HOSTNAME = "http://oliza.j.pl/";

Preferences.init(`${OLIZA_DIR}options.json`);

let PLATFORM = {

    PLANNER_FILE_PATH: `${OLIZA_DIR}planner.json`,
    RECIPES_FILE_PATH: `${OLIZA_DIR}recipes.json`,
    CREDS_FILE_PATH: `${OLIZA_DIR}creds.json`,
    // LOCALES_FILE_PATH: `${LOCALES_DIR}${LANGUAGE}.json`,
    RECIPE_REQUEST_PATH: `${HOSTNAME}request.php`,
    ACCOUNT_PATH: `${HOSTNAME}account.php`,
    LOCALES_DIR: LOCALES_DIR,
    PREFS_FILE_PATH: `${OLIZA_DIR}options.json`

}

const LANGUAGE = Preferences.get("Language") || "en";

PLATFORM.LOCALES_FILE_PATH = `${LOCALES_DIR}${LANGUAGE}.json`;

module.exports = { PLATFORM, FILE_PATH_CONNECTOR };