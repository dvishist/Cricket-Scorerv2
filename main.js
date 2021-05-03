const { app, BrowserWindow, Menu } = require('electron')
const { team1, team2 } = require('./match/loader')
const createMatch = require('./match/matchSetup')
const play = require('./match/matchController')
play(createMatch(team1, team2, team2, 'bat', 20))


const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })
    win.maximize()
    win.show()
    win.loadFile('index.html')
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
