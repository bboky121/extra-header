const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const store = require('./store')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  loadHome()

  mainWindow.webContents.openDevTools({ mode: 'detach' })
}

// 첫 화면(입력 폼)으로 이동
function loadHome() {
  if (!mainWindow) return
  mainWindow.loadFile(path.join(__dirname, 'input.html'))
}

function buildMenu() {
  const template = [
    {
      label: '탐색',
      submenu: [
        {
          label: '첫 화면으로',
          accelerator: 'CmdOrCtrl+Home',
          click: () => loadHome(),
        },
        { type: 'separator' },
        { role: 'quit', label: '종료' },
      ],
    },
    {
      label: '보기',
      submenu: [
        { role: 'reload', label: '새로고침' },
        { role: 'forceReload', label: '강력 새로고침' },
        { role: 'toggleDevTools', label: '개발자 도구' },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.whenReady().then(() => {
  buildMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ---------- IPC 핸들러 ----------

// 입력 화면 진입 시 마지막에 저장된 값 돌려주기
ipcMain.handle('get-saved-input', () => {
  return store.load()
})

// 입력 폼에서 "이동" 버튼을 눌렀을 때 실행
// url과 headers 배열([{key, value}, ...])을 받아서
// 1) 값을 파일에 저장하고
// 2) extraHeaders 형식("Key: Value\n"의 연속 문자열)으로 변환해
//    실제 loadURL 수행 (최초 로드에만 적용됨)
ipcMain.handle('navigate', (event, { url, headers }) => {
  store.save({ url, headers })

  let normalizedUrl = url.trim()
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'http://' + normalizedUrl
  }

  const validHeaders = (headers || []).filter(
    (h) => h.key && h.key.trim().length > 0
  )

  const extraHeaders =
    validHeaders.length > 0
      ? validHeaders.map((h) => `${h.key.trim()}: ${h.value ?? ''}\n`).join('')
      : undefined

  mainWindow.loadURL(normalizedUrl, extraHeaders ? { extraHeaders } : undefined)

  return { ok: true }
})
