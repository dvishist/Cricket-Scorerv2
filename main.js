const { app, BrowserWindow, Menu, ipcRenderer, remote, ipcMain } = require('electron')

const mainMenu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
                accelerator: 'Ctrl+I'
            }
        ]
    }
])



app.on('ready', () => {

    const indexWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
    })
    indexWindow.setMenu(mainMenu)
    indexWindow.maximize()
    indexWindow.setResizable(false)
    indexWindow.loadFile('views/index.html')

    const setupWindow = new BrowserWindow({
        width: 450,
        height: 600,
        title: 'Setup Cricket Match',
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
    })

    setupWindow.setMenu(null)
    setupWindow.show()
    setupWindow.loadFile("views/setupWindow.html")

    ipcMain.on('match-created', (e, match) => {
        const controllerWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            x: 300,
            y: 155,
            title: 'Match Controller',
            show: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
        })
        controllerWindow.setMenu(null)
        controllerWindow.show()
        controllerWindow.loadFile("views/controllerWindow.html")
        controllerWindow.setMenu(mainMenu)

        indexWindow.webContents.send('match-created', match)
        controllerWindow.webContents.on('dom-ready', () => {
            controllerWindow.webContents.send('controller-setup', match)
        })
    })

    ipcMain.on('controller-Setup', (e, matchState) => {
        controllerWindow.webContents.send('controller-setup', matchState)
    })

    ipcMain.on('update-players', (e, liveState) => {
        indexWindow.webContents.send('update-players', liveState)
    })

    ipcMain.on('update-main', (e, matchState) => {
        indexWindow.webContents.send('update-main', matchState)
    })

    ipcMain.on('fade-batsman', (e, batsman) => {
        indexWindow.webContents.send('fade-batsman', batsman)
    })

    ipcMain.on('unfade-batsman', (e, batsman) => {
        indexWindow.webContents.send('unfade-batsman', batsman)
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
