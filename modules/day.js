const { loadRecipes, getRecipeIdByName, parseGetParam } = require("../modules/parse_recipes");
const getEl = require("../modules/getEl");
const { loadPlanner, PLANNER_DAYS } = require("../modules/parse_planner");
const Locales = require("../modules/locales");
require("../modules/theme");

const recipes = loadRecipes();
let planner   = loadPlanner();

const pgp = parseGetParam(location.search);

document.title = Locales.Pages.ShowDay;
getEl("Change").innerHTML = Locales.UI.Change;
getEl("day-dish-1").innerHTML = Locales.Elements.Dish1 + ': ';
getEl("day-dish-2").innerHTML = Locales.Elements.Dish2 + ': ';
getEl("rec-go-back").innerHTML= `[${Locales.UI.BackToList}]`;
getEl("Lunch").innerHTML = Locales.Elements.Lunch;

let idx = pgp.p;
const day = planner[idx];

getEl("day-name").innerHTML = PLANNER_DAYS[idx];

getEl("rec-edit").href += idx;

for (let i = 0; i < 2; i++) {

    const sri = getRecipeIdByName(day[i], recipes);
    const d1 = (day[i] === "Brak") ? Locales.Elements.Empty : day[i];
    getEl(`day-dish-${i + 1}`).innerHTML += (sri === -1) ? d1 : `<a class="zp" href="pokaz-przepis.html?p=${sri}">${d1}</a>`;

}