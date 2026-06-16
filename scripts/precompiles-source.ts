import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type PrecompilesManifest = {
	source: string
	ref: string
	lastSynced: string
}

type GithubContentRow = {
	name: string
	path: string
	type: 'file' | 'dir'
	download_url: string | null
}

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'..'
)

const dataDir = resolve(rootDir, 'src/data/precompiles')
const manifestFile = resolve(dataDir, 'manifest.json')

const usage = `
Usage:
  pnpm run sources:precompiles:sync

Downloads shemnon/precompiles _data/precompiles JSON into src/data/precompiles/.
`.trim()

const readManifest = async (): Promise<PrecompilesManifest> => {
	const raw = await readFile(manifestFile, 'utf8')
	return JSON.parse(raw) as PrecompilesManifest
}

const listGithubPrecompileFiles = async (
	ref: string
): Promise<GithubContentRow[]> => {
	const response = await fetch(
		`https://api.github.com/repos/shemnon/precompiles/contents/_data/precompiles?ref=${ref}`,
		{
			headers: {
				Accept: 'application/vnd.github+json',
			},
		}
	)
	if (!response.ok) {
		throw new Error(`precompiles-source: GitHub listing failed (${String(response.status)})`)
	}
	const rows = await response.json() as GithubContentRow[]
	return rows.filter((row) => (
		row.type === 'file'
		&& row.name.endsWith('.json')
		&& row.name !== 'manifest.json'
		&& row.download_url != null
	))
}

const syncPrecompiles = async () => {
	const manifest = await readManifest()
	const files = await listGithubPrecompileFiles(manifest.ref)
	await mkdir(dataDir, { recursive: true })

	for (const file of files) {
		const response = await fetch(file.download_url!)
		if (!response.ok) {
			throw new Error(`precompiles-source: download failed for ${file.name}`)
		}
		const text = await response.text()
		const parsed: unknown = JSON.parse(text)
		await writeFile(resolve(dataDir, file.name), `${JSON.stringify(parsed, null, 2)}\n`)
	}

	const localNames = new Set(files.map((file) => file.name))
	for (const name of await readdir(dataDir)) {
		if (
			name.endsWith('.json')
			&& name !== 'manifest.json'
			&& !localNames.has(name)
		) {
			console.warn(`precompiles-source: keeping local-only file ${name}`)
		}
	}

	await writeFile(
		manifestFile,
		`${JSON.stringify({
			...manifest,
			lastSynced: new Date().toISOString(),
		}, null, 2)}\n`
	)

	console.log(`precompiles-source: synced ${String(files.length)} files`)
}

const action = process.argv[2]

if (action !== 'sync') {
	console.error(usage)
	process.exit(1)
}

await syncPrecompiles()
