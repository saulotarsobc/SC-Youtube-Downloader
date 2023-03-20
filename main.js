const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require('fs');
const ytdl = require('ytdl-core');

let win;

function createWindows() {
    /* main window */
    win = new BrowserWindow({
        height: 700,
        width: 580,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    win.loadFile("./home.html");
    win.setTitle("SC Youtube Downloader");
    // win.setTitle(`${require('./package.json').build.productName} - v${require('./package.json').version}`);
    // win.setPosition(50, 50);
    // win.maximize();
    // win.webContents.openDevTools();
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
ipcMain.on('baixar', (event, { info, formatoEscolido, videoTitle }) => {
    const { container } = formatoEscolido;
    const download = ytdl.downloadFromInfo(info, { formatoEscolido });
    download.on('progress', (chunkLength, downloaded, total) => {
        /* progresso */
        const progress = (downloaded / total) * 100;
        const downloadedMB = downloaded / (1024 * 1024);
        const totalMB = total / (1024 * 1024);

        /* velocidade */

        /* exibir resultados */
        // console.log(`"${videoTitle}.${container}" - ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`);

        win.setProgressBar((Number(progress.toFixed()) * 0.01));
        console.log((Number(progress.toFixed()) * 0.01));
        win.webContents.send('show', {
            valueOfProgresso: progress.toFixed(2),
            textOfMessage: `Baixando... ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`,
            textOfConsole: `${videoTitle}.${container}" - ${progress.toFixed(2)} % concluído(${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`
        });
    });
    download.on('finish', () => {
        console.log(`Download do vídeo "${videoTitle}" concluído com sucesso!`);
    });

    dialog.showSaveDialog(null, {
        title: 'Salvar arquivo',
        defaultPath: `${videoTitle.replace(/[^\w\s]/gi, '')}.${container}`,
        buttonLabel: 'Salvar',
        filters: [
            { name: 'Documentos', extensions: [container] },
            { name: 'Todos os arquivos', extensions: ['*'] }
        ]
    }).then(result => {
        console.log(result.filePath);
        download.pipe(fs.createWriteStream(result.filePath));
    }).catch(err => {
        console.log(err);
    });
});