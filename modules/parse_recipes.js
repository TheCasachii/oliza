
const fs = require("fs");
const ERROR_CODES = require("./error");
const { PLATFORM, FILE_PATH_CONNECTOR }= require("./platform");

function getPathTo(file) {
    let spl = file.split(FILE_PATH_CONNECTOR);
    return spl.splice(0, spl.length - 1).join(FILE_PATH_CONNECTOR);
}

function loadRecipes(file = PLATFORM.RECIPES_FILE_PATH) {

    try {
        const d = fs.readFileSync(file, { encoding: "utf-8", flag: "r" });
        
        const o = JSON.parse(d).recipes;

        return o;

    } catch(e) {
        
        const str = '{"recipes":[]}';

        if (!fs.existsSync(getPathTo(file))){
            fs.mkdirSync(getPathTo(file));
        }

        fs.writeFileSync(file, str);
        
        return [];

    }

}

function saveRecipes(array, file = PLATFORM.RECIPES_FILE_PATH) {

    let ec = 2;

    try {

        const obj = { recipes: array };
        
        const d = JSON.stringify(obj);
        ec++;

        fs.writeFileSync(file, d, { encoding: "utf-8", mode: 0o666, flag: "w" });
        ec++;

    } catch(e) {
        alert(`Błąd wewnętrzny ${ec + 1} - ${ERROR_CODES[ec]}`);
        console.log(e);
    }

}

function showRecipes(parent, array = []) {

    array.forEach( (recipe, i) => {

        let elem = document.createElement("div");
        elem.className = "list-element";

        let elemName = document.createElement("div");
        elemName.className = "list-element-name";
        elemName.innerHTML = `<a target="_self" href='pokaz-przepis.html?p=${i}'>${recipe.name}</a>`;

        elem.appendChild(elemName);
        parent.appendChild(elem);

    });

}

function getRecipeIdByName(n, r) {
    for (let i = 0; i < r.length; i++) {
        const rec = r[i];
        if (rec.name === n) {
            return i;
        }
    }
    return -1;
}

function parseGetParam(p) {
    if (!p) return {};
    return JSON.parse(`${p.split('?').join('{"').split('=').join('":"').split('&').join('","')}"}`);
}

module.exports = { loadRecipes, saveRecipes, showRecipes, getRecipeIdByName, parseGetParam, getPathTo };