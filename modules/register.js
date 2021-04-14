const { keccak512 } = require("js-sha3");
const getEl = require("../modules/getEl");
const Locales = require("../modules/locales");
const path = require("path");
const fs = require("fs");
const { PLATFORM } = require("../modules/platform");

document.title = Locales.Pages.Register;

getEl("username").placeholder = Locales.UI.Username;
getEl("password").placeholder = Locales.UI.Password;
getEl("register").innerHTML = Locales.UI.Register;
getEl("regh1").innerHTML = Locales.UI.OlizaRegistration;
getEl("prompt").innerHTML = Locales.UI.RegDataPrompt;
getEl("already-reg").innerHTML = Locales.UI.AlreadyRegisteredLogIn;

getEl("register").addEventListener("click", () => {

    const un = getEl("username").value;
    const pa = getEl("password").value;

    getEl("rec-delete").innerHTML = '';

    if (un.length < 4) {
        getEl("rec-delete").innerHTML = Locales.UI.RegShortUname;
        return;
    }

    if (pa.length < 8) {
        getEl("rec-delete").innerHTML = Locales.UI.RegShortPass;
        return;
    }

    fetch(`${PLATFORM.RECIPE_REQUEST_PATH}?user=${un}&pass=1`)
    .then(r => r.json())
    .then(data => {
        if (data.stat !== 502) {
            getEl("rec-delete").innerHTML = Locales.UI.UnameTaken;
            return;
        }

        const hash = keccak512(pa);

        // Send request to server

        fetch(`${PLATFORM.ACCOUNT_PATH}?user=${un}&pass=${hash}`)
        .then(r => r.json())
        .then(response => {
            switch(response.stat) {
                case 501:
                    getEl("rec-delete").innerHTML = Locales.UI.HackingAttempt;
                    break;
                case 502:
                    getEl("rec-delete").innerHTML = Locales.UI.RegShortUname;
                    break;
                case 503:
                    getEl("rec-delete").innerHTML = Locales.UI.HackingAttempt;
                    break;
                case 504:
                    getEl("rec-delete").innerHTML = Locales.UI.UnameTaken;
                    break;
                case 505:
                    getEl("rec-delete").innerHTML = Locales.UI.EasyPeasyPassword;
                    break;
                case 200:
                    fs.writeFileSync(PLATFORM.CREDS_FILE_PATH, JSON.stringify({user: un, pass: hash}));
                    let p = location.pathname.replaceAll("\\", "/").split('/');
                    p.pop();
                    p.push("lista-przepisow.html");
                    location.pathname = path.join(...p);
                    break;
                default:
                    getEl("rec-delete").innerHTML = Locales.UI.WeirdError;
                    break;
            }
        });
    });

})
