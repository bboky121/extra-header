// 별도 npm 패키지 없이 fs로 간단히 구현한 영속 저장소.
// app.getPath('userData') 하위에 JSON 파일로 저장하므로 앱을 껐다 켜도 값이 유지됨.

const { app } = require('electron')
const fs = require('fs')
const path = require('path')

const filePath = path.join(app.getPath('userData'), 'saved-input.json')

const DEFAULT_DATA = {
  url: 'http://localhost:3000',
  headers: [
    { key: 'Authorization', value: 'Bearer TEST_TOKEN_12345' },
    { key: 'X-Custom-Header', value: 'hello-from-electron' },
  ],
}

function load() {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      url: parsed.url ?? DEFAULT_DATA.url,
      headers: Array.isArray(parsed.headers) ? parsed.headers : DEFAULT_DATA.headers,
    }
  } catch (e) {
    // 파일이 없거나 깨진 경우 기본값 반환
    return DEFAULT_DATA
  }
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

module.exports = { load, save }
