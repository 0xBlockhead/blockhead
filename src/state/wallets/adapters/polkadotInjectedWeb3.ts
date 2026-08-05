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
const polkadotReference = '91b171bb158e2d3848fa23a9f1c25182'
const polkadotGenesisHash = `0x${polkadotReference}`

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
	connectedAt: number
): WalletConnection => {
	const accountsWithChainIdentity = [...new Map<string, WalletAccount>(accounts.flatMap((account) => {
		const declaredReference = account.genesisHash?.replace(/^0x/i, '').slice(0, 32).toLowerCase()
		if (
			declaredReference != null
			&& (
				!/^[0-9a-f]{32}$/.test(declaredReference)
				|| declaredReference !== authorizedReference
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

	return {
		id: 'polkadot-injected-web3',
		start: (updateCandidates) => {
			let discoveredCandidateIds: string[] | undefined
			const discover = () => {
				const discoveredWallets = new Set<PolkadotInjectedWeb3Wallet>()
				walletByWalletId.clear()
				const candidates = typeof window === 'undefined' ?
					[]
				:
					Object
						.entries(window.injectedWeb3 ?? {})
						.flatMap(([walletKey, wallet]) => {
							if (discoveredWallets.has(wallet))
								return []

							discoveredWallets.add(wallet)
							walletByWalletId.set(`polkadot:${walletKey}`, wallet)

							return [{
								id: `polkadot:${walletKey}`,
								name: walletKey,
								icon: '',
								protocol: WalletProtocol.PolkadotInjectedWeb3,
								discoveryKind: WalletDiscoveryKind.InjectedGlobal,
								transportKind: WalletTransportKind.InjectedSigner,
								capabilities: [
									WalletCapability.Connect,
									WalletCapability.Reconnect,
									WalletCapability.ListAccounts,
									WalletCapability.WatchAccounts,
								],
							}]
						})

				const candidateIds = candidates.map(({ id }) => id)
				if (
					discoveredCandidateIds == null
					|| candidateIds.length !== discoveredCandidateIds.length
					|| candidateIds.some((candidateId, index) => candidateId !== discoveredCandidateIds?.[index])
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

			return () => {
				if (discoveryInterval !== undefined)
					globalThis.clearInterval(discoveryInterval)

				authorizationVersionByWalletId.clear()
				connectedAtByWalletId.clear()
				extensionByWalletId.clear()
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const extension = await wallet.enable('Blockhead')
			const connectedAt = Date.now()
			const authorizationVersion = (authorizationVersionByWalletId.get(walletId) ?? 0) + 1

			extensionByWalletId.set(walletId, extension)
			connectedAtByWalletId.set(walletId, connectedAt)
			authorizationVersionByWalletId.set(walletId, authorizationVersion)

			return polkadotConnectionFromAccounts(
				walletId,
				await extension.accounts.get(
					undefined,
					polkadotGenesisHash
				),
				polkadotReference,
				connectedAt
			)
		},
		disconnect: (walletId) => {
			authorizationVersionByWalletId.set(
				walletId,
				(authorizationVersionByWalletId.get(walletId) ?? 0) + 1
			)
			connectedAtByWalletId.delete(walletId)
			extensionByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection, connectionKey) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => {}

			let subscribed = true
			let accountVersion = 0
			let unsubscribe = () => {}
			const subscribeExtension = (
				extension: PolkadotInjectedExtension,
				connectedAt: number,
				authorizationVersion: number,
				readInitialAccounts: boolean
			) => {
				if (!subscribed) return

				unsubscribe = extension.accounts.subscribe((accounts) => {
					accountVersion++
					if (
						subscribed
						&& authorizationVersionByWalletId.get(walletId) === authorizationVersion
					)
						updateConnection(polkadotConnectionFromAccounts(
							walletId,
							accounts,
							polkadotReference,
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
						|| authorizationVersionByWalletId.get(walletId) !== authorizationVersion
					) return

					updateConnection(polkadotConnectionFromAccounts(
						walletId,
						accounts,
						polkadotReference,
						connectedAt
					))
				}).catch(() => {})
			}
			const extension = extensionByWalletId.get(walletId)
			if (extension == null && connectionKey != null)
				void wallet.enable('Blockhead').then((restoredExtension) => {
					if (!subscribed) return

					const connectedAt = Date.now()
					const authorizationVersion = (authorizationVersionByWalletId.get(walletId) ?? 0) + 1
					extensionByWalletId.set(walletId, restoredExtension)
					connectedAtByWalletId.set(walletId, connectedAt)
					authorizationVersionByWalletId.set(walletId, authorizationVersion)
					subscribeExtension(
						restoredExtension,
						connectedAt,
						authorizationVersion,
						true
					)
				}).catch(() => {})
			else if (extension != null)
				subscribeExtension(
					extension,
					connectedAtByWalletId.get(walletId) ?? Date.now(),
					authorizationVersionByWalletId.get(walletId) ?? 0,
					false
				)

			return () => {
				subscribed = false
				unsubscribe()
			}
		},
	}
}
