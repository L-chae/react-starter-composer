// src/templates/base.ts

export const getIndexHtmlTemplate = (ext: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;

export const getViteConfigTemplate = () => `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

export const getMainEntryTemplate = (isTs: boolean, ext: string) => `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')${isTs ? ' as HTMLElement' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

export const getAppTemplate = () => `function App() {
  return (
    <div>
      <h1>Hello React Component</h1>
    </div>
  )
}

export default App
`;

export const getTsConfigTemplate = () => `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

export const getTsConfigNodeTemplate = () => `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
`;