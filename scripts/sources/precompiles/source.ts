import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
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

type GithubPrecompileFile = {
	name: string
	downloadUrl: string
}

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../../..'
)

const dataDir = resolve(rootDir, 'src/constants/precompiles')
const manifestFile = resolve(dataDir, 'manifest.json')

const usage = `
Usage:
  pnpm run sources:precompiles:sync
  pnpm run sources:precompiles:check

Downloads shemnon/precompiles _data/precompiles JSON into src/constants/precompiles/.
`.trim()

const readManifest = async (): Promise<PrecompilesManifest> => {
	const raw = await readFile(manifestFile, 'utf8')
	return JSON.parse(raw) as PrecompilesManifest
}

const listGithubPrecompileFiles = async (
	ref: string
): Promise<GithubPrecompileFile[]> => {
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
	return rows.flatMap((row) => (
		row.type === 'file'
		&& row.name.endsWith('.json')
		&& row.name !== 'manifest.json'
		&& row.download_url != null ?
			[{
				name: row.name,
				downloadUrl: row.download_url,
			}]
		:
			[]
	))
}

const normalizedJson = (
	name: string,
	text: string,
	definitionNames: ReadonlySet<string>
) => {
	const parsed = JSON.parse(text
		.replace(/,\s*([}\]])/g, '$1')
		.replaceAll('eip155-4220-', 'eip155-42220-'))

	if (
		name.endsWith('-schedule.json')
		&& parsed != null
		&& typeof parsed === 'object'
		&& !Array.isArray(parsed)
	) {
		for (const [
			key,
			value,
		] of Object.entries(parsed)) {
			if (key === 'name')
				continue

			if (Array.isArray(value))
				parsed[key] = value.filter((id) => (
					typeof id === 'string'
					&& definitionNames.has(id)
				))
		}
	}

	return `${JSON.stringify(parsed, null, 2)}\n`
}

const downloadPrecompiles = async (targetDir: string) => {
	const manifest = await readManifest()
	const files = await listGithubPrecompileFiles(manifest.ref)
	const definitionNames = new Set(
		files
			.map((file) => file.name.replace('.json', '').replaceAll('eip155-4220-', 'eip155-42220-'))
			.filter((name) => /^eip155-\d+-0x[0-9a-f]+$/.test(name))
	)
	await mkdir(targetDir, { recursive: true })

	for (const file of files) {
		const response = await fetch(file.downloadUrl)
		if (!response.ok) {
			throw new Error(`precompiles-source: download failed for ${file.name}`)
		}
		const text = await response.text()
		try {
			await writeFile(resolve(targetDir, file.name), normalizedJson(
				file.name,
				text,
				definitionNames
			))
		}
		catch (error) {
			throw new Error(`precompiles-source: invalid JSON in ${file.name}`, {
				cause: error,
			})
		}
	}

	const localNames = new Set(files.map((file) => file.name))
	return {
		manifest,
		localNames,
		count: files.length,
	}
}

const syncPrecompiles = async () => {
	const {
		manifest,
		localNames,
		count,
	} = await downloadPrecompiles(dataDir)

	for (const name of await readdir(dataDir)) {
		if (
			name.endsWith('.json')
			&& name !== 'manifest.json'
			&& !localNames.has(name)
		) {
			throw new Error(`precompiles-source: local-only file ${name}`)
		}
	}

	await writeFile(
		manifestFile,
		`${JSON.stringify({
			...manifest,
			lastSynced: new Date().toISOString(),
		}, null, 2)}\n`
	)

	console.log(`precompiles-source: synced ${String(count)} files`)
}

const checkPrecompiles = async () => {
	const tempDir = await mkdtemp(resolve(tmpdir(), 'blockhead-precompiles-'))
	try {
		const { localNames } = await downloadPrecompiles(tempDir)

		for (const name of await readdir(dataDir)) {
			if (
				name.endsWith('.json')
				&& name !== 'manifest.json'
				&& !localNames.has(name)
			)
				throw new Error(`precompiles-source: local-only file ${name}`)
		}

		for (const name of localNames) {
			const [
				actual,
				expected,
			] = await Promise.all([
				readFile(resolve(tempDir, name), 'utf8'),
				readFile(resolve(dataDir, name), 'utf8'),
			])

			if (actual !== expected)
				throw new Error(`precompiles-source: ${name} drifted from checked-in data`)
		}
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

const action = process.argv[2]

if (action === 'sync')
	await syncPrecompiles()
else if (action === 'check')
	await checkPrecompiles()
else {
	console.error(usage)
	process.exit(1)
}
