import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type {
	PolkadotInjectedAccount,
	PolkadotInjectedExtension,
	PolkadotInjectedWeb3Wallet,
} from '$/sources/PolkadotInjectedWeb3/WalletApi/types.ts'
import { base58 } from '@scure/base'
import { Blake2 } from '@tevm/voltaire/Blake2'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAccount, WalletAdapter, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

const ss58PrefixBytes = new TextEncoder().encode('SS58PRE')
const polkadotGenesisHash = '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
const polkadotReference = polkadotGenesisHash.slice(2, 34)

const encodeSs58Account = (
	accountId: Uint8Array,
	format: number
) => {
	const payload = new Uint8Array([
		...(
			format < 64 ?
				[format]
			:
				[
					((format & 0xfc) >> 2) | 0x40,
					(format >> 8) | ((format & 0x03) << 6),
				]
		),
		...accountId,
	])
	const checksum = Blake2.hash(new Uint8Array([
		...ss58PrefixBytes,
		...payload,
	]))

	return base58.encode(new Uint8Array([
		...payload,
		...checksum.slice(0, 2),
	]))
}

const normalizeSs58Account = (
	address: string,
	reference: string
) => {
	try {
		const decoded = base58.decode(address)
		const prefixLength = decoded[0] < 64 ? 1 : 2
		const format = (
			prefixLength === 1 ?
				decoded[0]
			:
				(
					((decoded[0] & 0x3f) << 2)
					| (decoded[1] >> 6)
					| ((decoded[1] & 0x3f) << 8)
				)
		)
		if (
			decoded.length !== prefixLength + 34
			|| (prefixLength === 2 && (decoded[0] & 0xc0) !== 0x40)
			|| format > 16_383
			|| format === 46
			|| format === 47
		)
			return undefined

		const payload = decoded.slice(0, -2)
		const checksum = Blake2.hash(new Uint8Array([
			...ss58PrefixBytes,
			...payload,
		]))
		if (
			decoded.at(-2) !== checksum[0]
			|| decoded.at(-1) !== checksum[1]
		)
			return undefined

		return encodeSs58Account(
			decoded.slice(prefixLength, -2),
			reference === polkadotReference ? 0 : format
		)
	} catch {
		return undefined
	}
}

const polkadotConnectionFromAccounts = (
	walletId: string,
	accounts: PolkadotInjectedAccount[],
	authorizedReference: string,
	authorizedGenesisHash: string,
	connectedAt: number
): WalletConnection => {
	const accountsWithChainIdentity = [...new Map<string, WalletAccount>(accounts.flatMap((account) => {
		const declaredGenesisHash = account.genesisHash?.replace(/^0x/i, '').toLowerCase()
		if (
			declaredGenesisHash != null
			&& (
				!/^[0-9a-f]{64}$/.test(declaredGenesisHash)
				|| declaredGenesisHash !== authorizedGenesisHash.slice(2)
			)
		)
			return []

		const accountAddress = normalizeSs58Account(account.address, authorizedReference)

		if (accountAddress == null)
			return []

		return [
			[`${authorizedReference}:${accountAddress}`, {
				namespace: 'polkadot',
				reference: authorizedReference,
				accountAddress,
				capabilities: [
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.Disconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
				],
			}],
		]
	})).values()]

	return buildWalletConnection({
		walletId,
		status: (
			accountsWithChainIdentity.length ?
				BlockheadConnectionStatus.Connected
			:
				BlockheadConnectionStatus.Disconnected
		),
		protocol: WalletProtocol.PolkadotInjectedWeb3,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: accountsWithChainIdentity.length === 0 ?
			[]
		:
			[
				{
					namespace: 'polkadot',
					reference: authorizedReference,
					methods: ['enable', 'accounts.get'],
					events: ['accounts.subscribe'],
				},
			],
		accounts: accountsWithChainIdentity,
		...(accountsWithChainIdentity.length > 0 && { activeAccount: accountsWithChainIdentity[0] }),
		selected: accountsWithChainIdentity.length > 0,
		connectedAt,
		...(accountsWithChainIdentity.length === 0 && { disconnectedAt: Date.now() }),
	})
}

export const createPolkadotInjectedWeb3Adapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, PolkadotInjectedWeb3Wallet>()
	const extensionByWalletId = new SvelteMap<string, PolkadotInjectedExtension>()
	const connectedAtByWalletId = new SvelteMap<string, number>()
	const authorizationVersionByWalletId = new SvelteMap<string, number>()
	const providerEpochByWalletId = new SvelteMap<string, number>()
	const subscriptionEpochByWalletId = new SvelteMap<string, number>()
	const subscriptionCleanupByWalletId = new SvelteMap<string, () => void>()
	let nextStartEpoch = 0
	let activeStartEpoch = 0
	let activeStop: (() => void) | undefined

	const nextEpoch = (epochs: SvelteMap<string, number>, walletId: string) => {
		const epoch = (epochs.get(walletId) ?? 0) + 1
		epochs.set(walletId, epoch)
		return epoch
	}

	const isCurrent = (
		walletId: string,
		wallet: PolkadotInjectedWeb3Wallet,
		startEpoch: number,
		providerEpoch: number,
		authorizationVersion?: number,
		subscriptionEpoch?: number
	) => (
		activeStartEpoch === startEpoch
		&& walletByWalletId.get(walletId) === wallet
		&& providerEpochByWalletId.get(walletId) === providerEpoch
		&& (
			authorizationVersion === undefined
			|| authorizationVersionByWalletId.get(walletId) === authorizationVersion
		)
		&& (
			subscriptionEpoch === undefined
			|| subscriptionEpochByWalletId.get(walletId) === subscriptionEpoch
		)
	)

	const invalidateWallet = (walletId: string, wallet: PolkadotInjectedWeb3Wallet) => {
		if (walletByWalletId.get(walletId) !== wallet)
			return

		nextEpoch(providerEpochByWalletId, walletId)
		nextEpoch(authorizationVersionByWalletId, walletId)
		nextEpoch(subscriptionEpochByWalletId, walletId)
		subscriptionCleanupByWalletId.get(walletId)?.()
		subscriptionCleanupByWalletId.delete(walletId)
		connectedAtByWalletId.delete(walletId)
		extensionByWalletId.delete(walletId)
	}

	return {
		id: 'polkadot-injected-web3',
		start: (updateCandidates) => {
			activeStop?.()
			const startEpoch = ++nextStartEpoch
			activeStartEpoch = startEpoch
			let discoveredCandidateIds: string[] | undefined
			const discover = () => {
				if (activeStartEpoch !== startEpoch)
					return

				const discoveredWallets = new Set<PolkadotInjectedWeb3Wallet>()
				const previousWallets = new Map(walletByWalletId)
				const nextWallets = new Map<string, PolkadotInjectedWeb3Wallet>()
				const candidates = typeof window === 'undefined' ?
					[]
				:
					Object
						.entries(window.injectedWeb3 ?? {})
						.flatMap(([walletKey, wallet]) => {
							if (discoveredWallets.has(wallet))
								return []

							discoveredWallets.add(wallet)
							nextWallets.set(`polkadot:${walletKey}`, wallet)

							return [{
								id: `polkadot:${walletKey}`,
								name: walletKey,
								icon: '',
								protocol: WalletProtocol.PolkadotInjectedWeb3,
								discoveryKind: WalletDiscoveryKind.InjectedGlobal,
								transportKind: WalletTransportKind.InjectedSigner,
								capabilities: [
									WalletCapability.Discover,
									WalletCapability.Connect,
									WalletCapability.Reconnect,
									WalletCapability.Disconnect,
									WalletCapability.ListAccounts,
									WalletCapability.WatchAccounts,
								],
							}]
						})

				for (const [walletId, wallet] of previousWallets)
					if (nextWallets.get(walletId) !== wallet)
						invalidateWallet(walletId, wallet)
				walletByWalletId.clear()
				for (const [walletId, wallet] of nextWallets) {
					walletByWalletId.set(walletId, wallet)
					if (!providerEpochByWalletId.has(walletId))
						nextEpoch(providerEpochByWalletId, walletId)
				}

				const candidateIds = candidates.map(({ id }) => id)
				const providerChanged = (
					previousWallets.size !== nextWallets.size
					|| [...nextWallets].some(([walletId, wallet]) => previousWallets.get(walletId) !== wallet)
				)
				if (
					discoveredCandidateIds == null
					|| candidateIds.length !== discoveredCandidateIds.length
					|| candidateIds.some((candidateId, index) => candidateId !== discoveredCandidateIds?.[index])
					|| providerChanged
				) {
					discoveredCandidateIds = candidateIds
					updateCandidates(candidates)
				}
			}

			discover()
			const discoveryInterval = typeof window === 'undefined' ?
				undefined
			:
				globalThis.setInterval(discover, 100)

			const stop = () => {
				if (activeStop !== stop)
					return

				activeStop = undefined
				activeStartEpoch = 0
				if (discoveryInterval !== undefined)
					globalThis.clearInterval(discoveryInterval)

				for (const [walletId, wallet] of walletByWalletId)
					invalidateWallet(walletId, wallet)
				subscriptionCleanupByWalletId.clear()
				authorizationVersionByWalletId.clear()
				connectedAtByWalletId.clear()
				extensionByWalletId.clear()
				providerEpochByWalletId.clear()
				subscriptionEpochByWalletId.clear()
				walletByWalletId.clear()
			}
			activeStop = stop
			return stop
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null)
				return undefined

			const startEpoch = activeStartEpoch
			const providerEpoch = providerEpochByWalletId.get(walletId)
			if (startEpoch === 0 || providerEpoch === undefined)
				return undefined

			const authorizationVersion = nextEpoch(authorizationVersionByWalletId, walletId)

			const extension = await wallet.enable('Blockhead')
			if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, authorizationVersion))
				throw new Error('Polkadot injectedWeb3 wallet changed during authorization')
			const accounts = await extension.accounts.get(
				undefined,
				polkadotGenesisHash
			)
			if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, authorizationVersion))
				throw new Error('Polkadot injectedWeb3 wallet changed during account acquisition')
			const connectedAt = Date.now()

			extensionByWalletId.set(walletId, extension)
			connectedAtByWalletId.set(walletId, connectedAt)
			authorizationVersionByWalletId.set(walletId, authorizationVersion)

			return polkadotConnectionFromAccounts(
				walletId,
				accounts,
				polkadotReference,
				polkadotGenesisHash,
				connectedAt
			)
		},
		disconnect: (walletId) => {
			nextEpoch(authorizationVersionByWalletId, walletId)
			subscriptionCleanupByWalletId.get(walletId)?.()
			subscriptionCleanupByWalletId.delete(walletId)
			connectedAtByWalletId.delete(walletId)
			extensionByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection, connectionKey) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null)
				return () => {}

			const startEpoch = activeStartEpoch
			const providerEpoch = providerEpochByWalletId.get(walletId)
			if (startEpoch === 0 || providerEpoch === undefined)
				return () => {}

			subscriptionCleanupByWalletId.get(walletId)?.()
			const subscriptionEpoch = nextEpoch(subscriptionEpochByWalletId, walletId)

			let subscribed = true
			let accountVersion = 0
			let unsubscribe = () => {}
			const subscribeExtension = (
				extension: PolkadotInjectedExtension,
				connectedAt: number,
				authorizationVersion: number,
				readInitialAccounts: boolean
			) => {
				if (
					!subscribed
					|| !isCurrent(walletId, wallet, startEpoch, providerEpoch, authorizationVersion, subscriptionEpoch)
				)
					return


				unsubscribe = extension.accounts.subscribe((accounts) => {
					accountVersion++
					if (
						subscribed
						&& authorizationVersionByWalletId.get(walletId) === authorizationVersion
						&& isCurrent(walletId, wallet, startEpoch, providerEpoch, authorizationVersion, subscriptionEpoch)
					)
						updateConnection(polkadotConnectionFromAccounts(
							walletId,
							accounts,
							polkadotReference,
							polkadotGenesisHash,
							connectedAt
						))
				})
				if (!readInitialAccounts) return

				const initialAccountVersion = accountVersion
				void extension.accounts.get(
					undefined,
					polkadotGenesisHash
				).then((accounts) => {
					if (
						!subscribed
						|| accountVersion !== initialAccountVersion
						|| !isCurrent(walletId, wallet, startEpoch, providerEpoch, authorizationVersion, subscriptionEpoch)
					) return

					updateConnection(polkadotConnectionFromAccounts(
						walletId,
						accounts,
						polkadotReference,
						polkadotGenesisHash,
						connectedAt
					))
				}).catch(() => {})
			}
			const extension = extensionByWalletId.get(walletId)
			if (extension == null && connectionKey != null) {
				const restoreAuthorizationVersion = nextEpoch(authorizationVersionByWalletId, walletId)
				void wallet.enable('Blockhead').then((restoredExtension) => {
					if (
						!subscribed
						|| !isCurrent(walletId, wallet, startEpoch, providerEpoch, restoreAuthorizationVersion, subscriptionEpoch)
					)
						return


					const connectedAt = Date.now()
					extensionByWalletId.set(walletId, restoredExtension)
					connectedAtByWalletId.set(walletId, connectedAt)
					subscribeExtension(
						restoredExtension,
						connectedAt,
						restoreAuthorizationVersion,
						true
					)
				}).catch(() => {})
			} else if (extension != null)
				subscribeExtension(
					extension,
					connectedAtByWalletId.get(walletId) ?? Date.now(),
					authorizationVersionByWalletId.get(walletId) ?? 0,
					false
				)

			const cleanup = () => {
				subscribed = false
				unsubscribe()
				if (subscriptionCleanupByWalletId.get(walletId) === cleanup)
					subscriptionCleanupByWalletId.delete(walletId)
			}
			subscriptionCleanupByWalletId.set(walletId, cleanup)
			return cleanup
		},
	}
}
