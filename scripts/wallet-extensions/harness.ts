import { mkdtemp, readFile, realpath } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'

import {
	chromium,
	type BrowserContext,
	type Page,
	type Worker,
} from 'playwright'


// Types

export type WalletKind =
	| 'ambire'
	| 'backpack'
	| 'harness-only'
	| 'metamask'
	| 'rabby'
	| 'taho'
	| 'unisat'
	| 'unknown'
	| 'zerion'

export type LoadedWalletExtension = {
	id: string
	kind: WalletKind
	manifest: WalletExtensionManifest
	path: string
	serviceWorker: Worker
}

export type WalletDriver = {
	kind: 'metamask' | 'rabby'
	open: (context: BrowserContext, extension: LoadedWalletExtension) => Promise<Page>
}

type WalletExtensionManifest = {
	action?: {
		default_popup?: string
		default_title?: string
	}
	author?: string
	background: {
		service_worker: string
	}
	manifest_version: 3
	name: string
	version: string
}


// Functions

export const parseExtensionDirectories = (value: string | undefined) => (
	(value ?? '')
		.split(delimiter)
		.map((path) => path.trim())
		.filter(Boolean)
)

export const classifyWallet = (manifest: WalletExtensionManifest, extensionId?: string): WalletKind => (
	/ambire/i.test(manifest.name) ?
		'ambire'
	: /backpack/i.test(manifest.name) ?
		'backpack'
	: extensionId === 'nkbihfbeogaeaoehlefnkodbefgpgknn' || /metamask/i.test(manifest.name) ?
		'metamask'
	: extensionId === 'acmacodkjbdgmoleebolmdjonilkdbch' || /rabby/i.test(manifest.name) ?
		'rabby'
	: /taho/i.test(manifest.name) ?
		'taho'
	: /unisat/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''} ${manifest.author ?? ''}`) ?
		'unisat'
	: /zerion/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''} ${manifest.author ?? ''}`) ?
		'zerion'
	: /Blockhead Wallet Harness Fixture/i.test(manifest.name) ?
		'harness-only'
	:
		'unknown'
)

export const launchWalletExtensions = async ({
	extensionDirectories,
	headless = false,
	serviceWorkerTimeoutMs = 30_000,
}: {
	extensionDirectories: string[]
	headless?: boolean
	serviceWorkerTimeoutMs?: number
}) => {
	if (headless)
		throw new Error('Wallet extensions require headed Chromium. Remove PLAYWRIGHT_WALLET_HEADLESS=1 and run in a desktop session.')

	if (extensionDirectories.length === 0)
		throw new Error('No unpacked extensions supplied. Set WALLET_EXTENSION_DIRS to one or more paths separated by the platform path delimiter.')

	const extensions = await Promise.all(extensionDirectories.map(async (extensionDirectory) => ({
		manifest: JSON.parse(await readFile(join(extensionDirectory, 'manifest.json'), 'utf8')) as WalletExtensionManifest,
		path: await realpath(resolve(extensionDirectory)),
	})))

	for (const { manifest, path } of extensions)
		if (manifest.manifest_version !== 3 || !manifest.background?.service_worker)
			throw new Error(`${path} must be an unpacked MV3 extension with background.service_worker`)

	const extensionPaths = extensions.map(({ path }) => path).join(',')
	const profileDirectory = await mkdtemp(join(tmpdir(), 'blockhead-wallet-extensions-'))
	const context = await chromium.launchPersistentContext(profileDirectory, {
		headless: false,
		args: [
			`--disable-extensions-except=${extensionPaths}`,
			`--load-extension=${extensionPaths}`,
		],
	})

	try {
		const loadedExtensions = await Promise.all(extensions.map(async ({ manifest, path }) => {
			const serviceWorker = (
				context.serviceWorkers().find((worker) => worker.url().endsWith(`/${manifest.background.service_worker}`))
				?? await context.waitForEvent('serviceworker', {
					predicate: (worker) => worker.url().endsWith(`/${manifest.background.service_worker}`),
					timeout: serviceWorkerTimeoutMs,
				})
			)
			const id = new URL(serviceWorker.url()).host

			return {
				id,
				kind: classifyWallet(manifest, id),
				manifest,
				path,
				serviceWorker,
			}
		}))

		return {
			context,
			extensions: loadedExtensions,
			profileDirectory,
		}
	} catch (error) {
		await context.close()
		throw new Error(`Chromium launched, but an MV3 service worker was not discovered: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
	}
}
