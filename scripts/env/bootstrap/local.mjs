/**
 * Build plaintext `.env.local` from `.env.example` keys, filling values from
 * existing `.env` and/or plaintext `.env.local` (later wins). Aborts if
 * `.env.local` looks dotenvx-encrypted unless --force.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const force = process.argv.includes('--force')

const read = (name) => {
	const p = path.join(root, name)
	return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''
}

const parseEnv = (text) => {
	const out = {}
	for (const line of text.split('\n')) {
		if (line === '' || line.startsWith('#')) continue
		const i = line.indexOf('=')
		if (i === -1) continue
		const k = line.slice(0, i).trim()
		if (k === '') continue
		out[k] = line.slice(i + 1)
	}
	return out
}

const examplePath = path.join(root, '.env.example')
if (!fs.existsSync(examplePath)) {
	console.error('Missing .env.example')
	process.exit(1)
}

const exampleText = fs.readFileSync(examplePath, 'utf8')
const localPath = path.join(root, '.env.local')
const localRaw = read('.env.local')
if (
	localRaw !== ''
	&& /encrypted:/.test(localRaw)
	&& !force
) {
	console.error(
		'.env.local appears encrypted. Run pnpm run env:decrypt first, or pass --force to overwrite.',
	)
	process.exit(1)
}

const merged = {
	...parseEnv(read('.env')),
	...parseEnv(localRaw),
}

let out = ''
for (const line of exampleText.split('\n')) {
	if (line === '' || line.startsWith('#')) {
		out += `${line}\n`
		continue
	}
	const i = line.indexOf('=')
	if (i === -1) {
		out += `${line}\n`
		continue
	}
	const k = line.slice(0, i).trim()
	const v = merged[k] ?? ''
	out += `${k}=${v}\n`
}

fs.writeFileSync(localPath, out)
console.error(`Wrote ${path.relative(root, localPath)} (${Object.keys(merged).length} known values merged).`)
