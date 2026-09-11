import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
	access,
	mkdtemp,
	mkdir,
	readFile,
	readdir,
	rm,
	symlink,
	writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import {
	join,
	resolve,
} from 'node:path'
import test from 'node:test'

import {
	acquireWalletExtension,
	defaultWalletExtensionArtifactRoot,
} from './acquire.mjs'


test('keeps acquired extension artifacts outside Playwright test-results', () => {
	assert.equal(
		defaultWalletExtensionArtifactRoot,
		resolve('.wallet-extensions/artifacts')
	)
	assert.equal(
		defaultWalletExtensionArtifactRoot.startsWith(resolve('test-results')),
		false
	)
})

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
		assert.equal(downloads, 1)
	})
})

test('allows a fresh acquisition after a coalesced acquisition fails', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		let downloads = 0
		const flakyDownload = async () => {
			downloads++
			if (downloads === 1)
				throw new Error('temporary download failure')
			return download()
		}
		const options = {
			artifactRoot,
			download: flakyDownload,
			extract,
		}

		await assert.rejects(
			Promise.all([
				acquireWalletExtension('fixture', descriptor, options),
				acquireWalletExtension('fixture', descriptor, options),
			]),
			/temporary download failure/
		)
		assert.equal(
			await acquireWalletExtension('fixture', descriptor, options),
			join(artifactRoot, 'fixture-1.0.0')
		)
		assert.equal(downloads, 2)
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

test('refuses an interrupted partial artifact without overwriting it', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		await mkdir(join(artifactRoot, 'fixture-1.0.0'), {
			recursive: true,
		})
		await writeFile(join(artifactRoot, 'fixture-1.0.0/fixture.zip'), 'partial')

		await assert.rejects(acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download,
			extract,
		}), /cache is invalid/)
		assert.equal(await readFile(join(artifactRoot, 'fixture-1.0.0/fixture.zip'), 'utf8'), 'partial')
		assert.deepEqual(await readdir(artifactRoot), ['fixture-1.0.0'])
	})
})

test('does not trust a cached manifest without matching acquisition provenance', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		const cachedDirectory = join(artifactRoot, 'fixture-1.0.0')
		await mkdir(cachedDirectory, { recursive: true })
		await writeFile(join(cachedDirectory, 'manifest.json'), '{"manifest_version":3}')
		await writeFile(join(cachedDirectory, '.acquisition.json'), JSON.stringify({
			sha256: 'tampered',
			version: descriptor.version,
			manifestRoot: descriptor.manifestRoot,
		}))
		let downloads = 0
		await assert.rejects(acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download: async () => {
				downloads++
				return download()
			},
			extract,
		}), /cache is invalid/)
		assert.equal(downloads, 0)
		assert.equal(await readFile(join(cachedDirectory, 'manifest.json'), 'utf8'), '{"manifest_version":3}')
	})
})

test('refuses mutated extracted content without downloading or deleting it', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		await acquireWalletExtension('fixture', descriptor, { artifactRoot, download, extract })
		const manifestPath = join(artifactRoot, 'fixture-1.0.0/manifest.json')
		await writeFile(manifestPath, '{"manifest_version":3,"mutated":true}')
		let downloads = 0
		await assert.rejects(acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download: async () => {
				downloads++
				return download()
			},
			extract,
		}), /cache is invalid/)
		assert.equal(downloads, 0)
		assert.equal(await readFile(manifestPath, 'utf8'), '{"manifest_version":3,"mutated":true}')
	})
})

test('refuses a symlink entry in an existing artifact without downloading', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		const cachedDirectory = join(artifactRoot, 'fixture-1.0.0')
		await mkdir(cachedDirectory, { recursive: true })
		await symlink('/etc/hosts', join(cachedDirectory, 'manifest.json'))
		let downloads = 0
		await assert.rejects(acquireWalletExtension('fixture', descriptor, {
			artifactRoot,
			download: async () => {
				downloads++
				return download()
			},
			extract,
		}), /cache is invalid|symlink/)
		assert.equal(downloads, 0)
	})
})

test('refuses an incomplete nested manifest root without downloading or overwriting', async () => {
	await withArtifactRoot(async (artifactRoot) => {
		const nestedDescriptor = {
			...descriptor,
			manifestRoot: 'dist',
		}
		const cachedDirectory = join(artifactRoot, 'fixture-1.0.0')
		await mkdir(join(cachedDirectory, 'dist'), { recursive: true })
		await writeFile(join(cachedDirectory, 'partial.txt'), 'owned partial')
		let downloads = 0
		await assert.rejects(acquireWalletExtension('fixture', nestedDescriptor, {
			artifactRoot,
			download: async () => {
				downloads++
				return download()
			},
			extract,
		}), /cache is invalid/)
		assert.equal(downloads, 0)
		assert.equal(await readFile(join(cachedDirectory, 'partial.txt'), 'utf8'), 'owned partial')
	})
})
