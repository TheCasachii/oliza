const getEl = require("../modules/getEl.js");
const { loadRecipes, getRecipeIdByName } = require("../modules/parse_recipes.js");
const { loadPlanner } = require("../modules/parse_planner.js");
const printJS = require("print-js");
const Locales = require("../modules/locales.js");
require("../modules/theme");

const planner = loadPlanner();
const recipes = loadRecipes();

let ingredients = [];

document.title = Locales.Pages.ShoppingList;
getEl("GoToPlanner").innerHTML = Locales.UI.GoToPlanner;
getEl("PrintList").innerHTML = Locales.UI.PrintShoppingList;

function addToList(name, aN, aT) {
	const iid = getRecipeIdByName(name, ingredients);
	if (iid === -1) {
		let elem = {name: name, amount: {}}
		elem.amount[aT] = aN;
		ingredients.push(elem);
	} else {
		let c = ingredients[iid].amount[aT] || 0;
		ingredients[iid].amount[aT] = c + aN;
	}
}

function parseRecipe(recipe, recipes, multiplier = 1) {

	function cutLetter(v, isLastLetter = false) {
   		return v.substr(1 - isLastLetter * 1, v.length - 1);
   	}

	recipe.ingredients.forEach(ingr => {

		if (ingr.type === "primitive") {

			let amountNumeric = parseInt(ingr.amount);

			if (isNaN(amountNumeric)) amountNumeric = 0;

			const numericLength = amountNumeric.toString().length;

			let amountType = ingr.amount.substr(numericLength, ingr.amount.length - numericLength) || Locales.Units.Pieces;

			while (amountType[0] === ' ') amountType = cutLetter(amountType);

			addToList(ingr.name, amountNumeric, amountType);

		} else {

			const r = recipes[getRecipeIdByName(ingr.name, recipes)];

			parseRecipe(r, recipes, parseInt(ingr.amount) || 1);

		}

	});

}

planner.forEach(day => {

	day.forEach(rec => {
		
		const rid = getRecipeIdByName(rec, recipes);
		if (rid === -1) {
			if (rec !== "Brak") addToList(rec, 1, Locales.Units.Pieces);
			return;
		}

		parseRecipe(recipes[rid], recipes);

	});

});

function getIngrAmountStr(ingr) {
	let ingrAmoStr = "";

	Object.keys(ingr.amount).forEach(k => {
		const v = ingr.amount[k];
		if (v === 0) return;
		ingrAmoStr += `${v}${k} `;
	});

	return ingrAmoStr;
}

function printList() {
    let data = [];

    ingredients.forEach(ingr => {
        const amo = getIngrAmountStr(ingr);
        data.push({
            name: ingr.name,
			amount: amo
        });
    });

    const style = "font-family: sans-serif; border: 0; font-size: 14pt; text-align: left;"

    printJS({
        printable: data,
        type: 'json',
        properties: [
            { field: "name", displayName: Locales.Elements.IngrName },
            { field: "amount", displayName: Locales.Elements.IngrAmount }
        ],
        //style: "@page { size: landscape; }",
        gridStyle: style,
        gridHeaderStyle: style,
        headerStyle: style,
        header: `<h2>${Locales.Elements.ShoppingList}</h2>`
    });
}

const parent = getEl("container");

ingredients.forEach((ingr, i) => {

	let elem = document.createElement("div");
	elem.className = "list-element";

	let child = document.createElement("div");
	child.className = "list-element-name";
	child.id = `shoplist-elem${i}`;

	const ingrAmoStr = getIngrAmountStr(ingr);

	child.innerHTML = `${ingr.name} ${(ingrAmoStr) ? '-' : ''} ${ingrAmoStr}`;

	elem.appendChild(child);
	parent.appendChild(elem);

})

getEl("print-list").addEventListener("click", printList);