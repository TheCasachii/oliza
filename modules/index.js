const { loadRecipes, showRecipes } = require("../modules/parse_recipes");
const getEl = require("../modules/getEl");
const Locales = require("../modules/locales");
const fs = require("fs");
const { PLATFORM } = require("../modules/platform");

document.title = Locales.Pages.RecipeList;

getEl("GoToPlanner").innerHTML = Locales.UI.GoToPlanner;
getEl("AddRecipe").innerHTML  += Locales.UI.AddRecipe;

(() => {
    const creds = JSON.parse(fs.readFileSync(PLATFORM.CREDS_FILE_PATH));
    fetch(`http://oliza.j.pl/request.php?user=${creds.user}&pass=${creds.pass}`)
    .then(r => r.json())
    .then(data => {
        fs.writeFileSync(PLATFORM.RECIPES_FILE_PATH, JSON.stringify({recipes: data.recipes}));
        fs.writeFileSync(PLATFORM.PLANNER_FILE_PATH, JSON.stringify({plan: data.planner}));
    });
})();

let recipes = loadRecipes();
showRecipes(getEl('container'), recipes);