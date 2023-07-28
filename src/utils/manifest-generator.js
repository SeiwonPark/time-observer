import { copyFileSync } from 'fs'
import path, { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const source = join(__dirname, '../../public/manifest.json')
const destination = join(__dirname, '../../dist/manifest.json')

copyFileSync(source, destination)
