const { app, BrowserWindow, Menu, ipcRenderer, remote, ipcMain } = require('electron')
const { team1Obj, team2Obj } = require('./match/teamsLoader')
const createMatch = require('./match/createMatch')
const play = require('./match/matchController')


const createMenus = () => {
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
        },
        {
            label: 'Match',
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
    Menu.setApplicationMenu(mainMenu)
}



app.on('ready', () => {
    const indexWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
    })
    indexWindow.maximize()
    indexWindow.setMovable(false)
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
    setupWindow.show()
    setupWindow.loadFile("views/setupWindow.html")
    createMenus()

    ipcMain.on('match-created', (e, match) => {
        console.log(match)
        indexWindow.webContents.send('match-created', match)
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
