const ytdl = require('ytdl-core');
const fs = require('fs');

const videoUrl = "https://youtu.be/hsZVlDQEwnI";

setTimeout(async () => {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;
    const videoSize = videoInfo.videoDetails.lengthSeconds;

    const video = ytdl(videoUrl);

    let downloaded = 0;

    video.on('progress', (chunkLength, downloadedLength, totalLength) => {
        downloaded += chunkLength;

        const progress = (downloaded / totalLength) * 100;
        const downloadedMB = downloaded / (1024 * 1024);
        const totalMB = totalLength / (1024 * 1024);

        console.log(`Baixando "${videoTitle}" - ${progress.toFixed(2)}% concluído (${downloadedMB.toFixed(2)} MB de ${totalMB.toFixed(2)} MB)`);
    });

    video.pipe(fs.createWriteStream(`${videoTitle}.mp4`))
        .on('finish', () => {
            console.log(`Download do vídeo "${videoTitle}" concluído com sucesso!`);
        });

});
