/* libs */
const { ipcRenderer } = require('electron');
const ytdl = require('ytdl-core');
/* libs */

/* html elements */
const url = document.getElementById('url');
const buscar = document.getElementById('buscar');
// const thumb = document.getElementById('thumb');
const title = document.getElementById('title');
const description = document.getElementById('description');
const channel_thumb = document.getElementById('channel_thumb');
const channel_name = document.getElementById('channel_name');
const channel_sub = document.getElementById('channel_sub');
const mensagem = document.getElementById('mensagem');
const progresso = document.getElementById('progresso');
const formats = document.getElementById('formats');
const video_frame = document.getElementById('video_frame');
/* html elements */

buscar.addEventListener('click', async () => {
    buscarVideo();
});

let info, videoTitle, videoFormats = {};

async function buscarVideo() {
    console.log('bucando...');
    clearAll();

    info = await ytdl.getInfo(url.value);
    console.log(info);

    videoTitle = info.videoDetails.title;

    videoFormats = info.formats;
    renderFormts();

    title.value = info.videoDetails.title;
    description.value = info.videoDetails.description;
    // thumb.src = info.videoDetails.thumbnails.slice(-1)[0].url;
    video_frame.src = info.videoDetails.embed.iframeUrl;
    video_frame.height = 200;
    channel_thumb.src = info.videoDetails.author.thumbnails.slice(-1)[0].url;
    channel_name.innerHTML = `<a href="${info.videoDetails.author.channel_url}" target="_blank">${info.videoDetails.author.name}</a>`;
    channel_sub.innerHTML = 'Inscritos: ' + info.videoDetails.author.subscriber_count + '<br>Views: ' + info.videoDetails.viewCount;
};

buscarVideo();

async function renderFormts() {

    console.log(videoFormats);

    formats.innerHTML = "";

    await videoFormats.map(({ qualityLabel, mimeType, container, codecs }, index) => {
        formats.innerHTML += `<div class="format" data-index=${index}>
            <div class="indexValue">Index: ${index}</div>    
            <div>Qualidade: ${qualityLabel}</div>
            <div>Formato: ${container}</div>
            <div>Mine: ${mimeType}</div>
            <div>Codecs: ${codecs}</div>
        </div>`;
    });
    document.querySelectorAll('.format').forEach(format => {
        format.addEventListener('click', () => {
            baixar(format.dataset.index);
        });
    });
};

function baixar(index) {
    ipcRenderer.send('baixar', {
        formatoEscolido: videoFormats[index],
        info,
        videoTitle
    });
};

ipcRenderer.on('show', (event, { valueOfProgresso, textOfMessage, textOfConsole }) => {
    progresso.value = valueOfProgresso;
    mensagem.innerHTML = textOfMessage;
    console.log(textOfConsole);
});

function clearAll() {
    // thumb.src = "./image/nothing.png";
    channel_thumb.src = "./image/channel_thumb.jpeg";
    title.value = "";
    description.value = "";
    channel_name.innerHTML = `<a href="https://github.com/saulotarsobc" target="_blank">Saulo Costa</a>`;
    channel_sub.innerHTML = "@saulotarsobc";
    progresso.value = 0;
    mensagem.innerHTML = "Download não iniciado";
    formats.innerHTML = "";
    video_frame.height = 0;
    video_frame.src = "";
};



