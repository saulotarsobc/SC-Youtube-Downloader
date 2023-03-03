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
/* html elements */

buscar.addEventListener('click', async () => {
    buscarVideo();
});

async function buscarVideo() {
    clearAll();
    let info = await ytdl.getInfo(url.value);
    console.log(info);
    title.value = info.videoDetails.title;
    description.value = info.videoDetails.description;
    thumb.src = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
    channel_thumb.src = info.videoDetails.author.thumbnails[2].url;
    channel_name.innerHtml = `<a href="https://github.com/saulotarsobc" target="_blank">${info.videoDetails.author.name}</a>`;
    channel_sub.innerHTML = info.videoDetails.author.subscriber_count + ' inscritos<br>' + info.videoDetails.viewCount + ' visualizações';
};

function clearAll() {
    thumb.src = "./image/nothing.png";
    channel_thumb.src = "./image/channel_thumb.jpeg";
    title.value = "";
    description.value = "";
    channel_name.innerHtml = `<a href="https://github.com/saulotarsobc" target="_blank">Saulo Costa</a>`;
    channel_sub.innerHTML = "@saulotarsobc";
};

buscarVideo();