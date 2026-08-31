import {
	createHash,
	randomBytes,
} from 'node:crypto'
import {
	mkdtemp,
	readFile,
	realpath,
	rm,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'

import {
	chromium,
	type BrowserContext,
	type Page,
	type Worker,
} from 'playwright'

import { WalletHarnessEcosystem } from './ecosystems.ts'


// Types

export type WalletKind =
	| 'ambire'
	| 'argent-x'
	| 'backpack'
	| 'harness-only'
	| 'keplr'
	| 'lace'
	| 'metamask'
	| 'petra'
	| 'polkadot-js'
	| 'rabby'
	| 'taho'
	| 'tonkeeper'
	| 'unisat'
	| 'unknown'
	| 'zerion'

export type RealWalletKind = Exclude<WalletKind, 'harness-only' | 'unknown'>

export type LoadedWalletExtension = {
	id: string
	kind: WalletKind
	manifest: WalletExtensionManifest
	path: string
	serviceWorker: Worker
}

export type WalletDriver<_Kind extends RealWalletKind = RealWalletKind> = {
	kind: _Kind
	open: (context: BrowserContext, extension: LoadedWalletExtension) => Promise<Page>
	onboard?: (context: BrowserContext, extension: LoadedWalletExtension, secret: string) => Promise<Page>
	waitForRequest?: (context: BrowserContext, extension: LoadedWalletExtension, previousPages: Set<Page>) => Promise<Page>
	approveConnection?: (page: Page) => Promise<void>
	rejectConnection?: (page: Page) => Promise<void>
	selectAccount?: (page: Page, account: string) => Promise<void>
	signing?: (context: BrowserContext, extension: LoadedWalletExtension) => WalletSigningDriverHooks
}

export type WalletExtensionManifest = {
	action?: {
		default_popup?: string
		default_title?: string
	}
	author?: string
	background: {
		service_worker: string
	}
	key?: string
	manifest_version: 3
	name: string
	version: string
}

export type WalletProviderDiscoveryReport = {
	injectedGlobals: string[]
	loadedExtensions: {
		id: string
		kind: WalletKind
		name: string
		version: string
	}[]
	walletConnections: string
}

type WalletTestRequestShared = {
	accountAddress: string
	params: readonly unknown[]
}

export type WalletTestRequest =
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Evm
		kind: 'message'
		method: 'eth_sign' | 'personal_sign'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Evm
		kind: 'typed-data'
		method: 'eth_signTypedData' | 'eth_signTypedData_v3' | 'eth_signTypedData_v4'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Evm
		kind: 'transaction'
		method: 'eth_sendTransaction'
		chainId: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Solana
		kind: 'message'
		method: 'solana:signMessage'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Bitcoin
		kind: 'message'
		method: 'signMessage'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Lightning
		kind: 'invoice'
		method: 'lightning-invoice'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Farcaster
		kind: 'message'
		method: 'personal_sign'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Near
		kind: 'message'
		method: 'near:signMessage'
		chainId?: string
	})
	| (WalletTestRequestShared & {
		ecosystem: WalletHarnessEcosystem.Sui
		kind: 'message'
		method: 'sui:signPersonalMessage'
		chainId?: string
	})

export type WalletTestRequestMetadata = {
	ecosystem: WalletTestRequest['ecosystem']
	accountAddress: string
	chainId?: string
	kind: WalletTestRequest['kind']
	method: WalletTestRequest['method']
	paramsHash: string
	paramsLength: number
}

export type WalletTestProvider = {
	request: (request: {
		method: WalletTestRequest['method']
		params: readonly unknown[]
	}) => Promise<unknown>
}

export type WalletSigningDriverHooks = {
	waitForRequest: (metadata: WalletTestRequestMetadata) => Promise<void>
	approve: (metadata: WalletTestRequestMetadata) => Promise<void>
	reject: (metadata: WalletTestRequestMetadata) => Promise<void>
}

export type WalletSigningPersistenceObservation = {
	submittedAt?: number
	evmTransactionIds: readonly string[]
}

export type WalletSigningTestContract = {
	provider: WalletTestProvider
	driver: WalletSigningDriverHooks
	observePersistence: () => WalletSigningPersistenceObservation | Promise<WalletSigningPersistenceObservation>
	onTransactionHash?: (transactionHash: string, metadata: WalletTestRequestMetadata) => void | Promise<void>
}

export type WalletSigningTestResult =
	| {
		decision: 'approve'
		metadata: WalletTestRequestMetadata
		result: unknown
	}
	| {
		decision: 'reject'
		metadata: WalletTestRequestMetadata
		error: unknown
	}


// Functions

export const parseExtensionDirectories = (value: string | undefined) => (
	(value ?? '')
		.split(delimiter)
		.map((path) => path.trim())
		.filter(Boolean)
)

const namedExtensionDirectoryEnvKeys = [
	'AMBIRE_EXTENSION_DIR',
	'ARGENT_X_EXTENSION_DIR',
	'BACKPACK_EXTENSION_DIR',
	'KEPLR_EXTENSION_DIR',
	'LACE_EXTENSION_DIR',
	'METAMASK_EXTENSION_DIR',
	'PETRA_EXTENSION_DIR',
	'POLKADOT_JS_EXTENSION_DIR',
	'RABBY_EXTENSION_DIR',
	'TAHO_EXTENSION_DIR',
	'TONKEEPER_EXTENSION_DIR',
	'UNISAT_EXTENSION_DIR',
	'ZERION_EXTENSION_DIR',
] as const

export const resolveWalletExtensionDirectories = ({
	fixtureDirectory = resolve('tests/e2e/wallet-extensions/fixture-extension'),
}: {
	fixtureDirectory?: string
} = {}) => {
	const fromDirs = parseExtensionDirectories(process.env.WALLET_EXTENSION_DIRS)
	if (fromDirs.length > 0)
		return fromDirs.map((directory) => resolve(directory))

	const named = namedExtensionDirectoryEnvKeys.flatMap((key) => {
		const value = process.env[key]
		return value ?
			[
				resolve(value),
			]
		:
			[]
	})
	if (named.length > 0)
		return named

	return [
		resolve(fixtureDirectory),
	]
}

export const createEphemeralWalletSecret = (prefix = '') => (
	`${prefix}${randomBytes(24).toString('base64url')}`
)

export const walletTestRequestMetadata = (
	request: WalletTestRequest
): WalletTestRequestMetadata => ({
	ecosystem: request.ecosystem,
	accountAddress: request.accountAddress,
	chainId: request.chainId,
	kind: request.kind,
	method: request.method,
	paramsHash: `sha256:${createHash('sha256').update(JSON.stringify(request.params)).digest('hex')}`,
	paramsLength: request.params.length,
})

const assertWalletSigningNotSubmitted = async (
	observePersistence: WalletSigningTestContract['observePersistence']
) => {
	const observation = await observePersistence()
	assert(
		observation.submittedAt == null,
		'Wallet request must not be marked submitted before the provider returns a real transaction hash.'
	)
	assert(
		observation.evmTransactionIds.length === 0,
		'Wallet request must not persist an EvmTransaction before the provider returns a real transaction hash.'
	)
}

const assert: (condition: boolean, message: string) => asserts condition = (condition, message) => {
	if (!condition)
		throw new Error(message)
}

export const exerciseWalletSigningRequest = async ({
	contract,
	request,
	decision,
}: {
	contract: WalletSigningTestContract
	request: WalletTestRequest
	decision: 'approve' | 'reject'
}): Promise<WalletSigningTestResult> => {
	const metadata = walletTestRequestMetadata(request)
	await assertWalletSigningNotSubmitted(contract.observePersistence)

	const providerOutcome = contract.provider.request({
		method: request.method,
		params: request.params,
	}).then(
		(result) => ({
			resolved: true as const,
			result,
		}),
		(error) => ({
			resolved: false as const,
			error,
		})
	)
	await contract.driver.waitForRequest(metadata)
	await assertWalletSigningNotSubmitted(contract.observePersistence)
	await contract.driver[decision](metadata)

	const outcome = await providerOutcome
	if (decision === 'reject') {
		if (outcome.resolved)
			throw new Error('Provider resolved a wallet request that the driver rejected.')
		await assertWalletSigningNotSubmitted(contract.observePersistence)
		return {
			decision,
			metadata,
			error: outcome.error,
		}
	}

	if (!outcome.resolved)
		throw outcome.error

	if (
		request.ecosystem === WalletHarnessEcosystem.Evm
		&& request.kind === 'transaction'
	) {
		assert(
			typeof outcome.result === 'string' && /^0x[0-9a-fA-F]{64}$/.test(outcome.result),
			'Approved transaction request did not return a real transaction hash.'
		)
		await contract.onTransactionHash?.(outcome.result, metadata)
	}
	else
		await assertWalletSigningNotSubmitted(contract.observePersistence)

	return {
		decision,
		metadata,
		result: outcome.result,
	}
}

export const classifyWallet = (manifest: WalletExtensionManifest, extensionId?: string): WalletKind => (
	/ambire/i.test(manifest.name) ?
		'ambire'
	: extensionId === 'dlcobpjiigpikoobohmabehhmhfoodbb' || /argent x/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''}`) ?
		'argent-x'
	: /backpack/i.test(manifest.name) ?
		'backpack'
	: extensionId === 'dmkamcknogkgcdfhhbddcghachkejeap' || /keplr/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''}`) ?
		'keplr'
	: extensionId === 'efeiemlfnahiidnjglmehaihacglceia' || /lace/i.test(manifest.name) ?
		'lace'
	: extensionId === 'nkbihfbeogaeaoehlefnkodbefgpgknn' || /metamask/i.test(manifest.name) ?
		'metamask'
	: extensionId === 'ejjladinnckdgjemekebdpeokbikhfci' || /petra/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''}`) ?
		'petra'
	: extensionId === 'mopnmbcafieddcagagdcbnhejhlodfdd' || /polkadot\{\.js\}|Polkadot Developer Signer/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''}`) ?
		'polkadot-js'
	: extensionId === 'acmacodkjbdgmoleebolmdjonilkdbch' || /rabby/i.test(manifest.name) ?
		'rabby'
	: /taho/i.test(manifest.name) ?
		'taho'
	: /tonkeeper/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''} ${manifest.author ?? ''}`)
		|| (
			manifest.name === '__MSG_appTitle__'
			&& manifest.action?.default_popup === 'index.html?source=default_popup'
		) ?
		'tonkeeper'
	: /unisat/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''} ${manifest.author ?? ''}`) ?
		'unisat'
	: /zerion/i.test(`${manifest.name} ${manifest.action?.default_title ?? ''} ${manifest.author ?? ''}`) ?
		'zerion'
	: /Blockhead Wallet Harness Fixture/i.test(manifest.name) ?
		'harness-only'
	:
		'unknown'
)

export const extensionPageUrl = (
	extension: LoadedWalletExtension,
	path = extension.manifest.action?.default_popup ?? ''
) => (
	new URL(path, `chrome-extension://${extension.id}/`).href
)

export const openExtensionPage = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	path?: string
) => (
	context.newPage().then(async (page) => {
		await page.goto(extensionPageUrl(extension, path))
		return page
	})
)

export const acquireExtensionPage = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	{
		previousPages = new Set<Page>(),
		timeoutMs = 30_000,
	}: {
		previousPages?: Set<Page>
		timeoutMs?: number
	} = {}
) => (
	context.pages().find((page) => (
		!previousPages.has(page)
		&& page.url().startsWith(`chrome-extension://${extension.id}/`)
	))
	?? context.waitForEvent('page', {
		predicate: (page) => (
			!previousPages.has(page)
			&& page.url().startsWith(`chrome-extension://${extension.id}/`)
		),
		timeout: timeoutMs,
	})
)

export const reportWalletProviderDiscovery = async (
	page: Page,
	extensions: LoadedWalletExtension[]
) => ({
	loadedExtensions: extensions.map((extension) => ({
		id: extension.id,
		kind: extension.kind,
		name: extension.manifest.name,
		version: extension.manifest.version,
	})),
	injectedGlobals: await page.evaluate(() => (
		[
			'aptos',
			'backpack',
			'bitcoin',
			'cardano',
			'ethereum',
			'keplr',
			'phantom',
			'solana',
			'starknet',
			'ton',
			'tron',
			'unisat',
		].filter((name) => Object.hasOwn(globalThis, name))
	)),
	walletConnections: await page.locator('#wallet-connections').innerText(),
})

export const extensionIdForManifest = (manifest: WalletExtensionManifest, path: string) => (
	[
		...createHash('sha256')
			.update(manifest.key == null ? path : Buffer.from(manifest.key, 'base64'))
			.digest()
			.subarray(0, 16),
	]
		.map((byte) => (
			String.fromCharCode(
				97 + (byte >> 4),
				97 + (byte & 15)
			)
		))
		.join('')
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
		const loadedExtensions: LoadedWalletExtension[] = []
		for (const { manifest, path } of extensions) {
			const id = extensionIdForManifest(manifest, path)
			const activationPage = await context.newPage()
			await activationPage.goto(`chrome-extension://${id}/manifest.json`)
			await activationPage.close()
			const serviceWorker = (
				context.serviceWorkers().find((worker) => new URL(worker.url()).host === id)
				?? await context.waitForEvent('serviceworker', {
					predicate: (worker) => new URL(worker.url()).host === id,
					timeout: serviceWorkerTimeoutMs,
				})
			)

			loadedExtensions.push({
				id,
				kind: classifyWallet(manifest, id),
				manifest,
				path,
				serviceWorker,
			})
		}

		return {
			close: async () => {
				await context.close()
				.finally(() => rm(profileDirectory, {
					force: true,
					recursive: true,
				}))
			},
			context,
			extensions: loadedExtensions,
			profileDirectory,
		}
	} catch (error) {
		await context.close()
			.finally(() => rm(profileDirectory, {
				force: true,
				recursive: true,
			}))
		throw new Error(`Chromium launched, but an MV3 service worker was not discovered: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
	}
}
