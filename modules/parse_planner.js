const getEl = require("../modules/getEl");
const { getPathTo } = require("../modules/parse_recipes");
const { PLATFORM } = require("../modules/platform");
const fs = require("fs");
const Locales = require("./locales");

const PLANNER_DAYS = Locales.Elements.DayNames;

function emptyPlanner() {
    const empty = ["Brak", "Brak"];
    return [empty, empty, empty, empty, empty, empty, empty];
}

function loadPlanner(file = PLATFORM.PLANNER_FILE_PATH) {

    let o = emptyPlanner();

    try {

        const d = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });

        o = JSON.parse(d).plan;

        return o;

    } catch(e) {

        const str = JSON.stringify({plan: o});

        if (!fs.existsSync(getPathTo(file))){
            fs.mkdirSync(getPathTo(file));
        }

        fs.writeFileSync(file, str);

        return o;

    }

}

function savePlanner(array, file = PLATFORM.PLANNER_FILE_PATH) {

    try {

        const obj = { plan: array };
        
        const d = JSON.stringify(obj);

        fs.writeFileSync(file, d, { encoding: "utf-8", mode: 0o666, flag: "w" });

    } catch(e) {
        alert(`Błąd wewnętrzny.`);
    }
}

function showPlanner(parent, array) {

    array.forEach((day, i) => {
        
        let elem = document.createElement("div");
        elem.className = "list-element";

        const d1 = (day[0] === "Brak") ? Locales.Elements.Empty : day[0];
        const d2 = (day[1] === "Brak") ? Locales.Elements.Empty : day[1];

        let elemName = document.createElement("div");
        elemName.className = "list-element-name";
        elemName.innerHTML = `<a target="_self" href='pokaz-dzien.html?p=${i}'>${PLANNER_DAYS[i]} - ${d1}, ${d2}</a>`;

        elem.appendChild(elemName);
        parent.appendChild(elem);

    });

}

module.exports = { loadPlanner, savePlanner, showPlanner, PLANNER_DAYS, emptyPlanner };