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

const controlMenu = Menu.buildFromTemplate([
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
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                click(item, focusedWindow) {
                    focusedWindow.webContents.send('undo')
                },
                accelerator: 'Ctrl+Shift+Z'
            }
        ]
    },

])


app.on('ready', () => {

    const indexWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 210,
        width: 1600,
        x: 0,
        y: 0,
        show: false,
        title: 'CRICKET SCORER V2 ©Vishist Dura 2021'
    })
    indexWindow.setMenu(controlMenu)
    indexWindow.show()
    indexWindow.setResizable(false)
    indexWindow.loadFile('views/index.html')

    const setupWindow = new BrowserWindow({
        width: 450,
        height: 700,
        x: 600,
        y: 160,
        title: 'SETUP CRICKET MATCH',
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
            width: 1200,
            height: 700,
            x: 200,
            y: 170,
            title: 'MATCH CONTROLLER',
            show: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
        })
        controllerWindow.setMenu(null)
        controllerWindow.show()
        controllerWindow.loadFile("views/controllerWindow.html")
        controllerWindow.setMenu(controlMenu)

        indexWindow.webContents.send('match-created', match)
        controllerWindow.webContents.on('dom-ready', () => {
            controllerWindow.webContents.send('controller-setup', match)
        })

        const scorecardWindow = new BrowserWindow({
            title: 'SCORECARDS',
            show: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            },
        })
        // scorecardWindow.setMenu(null)
        // scorecardWindow.show()
        // scorecardWindow.loadFile("views/scorecardWindow.html")
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

    ipcMain.on('send-message', (e, msg) => {
        indexWindow.webContents.send('send-message', msg)
    })

    ipcMain.on('add-ball', (e, ballText) => {
        indexWindow.webContents.send('add-ball', ballText)
    })

    ipcMain.on('add-remaining-balls', (e, n) => {
        indexWindow.webContents.send('add-remaining-balls', n)
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
