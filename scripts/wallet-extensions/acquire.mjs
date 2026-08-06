import { execFile } from 'node:child_process'
import {
	createHash,
	randomUUID,
} from 'node:crypto'
import {
	access,
	mkdir,
	readFile,
	rename,
	rm,
	writeFile,
} from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'


const execute = promisify(execFile)

const publishArtifact = async (
	stagingDirectory,
	artifactDirectory,
	manifestPath
) => {
	const lockDirectory = `${artifactDirectory}.lock`

	while (true) {
		try {
			await mkdir(resolve(artifactDirectory, '..'), {
				recursive: true,
			})
			await mkdir(lockDirectory)
			break
		} catch (error) {
			try {
				await access(manifestPath)
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
			await access(manifestPath)
			return
		} catch {
		}

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

export const acquireWalletExtension = async (
	wallet,
	descriptor,
	{
		artifactRoot = resolve('test-results/wallet-extensions/artifacts'),
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
		const stagingDirectory = join(artifactRoot, `.${artifactName}-${randomUUID()}.partial`)

		try {
			await access(join(extensionDirectory, 'manifest.json'))
			return extensionDirectory
		} catch {
		}

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
			await publishArtifact(
				stagingDirectory,
				artifactDirectory,
				join(extensionDirectory, 'manifest.json')
			)
			return extensionDirectory
		} finally {
			await rm(stagingDirectory, {
				force: true,
				recursive: true,
			})
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
