
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const mainMenu = require("./modules/menu");

function createWindow() {

    const h = 854;
    const w = 480;

    const win = new BrowserWindow({
        minWidth: w,
        width: w,
        // maxWidth: w,
        minHeight: h,
        height: h,
        // maxHeight: h,
        icon: path.join(__dirname, "icon/oliza32.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile("html/lista-przepisow.html");
    win.webContents.openDevTools();

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

Menu.setApplicationMenu(mainMenu);
