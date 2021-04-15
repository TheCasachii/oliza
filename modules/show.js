const { loadRecipes, getRecipeIdByName, parseGetParam, saveRecipes } = require("../modules/parse_recipes");
const getEl = require("../modules/getEl");
const Locales = require("../modules/locales");
require("../modules/theme");

let recipes = loadRecipes();

const pgp = parseGetParam(location.search);

let idx = pgp.p;

const recipe = recipes[idx];

document.title = Locales.Pages.ShowRecipe;
getEl("rec-go-back").innerHTML = `[${Locales.UI.BackTo} `;
getEl("Props").innerHTML = Locales.Elements.Properties;
getEl("rec-prep-time").innerHTML = `${Locales.Elements.PrepTime}: `;
getEl("rec-portions").innerHTML = `${Locales.Elements.Portions}: `;
getEl("Ingr").innerHTML = Locales.Elements.Ingredients;
getEl("rec-edit-h3").innerHTML = Locales.UI.EditRecipe;
getEl("rec-delete").innerHTML = Locales.UI.DeleteRecipe;

getEl('recipe-name').innerHTML = recipe.name;
getEl('rec-prep-time').innerHTML += recipe.time;
getEl('rec-portions').innerHTML += recipe.people;
getEl('rec-edit').href += `?edit=${idx}`;

if (typeof pgp.b === "undefined") {
    getEl("rec-go-back").innerHTML += Locales.UI.List;
} else {
    getEl("rec-go-back").innerHTML += recipes[pgp.b].name;
    getEl("rec-go-back").href = `#`;
    getEl("rec-go-back").onclick = () => { history.back(); };
}

getEl("rec-go-back").innerHTML += "]";

const ingl = "rec-ingr-list";

recipe.ingredients.forEach(ing => {
    
    let li = document.createElement('li');

    if (ing.type === "primitive") li.innerHTML = `${ing.amount} ${ing.name}`;
    else {

        const rec = getRecipeIdByName(ing.name, recipes);
        if (rec === -1) return;

        li.innerHTML = `<a class="zp" href="?p=${rec}&b=${idx}">${ing.amount} ${ing.name}</a>`;

    }

    getEl(ingl).appendChild(li);

});

getEl("rec-delete").addEventListener("click", () => {
    if (!confirm(Locales.UI.ConfirmMessage)) return;
    recipes.splice(idx, 1);
    saveRecipes(recipes);
});
