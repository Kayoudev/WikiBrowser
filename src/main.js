const { app, BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "WikBrowser",
        icon: path.join(__dirname, '../assets/wikibrowser_icon.png'),
        width: 1200,
        height: 700,
    })

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
    createMainWindow();
});