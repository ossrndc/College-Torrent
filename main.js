// Includes for Electron App

const electron = require("electron");
const eapp = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Includes for express JS

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.Server(app);
const io = require('socket.io')(httpServer);

//Basic requires

const path = require("path");
const url = require("url");
const fs = require('fs');

let win;

// Create the main window

function createWindow() {
    win = new BrowserWindow();
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/client/index.html"),
        protocol: "file",
        slashes: true
    }));

    win.on("closed", function () {
        win = null
    });

    createServer();
    createSocketServer();
}

eapp.on("ready", createWindow);

eapp.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        eapp.quit();
    }
});

eapp.on("activate", function () {
    if (win === null) {
        createWindow();
    }
});

// Create Server Function

function createServer() {
    httpServer.listen(3000, function () {
        console.log('Server listening on port 3000');
    });
}

function createSocketServer() {
    io.on('connection', function (socket) {
        console.log('New Socket Connected', socket.id);
        socketEventConfigure(socket);
    });
}

function socketEventConfigure(socket) {
    socket.on('F_FOUND', function (fileHash) {
        const readStream = fs.createReadStream(path.resolve(fileHash), {highWaterMark: 128 * 1024});
        uploadFile(socket, readStream);
    });
    socket.on('START_DOWNLOAD', function (fileHash) {
        const writeStream = fs.createWriteStream(path.resolve(fileHash));
        download(socket, writeStream);
    });
}

function uploadFile(socket, readStream) {
    const chunk = [];

    readStream.on('readable', function () {
        console.log('sending file started !!');
    });

    readStream.on('data', function (chunk) {
        socket.emit('data-chunk', chunk)
    });

    readStream.on('end', function (chunk) {
        console.log('sending parts end');
    });
}

function download(socket, writeStream) {
    socket.on('newpart', function (newdata) {
        console.log("data incoming");
        writeStream.write(newdata);
    });
}