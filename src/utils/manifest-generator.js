import { copyFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const source = path.join(__dirname, '../../public/manifest.json')
const destination = path.join(__dirname, '../../dist/manifest.json')

copyFileSync(source, destination)
