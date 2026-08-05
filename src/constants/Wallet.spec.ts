import { describe, expect, it } from 'vitest'

import { NetworkNamespace } from '$/constants/Network.ts'
import {
	WalletArchitectureCoverageKind,
	WalletCapability,
	WalletImplementationStatus,
	walletArchitectureCoverageByNetworkNamespace,
	walletConnectionMethodById,
	walletConnectionMethods,
} from '$/constants/Wallet.ts'


const mountAndConnectProvenMethodIds = [
	'aptos-aip62',
	'bitcoin-injected-globals',
	'starknet-wallet-api',
	'ton-connect-injected',
	'tron-tip1193',
	'tron-tip6963',
	'wallet-standard',
	'walletconnect-v2',
] as const


describe('wallet connection method implementation status', () => {
	it('marks mounted adapters with proven connect as Implemented', () => {
		expect(
			mountAndConnectProvenMethodIds.map((id) => ({
				id,
				implementationStatus: walletConnectionMethodById[id].implementationStatus,
				hasConnect: walletConnectionMethodById[id].capabilities.includes(WalletCapability.Connect),
			}))
		).toEqual(
			mountAndConnectProvenMethodIds.map((id) => ({
				id,
				implementationStatus: WalletImplementationStatus.Implemented,
				hasConnect: true,
			}))
		)
	})

	it('leaves modeled-only and discovery-only methods outside the proven mount+connect set', () => {
		expect(
			walletConnectionMethods
				.filter((method) => (
					!mountAndConnectProvenMethodIds.includes(method.id as typeof mountAndConnectProvenMethodIds[number])
					&& method.implementationStatus === WalletImplementationStatus.Implemented
				))
				.map(({ id }) => id)
				.sort()
		).toEqual([
			'aptos-injected-globals',
			'cardano-cip30',
			'cosmos-offline-signer',
			'eip6963',
			'polkadot-injected-web3',
		])

		expect(walletConnectionMethodById['sats-connect'].implementationStatus).toBe(
			WalletImplementationStatus.Modeled
		)
		expect(walletConnectionMethodById['ton-connect'].implementationStatus).toBe(
			WalletImplementationStatus.Modeled
		)
		expect(walletConnectionMethodById['eip1193-legacy'].implementationStatus).toBe(
			WalletImplementationStatus.Modeled
		)
	})

	it('keeps WalletConnect catalog claims within executable runtime authority', () => {
		expect(walletConnectionMethodById['walletconnect-v2']).toMatchObject({
			caipNamespaces: [
				'eip155',
				'solana',
			],
			capabilities: [
				WalletCapability.Connect,
				WalletCapability.Reconnect,
				WalletCapability.Disconnect,
				WalletCapability.ListAccounts,
				WalletCapability.WatchAccounts,
				WalletCapability.WatchScopes,
				WalletCapability.SignMessage,
			],
		})
	})

	it('keeps Lightning architecture-only and out of wallet connection methods', () => {
		expect(walletArchitectureCoverageByNetworkNamespace[NetworkNamespace.Lightning]).toMatchObject({
			coverageKind: WalletArchitectureCoverageKind.ArchitectureOnly,
			connectionProtocol: 'lightning-node',
		})
		expect(
			walletConnectionMethods.some((method) => (
				method.networkNamespaces.includes(NetworkNamespace.Lightning)
			))
		).toBe(false)
	})
})
