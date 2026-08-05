import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
	access,
	mkdir,
	readFile,
	rm,
	writeFile,
} from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'


const descriptors = JSON.parse(await readFile(new URL('./wallets.json', import.meta.url), 'utf8'))
const requestedWallets = process.argv.slice(2)
const execute = promisify(execFile)

if (requestedWallets.length === 0)
	throw new Error(`Choose a pinned source build: ${Object.keys(descriptors).join(', ')}`)

for (const wallet of requestedWallets) {
	const descriptor = descriptors[wallet]

	if (!descriptor)
		throw new Error(`Unknown wallet "${wallet}". Available: ${Object.keys(descriptors).join(', ')}`)

	if (descriptor.url) {
		const artifactDirectory = resolve('test-results/wallet-extensions/artifacts', `${wallet}-${descriptor.version}`)
		const extensionDirectory = join(artifactDirectory, descriptor.manifestRoot)

		try {
			await access(join(extensionDirectory, 'manifest.json'))
			console.log(`${wallet}: ${extensionDirectory}`)
			continue
		} catch {
			await rm(artifactDirectory, {
				force: true,
				recursive: true,
			})
		}

		await mkdir(artifactDirectory, {
			recursive: true,
		})
		const response = await fetch(descriptor.url)
		if (!response.ok)
			throw new Error(`${wallet}: artifact download failed with ${response.status}`)

		const artifact = Buffer.from(await response.arrayBuffer())
		const digest = createHash('sha256').update(artifact).digest('hex')
		if (digest !== descriptor.sha256)
			throw new Error(`${wallet}: checksum mismatch, expected ${descriptor.sha256}, received ${digest}`)

		const archive = join(artifactDirectory, `${wallet}.zip`)
		await writeFile(archive, artifact)
		await execute('unzip', [
			'-q',
			archive,
			'-d',
			artifactDirectory,
		])
		await rm(archive)
		await access(join(extensionDirectory, 'manifest.json'))
		console.log(`${wallet}: ${extensionDirectory}`)
		continue
	}

	const suppliedDirectory = process.env[`${wallet.toUpperCase()}_EXTENSION_DIR`]

	if (!suppliedDirectory)
		throw new Error([
			`${wallet} ${descriptor.version} is intentionally source-build-only; no unverified prebuilt download is used.`,
			`Clone ${descriptor.repository}, check out commit ${descriptor.commit}, follow ${descriptor.buildDocumentation ?? `the repository build command (${descriptor.buildCommand})`},`,
			`then set ${wallet.toUpperCase()}_EXTENSION_DIR to the unpacked ${descriptor.artifact} directory and rerun this command.`,
		].join(' '))

	await access(resolve(suppliedDirectory, 'manifest.json'))
	console.log(`${wallet}: ${resolve(suppliedDirectory)}`)
}
