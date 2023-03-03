const { app, BrowserWindow } = require("electron");
const fs = require('fs');
const ytdl = require('ytdl-core');

let win;

function createWindows() {
    /* main window */
    win = new BrowserWindow({
        // height: 500,
        // width: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    win.loadFile("./home.html");
    win.setTitle("SC Youtube Downloader - v1.0.0");
    // win.setTitle(`${require('./package.json').build.productName} - v${require('./package.json').version}`);
    // win.setPosition(50, 50);
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