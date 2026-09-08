import {
	createTauriWalletLinkRuntime,
	metamaskMobileTauriWalletLaunchTarget,
	type TauriWalletLinkHost,
	type WalletLinkAttempt,
	type WalletLinkCorrelation,
	type WalletLinkRelayReceipt,
	type WalletLinkSettlement,
} from './tauriWalletLink.ts'

type WalletConnectPairingCorrelation = Extract<
	WalletLinkCorrelation,
	{ kind: 'pairing' }
>

export type WalletConnectApplicationConsumer = Readonly<{
	start(): Promise<void>
	open(input: {
		walletConnectUri: string
		correlation: WalletLinkCorrelation
	}): Promise<WalletLinkAttempt>
	openPairing(walletConnectUri: string): Promise<WalletLinkAttempt>
	approvePairing(
		walletConnectUri: string,
		sessionTopic: string
	): WalletLinkSettlement | undefined
	rejectPairing(walletConnectUri: string): WalletLinkAttempt | undefined
	settle(receipt: WalletLinkRelayReceipt): WalletLinkSettlement
	destroy(): void
	current(): WalletLinkAttempt | undefined
}>

const walletConnectPairingTopic = (walletConnectUri: string) => {
	const uri = new URL(walletConnectUri)
	const match = /^([^@]+)@2$/.exec(uri.pathname)
	if (
		uri.protocol !== 'wc:'
		|| match == null
		|| !match[1]
	)
		throw new Error('WalletConnect pairing requires an exact v2 URI')

	return match[1]
}

const walletConnectUriHash = async (walletConnectUri: string) => (
	`0x${[...new Uint8Array(await globalThis.crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(walletConnectUri)
	))].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
)

export const createWalletConnectPairingCorrelation = async (
	walletConnectUri: string
): Promise<WalletConnectPairingCorrelation> => {
	const pairingTopic = walletConnectPairingTopic(walletConnectUri)

	return {
		kind: 'pairing',
		attemptId: `walletconnect-pairing-${globalThis.crypto.randomUUID()}`,
		authorityRequestId: `walletconnect-pairing:${pairingTopic}`,
		envelopeHash: await walletConnectUriHash(walletConnectUri),
	}
}

export const createWalletConnectApplicationConsumer = ({
	host,
}: {
	host: TauriWalletLinkHost
}): WalletConnectApplicationConsumer => {
	const walletLink = createTauriWalletLinkRuntime({
		target: metamaskMobileTauriWalletLaunchTarget,
		host,
	})
	let destroyed = false

	const requireActive = () => {
		if (destroyed)
			throw new Error('Destroyed WalletConnect application consumer is inactive')

		return walletLink.current()
	}

	const activePairing = (walletConnectUri: string) => {
		const attempt = requireActive()
		if (
			attempt == null
			|| attempt.state === 'cancelled'
		)
			return undefined
		if (
			attempt.correlation.kind !== 'pairing'
			|| attempt.walletConnectUri !== walletConnectUri
		)
			throw new Error('WalletConnect application callback is stale or superseded')

		return attempt
	}

	const open = async ({
		walletConnectUri,
		correlation,
	}: {
		walletConnectUri: string
		correlation: WalletLinkCorrelation
	}) => {
		requireActive()
		return walletLink.open({
			walletConnectUri,
			correlation,
		})
	}

	return {
		start: () => {
			requireActive()
			return walletLink.start()
		},
		open,
		openPairing: async (walletConnectUri) => open({
			walletConnectUri,
			correlation: await createWalletConnectPairingCorrelation(walletConnectUri),
		}),
		approvePairing: (walletConnectUri, sessionTopic) => {
			if (!sessionTopic.length)
				throw new Error('WalletConnect relay approval requires an exact session topic')

			const attempt = activePairing(walletConnectUri)
			if (attempt == null) return undefined

			return walletLink.settle({
				...attempt.correlation,
				sessionTopic,
				outcome: 'approved',
			})
		},
		rejectPairing: (walletConnectUri) => {
			const attempt = activePairing(walletConnectUri)
			if (attempt == null) return undefined

			return walletLink.cancel()
		},
		settle: (receipt) => {
			requireActive()
			if (!receipt.sessionTopic.length)
				throw new Error('WalletConnect relay result requires an exact session topic')
			return walletLink.settle(receipt)
		},
		destroy: () => {
			if (destroyed) return

			destroyed = true
			walletLink.destroy()
		},
		current: () => walletLink.current(),
	}
}
