// 간단한 로컬 테스트 서버
// 요청이 들어올 때마다 받은 헤더를 콘솔 + 브라우저 화면에 그대로 출력해준다.
// 이걸로 Electron의 extraHeaders가 실제로 서버까지 전달되는지 눈으로 확인할 수 있음.

const http = require('http')

const PORT = 3000
let requestCount = 0

const server = http.createServer((req, res) => {
  requestCount++
  const headers = req.headers

  console.log(`\n===== 요청 #${requestCount} (${req.method} ${req.url}) =====`)
  console.log(JSON.stringify(headers, null, 2))

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })

  const authHeader = headers['authorization'] || '(없음)'
  const customHeader = headers['x-custom-header'] || '(없음)'

  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>헤더 테스트</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 24px; background: #1e1e2e; color: #cdd6f4; }
        h1 { color: #89b4fa; }
        .box { background: #313244; padding: 16px; border-radius: 8px; margin: 12px 0; }
        .highlight { color: #a6e3a1; font-weight: bold; }
        .missing { color: #f38ba8; }
        pre { white-space: pre-wrap; word-break: break-all; }
        button { padding: 8px 16px; margin-top: 12px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>요청 #${requestCount}</h1>
      <div class="box">
        <p>Authorization: <span class="${authHeader === '(없음)' ? 'missing' : 'highlight'}">${authHeader}</span></p>
        <p>X-Custom-Header: <span class="${customHeader === '(없음)' ? 'missing' : 'highlight'}">${customHeader}</span></p>
      </div>
      <div class="box">
        <p>전체 요청 헤더:</p>
        <pre>${JSON.stringify(headers, null, 2)}</pre>
      </div>
      <button onclick="location.reload()">새로고침 (헤더 사라지는지 테스트)</button>
    </body>
    </html>
  `)
})

server.listen(PORT, () => {
  console.log(`테스트 서버 실행 중: http://localhost:${PORT}`)
})
