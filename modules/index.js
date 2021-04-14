const { loadRecipes, showRecipes } = require("../modules/parse_recipes");
const getEl = require("../modules/getEl");
const Locales = require("../modules/locales");
const fs = require("fs");
const { PLATFORM } = require("../modules/platform");

document.title = Locales.Pages.RecipeList;

getEl("GoToPlanner").innerHTML = Locales.UI.GoToPlanner;
getEl("AddRecipe").innerHTML  += Locales.UI.AddRecipe;

let recipes = loadRecipes();
showRecipes(getEl('container'), recipes);