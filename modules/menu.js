const { Menu, MenuItem }    = require("electron")       ,
      fs                    = require("fs")             ,
      Locales               = require("./locales")      ,
      { PLATFORM }          = require("./platform")     ,
      Preferences           = require("./preferences")  ;

const mainMenu              = new Menu                  ,
      optionMenu            = new Menu                  ,
      languageMenu          = new Menu                  ,
      themeMenu             = new Menu                  ;

const langs                 = fs.readdirSync(PLATFORM.LOCALES_DIR, { encoding: "utf-8", withFileTypes: false });

langs.forEach(lang => {
    const lang_data = JSON.parse(fs.readFileSync(`${PLATFORM.LOCALES_DIR}${lang}`, { encoding: "utf-8", flag: 'r' }));

    languageMenu.append(new MenuItem({
        type: "radio",
        label: lang_data.Name,
        checked: (lang_data.Name === Locales.Name),
        click: () => {
            Preferences.init();
            Preferences.set("Language", lang.split(".json").join(""));
            Preferences.save();
        }
    }));

});

Preferences.init();

themeMenu.append(new MenuItem({
    type: "radio",
    label: Locales.Theme[0],
    checked: (Preferences.get("Theme") === 0),
    click: () => {
        Preferences.init();
        Preferences.set("Theme", 0);
        Preferences.save();
    }
}));

themeMenu.append(new MenuItem({
    type: "radio",
    label: Locales.Theme[1],
    checked: (Preferences.get("Theme") === 1),
    click: () => {
        Preferences.init();
        Preferences.set("Theme", 1);
        Preferences.save();
    }
}));

optionMenu.append(new MenuItem({
    type: "submenu",
    submenu: languageMenu,
    label: Locales.UI.LanguageMenu,
    icon: "icon/langmenu.png"
}));

optionMenu.append(new MenuItem({
    type: "submenu",
    submenu: themeMenu,
    label: Locales.UI.ThemeMenu
}));

const separator = new MenuItem({
    type: "separator"
});

optionMenu.append(separator);


optionMenu.append(new MenuItem({
    label: Locales.UI.Quit,
    role: "quit"
}))

mainMenu.append(new MenuItem({
    type: "submenu",
    submenu: optionMenu,
    label: Locales.UI.Options
}));

module.exports = mainMenu;
