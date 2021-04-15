
const getEl = require("../modules/getEl");
const { loadPlanner, showPlanner, savePlanner, emptyPlanner, PLANNER_DAYS } = require("../modules/parse_planner");
const printJS = require("print-js");
const Locales = require("../modules/locales");
require("../modules/theme");

let planner = loadPlanner();

showPlanner(getEl('container'), planner);

document.title = Locales.Pages.ShowWeek;
getEl("GoToRecipeList").innerHTML = Locales.UI.GoToRecipeList;
getEl("ShuffleDays").innerHTML    = Locales.UI.ShuffleDays;
getEl("PrintPlanner").innerHTML   = Locales.UI.PrintPlanner;
getEl("GoToShoppingList").innerHTML=Locales.UI.GoToShoppingList;

function shuffle() {

    if (!confirm(Locales.UI.ConfirmMessage)) return;

    let newPlanner = emptyPlanner();

    function rand(r) {
        return Math.floor(Math.random() * r);
    }

    planner.forEach(day => {
        
        const l = planner.length;
        let i;

        do {
           i = rand(l);
        } while( newPlanner[i][0] !== "Brak" || newPlanner[i][1] !== "Brak" );

        newPlanner[i] = day;

    });

    savePlanner(newPlanner);

}

function printDays() {
    let data = [];


    PLANNER_DAYS.forEach((day, i) => {
        const d1 = (planner[i][0] === "Brak") ? Locales.Elements.Empty : planner[i][0];
        const d2 = (planner[i][1] === "Brak") ? Locales.Elements.Empty : planner[i][1];
        data.push({
            dayName: day,
            dish1: d1,
            dish2: d2
        });
    });

    const style = "font-family: sans-serif; border: 1px solid lightgrey; font-size: 20pt;"

    printJS({
        printable: data,
        type: 'json',
        properties: [
            { field: "dayName", displayName: Locales.Elements.Day },
            { field: "dish1", displayName: Locales.Elements.Dish1 },
            { field: "dish2", displayName: Locales.Elements.Dish2 }
        ],
        style: "@page { size: landscape; }",
        gridStyle: style,
        gridHeaderStyle: style,
        headerStyle: style,
        header: `<h2>${Locales.Elements.Planner}</h2>`
    });
}

getEl("day-shuffle").addEventListener("click", shuffle);
getEl("print-week").addEventListener("click", printDays);
