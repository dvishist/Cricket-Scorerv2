const { app, BrowserWindow, Menu, ipcRenderer, ipcMain } = require('electron')
// const { team1Obj, team2Obj } = require('./match/teamsLoader')
// const createMatch = require('./match/createMatch')
// const play = require('./match/matchController')

// const match = createMatch(team1Obj, team2Obj, team2Obj, 'bat', 20)
// play(match)

ipcMain.on('match-created', (e, match) => {
    console.log(match)
})

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
    })
    win.maximize()
    win.setMovable(false)
    win.loadFile('views/index.html')
}

const createSetupWindow = () => {
    const win2 = new BrowserWindow({
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
    win2.show()
    win2.loadFile("views/setupWindow.html")
}

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
    createWindow()
    //createSetupWindow()
    createMenus()

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
