const { app, BrowserWindow } = require("electron");
const remoteMain = require("@electron/remote/main");


let win;
remoteMain.initialize();

function createWindows() {
    /* main window */
    win = new BrowserWindow({
        height: 500,
        width: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    win.loadFile("./src/views/index.html");
    win.setTitle("SC Youtube Downloader - v1.0.0");
    win.setPosition(50, 50);
    remoteMain.enable(win.webContents);
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindows();
    console.log("app inicializado...");
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

app.on("window-all-closed", function () {
    console.log("...app finalizado");
    if (process.platform !== "darwin") app.quit();
});

/* code */