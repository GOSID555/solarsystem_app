import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { watchUiScale } from './ui'

watchUiScale()

// ไม่ใช้ StrictMode เพราะ <Html> ของ drei จะ unmount ซ้ำตอน dev แล้วขึ้น error ใน console
createRoot(document.getElementById('root')).render(<App />)
