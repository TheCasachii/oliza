const getEl = require("../modules/getEl");
const { loadRecipes, getRecipeIdByName, saveRecipes, parseGetParam } = require("../modules/parse_recipes");
const { CURRENT_THEME } = require("../modules/theme");
const Locales = require("../modules/locales");

const RECIPE_NAME_ID = "rec-name";

document.title =
getEl(RECIPE_NAME_ID).value = 
getEl(RECIPE_NAME_ID).placeholder = Locales.Elements.DefaultRecipeName;

getEl(RECIPE_NAME_ID).addEventListener("keyup", _e => { const x = getEl(RECIPE_NAME_ID).value; document.title = (x !== '') ? x : Locales.Elements.DefaultRecipeName; });
getEl("rec-ingr-name").addEventListener("keydown", _e => { getEl("rec-ingr-name").style.color = (CURRENT_THEME === "light") ? "black" : "white"; });

getEl("PrepTime").innerHTML = Locales.Elements.PrepTime;
getEl("Portions").innerHTML = Locales.Elements.Portions;
getEl("Ingr")    .innerHTML = Locales.Elements.Ingredients;
getEl("Hr")      .innerHTML = Locales.Units.Hours;
getEl("Mi")      .innerHTML = Locales.Units.Minutes;
getEl("Pe")      .innerHTML = Locales.Units.Portions;
getEl("rec-submit").innerHTML=Locales.UI.Save;
getEl("rec-go-back").innerHTML= `[${Locales.UI.BackToList}]`;

const pgp = parseGetParam(location.search);

let edited = null;

let recipes = loadRecipes();

let datalist = getEl('recipes');

recipes.forEach(r => {
    let option = document.createElement('option');
    option.value = `*${r.name}`;
    datalist.appendChild(option);
});

if (typeof pgp.edit !== "undefined") {


    const rec = recipes[pgp.edit];

    document.title = getEl(RECIPE_NAME_ID).value = rec.name;

    const times = rec.time.split(' ');

    getEl('rec-time-hr').value = times[0];
    getEl('rec-time-mi').value = times[2];

    getEl('rec-peop').value = rec.people;

    rec.ingredients.forEach(ingr => {
        createLi(
            ingr.type === "recipe",
            `${ingr.name}: ${ingr.amount}`
        )
    });

    edited = pgp.edit;

}

function cutLetter(v, isLastLetter = false) {
    return v.substr(1 - isLastLetter * 1, v.length - 1);
}

function createLi(isRecipe, name) {
    let li = document.createElement("li");
    li.innerHTML = `<span class="${(isRecipe) ? 'rec-list-recursive' : 'rec-list-normal'}">${name}</span>`;

    const id = getEl('rec-ingr-list').childElementCount;

    li.onmouseup = e => {
        if (e.button === 1) removeIngredient(id);
        if (e.button === 2) {
            getEl("rec-ingr-name").value = `${(li.children.item(0).className === "rec-list-recursive") ? "*" : ""}${li.children.item(0).innerHTML}`;
            removeIngredient(id);
        }
    };
    getEl('rec-ingr-list').appendChild(li);
}

function addIngredient() {
    let val = getEl("rec-ingr-name").value;
    getEl("rec-ingr-name").value = "";

    if (!val) return;

    let isRecipe = false;
    if (val[0] === "*") {
        isRecipe = true;
        val = cutLetter(val);
    }

    while (val[0] === " ") val = cutLetter(val);
    while (val[val.length - 1] === " ") val = cutLetter(val, true);

    if (!val) return;

    if (isRecipe) {

        const recipes = loadRecipes();

        const id = getRecipeIdByName(val.split(':')[0], recipes);

        if (id === -1) {
            getEl("rec-ingr-name").value = `*${val}`;
            getEl("rec-ingr-name").style.color = "red";
            return;
        }

    }

    createLi(isRecipe, val);

}

function removeIngredient(id) {
    
    getEl('rec-ingr-list').children.item(id).style.display = "none";
    getEl('rec-ingr-list').children.item(id).children.item(0).className = "rec-list-removed";

}

function finalizeRecipe() {

    let recipes = loadRecipes();

    const ch = getEl("rec-ingr-list").children;
    const cc = getEl("rec-ingr-list").childElementCount;

    let ingredients = [];

    for (let i = 0; i < cc; i++) {

        const node = ch.item(i).children.item(0);

        if (node.className === "rec-list-removed") continue;

        const split = node.innerHTML.split(':');

        const name = split[0];

        const type = (node.className === "rec-list-recursive") ? "recipe" : "primitive";

        let amount = '';
        if (split.length > 1)
            amount = split[1];

        while (amount[0] === " ") amount = cutLetter(amount);
        while (amount[amount.length - 1] === " ") amount = cutLetter(amount, true);

        const obj = {
            name: name,
            amount: amount,
            type: type
        }

        ingredients.push(obj);

    }

    const recipe = {
        name: getEl("rec-name").value,
        people: parseInt(getEl("rec-peop").value),
        time: `${getEl("rec-time-hr").value} godz. ${getEl("rec-time-mi").value} min.`,
        ingredients: ingredients
    };

    if (edited === null)
        recipes.push(recipe);
    else
        recipes[edited] = recipe;

    saveRecipes(recipes);

}

getEl("rec-ingr-name").addEventListener("keydown", e => {if (e.key === "Enter") addIngredient() });
getEl("rec-submit").addEventListener("click", finalizeRecipe);
// getEl("rec-ingr-add").addEventListener("click", addIngredient);
