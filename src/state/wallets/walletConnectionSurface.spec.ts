import { describe, expect, it } from 'vitest'

import {
	WalletCapability,
	WalletImplementationStatus,
	walletConnectionMethods,
} from '$/constants/Wallet.ts'
import {
	adapterExposesHook,
	assertEveryWalletCapabilityHasSurface,
	catalogCapabilityAccountabilities,
	discoverableStateFromConnection,
	implementedWalletConnectionMethods,
	walletCapabilitySurfaceByCapability,
	walletCapabilitySurfaces,
	WalletCapabilitySurfaceKind,
	walletConnectionMethodAdapterIdByMethodId,
} from './walletConnectionSurface.ts'
import { createEip6963Adapter } from './adapters/eip6963.ts'
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createTonConnectAdapter } from './adapters/tonConnect.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createAptosInjectedAdapter } from './adapters/aptosInjected.ts'
import type { WalletAdapter } from './adapters/types.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'


describe('walletConnectionSurface', () => {
	const assertImplementedAdapterHooks = (
		methodId: string,
		createAdapter: () => WalletAdapter
	) => {
		const adapter = createAdapter()
		const method = walletConnectionMethods.find((entry) => entry.id === methodId)
		expect(method).toBeTruthy()
		for (const capability of method!.capabilities) {
			const surface = walletCapabilitySurfaceByCapability[capability]
			if (surface.kind === WalletCapabilitySurfaceKind.PrepOnly)
				continue
			if (surface.adapterHook == null)
				continue
			expect(
				adapterExposesHook(adapter, surface.adapterHook),
				`${methodId} missing adapter hook ${surface.adapterHook} for ${capability}`
			).toBe(true)
		}
	}

	it('accounts for every WalletCapability', () => {
		expect(() => assertEveryWalletCapabilityHasSurface()).not.toThrow()
		expect(walletCapabilitySurfaces).toHaveLength(Object.values(WalletCapability).length)
	})

	it('marks SignTransaction and SendTransaction as prep-only (Codex: no public EvmTransaction until hash)', () => {
		expect(walletCapabilitySurfaceByCapability[WalletCapability.SignTransaction].kind)
			.toBe(WalletCapabilitySurfaceKind.PrepOnly)
		expect(walletCapabilitySurfaceByCapability[WalletCapability.SendTransaction].kind)
			.toBe(WalletCapabilitySurfaceKind.PrepOnly)
		expect(walletCapabilitySurfaceByCapability[WalletCapability.SignTransaction].runtimeAction)
			.toBe('rejectPreparedTransactionRequest')
		expect(walletCapabilitySurfaceByCapability[WalletCapability.SendTransaction].runtimeAction)
			.toBe('rejectPreparedTransactionRequest')
	})

	it('accounts for every catalog capability on Implemented and DiscoveryImplemented methods', () => {
		for (const method of implementedWalletConnectionMethods()) {
			const accountabilities = catalogCapabilityAccountabilities(method)
			expect(accountabilities.length).toBe(method.capabilities.length)
			for (const accountability of accountabilities) {
				expect(accountability.kind).toBeTruthy()
				expect(accountability.discoverableOn.length).toBeGreaterThan(0)
			}
		}
	})

	it('maps every Implemented method that has a product adapter to an adapter id', () => {
		const implemented = walletConnectionMethods.filter((method) => (
			method.implementationStatus === WalletImplementationStatus.Implemented
		))
		for (const method of implemented) {
			expect(
				walletConnectionMethodAdapterIdByMethodId[method.id as keyof typeof walletConnectionMethodAdapterIdByMethodId],
				`${method.id} missing adapter id mapping`
			).toBeTruthy()
		}
	})

	it('eip6963 adapter exposes executable hooks for non-prep catalog capabilities', () => {
		assertImplementedAdapterHooks('eip6963', createEip6963Adapter)
	})

	it.each([
		['tron-tip6963', createTronInjectedAdapter],
		['tron-tip1193', createTronInjectedAdapter],
		['cardano-cip30', createCardanoCip30Adapter],
		['cosmos-offline-signer', createCosmosOfflineSignerAdapter],
		['ton-connect-injected', createTonConnectAdapter],
		['starknet-wallet-api', createStarknetWalletApiAdapter],
		['polkadot-injected-web3', createPolkadotInjectedWeb3Adapter],
		['bitcoin-injected-globals', createBitcoinInjectedAdapter],
		['aptos-injected-globals', createAptosInjectedAdapter],
	] as const)('%s adapter exposes executable hooks for non-prep catalog capabilities', (
		methodId,
		createAdapter
	) => {
		assertImplementedAdapterHooks(methodId, createAdapter)
	})

	it('projects discoverable connection state (scopes methods/events, accounts, session)', () => {
		const state = discoverableStateFromConnection(
			{
				walletId: 'eip6963:com.example',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				selected: true,
				connectedAt: 1,
				sessionTopic: 'topic-1',
				scopes: [
					{
						namespace: 'eip155',
						reference: '1',
						methods: [
							'personal_sign',
							'eth_signTypedData_v4',
							'wallet_switchEthereumChain',
						],
						events: [
							'accountsChanged',
							'chainChanged',
						],
					},
				],
				accounts: [
					{
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
						capabilities: [
							WalletCapability.SignMessage,
							WalletCapability.SignTypedData,
							WalletCapability.SwitchScope,
						],
					},
				],
				activeAccount: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: [
						WalletCapability.SignMessage,
						WalletCapability.SignTypedData,
						WalletCapability.SwitchScope,
					],
				},
			},
			'eip6963:com.example:eip155:1'
		)

		expect(state).toMatchObject({
			connectionKey: 'eip6963:com.example:eip155:1',
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			sessionTopic: 'topic-1',
			activeAccountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			scopes: [
				{
					namespace: 'eip155',
					reference: '1',
					methods: expect.arrayContaining([
						'personal_sign',
						'eth_signTypedData_v4',
						'wallet_switchEthereumChain',
					]),
					events: expect.arrayContaining([
						'accountsChanged',
						'chainChanged',
					]),
				},
			],
		})
		expect(state.accounts[0]?.capabilities).toEqual(
			expect.arrayContaining([
				WalletCapability.SignMessage,
				WalletCapability.SignTypedData,
				WalletCapability.SwitchScope,
			])
		)
	})

	it('Modeled catalog methods still have capability surfaces without requiring adapter hooks', () => {
		const modeled = walletConnectionMethods.filter((method) => (
			method.implementationStatus === WalletImplementationStatus.Modeled
		))
		expect(modeled.length).toBeGreaterThan(0)
		for (const method of modeled) {
			for (const accountability of catalogCapabilityAccountabilities(method)) {
				expect(walletCapabilitySurfaceByCapability[accountability.capability]).toBeTruthy()
			}
		}
	})

	it('keeps BlockheadWalletCapabilityGrant as a separate authorization entity (not connection account caps)', async () => {
		const { EntityType } = await import('$/schema/EntityType.ts')
		expect(EntityType.BlockheadWalletCapabilityGrant).toBe('BlockheadWalletCapabilityGrant')
		expect(
			Object.values(WalletCapabilitySurfaceKind)
		).not.toContain('grant')
	})
})
