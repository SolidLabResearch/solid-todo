import App from './components/App'
import { createRoot } from 'react-dom/client'

import './index.css'

const rootMountPoint: HTMLElement = document.getElementById('root') as HTMLElement

createRoot(rootMountPoint).render(<App />)
