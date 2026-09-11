import { execFile } from 'node:child_process'
import {
	createHash,
	randomUUID,
} from 'node:crypto'
import {
	access,
	lstat,
	mkdir,
	readFile,
	readdir,
	rename,
	rm,
	writeFile,
} from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'


const execute = promisify(execFile)
const acquisitionByArtifactDirectory = new Map()

const extractedFingerprint = async (directory) => {
	if (!(await lstat(directory)).isDirectory())
		throw new Error('Wallet artifact root must be a real directory')
	const hash = createHash('sha256')
	const visit = async (current, relative) => {
		const entries = (await readdir(current, { withFileTypes: true })).sort((left, right) => Buffer.from(left.name).compare(Buffer.from(right.name)))
		for (const entry of entries) {
			if (relative === '' && entry.name === '.acquisition.json')
				continue
			const nextRelative = join(relative, entry.name)
			const nextPath = join(current, entry.name)
			const stats = await lstat(nextPath)
			if (stats.isSymbolicLink())
				throw new Error(`Wallet artifact contains unsupported symlink: ${nextRelative}`)
			if (entry.isDirectory()) {
				hash.update(`${JSON.stringify(['directory', nextRelative])}\n`)
				await visit(nextPath, nextRelative)
			} else if (entry.isFile()) {
				const content = await readFile(nextPath)
				const contentHash = createHash('sha256').update(content).digest('hex')
				hash.update(`${JSON.stringify(['file', nextRelative, content.length, contentHash])}\n`)
			} else {
				throw new Error(`Wallet artifact contains unsupported entry: ${nextRelative}`)
			}
		}
	}
	await visit(directory, '')
	return hash.digest('hex')
}

const publishArtifact = async (
	stagingDirectory,
	artifactDirectory,
	manifestPath,
	metadata
) => {
	const lockDirectory = `${artifactDirectory}.lock`
	const cacheIsValid = async () => {
		try {
			const cached = JSON.parse(await readFile(join(artifactDirectory, '.acquisition.json'), 'utf8'))
			return cached.sha256 === metadata.sha256 && cached.version === metadata.version && cached.manifestRoot === metadata.manifestRoot && cached.contentSha256 === await extractedFingerprint(artifactDirectory)
		} catch {
			return false
		}
	}

	while (true) {
		try {
			await mkdir(resolve(artifactDirectory, '..'), {
				recursive: true,
			})
			await mkdir(lockDirectory)
			break
		} catch (error) {
			try {
				if (await cacheIsValid())
					return
			} catch {
			}

			// EEXIST = another publisher holds the lock. ENOENT = parent was removed
			// mid-flight (concurrent cleanup / interrupted root); recreate and retry.
			if (error.code !== 'EEXIST' && error.code !== 'ENOENT')
				throw error

			await new Promise((resolveWait) => setTimeout(resolveWait, 10))
		}
	}

	try {
		try {
			if (await cacheIsValid())
				return
		} catch {
		}
		if (await access(manifestPath).then(() => true).catch(() => false))
			throw new Error(`Wallet artifact cache is invalid: ${artifactDirectory}`)

		await rm(artifactDirectory, {
			force: true,
			recursive: true,
		})
		await rename(stagingDirectory, artifactDirectory)
	} finally {
		await rm(lockDirectory, {
			force: true,
			recursive: true,
		})
	}
}

// Keep acquired zips outside Playwright's default outputDir (`test-results`).
// Headed shards wipe that folder at run start; putting artifacts there ENOENTs the extension.
export const defaultWalletExtensionArtifactRoot = resolve('.wallet-extensions/artifacts')

export const acquireWalletExtension = async (
	wallet,
	descriptor,
	{
		artifactRoot = defaultWalletExtensionArtifactRoot,
		download = fetch,
		extract = async (archive, directory) => (
			execute('unzip', [
				'-q',
				archive,
				'-d',
				directory,
			])
		),
	} = {}
) => {
	if (!descriptor)
		throw new Error(`Unknown wallet "${wallet}"`)

	if (descriptor.url) {
		const artifactName = `${wallet}-${descriptor.version}`
		const artifactDirectory = join(artifactRoot, artifactName)
		const extensionDirectory = join(artifactDirectory, descriptor.manifestRoot)

		try {
			await access(join(extensionDirectory, 'manifest.json'))
			const cached = JSON.parse(await readFile(join(artifactDirectory, '.acquisition.json'), 'utf8'))
			if (cached.sha256 === descriptor.sha256 && cached.version === descriptor.version && cached.manifestRoot === descriptor.manifestRoot && cached.contentSha256 === await extractedFingerprint(artifactDirectory))
				return extensionDirectory
			throw new Error(`Wallet artifact cache is invalid: ${artifactDirectory}`)
		} catch (error) {
			if (await lstat(artifactDirectory).then(() => true).catch(() => false))
				throw new Error(`Wallet artifact cache is invalid: ${artifactDirectory}`, { cause: error })
		}

		if (acquisitionByArtifactDirectory.has(artifactDirectory))
			return acquisitionByArtifactDirectory.get(artifactDirectory)

		const acquisition = (async () => {
			const stagingDirectory = join(artifactRoot, `.${artifactName}-${randomUUID()}.partial`)

			try {
				const response = await download(descriptor.url)
				if (!response.ok)
					throw new Error(`${wallet}: artifact download failed with ${response.status}`)

				const artifact = Buffer.from(await response.arrayBuffer())
				const digest = createHash('sha256').update(artifact).digest('hex')
				if (digest !== descriptor.sha256)
					throw new Error(`${wallet}: checksum mismatch, expected ${descriptor.sha256}, received ${digest}`)

				await mkdir(stagingDirectory, {
					recursive: true,
				})
				const archive = join(stagingDirectory, `${wallet}.zip`)
				await writeFile(archive, artifact.subarray(descriptor.archiveOffset ?? 0))
				await extract(archive, stagingDirectory)
				await rm(archive)
				await access(join(stagingDirectory, descriptor.manifestRoot, 'manifest.json'))
				await writeFile(join(stagingDirectory, '.acquisition.json'), JSON.stringify({
					sha256: descriptor.sha256,
					version: descriptor.version,
					manifestRoot: descriptor.manifestRoot,
					contentSha256: await extractedFingerprint(stagingDirectory),
				}))
				await publishArtifact(
					stagingDirectory,
					artifactDirectory,
					join(extensionDirectory, 'manifest.json'),
					descriptor
				)
				return extensionDirectory
			} finally {
				await rm(stagingDirectory, {
					force: true,
					recursive: true,
				})
			}
		})()
		acquisitionByArtifactDirectory.set(artifactDirectory, acquisition)

		try {
			return await acquisition
		} finally {
			acquisitionByArtifactDirectory.delete(artifactDirectory)
		}
	}

	const suppliedDirectory = process.env[`${wallet.toUpperCase()}_EXTENSION_DIR`]

	if (!suppliedDirectory)
		throw new Error([
			`${wallet} ${descriptor.version} is intentionally source-build-only; no unverified prebuilt download is used.`,
			`Clone ${descriptor.repository}, check out commit ${descriptor.commit}, follow ${descriptor.buildDocumentation ?? `the repository build command (${descriptor.buildCommand})`},`,
			`then set ${wallet.toUpperCase()}_EXTENSION_DIR to the unpacked ${descriptor.artifact} directory and rerun this command.`,
		].join(' '))

	await access(resolve(suppliedDirectory, 'manifest.json'))
	return resolve(suppliedDirectory)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const descriptors = JSON.parse(await readFile(new URL('./wallets.json', import.meta.url), 'utf8'))
	const requestedWallets = process.argv.slice(2)

	if (requestedWallets.length === 0)
		throw new Error(`Choose a pinned source build: ${Object.keys(descriptors).join(', ')}`)

	for (const wallet of requestedWallets) {
		if (!descriptors[wallet])
			throw new Error(`Unknown wallet "${wallet}". Available: ${Object.keys(descriptors).join(', ')}`)

		console.log(`${wallet}: ${await acquireWalletExtension(wallet, descriptors[wallet])}`)
	}
}
