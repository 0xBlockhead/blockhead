export const blockheadWalletReturnUrl = 'blockhead://walletconnect'

export type TauriWalletLaunchTarget = Readonly<{
	walletId: string
	bundleId: string
	version: string
	launchBaseUrl: string
}>

export const metamaskMobileTauriWalletLaunchTarget = Object.freeze({
	walletId: 'metamask-mobile',
	bundleId: 'io.metamask.MetaMask',
	version: '8.12.0+904d9f5d',
	launchBaseUrl: 'metamask://wc?uri=',
}) satisfies TauriWalletLaunchTarget

export type WalletLinkCorrelation = Readonly<{
	attemptId: string
	authorityRequestId: string
	envelopeHash: string
}> & (
	| Readonly<{
		kind: 'pairing'
	}>
	| Readonly<{
		kind: 'request'
		sessionTopic: string
		requestId: string
	}>
)

export type WalletLinkAttempt = Readonly<{
	target: TauriWalletLaunchTarget
	walletConnectUri: string
	launchUrl: string
	correlation: WalletLinkCorrelation
	state: 'prepared' | 'opened' | 'returned' | 'cancelled'
	openedAt?: number
	returnedAt?: number
}>

type WalletLinkRelayReceiptCorrelation = Readonly<{
	attemptId: string
	authorityRequestId: string
	envelopeHash: string
}>

export type WalletLinkRelayReceipt = WalletLinkRelayReceiptCorrelation & (
	| Readonly<{
		kind: 'pairing'
		requestId?: undefined
	}> & (
		| Readonly<{
			outcome: 'approved'
			sessionTopic: string
		}>
		| Readonly<{
			outcome: 'rejected'
			sessionTopic?: undefined
		}>
	)
	| Readonly<{
		kind: 'request'
		sessionTopic: string
		requestId: string
		outcome: 'approved' | 'rejected'
	}>
)

export type WalletLinkSettlement = Readonly<{
	attempt: WalletLinkAttempt
	receipt: WalletLinkRelayReceipt
	completedBy: 'walletconnect-relay'
}>

export type TauriWalletLinkHost = Readonly<{
	openUrl(url: string): Promise<void>
	getCurrent(): Promise<readonly string[] | null>
	onOpenUrl(listener: (urls: readonly string[]) => void): Promise<() => void>
}>

export type TauriWalletLinkRuntime = Readonly<{
	start(): Promise<void>
	open(input: {
		walletConnectUri: string
		correlation: WalletLinkCorrelation
	}): Promise<WalletLinkAttempt>
	cancel(): WalletLinkAttempt | undefined
	settle(receipt: WalletLinkRelayReceipt): WalletLinkSettlement
	destroy(): void
	current(): WalletLinkAttempt | undefined
}>

const requireValue = (value: string, name: string) => {
	if (!value.length)
		throw new Error(`${name} is required`)
	return value
}

const parseWalletConnectUri = (value: string) => {
	const uri = new URL(value)
	if (uri.protocol !== 'wc:' || !uri.pathname.length)
		throw new Error('Wallet launch requires an exact WalletConnect URI')
	return uri
}

const parseLaunchBaseUrl = (target: TauriWalletLaunchTarget) => {
	requireValue(target.walletId, 'walletId')
	requireValue(target.bundleId, 'bundleId')
	requireValue(target.version, 'version')

	const url = new URL(requireValue(target.launchBaseUrl, 'launchBaseUrl'))
	const query = [...url.searchParams]
	if (
		url.protocol === 'wc:'
		|| url.protocol === 'blockhead:'
		|| url.protocol === 'http:'
		|| url.protocol === 'file:'
		|| url.protocol === 'data:'
		|| url.protocol === 'javascript:'
		|| url.username.length
		|| url.password.length
		|| (
			query.length
			&& !(query.length === 1 && query[0][0] === 'uri' && !query[0][1])
		)
		|| url.hash.length
	)
		throw new Error('Wallet launch requires one selected wallet deep or universal link')
	return url
}

const requireCorrelation = (correlation: WalletLinkCorrelation) => {
	requireValue(correlation.attemptId, 'attemptId')
	requireValue(correlation.authorityRequestId, 'authorityRequestId')
	requireValue(correlation.envelopeHash, 'envelopeHash')
	if (correlation.kind === 'request') {
		requireValue(correlation.sessionTopic, 'sessionTopic')
		requireValue(correlation.requestId, 'requestId')
	}
}

export const prepareTauriWalletLink = ({
	target,
	walletConnectUri,
	correlation,
}: {
	target: TauriWalletLaunchTarget
	walletConnectUri: string
	correlation: WalletLinkCorrelation
}): WalletLinkAttempt => {
	parseWalletConnectUri(walletConnectUri)
	requireCorrelation(correlation)
	const launchUrl = parseLaunchBaseUrl(target)
	launchUrl.searchParams.set('uri', walletConnectUri)

	return {
		target,
		walletConnectUri,
		launchUrl: launchUrl.href,
		correlation,
		state: 'prepared',
	}
}

export const markTauriWalletLinkOpened = (
	attempt: WalletLinkAttempt,
	openedAt: number
): WalletLinkAttempt => {
	if (attempt.state !== 'prepared')
		throw new Error('Only a prepared wallet link can be opened')
	return { ...attempt, state: 'opened', openedAt }
}

export const observeTauriWalletReturn = (
	attempt: WalletLinkAttempt,
	openedUrls: readonly string[],
	returnedAt: number
): WalletLinkAttempt => {
	if (attempt.state !== 'opened')
		throw new Error('Wallet return has no matching open attempt')
	const openedUrl = openedUrls[0]
	if (
		openedUrls.length !== 1
		|| new URL(openedUrl).href !== new URL(blockheadWalletReturnUrl).href
	)
		throw new Error('Wallet return URL does not match the Blockhead wallet route')

	return { ...attempt, state: 'returned', returnedAt }
}

export const cancelTauriWalletLink = (
	attempt: WalletLinkAttempt
): WalletLinkAttempt => {
	if (attempt.state === 'cancelled') return attempt
	return { ...attempt, state: 'cancelled' }
}

export const settleTauriWalletLink = (
	attempt: WalletLinkAttempt,
	receipt: WalletLinkRelayReceipt
): WalletLinkSettlement => {
	if (attempt.state !== 'opened' && attempt.state !== 'returned')
		throw new Error('Wallet relay receipt has no active open attempt')
	if (
		receipt.attemptId !== attempt.correlation.attemptId
		|| receipt.authorityRequestId !== attempt.correlation.authorityRequestId
		|| receipt.envelopeHash !== attempt.correlation.envelopeHash
		|| receipt.kind !== attempt.correlation.kind
	)
		throw new Error('Wallet relay receipt does not match the open attempt')

	if (receipt.kind === 'request') {
		if (
			attempt.correlation.kind !== 'request'
			|| receipt.sessionTopic !== attempt.correlation.sessionTopic
			|| receipt.requestId !== attempt.correlation.requestId
		)
			throw new Error('Wallet relay receipt does not match the open attempt')
	}
	else if (
		attempt.correlation.kind !== 'pairing'
		|| Object.hasOwn(receipt, 'requestId')
		|| (
			receipt.outcome === 'approved'
			&& !receipt.sessionTopic.length
		)
		|| (
			receipt.outcome === 'rejected'
			&& Object.hasOwn(receipt, 'sessionTopic')
		)
	)
		throw new Error('Wallet relay receipt does not match the open attempt')

	return {
		attempt,
		receipt,
		completedBy: 'walletconnect-relay',
	}
}

const sameLaunchTarget = (
	left: TauriWalletLaunchTarget,
	right: TauriWalletLaunchTarget
) => (
	left.walletId === right.walletId
	&& left.bundleId === right.bundleId
	&& left.version === right.version
	&& left.launchBaseUrl === right.launchBaseUrl
)

const validateRestoredAttempt = (
	target: TauriWalletLaunchTarget,
	attempt: WalletLinkAttempt
) => {
	const prepared = prepareTauriWalletLink({
		target,
		walletConnectUri: attempt.walletConnectUri,
		correlation: attempt.correlation,
	})
	if (
		!sameLaunchTarget(target, attempt.target)
		|| prepared.launchUrl !== attempt.launchUrl
		|| (attempt.state !== 'opened' && attempt.state !== 'returned')
		|| attempt.openedAt == null
		|| (attempt.state === 'returned' && attempt.returnedAt == null)
	)
		throw new Error('Restored wallet link does not match the selected wallet attempt')

	return attempt
}

export const createTauriWalletLinkRuntime = ({
	target,
	host,
	restoredAttempt,
	onAttempt,
}: {
	target: TauriWalletLaunchTarget
	host: TauriWalletLinkHost
	restoredAttempt?: WalletLinkAttempt
	onAttempt?: (attempt: WalletLinkAttempt) => void
}): TauriWalletLinkRuntime => {
	let attempt = restoredAttempt == null ?
		undefined
		:
		validateRestoredAttempt(target, restoredAttempt)
	let lifecycle = 0
	let started = false
	let destroyed = false
	let startPromise: Promise<void> | undefined
	let stopOpenUrls: (() => void) | undefined
	const isCurrentLifecycle = (generation: number) => (
		!destroyed && generation === lifecycle
	)
	const isCurrentAttempt = (candidate: WalletLinkAttempt) => (
		!destroyed && attempt === candidate
	)

	const updateAttempt = (next: WalletLinkAttempt) => {
		attempt = next
		onAttempt?.(next)
		return next
	}

	const observeOpenedUrls = (urls: readonly string[]) => {
		if (!started || attempt?.state !== 'opened') return

		try {
			updateAttempt(observeTauriWalletReturn(attempt, urls, Date.now()))
		}
		catch {}
	}

	const start = () => {
		if (destroyed)
			return Promise.reject(new Error('Destroyed wallet link runtime cannot restart'))
		if (startPromise != null) return startPromise

		const generation = ++lifecycle
		startPromise = (async () => {
			const stop = await host.onOpenUrl(observeOpenedUrls)
			if (!isCurrentLifecycle(generation)) {
				stop()
				return
			}

			stopOpenUrls = stop
			started = true
			const current = await host.getCurrent()
			if (
				isCurrentLifecycle(generation)
				&& current != null
			)
				observeOpenedUrls(current)
		})().catch((error) => {
			if (generation === lifecycle) {
				started = false
				startPromise = undefined
				stopOpenUrls?.()
				stopOpenUrls = undefined
			}
			throw error
		})
		return startPromise
	}

	const open = async ({
		walletConnectUri,
		correlation,
	}: {
		walletConnectUri: string
		correlation: WalletLinkCorrelation
	}) => {
		if (!started || destroyed)
			throw new Error('Wallet link runtime must start before opening a wallet')

		if (attempt != null && attempt.state !== 'cancelled')
			updateAttempt(cancelTauriWalletLink(attempt))

		const prepared = updateAttempt(prepareTauriWalletLink({
			target,
			walletConnectUri,
			correlation,
		}))
		try {
			await host.openUrl(prepared.launchUrl)
		}
		catch (error) {
			if (attempt === prepared)
				updateAttempt(cancelTauriWalletLink(prepared))
			throw error
		}

		if (!isCurrentAttempt(prepared))
			throw new Error('Wallet link open was superseded')
		return updateAttempt(markTauriWalletLinkOpened(prepared, Date.now()))
	}

	return {
		start,
		open,
		cancel: () => (
			attempt == null ?
				undefined
				:
				updateAttempt(cancelTauriWalletLink(attempt))
		),
		settle: (receipt) => {
			if (attempt == null)
				throw new Error('Wallet relay receipt has no wallet link attempt')
			return settleTauriWalletLink(attempt, receipt)
		},
		destroy: () => {
			if (destroyed) return

			destroyed = true
			started = false
			lifecycle += 1
			stopOpenUrls?.()
			stopOpenUrls = undefined
			if (attempt != null)
				updateAttempt(cancelTauriWalletLink(attempt))
		},
		current: () => attempt,
	}
}
