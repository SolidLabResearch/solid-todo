import App from './components/App'
import './index.css'
import { createRoot } from 'react-dom/client'

const rootMountPoint: HTMLElement = document.getElementById('root') as HTMLElement

createRoot(rootMountPoint).render(<App />)
