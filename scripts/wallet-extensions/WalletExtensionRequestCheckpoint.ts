import type {
	BrowserContext,
	Page,
	Request,
	Response,
} from 'playwright'


export type WalletExtensionPageCheckpointInput = {
	buttonNames: readonly string[]
	headingNames: readonly string[]
	inputIds: readonly string[]
	visibleFormCount?: number
	visibleSubmitButtonCount?: number
	url: string
	controlRoles?: readonly string[]
	stableControlIds?: readonly string[]
	inputTypes?: readonly string[]
	testIds?: readonly string[]
	ariaOwners?: readonly string[]
	disabledControlCount?: number
	walletErrorCodes?: readonly string[]
}

export type WalletExtensionPageCheckpoint = {
	buttonNames: string[]
	extensionUrl: string
	headingNames: string[]
	inputIds: string[]
	visibleFormCount: number
	visibleSubmitButtonCount: number
	origin: string
	pageIdentity: string
	controlRoles: string[]
	stableControlIds: string[]
	inputTypes: string[]
	testIds: string[]
	ariaOwners: string[]
	disabledControlCount: number
	walletErrorCodes: string[]
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

export type WalletExtensionStructuralTelemetry = {
	events: Array<{ elapsedMilliseconds: number; kind: 'console-error' | 'http-error' | 'page-crash' | 'page-error' | 'request-failed'; page: string; resourceType?: string; classification: string }>
	pageControls: Array<{ page: string; buttons: number; disabledButtons: number; inputs: number; dialogs: number; alerts: number }>
	pageErrors: string[]
	networkFailures: Array<{ path: string; status: number | null; classification: string }>
	controls: {
		buttons: number
		disabledButtons: number
		inputs: number
		dialogs: number
		alerts: number
	}
}

const telemetryLimit = 32
const diagnosticPaths = new Set([
	'/', '/index.html', '/popup.html', '/notification.html',
	'/tonconnect-manifest.json', '/favicon.png', '/json', '/~/wallets',
])

const diagnosticNetworkLocation = (url: string) => {
	try {
		const parsed = new URL(url)
		if (parsed.protocol === 'about:') return 'about:blank'
		const path = diagnosticPaths.has(parsed.pathname) ? parsed.pathname : '/[redacted]'
		return `${parsed.protocol}//${parsed.host}${path}`
	} catch {
		return 'unparseable'
	}
}

export type WalletExtensionStructuralTelemetryController = {
	capture: () => Promise<WalletExtensionStructuralTelemetry & { surface: WalletExtensionSurfaceCheckpoint }>
	dispose: () => void
}

export const attachWalletExtensionStructuralTelemetry = (
	context: BrowserContext
): WalletExtensionStructuralTelemetryController => {
	const pageErrors: string[] = []
	const networkFailures: Array<{ url: string; status: number | null; errorText?: string }> = []
	const events: WalletExtensionStructuralTelemetry['events'] = []
	const startedAt = Date.now()
	const listeners = new Map<Page, Array<() => void>>()
	const boundedPush = <_Value>(values: _Value[], value: _Value) => {
		values.push(value)
		if (values.length > telemetryLimit) values.shift()
	}
	const attach = (page: Page) => {
		if (listeners.has(page)) return
		const record = (event: Omit<WalletExtensionStructuralTelemetry['events'][number], 'elapsedMilliseconds' | 'page'>) => boundedPush(events, {
			...event,
			elapsedMilliseconds: Date.now() - startedAt,
			page: diagnosticNetworkLocation(page.url()),
		})
		const onPageError = (error: Error) => {
			const classification = safeErrorClassification(error.message)
			boundedPush(pageErrors, classification)
			record({ kind: 'page-error', classification })
		}
		const onCrash = () => {
			boundedPush(pageErrors, 'page-crash')
			record({ kind: 'page-crash', classification: 'page-crash' })
		}
		const onRequestFailed = (request: Request) => {
			const classification = safeErrorClassification(request.failure()?.errorText ?? 'network')
			boundedPush(networkFailures, { url: diagnosticNetworkLocation(request.url()), status: null, errorText: classification })
			record({ kind: 'request-failed', classification, resourceType: request.resourceType() })
		}
		const onConsole = (message: { type(): string; text(): string }) => {
			if (message.type() !== 'error') return
			record({ kind: 'console-error', classification: safeErrorClassification(message.text()) })
		}
		const onResponse = (response: Response) => {
			if (response.status() >= 400) {
				boundedPush(networkFailures, { url: diagnosticNetworkLocation(response.url()), status: response.status() })
				record({ kind: 'http-error', classification: `http-${response.status()}`, resourceType: response.request().resourceType() })
			}
		}
		page.on('pageerror', onPageError)
		page.on('crash', onCrash)
		page.on('requestfailed', onRequestFailed)
		page.on('response', onResponse)
		page.on('console', onConsole)
		listeners.set(page, [
			() => page.off('pageerror', onPageError),
			() => page.off('crash', onCrash),
			() => page.off('requestfailed', onRequestFailed),
			() => page.off('response', onResponse),
			() => page.off('console', onConsole),
		])
	}
	const onPage = (page: Page) => attach(page)
	context.on('page', onPage)
	for (const page of context.pages()) attach(page)
	return {
		capture: async () => {
			const pages = context.pages()
			const extensionPages = pages.filter((page) => page.url().startsWith('chrome-extension://'))
			const surface = await captureWalletExtensionSurfaceCheckpoint(extensionPages)
			const controls = await Promise.all(pages.map(async (page) => ({
				buttons: await page.locator('button:visible, [role="button"]:visible').count(),
				disabledButtons: await page.locator('button:visible:disabled, [role="button"][aria-disabled="true"]:visible').count(),
				inputs: await page.locator('input:visible').count(),
				dialogs: await page.locator('dialog:visible, [role="dialog"]:visible').count(),
				alerts: await page.locator('[role="alert"]:visible').count(),
			})))
			const telemetry = walletExtensionStructuralTelemetryFromSnapshot({
				...controls.reduce((total, next) => ({
					buttons: total.buttons + next.buttons,
					disabledButtons: total.disabledButtons + next.disabledButtons,
					inputs: total.inputs + next.inputs,
					dialogs: total.dialogs + next.dialogs,
					alerts: total.alerts + next.alerts,
				}), { buttons: 0, disabledButtons: 0, inputs: 0, dialogs: 0, alerts: 0 }),
				pageErrors,
				networkFailures,
			})
			return {
				...telemetry,
				events: [...events],
				pageControls: controls.map((control, index) => ({ ...control, page: diagnosticNetworkLocation(pages[index]?.url() ?? '') })),
				networkFailures: networkFailures.map(({ url, status, errorText }) => ({ path: url, status, classification: errorText ?? 'network' })),
				surface,
			}
		},
		dispose: () => {
			context.off('page', onPage)
			for (const [page, remove] of listeners) {
				for (const listener of remove) listener()
				listeners.delete(page)
			}
		},
	}
}

const safeErrorClassification = (message: string) => {
	if (message === 'page-crash') return 'page-crash'
	if (['net::ERR_ABORTED', 'net::ERR_CONNECTION_REFUSED', 'net::ERR_NAME_NOT_RESOLVED', 'net::ERR_FAILED'].includes(message))
		return message
	const normalized = message.toLowerCase()
	if (normalized.includes('timeout')) return 'timeout'
	if (normalized.includes('network') || normalized.includes('fetch')) return 'network'
	if (normalized.includes('permission') || normalized.includes('denied')) return 'permission'
	return 'page-error'
}

export const walletExtensionStructuralTelemetryFromSnapshot = ({
	buttons,
	disabledButtons,
	inputs,
	dialogs,
	alerts,
	pageErrors,
	networkFailures,
}: {
	buttons: number
	disabledButtons: number
	inputs: number
	dialogs: number
	alerts: number
	pageErrors: readonly string[]
	networkFailures: readonly { url: string; status: number | null; errorText?: string }[]
}): WalletExtensionStructuralTelemetry => ({
	events: [],
	pageControls: [],
	controls: { buttons, disabledButtons, inputs, dialogs, alerts },
	pageErrors: [...new Set(pageErrors.map(safeErrorClassification))],
	networkFailures: networkFailures.map(({ url, status, errorText }) => ({
		path: diagnosticNetworkLocation(url),
		status,
		classification: safeErrorClassification(errorText ?? (status != null && status >= 400 ? 'network failure' : 'network')),
	})),
})

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
	'connect to blockhead?',
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
	[...new Set(labels.map((label) => label.trim().replace(/\s+/g, ' ')).filter(Boolean).map((label) => (
		safeVisibleLabels.has(label.toLowerCase()) ? label : '[redacted]'
	)))]
)

const safeInputIds = new Set([
	'password',
	'unlock-password',
])

const normalizedInputIds = (ids: readonly string[]) => (
	[...new Set(ids.map((id) => id.trim()).filter((id) => safeInputIds.has(id)))]
)

const normalizedStructuralTokens = (tokens: readonly string[]) => (
	[...new Set(tokens.map((token) => token.trim()).filter((token) => /^[a-z][a-z0-9_.:-]{0,63}$/i.test(token) && !/(private|secret|seed|phrase|token|address|message|value)/i.test(token)))]
)

const normalizedInputTypes = (types: readonly string[]) => (
	[...new Set(types.map((type) => type.trim().toLowerCase()).filter((type) => /^[a-z][a-z0-9-]{0,31}$/.test(type)))]
)

const normalizedWalletErrorCodes = (codes: readonly string[]) => (
	[...new Set(codes.map((code) => code.trim()).filter((code) => /^[A-Z][A-Z0-9_.:-]{0,63}$/.test(code)))]
)

const safeOrigin = (url: string) => {
	try {
		const parsed = new URL(url)
		return `${parsed.protocol}//${parsed.host}`
	}
	catch {
		return 'unparseable'
	}
}

const safePageIdentity = (url: string) => {
	try {
		const parsed = new URL(url)
		return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
	}
	catch {
		return 'unparseable'
	}
}

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
	extensionPages: extensionPages.map(({ buttonNames, headingNames, inputIds, visibleFormCount = 0, visibleSubmitButtonCount = 0, url, controlRoles = [], stableControlIds = [], inputTypes = [], testIds = [], ariaOwners = [], disabledControlCount = 0, walletErrorCodes = [] }) => ({
		buttonNames: normalizedVisibleLabels(buttonNames),
		extensionUrl: safeExtensionUrl(url),
		headingNames: normalizedVisibleLabels(headingNames),
		inputIds: normalizedInputIds(inputIds),
		visibleFormCount,
		visibleSubmitButtonCount,
		origin: safeOrigin(url),
		pageIdentity: safePageIdentity(url),
		controlRoles: normalizedStructuralTokens(controlRoles),
		stableControlIds: normalizedStructuralTokens(stableControlIds),
		inputTypes: normalizedInputTypes(inputTypes),
		testIds: normalizedStructuralTokens(testIds),
		ariaOwners: normalizedStructuralTokens(ariaOwners),
		disabledControlCount: Math.max(0, disabledControlCount),
		walletErrorCodes: normalizedWalletErrorCodes(walletErrorCodes),
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

const structuralSnapshot = (page: Page) => page.locator('button:visible, input:visible, select:visible, textarea:visible, [role]:visible, [data-wallet-error-code]:visible').evaluateAll((controls) => {
	const values = (attribute: string) => controls.map((element) => element.getAttribute(attribute) ?? '').filter(Boolean)
	return {
		controlRoles: values('role'),
		stableControlIds: controls.map((element) => element.id).filter(Boolean),
		inputTypes: controls.filter((element): element is HTMLInputElement => element instanceof HTMLInputElement).map((element) => element.type),
		testIds: values('data-testid'),
		ariaOwners: values('aria-owns'),
		disabledControlCount: controls.filter((element) => element instanceof HTMLButtonElement || element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement ? element.disabled : element.getAttribute('aria-disabled') === 'true').length,
		walletErrorCodes: values('data-wallet-error-code'),
	}
})

export const captureWalletExtensionSurfaceCheckpoint = async (
	pages: readonly Page[]
) => walletExtensionSurfaceCheckpointFromSnapshots(await Promise.all(pages.map(async (page) => {
	const [buttonNames, headingNames, inputIds, visibleFormCount, visibleSubmitButtonCount, structural] = await Promise.all([
		visibleTexts(page, 'button:visible, [role="button"]:visible'),
		visibleTexts(page, 'h1:visible, h2:visible, h3:visible, h4:visible, h5:visible, h6:visible, [role="heading"]:visible'),
		visibleInputIds(page),
		page.locator('form:visible').count(),
		page.locator('form:visible button[type="submit"]:visible').count(),
		structuralSnapshot(page),
	])
	return {
		buttonNames,
		headingNames,
		inputIds,
		visibleFormCount,
		visibleSubmitButtonCount,
		url: page.url(),
		...structural,
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
			clock.wait(remainingMilliseconds, captureTimeout.signal).then((): typeof phaseCaptureTimeout => phaseCaptureTimeout),
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
