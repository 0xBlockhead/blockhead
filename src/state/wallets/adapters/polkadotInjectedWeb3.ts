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
	connectedAt: number
): WalletConnection => {
	const accountsWithChainIdentity = [...new Map<string, WalletAccount>(accounts.flatMap((account) => {
		const reference = account.genesisHash?.replace(/^0x/i, '').slice(0, 32).toLowerCase()
		if (reference == null || !/^[0-9a-f]{32}$/.test(reference))
			return []

		const accountAddress = normalizeSs58Account(account.address, reference)

		if (accountAddress == null)
			return []

		return [
			[`${reference}:${accountAddress}`, {
				namespace: 'polkadot',
				reference,
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
		scopes: [
			...new Set(accountsWithChainIdentity.map((account) => account.reference)),
		].map((reference) => ({
			namespace: 'polkadot',
			reference,
			methods: ['enable', 'accounts.get'],
			events: ['accounts.subscribe'],
		})),
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

	return {
		id: 'polkadot-injected-web3',
		start: (updateCandidates) => {
			const candidates = typeof window === 'undefined' ?
				[]
			:
				Object
					.entries(window.injectedWeb3 ?? {})
					.map(([walletKey, wallet]) => {
						walletByWalletId.set(`polkadot:${walletKey}`, wallet)

						return {
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
						}
					})

			updateCandidates(candidates)

			return () => {
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

			extensionByWalletId.set(walletId, extension)
			connectedAtByWalletId.set(walletId, connectedAt)

			return polkadotConnectionFromAccounts(
				walletId,
				await extension.accounts.get(),
				connectedAt
			)
		},
		disconnect: (walletId) => {
			connectedAtByWalletId.delete(walletId)
			extensionByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => {}

			let subscribed = true
			let accountVersion = 0
			let unsubscribe = () => {}
			const subscribeExtension = (
				extension: PolkadotInjectedExtension,
				connectedAt: number,
				readInitialAccounts: boolean
			) => {
				if (!subscribed) return

				unsubscribe = extension.accounts.subscribe((accounts) => {
					accountVersion++
					if (subscribed)
						updateConnection(polkadotConnectionFromAccounts(
							walletId,
							accounts,
							connectedAt
						))
				})
				if (!readInitialAccounts) return

				const initialAccountVersion = accountVersion
				void extension.accounts.get().then((accounts) => {
					if (!subscribed || accountVersion !== initialAccountVersion) return

					updateConnection(polkadotConnectionFromAccounts(
						walletId,
						accounts,
						connectedAt
					))
				}).catch(() => {})
			}
			const extension = extensionByWalletId.get(walletId)
			if (extension == null)
				void wallet.enable('Blockhead').then((restoredExtension) => {
					if (!subscribed) return

					const connectedAt = Date.now()
					extensionByWalletId.set(walletId, restoredExtension)
					connectedAtByWalletId.set(walletId, connectedAt)
					subscribeExtension(
						restoredExtension,
						connectedAt,
						true
					)
				}).catch(() => {})
			else
				subscribeExtension(
					extension,
					connectedAtByWalletId.get(walletId) ?? Date.now(),
					false
				)

			return () => {
				subscribed = false
				unsubscribe()
			}
		},
	}
}
