const getEl = require("../modules/getEl");
const { loadPlanner, PLANNER_DAYS, savePlanner } = require("../modules/parse_planner");
const { parseGetParam } = require("../modules/parse_recipes");
const Locales = require("../modules/locales");
require("../modules/theme");

const pgp = parseGetParam(location.search);

const idx = pgp.p;

getEl("day-name").innerHTML = PLANNER_DAYS[idx];

getEl("rec-go-back").href += idx;

document.title = Locales.Pages.EditDay;
getEl("rec-go-back").innerHTML = `[${Locales.UI.Back}]`;

getEl("Dish1").innerHTML = getEl("Dish1").innerHTML.split("#$#$#$#$PPP1!@!21431efbjkwevb").join(Locales.Elements.ShortDish1 + ': ');
getEl("Dish2").innerHTML = getEl("Dish2").innerHTML.split("#$#$#$#$PPP1!@!21431efbjkwevb").join(Locales.Elements.ShortDish2 + ': ');
getEl("rec-submit").innerHTML = Locales.UI.Save;

const plan = loadPlanner();

for(let i = 0; i < 2; i++) {
	const e = plan[idx][i];
	if (e !== "Brak") getEl(`day-dish-${i+1}`).value = e;
}

function save() {

    let plan = loadPlanner();

    const d1 = getEl("day-dish-1").value;
    const d2 = getEl("day-dish-2").value;

    const v1 = d1 || 'Brak';
    const v2 = d2 || 'Brak';

    plan[idx] = [v1, v2];

    savePlanner(plan);

}

getEl("rec-submit").addEventListener("click", save);
