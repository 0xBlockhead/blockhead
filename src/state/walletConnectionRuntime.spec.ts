import { afterEach, describe, expect, it, vi } from 'vitest'

import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletImplementationStatus,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethodById,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createAptosAip62Adapter } from './wallets/adapters/aptosAip62.ts'
import { createBitcoinInjectedAdapter } from './wallets/adapters/bitcoinInjected.ts'
import { createStarknetWalletApiAdapter } from './wallets/adapters/starknetWalletApi.ts'
import { createTonConnectAdapter } from './wallets/adapters/tonConnect.ts'
import { createTronInjectedAdapter } from './wallets/adapters/tronInjected.ts'
import {
	createWalletConnectV2Adapter,
	type WalletConnectV2Client,
	type WalletConnectV2ClientEvent,
	type WalletConnectV2Session,
} from './wallets/adapters/walletConnectV2.ts'
import { createWalletStandardAdapter } from './wallets/adapters/walletStandard.ts'
import type { WalletCandidate } from './wallets/adapters/types.ts'


afterEach(() => {
	vi.useRealTimers()
	vi.unstubAllGlobals()
})


describe('wallet catalog status vs active runtime mount+connect', () => {
	it('keeps reconciled connection methods Implemented only when adapters mount with Connect', () => {
		for (const id of [
			'aptos-aip62',
			'bitcoin-injected-globals',
			'starknet-wallet-api',
			'ton-connect-injected',
			'tron-tip1193',
			'tron-tip6963',
			'wallet-standard',
			'walletconnect-v2',
		] as const) {
			expect(walletConnectionMethodById[id]).toMatchObject({
				implementationStatus: WalletImplementationStatus.Implemented,
				capabilities: expect.arrayContaining([WalletCapability.Connect]),
			})
		}
	})

	it('connects TRON TIP-6963 and TIP-1193 candidates through the mounted injected adapter', async () => {
		const tip6963Address = 'TZ5XixnRyraxJJy996Q1sip85PHWuj4793'
		const tip1193Address = 'TRKb2nAnCBfwxnLxgoKJro6VbyA6QmsuXq'
		const windowListeners = new Map<string, (event: Event) => void>()
		const tip6963Provider = {
			request: vi.fn(async ({ method }: { method: string }) => (
				method === 'eth_chainId' ? '0x2b6653dc' : [tip6963Address]
			)),
			on: () => {},
			removeListener: () => {},
		}
		const tip1193Provider = {
			request: vi.fn(async ({ method }: { method: string }) => (
				method === 'eth_chainId' ? '0x2b6653dc' : [tip1193Address]
			)),
			on: () => {},
			removeListener: () => {},
		}

		vi.stubGlobal('window', {
			addEventListener: (eventName: string, listener: (event: Event) => void) => {
				windowListeners.set(eventName, listener)
			},
			removeEventListener: (eventName: string) => {
				windowListeners.delete(eventName)
			},
			dispatchEvent: () => true,
			setTimeout,
			clearTimeout,
		})

		const tip6963Candidates: WalletCandidate[][] = []
		const tip6963Adapter = createTronInjectedAdapter()
		const stopTip6963 = tip6963Adapter.start((candidates) => tip6963Candidates.push(candidates))
		windowListeners.get('TIP6963:announceProvider')?.(new CustomEvent('TIP6963:announceProvider', {
			detail: {
				info: {
					uuid: 'tronlink',
					name: 'TronLink',
					icon: '',
					rdns: 'org.tronlink.wallet',
				},
				provider: tip6963Provider,
			},
		}))

		expect(tip6963Candidates.at(-1)?.[0]).toMatchObject({
			id: 'tron-tip6963:tronlink',
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		})
		await expect(tip6963Adapter.connect('tron-tip6963:tronlink')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.TronTip1193,
			accounts: [expect.objectContaining({ accountAddress: tip6963Address })],
		})
		stopTip6963()

		vi.stubGlobal('window', {
			tronLink: tip1193Provider,
			addEventListener: undefined,
			setTimeout,
			clearTimeout,
		})
		const tip1193Candidates: WalletCandidate[][] = []
		const tip1193Adapter = createTronInjectedAdapter()
		const stopTip1193 = tip1193Adapter.start((candidates) => tip1193Candidates.push(candidates))

		expect(tip1193Candidates.at(-1)?.[0]).toMatchObject({
			id: 'tron:injected',
			discoveryKind: WalletDiscoveryKind.InjectedGlobal,
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		})
		await expect(tip1193Adapter.connect('tron:injected')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.TronTip1193,
			accounts: [expect.objectContaining({ accountAddress: tip1193Address })],
		})
		stopTip1193()
	})

	it('connects Aptos AIP-62, Wallet Standard, TON Connect injected, Starknet, and Bitcoin injected globals', async () => {
		const eventTarget = new EventTarget()
		vi.stubGlobal('window', Object.assign(eventTarget, {
			setTimeout,
			clearTimeout,
		}))
		const aptosAccount = {
			address: '0xa11ce',
		}
		const aptosNetwork = {
			name: 'mainnet',
			chainId: 1,
		}
		const aptosAdapter = createAptosAip62Adapter()
		const aptosCandidates: WalletCandidate[][] = []
		const stopAptos = aptosAdapter.start((candidates) => aptosCandidates.push(candidates))
		const standardAdapter = createWalletStandardAdapter()
		const standardCandidates: WalletCandidate[][] = []
		const stopStandard = standardAdapter.start((candidates) => standardCandidates.push(candidates))
		eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
			detail: (registry: {
				register(...wallets: {
					name: string
					icon: string
					accounts: unknown[]
					features: Record<string, object>
				}[]): void
			}) => {
				registry.register({
					name: 'Petra',
					icon: '',
					accounts: [],
					features: {
						'aptos:connect': {
							version: '1.0.0',
							connect: async () => ({
								status: 'Approved',
								args: aptosAccount,
							}),
						},
						'aptos:disconnect': {
							version: '1.0.0',
							disconnect: async () => {},
						},
						'aptos:account': {
							version: '1.0.0',
							account: async () => aptosAccount,
						},
						'aptos:network': {
							version: '1.0.0',
							network: async () => aptosNetwork,
						},
						'aptos:onAccountChange': {
							version: '1.0.0',
							onAccountChange: async () => {},
						},
						'aptos:onNetworkChange': {
							version: '1.0.0',
							onNetworkChange: async () => {},
						},
						'aptos:signMessage': {
							version: '1.0.0',
							signMessage: async () => ({}),
						},
						'aptos:signTransaction': {
							version: '1.0.0',
							signTransaction: async () => ({}),
						},
					},
				})
			},
		}))
		expect(aptosCandidates.at(-1)?.[0]).toMatchObject({
			id: 'aptos-aip62:Petra',
			protocol: WalletProtocol.AptosAip62,
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		})
		expect(standardCandidates.at(-1) ?? []).not.toContainEqual(expect.objectContaining({
			name: 'Petra',
		}))
		await expect(aptosAdapter.connect('aptos-aip62:Petra')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.AptosAip62,
			accounts: [
				expect.objectContaining({
					namespace: 'aptos',
					reference: '1',
					accountAddress: '0x00000000000000000000000000000000000000000000000000000000000a11ce',
				}),
			],
		})
		stopAptos()

		eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
			detail: (registry: {
				register(...wallets: {
					name: string
					icon: string
					accounts: unknown[]
					features: Record<string, object>
				}[]): void
			}) => {
				registry.register({
					name: 'Standard Wallet',
					icon: '',
					accounts: [],
					features: {
						'standard:connect': {
							version: '1.0.0',
							connect: async () => ({
								accounts: [{
									address: '11111111111111111111111111111111',
									chains: ['solana:mainnet'],
									features: [],
								}],
							}),
						},
						'standard:events': {
							version: '1.0.0',
							on: () => () => {},
						},
					},
				})
			},
		}))
		expect(standardCandidates.at(-1)?.[0]).toMatchObject({
			id: 'wallet-standard:Standard Wallet',
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		})
		await expect(standardAdapter.connect('wallet-standard:Standard Wallet')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.WalletStandard,
		})
		stopStandard()

		vi.stubGlobal('window', {
			location: { origin: 'https://blockhead.info' },
			tonkeeper: {
				tonconnect: {
					connect: vi.fn(async () => ({
						event: 'connect',
						payload: {
							items: [{
								name: 'ton_addr',
								address: `0:${'ab'.repeat(32)}`,
								network: '-239',
							}],
						},
					})),
					restoreConnection: vi.fn(async () => ({
						event: 'disconnect',
						payload: {},
					})),
					send: vi.fn(async () => ({})),
					listen: vi.fn(() => () => {}),
				},
			},
		})
		const tonAdapter = createTonConnectAdapter()
		tonAdapter.start(() => {})
		await expect(tonAdapter.connect('ton-connect:tonkeeper')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.TonConnect,
			transportKind: WalletTransportKind.InjectedProvider,
		})

		vi.stubGlobal('window', {
			starknet_argentX: {
				id: 'argentX',
				name: 'Argent X',
				icon: '',
				request: vi.fn(async (call: { type: string }) => (
					call.type === 'wallet_requestAccounts' ?
						['0x1234']
					:
						'0x534e5f4d41494e'
				)),
				on: () => {},
				off: () => {},
			},
		})
		const starknetAdapter = createStarknetWalletApiAdapter()
		starknetAdapter.start(() => {})
		await expect(starknetAdapter.connect('starknet:argentx')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.StarknetWalletApi,
		})

		vi.stubGlobal('window', {
			unisat: {
				requestAccounts: vi.fn(async () => ['bc1qqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5fcj4z3']),
				getAccounts: vi.fn(async () => ['bc1qqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5fcj4z3']),
				getChain: vi.fn(async () => ({
					enum: 'BITCOIN_MAINNET',
					name: 'Bitcoin Mainnet',
					network: 'livenet',
				})),
				on: () => {},
				removeListener: () => {},
			},
		})
		const bitcoinAdapter = createBitcoinInjectedAdapter()
		const bitcoinCandidates: WalletCandidate[][] = []
		bitcoinAdapter.start((candidates) => bitcoinCandidates.push(candidates))
		expect(bitcoinCandidates[0]?.[0]).toMatchObject({
			id: 'bitcoin:unisat',
			protocol: WalletProtocol.BitcoinInjected,
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		})
		await expect(bitcoinAdapter.connect('bitcoin:unisat')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.BitcoinInjected,
		})
	})

	it('mounts and connects WalletConnect v2 through the active Sign Client adapter boundary', async () => {
		const session = {
			topic: 'session-topic',
			expiry: Math.floor(Date.now() / 1_000) + 3_600,
			namespaces: {
				eip155: {
					accounts: ['eip155:1:0x1111111111111111111111111111111111111111'],
					chains: ['eip155:1'],
					methods: ['personal_sign'],
					events: ['accountsChanged'],
				},
			},
		} satisfies WalletConnectV2Session
		const listeners = new Set<(event: WalletConnectV2ClientEvent) => void>()
		const approval = Promise.withResolvers<WalletConnectV2Session>()
		const client = {
			connect: vi.fn(async () => ({
				uri: 'wc:proposal@2',
				approval: () => approval.promise,
			})),
			disconnect: vi.fn(async () => {}),
			session: {
				getAll: () => [],
			},
			listen: vi.fn((listener: (event: WalletConnectV2ClientEvent) => void) => {
				listeners.add(listener)
				return () => listeners.delete(listener)
			}),
		} satisfies WalletConnectV2Client

		const candidates: WalletCandidate[][] = []
		const adapter = createWalletConnectV2Adapter({
			client,
			requestedScopes: [{
				namespace: 'eip155',
				reference: '1',
				methods: ['personal_sign'],
				events: ['accountsChanged'],
			}],
		})
		const stop = adapter.start((nextCandidates) => candidates.push(nextCandidates))
		const connection = adapter.connect('walletconnect-v2')

		await vi.waitFor(() => expect(candidates.at(-1)?.[0]).toMatchObject({
			id: 'walletconnect-v2',
			connectionUri: 'wc:proposal@2',
			capabilities: expect.arrayContaining([WalletCapability.Connect]),
		}))
		approval.resolve(session)
		await expect(connection).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			walletId: 'walletconnect-v2',
			protocol: WalletProtocol.WalletConnectV2,
			transportKind: WalletTransportKind.WalletConnectRelay,
		})
		stop()
	})
})
