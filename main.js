const { app, BrowserWindow, session, Menu } = require('electron')
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require("cross-fetch");
const prompt = require('electron-prompt');
const path = require('path');
const fs = require('fs')



app.whenReady().then(async () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        icon:  __dirname + './favicon.png',
        webPreferences: {
          // nodeIntegration: true,
          preload: path.join(__dirname, 'preload.js'),
          // webviewTag: true,
          // enableRemoteModule: true,
        }
    });

    win.setBackgroundColor('#292a2d');
    win.setTitle('u.gg custom client')
    
    fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (err, data) => {
      let config = JSON.parse(data)
      win.loadURL(`https://u.gg/lol/profile/${config.region}/${config.name}/live-game`)
    })
    // win.loadURL('https://d3ward.github.io/toolz/adblock.html')
    


    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
      blocker.enableBlockingInSession(session.defaultSession);
    });

    let current_champ = 'irelia'

    const template = [
      {
        label: 'Live',
        click: () => {
          fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (err, data) => {
            let config = JSON.parse(data)
            win.loadURL(`https://u.gg/lol/profile/${config.region}/${config.name}/live-game`)
        })
        }
      },
      {
        label: 'Search',
        submenu: [
          {
            label: "Search for a champion",
            click: () => {
              prompt({
                title: 'u.gg custom client - search for a champion',
                label: 'Enter champion name:',
                type: 'input',
                icon: __dirname + './favicon.png',
                height: 177,
              })
              .then((r) => {
                if (r !== null) {
                  win.loadURL(`https://u.gg/lol/champions/${r}/build`)
                  current_champ = r
                }
              })
            }
          },
          {
            label: "Search for a player",
            click: () => {
              prompt({
                title: 'u.gg custom client - search for a player',
                label: 'Enter summoner name:',
                type: 'input',
                icon: __dirname + './favicon.png',
                height: 177,
              })
              .then((r) => {
                if (r !== null) {
                  fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (err, data) => {
                    let config = JSON.parse(data)
                    win.loadURL(`https://u.gg/lol/profile/${config.region}/${r}/overview`)
                  })
                }
              })
            }
          }
        ],
      },
      {
        label: "ARAM",
        click: () => {
          let currentURL = win.webContents.getURL().split("/")
          if (currentURL[currentURL.length-2] !== "aram") {
            win.loadURL(`https://u.gg/lol/champions/aram/${currentURL[currentURL.length-2]}-aram`)
            console.log(`https://u.gg/lol/champions/aram/${currentURL[currentURL.length-2]}-aram`)
          }
        }
      },
      {
        label: 'Tier List',
        click: () => {
          win.loadURL('https://u.gg/lol/tier-list')
        }
      },
      {
        label: 'Multisearch',
        click: () => {
          win.loadURL('https://u.gg/multisearch')
        }
      },
      {
        label: 'op.gg',
        click: () => {
          fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (err, data) => {
            let config = JSON.parse(data)
            win.loadURL(`https://${config.op_gg_region}.op.gg/summoner/userName=${config.name}`)
          })
        }
      },
      {
        label: 'devtools',
        click: () => {
          win.openDevTools()
        }
      }
    ]


    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    
    // dev tools
    // win.webContents.openDevTools()

    win.on('page-title-updated', (evt) => {
      evt.preventDefault();
    });

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})