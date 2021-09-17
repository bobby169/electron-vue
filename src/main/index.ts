import { app, BrowserWindow } from 'electron'
import './dialog'
import indexPreload from '/@preload/index'
import anotherPreload from '/@preload/another'
import indexHtmlUrl from '/@renderer/index.html'
import sideHtmlUrl from '/@renderer/side.html'
import logoUrl from '/@static/logo.png'

// delete Ajv can start the project
import Ajv from 'ajv'

async function main() {
  app.whenReady().then(() => {
    const main = createWindow()
    const [x, y] = main.getPosition()
    // const side = createSecondWindow()
    // side.setPosition(x + 800 + 5, y)

    // The Error happen here. delete initAjv() can start the project
    // initAjv()
  })
}

function initAjv() {
  const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

  const schema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'string' },
    },
    required: ['foo'],
    additionalProperties: false,
  }

  const data = {
    foo: 1,
    bar: 'abc',
  }

  const validate = ajv.compile(schema)
  const valid = validate(data)
  console.info(valid)
  if (!valid) console.log(validate.errors)
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: indexPreload,
      contextIsolation: true,
      nodeIntegration: true,
    },
    icon: logoUrl,
  })

  mainWindow.loadURL(indexHtmlUrl)
  return mainWindow
}

function createSecondWindow() {
  const sideWindow = new BrowserWindow({
    height: 600,
    width: 300,
    webPreferences: {
      preload: anotherPreload,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  sideWindow.loadURL(sideHtmlUrl)
  return sideWindow
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.nextTick(main)
