import { afterEach, describe, expect, it, vi } from 'vitest'
import { stringify } from 'devalue'

import { createAptosAip62Adapter } from './adapters/aptosAip62.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createDiscoveryOnlyAdapter } from './adapters/createDiscoveryOnlyAdapter.ts'
import { eipCandidateFromDetail, eipConnectionFromAccounts } from './adapters/eip6963.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createWalletStandardAdapter } from './adapters/walletStandard.ts'
import type { WalletCandidate } from './adapters/types.ts'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { ActionType } from '$/constants/actions.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type MockRow = Record<string, string | number | boolean | object | readonly object[] | undefined>

describe('wallet connection runtime normalization', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
		vi.doUnmock('$/routes/+layout.svelte')
	})

	it('normalizes EIP-6963 provider details into wallet candidates', () => {
		expect(eipCandidateFromDetail({
			info: {
				uuid: 'wallet-uuid',
				name: 'Example Wallet',
				icon: 'data:image/svg+xml,example',
				rdns: 'com.example.wallet',
			},
			provider: {
				request: async () => [],
			},
		})).toMatchObject({
			id: 'eip6963:com.example.wallet',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			rdns: 'com.example.wallet',
		})
	})

	it('normalizes EIP accounts into CAIP-scoped wallet connection rows', () => {
		expect(eipConnectionFromAccounts(
			'eip6963:com.example.wallet',
			[
				'0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			],
			1,
			BlockheadConnectionStatus.Connected,
		)).toMatchObject({
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			scopes: [
				{
					namespace: 'eip155',
					reference: '1',
					methods: expect.arrayContaining(['eth_accounts', 'eth_requestAccounts']),
					events: expect.arrayContaining(['accountsChanged', 'chainChanged']),
				},
			],
			accounts: [
				{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: expect.arrayContaining([WalletCapability.SignMessage]),
				},
			],
		})
	})

	it('returns disconnected rows for discovery-only adapters without prompting', async () => {
		expect(await createDiscoveryOnlyAdapter({
			id: 'test-discovery',
			candidate: {
				protocol: WalletProtocol.CardanoCip30,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: [WalletCapability.Connect],
			},
			getCandidates: () => [
				{
					id: 'cip30:test-wallet',
					name: 'Test Wallet',
					icon: '',
				},
			],
		}).connect('cip30:test-wallet')).toMatchObject({
			walletId: 'cip30:test-wallet',
			status: BlockheadConnectionStatus.Disconnected,
			protocol: WalletProtocol.CardanoCip30,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [],
			accounts: [],
			selected: false,
		})
	})

	it('writes wallet local mutations through the sanctioned mutation boundary', async () => {
		const entityUpserts: MockRow[] = []
		const fieldUpserts: MockRow[] = []
		const countUpserts: MockRow[] = []
		const entityDeletes: string[] = []
		const fieldDeletes: string[] = []
		const countDeletes: string[] = []

		vi.doMock('$/routes/+layout.svelte', () => ({
			entityCollectionByEntityType: {
				[EntityType.BlockheadSessionAction]: {
					delete: (key: string) => entityDeletes.push(key),
					utils: {
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.BlockheadWallet]: {
					utils: {
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.BlockheadWalletAccount]: {
					utils: {
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.BlockheadWalletConnection]: {
					delete: (key: string) => entityDeletes.push(key),
					utils: {
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
					},
				},
			},
			entityFieldCollections: {
				[EntityType.BlockheadSession]: {
					$$actions: {
						delete: (key: string) => fieldDeletes.push(key),
						utils: {
							writeUpsert: (row: MockRow) => fieldUpserts.push(row),
						},
					},
				},
				[EntityType._Global]: {
					$$blockheadWallets: {
						utils: {
							writeUpsert: (row: MockRow) => fieldUpserts.push(row),
						},
					},
					$$blockheadWalletAccounts: {
						utils: {
							writeUpsert: (row: MockRow) => fieldUpserts.push(row),
						},
					},
					$$blockheadWalletConnections: {
						utils: {
							writeUpsert: (row: MockRow) => fieldUpserts.push(row),
						},
					},
				},
			},
			entityFieldCountCollections: {
				[EntityType.BlockheadWalletConnection]: {
					$$connectedAccounts: {
						delete: (key: string) => countDeletes.push(key),
						utils: {
							writeUpsert: (row: MockRow) => countUpserts.push(row),
						},
					},
				},
			},
		}))

		const {
			deleteLocalBlockheadSessionAction,
			deleteLocalBlockheadWalletConnection,
			writeLocalBlockheadSessionAction,
			writeLocalBlockheadWallet,
			writeLocalBlockheadWalletConnection,
		} = await import('$/collections/localMutations.ts')

		writeLocalBlockheadSessionAction(
			{
				id: 'session-1',
			},
			0,
			ActionType.Swap,
		)
		writeLocalBlockheadWallet({
			id: 'eip6963:com.example.wallet',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			capabilities: [
				WalletCapability.Connect,
			],
		})
		writeLocalBlockheadWalletConnection({
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1,
			scopes: [],
			accounts: [
				{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: [
						WalletCapability.SignMessage,
					],
				},
			],
		})
		deleteLocalBlockheadSessionAction(
			{
				id: 'session-1',
			},
			{
				sessionId: 'session-1',
				actionId: 'action-1',
			},
		)
		deleteLocalBlockheadWalletConnection('eip6963:com.example.wallet')

		const sessionSelectorKey = stringify({ id: 'session-1' })
		const deletedSessionActionSelectorKey = stringify({
			sessionId: 'session-1',
			actionId: 'action-1',
		})
		const walletSelectorKey = stringify({ id: 'eip6963:com.example.wallet' })
		const walletAccountSelectorKey = stringify({
			caip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
		})
		const walletConnectionSelectorKey = stringify({
			$wallet: {
				id: 'eip6963:com.example.wallet',
			},
		})

		expect(entityUpserts).toEqual([
			expect.objectContaining({
				[EntityMetaKey.SelectorKey]: expect.stringMatching(/session-1/),
				[EntityMetaKey.Source]: Source.Local_Internal,
				action: expect.objectContaining({
					type: ActionType.Swap,
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					id: 'eip6963:com.example.wallet',
				},
				[EntityMetaKey.SelectorKey]: walletSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					caip10: {
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					},
				},
				[EntityMetaKey.SelectorKey]: walletAccountSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$wallet: {
						id: 'eip6963:com.example.wallet',
					},
				},
				[EntityMetaKey.SelectorKey]: walletConnectionSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				$$connectedAccounts: [
					{
						[EntityMetaKey.Selector]: {
							caip10: {
								namespace: 'eip155',
								reference: '1',
								accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
							},
						},
					},
				],
			}),
		])
		expect(fieldUpserts.map((row) => row[EntityMetaKey.Source])).toEqual([
			Source.Local_Internal,
			Source.Local_Internal,
			Source.Local_Internal,
			Source.Local_Internal,
		])
		expect(fieldUpserts).toEqual([
			expect.objectContaining({
				fieldName: '$$actions',
				[EntityMetaKey.ParentSelectorKey]: sessionSelectorKey,
				valueKey: expect.stringMatching(/^Entity:/),
			}),
			expect.objectContaining({
				fieldName: '$$blockheadWallets',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						id: 'eip6963:com.example.wallet',
					},
					[EntityMetaKey.SelectorKey]: walletSelectorKey,
				},
				valueKey: `Entity:${stringify(walletSelectorKey)}`,
			}),
			expect.objectContaining({
				fieldName: '$$blockheadWalletAccounts',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						caip10: {
							namespace: 'eip155',
							reference: '1',
							accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
						},
					},
					[EntityMetaKey.SelectorKey]: walletAccountSelectorKey,
				},
				valueKey: `Entity:${stringify(walletAccountSelectorKey)}`,
			}),
			expect.objectContaining({
				fieldName: '$$blockheadWalletConnections',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						$wallet: {
							id: 'eip6963:com.example.wallet',
						},
					},
					[EntityMetaKey.SelectorKey]: walletConnectionSelectorKey,
				},
				valueKey: `Entity:${stringify(walletConnectionSelectorKey)}`,
			}),
		])
		expect(countUpserts).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.ParentSelectorKey]: walletConnectionSelectorKey,
				[EntityMetaKey.Value]: 1,
				fieldName: '$$connectedAccounts',
				filterKey: stringify({}),
			}),
		])
		expect(entityDeletes).toEqual([
			stringify([
				Source.Local_Internal,
				deletedSessionActionSelectorKey,
			]),
			stringify([
				Source.Local_Internal,
				walletConnectionSelectorKey,
			]),
		])
		expect(fieldDeletes).toEqual([
			stringify([
				Source.Local_Internal,
				sessionSelectorKey,
				`Entity:${stringify(deletedSessionActionSelectorKey)}`,
			]),
		])
		expect(countDeletes).toEqual([
			stringify([
				Source.Local_Internal,
				walletConnectionSelectorKey,
				stringify({}),
			]),
		])
	})

	it('discovers Aptos injected signer globals without connecting', () => {
		vi.stubGlobal('window', {
			aptos: {},
			martian: {},
			pontem: {},
		})

			const updates: WalletCandidate[][] = []
		const cleanup = createAptosAip62Adapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'aptos:petra',
				name: 'Petra',
				protocol: WalletProtocol.AptosAip62,
			}),
			expect.objectContaining({
				id: 'aptos:martian',
				name: 'Martian',
				protocol: WalletProtocol.AptosAip62,
			}),
			expect.objectContaining({
				id: 'aptos:pontem',
				name: 'Pontem',
				protocol: WalletProtocol.AptosAip62,
			}),
		])

		cleanup()
	})

	it('connects Cardano CIP-30 wallets into CAIP-style account rows', async () => {
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					name: 'Nami',
					icon: 'nami-icon',
					enable: async () => ({
						getNetworkId: async () => 1,
						getUnusedAddresses: async () => ['addr_unused'],
						getUsedAddresses: async () => ['addr_used'],
					}),
				},
			},
		})

		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		expect(await adapter.connect('cip30:nami')).toMatchObject({
			walletId: 'cip30:nami',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.CardanoCip30,
			accounts: [
				{
					namespace: 'cardano',
					reference: '1',
					accountAddress: 'addr_used',
				},
				{
					namespace: 'cardano',
					reference: '1',
					accountAddress: 'addr_unused',
				},
			],
			scopes: [
				expect.objectContaining({
					namespace: 'cardano',
					reference: '1',
				}),
			],
		})
	})

	it('connects Polkadot injectedWeb3 wallets into CAIP-style account rows', async () => {
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: {
					enable: async () => ({
						accounts: {
							get: async () => [
								{ address: '15abc' },
							],
						},
					}),
				},
			},
		})

		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})

		expect(await adapter.connect('polkadot:polkadotjs')).toMatchObject({
			walletId: 'polkadot:polkadotjs',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.PolkadotInjectedWeb3,
			accounts: [
				{
					namespace: 'polkadot',
					reference: '0',
					accountAddress: '15abc',
				},
			],
			scopes: [
				expect.objectContaining({
					namespace: 'polkadot',
					reference: '0',
				}),
			],
		})
	})

	it('discovers Bitcoin injected signer globals without connecting', () => {
		vi.stubGlobal('window', {
			LeatherProvider: {},
			magicEden: {
				bitcoin: {},
			},
			unisat: {},
			XverseProviders: {},
		})

			const updates: WalletCandidate[][] = []
		const cleanup = createBitcoinInjectedAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'bitcoin:leather',
				name: 'Leather',
				protocol: WalletProtocol.SatsConnect,
			}),
			expect.objectContaining({
				id: 'bitcoin:xverse',
				name: 'Xverse',
				protocol: WalletProtocol.SatsConnect,
			}),
			expect.objectContaining({
				id: 'bitcoin:unisat',
				name: 'UniSat',
				protocol: WalletProtocol.SatsConnect,
			}),
			expect.objectContaining({
				id: 'bitcoin:magiceden',
				name: 'Magic Eden',
				protocol: WalletProtocol.SatsConnect,
			}),
		])

		cleanup()
	})

	it('discovers Cosmos injected signer globals without connecting', () => {
		vi.stubGlobal('window', {
			keplr: {},
			leap: {},
		})

			const updates: WalletCandidate[][] = []
		const cleanup = createCosmosOfflineSignerAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'cosmos:keplr',
				name: 'Keplr',
				protocol: WalletProtocol.CosmosOfflineSigner,
			}),
			expect.objectContaining({
				id: 'cosmos:leap',
				name: 'Leap',
				protocol: WalletProtocol.CosmosOfflineSigner,
			}),
		])

		cleanup()
	})

	it('discovers Starknet injected wallet globals without connecting', () => {
		vi.stubGlobal('window', {
			starknet_argentX: {},
			starknet_braavos: {},
		})

			const updates: WalletCandidate[][] = []
		const cleanup = createStarknetWalletApiAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'starknet:argentx',
				name: 'Argent X',
				protocol: WalletProtocol.StarknetWalletApi,
			}),
			expect.objectContaining({
				id: 'starknet:braavos',
				name: 'Braavos',
				protocol: WalletProtocol.StarknetWalletApi,
			}),
		])

		cleanup()
	})

	it('discovers Wallet Standard candidates through register-wallet events', () => {
		const eventListeners = new Map<string, (event: Event) => void>()
		vi.stubGlobal('window', {
			addEventListener: (eventName: string, listener: (event: Event) => void) => {
				eventListeners.set(eventName, listener)
			},
			removeEventListener: (eventName: string) => {
				eventListeners.delete(eventName)
			},
			dispatchEvent: (event: Event) => {
				eventListeners.get(event.type)?.(event)
				return true
			},
		})

		const adapter = createWalletStandardAdapter()
			const updates: WalletCandidate[][] = []
		const cleanup = adapter.start((candidates) => {
			updates.push(candidates)
		})

		globalThis.window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
			detail: {
				register: (register: (wallet: { name: string, icon?: string }) => void) => {
					register({
						name: 'Standard Wallet',
						icon: 'standard-icon',
					})
				},
			},
		}))

		expect(updates.at(-1)).toContainEqual(expect.objectContaining({
			id: 'wallet-standard:Standard Wallet',
			name: 'Standard Wallet',
			icon: 'standard-icon',
			protocol: WalletProtocol.WalletStandard,
		}))

		cleanup()
	})
})
