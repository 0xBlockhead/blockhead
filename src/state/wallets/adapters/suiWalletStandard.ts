import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import type { WalletAccount, WalletAdapter, WalletCandidate, WalletConnection } from '$/state/wallets/adapters/types.ts'
import { WalletAdapterResponseAuditFailure } from '$/state/wallets/adapters/types.ts'
import { isJsonObject, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'
import type { StandardWallet, WalletRegistryApi } from '$/state/wallets/adapters/walletStandard.ts'
import { buildWalletConnection } from '$/state/wallets/walletConnectionState.ts'

const SuiMainnetChain = 'sui:mainnet'
const SuiNamespace = 'sui'
const SuiMainnetReference = 'mainnet'
const SuiSignPersonalMessage = 'sui:signPersonalMessage'

type SuiWalletAccount = {
	readonly address: string
	readonly chains: readonly string[]
	readonly features: readonly string[]
	readonly publicKey?: Uint8Array
}

type SuiWalletRegistration = Readonly<{
	walletId: string
}>

const connectFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:connect']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.connect === 'function' ? feature : undefined
}

const eventsFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:events']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.on === 'function' ? feature : undefined
}

const disconnectFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:disconnect']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.disconnect === 'function' ? feature : undefined
}

const suiSignPersonalMessageFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.[SuiSignPersonalMessage]

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.1.0' && typeof feature.signPersonalMessage === 'function' ? feature : undefined
}

const normalizeSuiAccount = (address: string) => (
	/^0x[0-9a-f]{64}$/.test(address) ? address : undefined
)

const suiAccountHasSigningAuthority = (account: SuiWalletAccount) => (
	account.chains.includes(SuiMainnetChain)
	&& normalizeSuiAccount(account.address) != null
	&& account.features.includes(SuiSignPersonalMessage)
)

const capabilitiesFromWallet = (wallet: StandardWallet) => [
	WalletCapability.Discover,
	...(connectFeature(wallet) == null ?
		[]
	:
		[
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
		]),
	...(eventsFeature(wallet) == null ?
		[]
	:
		[WalletCapability.WatchAccounts]),
	...(disconnectFeature(wallet) == null ?
		[]
	:
		[WalletCapability.Disconnect]),
] satisfies WalletCapability[]

const capabilitiesFromAccount = (
	wallet: StandardWallet,
	account: SuiWalletAccount
) => [
	...capabilitiesFromWallet(wallet),
	...(suiSignPersonalMessageFeature(wallet) != null && suiAccountHasSigningAuthority(account) ?
		[WalletCapability.SignMessage]
	:
		[]),
] satisfies WalletCapability[]

const walletAccounts = (
	wallet: StandardWallet,
	accounts: readonly SuiWalletAccount[]
): WalletAccount[] => [...new Map(accounts.flatMap((account) => {
	const accountAddress = normalizeSuiAccount(account.address)
	if (!account.chains.includes(SuiMainnetChain) || accountAddress == null) return []

	return [[`${SuiNamespace}:${SuiMainnetReference}:${accountAddress}`, {
		namespace: SuiNamespace,
		reference: SuiMainnetReference,
		accountAddress,
		capabilities: capabilitiesFromAccount(wallet, account),
	}] as const]
})).values()]

const walletConnection = (
	walletId: string,
	wallet: StandardWallet,
	accounts: readonly SuiWalletAccount[],
	connectedAt?: number
): WalletConnection => {
	const normalizedAccounts = walletAccounts(wallet, accounts)

	return buildWalletConnection({
		walletId,
		status: normalizedAccounts.length ?
			BlockheadConnectionStatus.Connected
		:
			BlockheadConnectionStatus.Disconnected,
		protocol: WalletProtocol.WalletStandard,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: normalizedAccounts.length ?
			[{
				namespace: SuiNamespace,
				reference: SuiMainnetReference,
				methods: normalizedAccounts.some((account) => (
					account.capabilities.includes(WalletCapability.SignMessage)
				)) ? [SuiSignPersonalMessage] : [],
				events: eventsFeature(wallet) == null ? [] : ['change'],
			}]
		:
			[],
		accounts: normalizedAccounts,
		activeAccount: normalizedAccounts[0],
		selected: normalizedAccounts.length > 0,
		...(connectedAt != null && { connectedAt }),
		...(!normalizedAccounts.length && { disconnectedAt: Date.now() }),
	})
}

const bytesEqual = (
	left: Uint8Array,
	right: Uint8Array
) => (
	left.byteLength === right.byteLength
	&& left.every((byte, index) => byte === right[index])
)

const decodeBase64 = (value: string) => {
	if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))
		return undefined

	try {
		const binary = globalThis.atob(value)
		return Uint8Array.from(binary, (character) => character.charCodeAt(0))
	}
	catch {
		return undefined
	}
}

const canonicalSuiSignPersonalMessageResponse = (response: JsonValue) => {
	if (!isJsonObject(response) || !isJsonString(response.bytes) || !isJsonString(response.signature))
		return undefined

	return {
		bytes: response.bytes,
		signature: response.signature,
	}
}

const responseSummary = () => ({
	kind: 'sui:signPersonalMessage JsonValue response',
})

export type SuiSignPersonalMessageResponseAudit = Readonly<{
	messageForProvider(): Uint8Array
	audit(response: JsonValue): string
}>

export const createSuiSignPersonalMessageResponseAudit = (
	message: string
): SuiSignPersonalMessageResponseAudit => {
	const retainedMessage = new TextEncoder().encode(message)

	return Object.freeze({
		messageForProvider: () => retainedMessage.slice(),
		audit: (response: JsonValue) => {
			const output = canonicalSuiSignPersonalMessageResponse(response)
			const bytes = output?.bytes
			const signature = output?.signature

			const decodedBytes = bytes == null ? undefined : decodeBase64(bytes)
			const decodedSignature = signature == null ? undefined : decodeBase64(signature)
			if (
				bytes == null
				|| signature == null
				|| decodedBytes == null
				|| decodedSignature == null
				|| decodedSignature.byteLength === 0
				|| !bytesEqual(decodedBytes, retainedMessage)
			)
				throw new WalletAdapterResponseAuditFailure(
					'Sui wallet returned a malformed sui:signPersonalMessage response',
					responseSummary()
				)

			return signature
		},
	})
}

export const createSuiWalletStandardAdapter = (): WalletAdapter => {
	const walletById = new Map<string, StandardWallet>()
	let registrationByWallet = new WeakMap<StandardWallet, SuiWalletRegistration>()
	const connectedAtByWalletId = new Map<string, number>()
	const accountsByWalletId = new Map<string, readonly SuiWalletAccount[]>()
	const connectionVersionByWalletId = new Map<string, number>()
	let updateCandidates: ((candidates: WalletCandidate[]) => void) | undefined
	let activeCleanup: (() => void) | undefined

	const emitCandidates = () => updateCandidates?.(
		[...walletById].map(([id, wallet]) => ({
			id,
			name: wallet.name,
			icon: wallet.icon ?? '',
			protocol: WalletProtocol.WalletStandard,
			discoveryKind: WalletDiscoveryKind.Registry,
			transportKind: WalletTransportKind.InjectedSigner,
			capabilities: capabilitiesFromWallet(wallet),
		}))
	)
	return {
		id: 'wallet-standard-sui',
		start: (nextUpdateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			activeCleanup?.()
			let active = true
			updateCandidates = nextUpdateCandidates
			const registry: WalletRegistryApi = {
				register: (...wallets) => {
					if (!active) return () => {}

					const registeredWallets: Readonly<{
						wallet: StandardWallet
						registration: SuiWalletRegistration
					}>[] = []
					for (const wallet of wallets) {
						if (registrationByWallet.has(wallet)) continue
						if (suiSignPersonalMessageFeature(wallet) == null) continue

						let walletId = `wallet-standard-sui:${wallet.name}`
						let duplicateIndex = 2
						while (walletById.has(walletId)) {
							walletId = `wallet-standard-sui:${wallet.name}:${duplicateIndex}`
							duplicateIndex++
						}

						const registration = { walletId }
						walletById.set(walletId, wallet)
						registrationByWallet.set(wallet, registration)
						registeredWallets.push({ wallet, registration })
					}

					if (registeredWallets.length) emitCandidates()

					let cleanedUp = false
					return () => {
						if (cleanedUp) return
						cleanedUp = true
						if (!active) return

						let removedWallet = false
						for (const { wallet, registration } of registeredWallets) {
							if (registrationByWallet.get(wallet) !== registration) continue

							walletById.delete(registration.walletId)
							registrationByWallet.delete(wallet)
							connectedAtByWalletId.delete(registration.walletId)
							accountsByWalletId.delete(registration.walletId)
							removedWallet = true
						}

						if (removedWallet) emitCandidates()
					}
				},
			}
			const onRegisterWallet = (registerEvent: WindowEventMap['wallet-standard:register-wallet']) => {
				if (!active) return

				// The official registry callback and the repo's legacy event fixture meet at this browser boundary.
				// oxlint-disable-next-line no-runtime-shape-guards/guards
				if (typeof registerEvent.detail === 'function') {
					registerEvent.detail(registry)
					return
				}

				registerEvent.detail.register((wallet) => registry.register(wallet))
			}

			window.addEventListener('wallet-standard:register-wallet', onRegisterWallet)
			window.dispatchEvent(new CustomEvent('wallet-standard:app-ready', {
				detail: registry,
			}))
			emitCandidates()

			const cleanup = () => {
				if (!active) return

				active = false
				window.removeEventListener('wallet-standard:register-wallet', onRegisterWallet)
				updateCandidates = undefined
				walletById.clear()
				registrationByWallet = new WeakMap<StandardWallet, SuiWalletRegistration>()
				connectedAtByWalletId.clear()
				accountsByWalletId.clear()
				activeCleanup = undefined
			}
			activeCleanup = cleanup
			return cleanup
		},
		connect: async (walletId) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return undefined
			const registration = registrationByWallet.get(wallet)
			if (registration?.walletId !== walletId) return undefined
			const connectVersion = (connectionVersionByWalletId.get(walletId) ?? 0) + 1
			connectionVersionByWalletId.set(walletId, connectVersion)

			const standardConnect = connectFeature(wallet)
			if (standardConnect == null)
				throw new Error(`${wallet.name} does not implement standard:connect 1.0.0`)

			const { accounts } = await standardConnect.connect()
			if (registrationByWallet.get(wallet) !== registration
				|| connectionVersionByWalletId.get(walletId) !== connectVersion)
				return undefined
			if (!walletAccounts(wallet, accounts).length)
				throw new Error(`${wallet.name} did not authorize a valid Sui mainnet account`)

			connectedAtByWalletId.set(walletId, Date.now())
			accountsByWalletId.set(walletId, accounts)
			return walletConnection(walletId, wallet, accounts, connectedAtByWalletId.get(walletId))
		},
		signMessage: async (walletId, accountAddress, message) => {
			const wallet = walletById.get(walletId)
			if (wallet == null)
				throw new Error('Sui Wallet Standard wallet is unavailable')

			const feature = suiSignPersonalMessageFeature(wallet)
			if (feature == null)
				throw new Error(`${wallet.name} does not implement sui:signPersonalMessage 1.1.0`)

			const account = (accountsByWalletId.get(walletId) ?? []).find((candidate) => (
				candidate.address === accountAddress
				&& suiAccountHasSigningAuthority(candidate)
			))
			if (account == null)
				throw new Error(`${wallet.name} is not connected with Sui account ${accountAddress}`)

			const responseAudit = createSuiSignPersonalMessageResponseAudit(message)
			const providerAccount = {
				...account,
				chains: account.chains.slice(),
				features: account.features.slice(),
				...(account.publicKey != null && { publicKey: account.publicKey.slice() }),
			}
			const response = await feature.signPersonalMessage({
				account: providerAccount,
				chain: SuiMainnetChain,
				message: responseAudit.messageForProvider(),
			})

			return responseAudit.audit(response)
		},
		disconnect: async (walletId) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return
			const registration = registrationByWallet.get(wallet)
			if (registration?.walletId !== walletId) return

			await disconnectFeature(wallet)?.disconnect()
			if (registrationByWallet.get(wallet) !== registration) return
			connectionVersionByWalletId.set(walletId, (connectionVersionByWalletId.get(walletId) ?? 0) + 1)
			connectedAtByWalletId.delete(walletId)
			accountsByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return () => {}
			const registration = registrationByWallet.get(wallet)
			if (registration?.walletId !== walletId) return () => {}

			const standardEvents = eventsFeature(wallet)
			let subscribed = true
			let connectionVersion = 0
			const ownsRegistration = () => registrationByWallet.get(wallet) === registration
			const unsubscribe = standardEvents?.on('change', ({ accounts }) => {
				if (!subscribed || !ownsRegistration() || accounts == null) return

				connectionVersion++
				accountsByWalletId.set(walletId, accounts)
				updateConnection(walletConnection(
					walletId,
					wallet,
					accounts,
					connectedAtByWalletId.get(walletId)
				))
			}) ?? (() => {})

			if (!connectedAtByWalletId.has(walletId)) {
				const restoreVersion = connectionVersion
				void connectFeature(wallet)?.connect({
						silent: true,
					}).then(({ accounts }) => {
						if (!subscribed || !ownsRegistration() || connectionVersion !== restoreVersion) return

					const connectedAt = Date.now()
					connectedAtByWalletId.set(walletId, connectedAt)
					accountsByWalletId.set(walletId, accounts)
					updateConnection(walletConnection(
						walletId,
						wallet,
						accounts,
						connectedAt
						))
					}).catch(() => {
						if (!subscribed || !ownsRegistration() || connectionVersion !== restoreVersion) return

					accountsByWalletId.delete(walletId)
					updateConnection(walletConnection(
						walletId,
						wallet,
						[],
						connectedAtByWalletId.get(walletId)
					))
				})
			}

			return () => {
				subscribed = false
				unsubscribe()
			}
		},
	}
}
