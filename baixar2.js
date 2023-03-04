const ytdl = require('ytdl-core');
const fs = require('fs');

const videoId = '29bWdogk2tA'; // Insira o ID do vídeo que você deseja baixar aqui
const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

ytdl.getInfo(videoUrl).then(info => {
    const { formats } = info;
    const { title } = info.videoDetails;
    const format = formats[13];
    const container = format.container
    // Baixe o vídeo
    const stream = ytdl.downloadFromInfo(info, { format });
    let downloaded = 0;
    stream.on('progress', (chunkLength, downloadedLength, totalLength) => {
        downloaded += chunkLength;
        const progress = (downloaded / totalLength) * 100;
        const downloadedMB = downloaded / (1024 * 1024);
        const totalMB = totalLength / (1024 * 1024);
        console.log(`Baixando "${title}.${container}" - ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`);
    });
    stream.pipe(fs.createWriteStream(`${title}.${container}`));
});
