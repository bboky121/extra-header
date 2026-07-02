const { contextBridge, ipcRenderer } = require('electron')

// contextIsolation 환경에서 렌더러(HTML/JS)가 window.api를 통해서만
// 메인 프로세스 기능을 제한적으로 사용할 수 있게 노출
contextBridge.exposeInMainWorld('api', {
  // 저장된 마지막 입력값(url, headersText) 불러오기
  getSavedInput: () => ipcRenderer.invoke('get-saved-input'),

  // 입력한 url/headers로 실제 페이지 이동 요청
  navigate: (data) => ipcRenderer.invoke('navigate', data),
})
