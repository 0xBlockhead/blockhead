import type {
	BrowserContext,
	Page,
} from 'playwright'


export type WalletExtensionPageCheckpointInput = {
	buttonNames: readonly string[]
	headingNames: readonly string[]
	inputIds: readonly string[]
	url: string
}

export type WalletExtensionPageCheckpoint = {
	buttonNames: string[]
	extensionUrl: string
	headingNames: string[]
	inputIds: string[]
}

export type WalletExtensionSurfaceCheckpoint = {
	extensionPages: WalletExtensionPageCheckpoint[]
}

export type WalletExtensionRequestCheckpoint = WalletExtensionSurfaceCheckpoint & {
	blockhead: {
		activeConnectionCount: number | null
		discoveryActive: boolean
		providerCount: number | null
		route: string
		walletSurfacePresent: boolean
	}
}

export type WalletExtensionPhaseSample<_OwnedSurface> = {
	checkpoint: WalletExtensionSurfaceCheckpoint
	ownedSurface: _OwnedSurface | null
}

export type WalletExtensionPhaseClock = {
	now: () => number
	wait: (milliseconds: number, signal?: AbortSignal) => Promise<void>
}

const safeVisibleLabels = new Set([
	'cancel',
	'confirm',
	'connect to blockhead',
	'connect wallet',
	'continue',
	'enter password',
	'sign',
	'sign message',
	'so, let’s check',
	'waiting',
	'wallet',
])

const normalizedVisibleLabels = (labels: readonly string[]) => (
	[...new Set(labels.map((label) => label.trim()).filter(Boolean).map((label) => (
		safeVisibleLabels.has(label.toLowerCase()) ? label : '[redacted]'
	)))]
)

const normalizedInputIds = (ids: readonly string[]) => (
	[...new Set(ids.map((id) => id.trim()).filter((id) => (
		/^[A-Za-z][A-Za-z0-9_.:-]{0,127}$/.test(id)
	)))]
)

const integerAfter = (copy: string | null, label: string) => {
	if (copy == null) return null
	const match = new RegExp(`${label}:\\s*(\\d+)`, 'i').exec(copy)
	return match?.[1] == null ? null : Number.parseInt(match[1], 10)
}

const safeRoute = (url: string) => {
	try {
		return new URL(url).pathname
	}
	catch {
		return 'unparseable'
	}
}

const safeExtensionUrl = (url: string) => {
	try {
		const parsed = new URL(url)
		if (parsed.protocol !== 'chrome-extension:') return 'non-extension'
		return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
	}
	catch {
		return 'unparseable'
	}
}

export const walletExtensionSurfaceCheckpointFromSnapshots = (
	extensionPages: readonly WalletExtensionPageCheckpointInput[]
): WalletExtensionSurfaceCheckpoint => ({
	extensionPages: extensionPages.map(({ buttonNames, headingNames, inputIds, url }) => ({
		buttonNames: normalizedVisibleLabels(buttonNames),
		extensionUrl: safeExtensionUrl(url),
		headingNames: normalizedVisibleLabels(headingNames),
		inputIds: normalizedInputIds(inputIds),
	})),
})

export const walletExtensionRequestCheckpointFromSnapshots = ({
	blockheadUrl,
	extensionPages,
	walletConnectionsText,
}: {
	blockheadUrl: string
	extensionPages: readonly WalletExtensionPageCheckpointInput[]
	walletConnectionsText: string | null
}): WalletExtensionRequestCheckpoint => ({
	blockhead: {
		activeConnectionCount: integerAfter(walletConnectionsText, 'Active connections'),
		discoveryActive: walletConnectionsText?.includes('Wallet discovery active.') ?? false,
		providerCount: integerAfter(walletConnectionsText, 'Providers detected'),
		route: safeRoute(blockheadUrl),
		walletSurfacePresent: walletConnectionsText != null,
	},
	...walletExtensionSurfaceCheckpointFromSnapshots(extensionPages),
})

const visibleTexts = (page: Page, selector: string) => (
	page.locator(selector).allTextContents()
)

const visibleInputIds = (page: Page) => (
	page.locator('input:visible[id]').evaluateAll((inputs) => (
		inputs.map(({ id }) => id)
	))
)

export const captureWalletExtensionSurfaceCheckpoint = async (
	pages: readonly Page[]
) => walletExtensionSurfaceCheckpointFromSnapshots(await Promise.all(pages.map(async (page) => {
	const [buttonNames, headingNames, inputIds] = await Promise.all([
		visibleTexts(page, 'button:visible, [role="button"]:visible'),
		visibleTexts(page, 'h1:visible, h2:visible, h3:visible, h4:visible, h5:visible, h6:visible, [role="heading"]:visible'),
		visibleInputIds(page),
	])
	return {
		buttonNames,
		headingNames,
		inputIds,
		url: page.url(),
	}
})))

const defaultPhaseClock: WalletExtensionPhaseClock = {
	now: Date.now,
	wait: (milliseconds, signal) => new Promise((resolve) => {
		const timeout = setTimeout(resolve, milliseconds)
		signal?.addEventListener('abort', () => clearTimeout(timeout), { once: true })
	}),
}

const phaseCaptureTimeout = Symbol('wallet extension phase capture timeout')

export class WalletExtensionPhaseTimeoutError extends Error {
	readonly lastCheckpoint: WalletExtensionSurfaceCheckpoint
	readonly phase: string

	constructor(phase: string, lastCheckpoint: WalletExtensionSurfaceCheckpoint) {
		super(`Wallet extension phase timed out: ${phase}; last safe checkpoint: ${JSON.stringify(lastCheckpoint)}`)
		this.name = 'WalletExtensionPhaseTimeoutError'
		this.phase = phase
		this.lastCheckpoint = lastCheckpoint
	}
}

export const waitForWalletExtensionPhase = async <_OwnedSurface>({
	capture,
	clock = defaultPhaseClock,
	onCheckpoint,
	phase,
	pollMilliseconds = 100,
	timeoutMilliseconds = 60_000,
}: {
	capture: () => Promise<WalletExtensionPhaseSample<_OwnedSurface>>
	clock?: WalletExtensionPhaseClock
	onCheckpoint?: (checkpoint: WalletExtensionSurfaceCheckpoint) => void
	phase: string
	pollMilliseconds?: number
	timeoutMilliseconds?: number
}) => {
	const deadline = clock.now() + timeoutMilliseconds
	let lastCheckpoint: WalletExtensionSurfaceCheckpoint = { extensionPages: [] }
	let lastSerializedCheckpoint: string | undefined

	for (;;) {
		const remainingMilliseconds = deadline - clock.now()
		if (remainingMilliseconds <= 0)
			throw new WalletExtensionPhaseTimeoutError(phase, lastCheckpoint)

		const captureTimeout = new AbortController()
		const sampleOrTimeout = await Promise.race([
			capture(),
			clock.wait(remainingMilliseconds, captureTimeout.signal).then(() => phaseCaptureTimeout),
		]).finally(() => captureTimeout.abort())
		if (sampleOrTimeout === phaseCaptureTimeout)
			throw new WalletExtensionPhaseTimeoutError(phase, lastCheckpoint)

		const sample = sampleOrTimeout
		lastCheckpoint = sample.checkpoint
		const serializedCheckpoint = JSON.stringify(sample.checkpoint)
		if (serializedCheckpoint !== lastSerializedCheckpoint) {
			lastSerializedCheckpoint = serializedCheckpoint
			onCheckpoint?.(sample.checkpoint)
		}
		if (sample.ownedSurface != null)
			return sample.ownedSurface
		if (clock.now() >= deadline)
			throw new WalletExtensionPhaseTimeoutError(phase, lastCheckpoint)

		await clock.wait(Math.min(pollMilliseconds, deadline - clock.now()))
	}
}

/**
 * Captures one read-only checkpoint from an already-running wallet profile.
 * It deliberately performs no launch, onboarding, navigation, waiting, or decision.
 */
export const captureWalletExtensionRequestCheckpoint = async ({
	blockheadPage,
	context,
}: {
	blockheadPage: Page
	context: BrowserContext
}) => {
	const extensionPages = context.pages().filter((page) => (
		page.url().startsWith('chrome-extension://')
	))
	const [walletConnectionsText, extensionCheckpoint] = await Promise.all([
		blockheadPage.locator('#wallet-connections').count().then((count) => (
			count === 0 ? null : blockheadPage.locator('#wallet-connections').innerText()
		)),
		captureWalletExtensionSurfaceCheckpoint(extensionPages),
	])

	return {
		blockhead: {
			activeConnectionCount: integerAfter(walletConnectionsText, 'Active connections'),
			discoveryActive: walletConnectionsText?.includes('Wallet discovery active.') ?? false,
			providerCount: integerAfter(walletConnectionsText, 'Providers detected'),
			route: safeRoute(blockheadPage.url()),
			walletSurfacePresent: walletConnectionsText != null,
		},
		...extensionCheckpoint,
	}
}
