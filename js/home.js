/* libs */
const fs = require('fs');
const ytdl = require('ytdl-core');
/* libs */

/* html elements */
const url = document.getElementById('url');
const buscar = document.getElementById('buscar');
const thumb = document.getElementById('thumb');
const title = document.getElementById('title');
const description = document.getElementById('description');
const channel_thumb = document.getElementById('channel_thumb');
const channel_name = document.getElementById('channel_name');
const channel_sub = document.getElementById('channel_sub');
const mensagem = document.getElementById('mensagem');
const progresso = document.getElementById('progresso');
/* html elements */

buscar.addEventListener('click', async () => {
    buscarVideo();
});

let info = {};

async function buscarVideo() {
    clearAll();
    console.log('bucando...');

    info = await ytdl.getInfo(url.value);

    // console.log(info);

    title.value = info.videoDetails.title;
    description.value = info.videoDetails.description;
    thumb.src = info.videoDetails.thumbnails.slice(-1)[0].url;
    channel_thumb.src = info.videoDetails.author.thumbnails.slice(-1)[0].url;
    channel_name.innerHTML = `<a href="${info.videoDetails.author.channel_url}" target="_blank">${info.videoDetails.author.name}</a>`;
    channel_sub.innerHTML = info.videoDetails.author.subscriber_count + ' inscritos<br>' + info.videoDetails.viewCount + ' visualizações';
    baixar();
};

async function baixar() {
    console.log(info);

    const { formats } = info;

    const { title } = info.videoDetails;
    const format = formats[13];
    const container = format.container

    // Baixe o vídeo
    const download = ytdl.downloadFromInfo(info, { format });

    download.on('progress', (chunkLength, downloaded, total) => {
        const progress = (downloaded / total) * 100;
        const downloadedMB = downloaded / (1024 * 1024);
        const totalMB = total / (1024 * 1024);
        console.log(`Baixando "${title}.${container}" - ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`);
        progresso.value = progress.toFixed(2);
        mensagem.innerHTML = `Baixando... - ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`;
    });

    download.on('finish', () => {
        console.log(`Download do vídeo "${title}" concluído com sucesso!`);
        mensagem.innerHTML = "Download concluído";
    });

    download.pipe(fs.createWriteStream(`${title}.${container}`));
};


function clearAll() {
    thumb.src = "./image/nothing.png";
    channel_thumb.src = "./image/channel_thumb.jpeg";
    title.value = "";
    description.value = "";
    channel_name.innerHTML = `<a href="https://github.com/saulotarsobc" target="_blank">Saulo Costa</a>`;
    channel_sub.innerHTML = "@saulotarsobc";
    mensagem.innerHTML = "Download não iniciado";
};

buscarVideo();