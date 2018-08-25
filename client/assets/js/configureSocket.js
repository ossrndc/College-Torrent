socket.on('data-chunk', function (newdata) {
    socket.emit('newpart', newdata);
});

socket.on('F_FOUND', function (filehash) {
    if (checkIfDownloadRequestWasSend(filehash)) {
        socket.emit('START_DOWNLOAD', filehash);
    }
});

socket.on('F_SEARCH', function (filehash) {
    serachForDownloadedFile(filehash);
});

function broadcastFileHash(fileHash) {
    scoket.emit('F_SEARCH', fileHash);
}

function broadcastFileHashFound(foundFileHash) {
    socket.emit('F_FOUND', foundFileHash);
}