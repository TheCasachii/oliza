const Preferences = require("./preferences");

Preferences.init();

if (Preferences.get("Theme") === 1)
{
    document.styleSheets[1].disabled = false;
}
else
{
    document.styleSheets[1].disabled = true;
}
