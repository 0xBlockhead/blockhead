import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
	access,
	mkdtemp,
	mkdir,
	readFile,
	readdir,
	rm,
	writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { acquireWalletExtension } from './acquire.mjs'


const artifact = Buffer.from('pinned wallet archive')
const descriptor = {
	version: '1.0.0',
	url: 'https://example.invalid/wallet.zip',
	sha256: createHash('sha256').update(artifact).digest('hex'),
	manifestRoot: '',
}
const download = async () => (
	new Response(artifact)
)
const extract = async (_archive, directory) => (
	writeFile(join(directory, 'manifest.json'), '{"manifest_version":3}')
)

const withArtifactRoot = async (run) => {
	const artifactRoot = await mkdtemp(join(tmpdir(), 'blockhead-wallet-acquire-'))

	try {
		await run(artifactRoot)
	} finally {
		await rm(artifactRoot, {
			force: true,
			recursive: true,
		})
	}
}

test('acquires a wallet into a fresh artifact root', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		assert.equal(
			await acquireWalletExtension('fixture', descriptor, {
				artifactRoot,
				download: async () => {
					await rm(artifactRoot, {
						force: true,
						recursive: true,
					})
					return download()
				},
				extract,
			}),
			join(artifactRoot, 'fixture-1.0.0')
		)
		assert.equal(
			await readFile(join(artifactRoot, 'fixture-1.0.0/manifest.json'), 'utf8'),
			'{"manifest_version":3}'
		)
	})
})

test('reuses a completed wallet acquisition', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		let downloads = 0
		const countedDownload = async () => {
			downloads++
			return download()
		}

		await acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download: countedDownload,
			extract,
		})
		await acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download: countedDownload,
			extract,
		})
		assert.equal(downloads, 1)
	})
})

test('acquires distinct wallets concurrently without deleting either artifact', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		await Promise.all([
			acquireWalletExtension('first', descriptor, {
				artifactRoot,
				download,
				extract,
			}),
			acquireWalletExtension('second', descriptor, {
				artifactRoot,
				download,
				extract,
			}),
		])
		await Promise.all([
			access(join(artifactRoot, 'first-1.0.0/manifest.json')),
			access(join(artifactRoot, 'second-1.0.0/manifest.json')),
		])
	})
})

test('acquires the same wallet concurrently without ENOENT or leaked staging', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		let downloads = 0
		const countedDownload = async () => {
			downloads++
			await new Promise((resolve) => setTimeout(resolve, 5))
			return download()
		}
		const paths = await Promise.all(Array.from({ length: 8 }, () => (
			acquireWalletExtension('fixture', descriptor, {
				artifactRoot,
				download: countedDownload,
				extract,
			})
		)))

		assert.deepEqual([...new Set(paths)], [join(artifactRoot, 'fixture-1.0.0')])
		assert.equal(
			await readFile(join(artifactRoot, 'fixture-1.0.0/manifest.json'), 'utf8'),
			'{"manifest_version":3}'
		)
		assert.deepEqual(await readdir(artifactRoot), ['fixture-1.0.0'])
		assert.ok(downloads >= 1)
		assert.ok(downloads <= 8)
	})
})

test('retries lock acquisition when the artifact parent disappears mid-flight', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		let downloads = 0
		const racingDownload = async () => {
			downloads++
			if (downloads === 1) {
				await rm(artifactRoot, {
					force: true,
					recursive: true,
				})
			}
			return download()
		}

		assert.equal(
			await acquireWalletExtension('fixture', descriptor, {
				artifactRoot,
				download: racingDownload,
				extract,
			}),
			join(artifactRoot, 'fixture-1.0.0')
		)
		await access(join(artifactRoot, 'fixture-1.0.0/manifest.json'))
	})
})

test('removes staging files after a checksum failure', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		await assert.rejects(
			acquireWalletExtension('fixture', {
				...descriptor,
				sha256: '0'.repeat(64),
			}, {
				artifactRoot,
				download,
				extract,
			}),
			/checksum mismatch/
		)
		assert.deepEqual(await readdir(artifactRoot), [])
	})
})

test('replaces an interrupted partial artifact without exposing staging files', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		await mkdir(join(artifactRoot, 'fixture-1.0.0'), {
			recursive: true,
		})
		await writeFile(join(artifactRoot, 'fixture-1.0.0/fixture.zip'), 'partial')

		await acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download,
			extract,
		})
		assert.equal(
			await readFile(join(artifactRoot, 'fixture-1.0.0/manifest.json'), 'utf8'),
			'{"manifest_version":3}'
		)
		assert.deepEqual(await readdir(artifactRoot), ['fixture-1.0.0'])
	})
})
