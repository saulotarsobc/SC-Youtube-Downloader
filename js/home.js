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
/* html elements */

buscar.addEventListener('click', async () => {
    buscarVideo();
});

async function buscarVideo() {
    let info = await ytdl.getInfo(url.value);
    console.log(info);
    title.value = info.videoDetails.title;
    description.value = info.videoDetails.description;
    thumb.src = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
};

function cleanAll(){
    thumb.src = "./image/nothing.png";
    title.value = "";
    description.value = "";
}

buscarVideo();

console.log(__dirname);