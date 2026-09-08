import { describe, expect, it } from 'vitest'

import { NetworkNamespace } from '$/constants/Network.ts'
import {
	WalletArchitectureCoverageKind,
	WalletCapability,
	WalletProtocol,
	walletArchitectureCoverageByNetworkNamespace,
	walletConnectionMethods,
} from '$/constants/Wallet.ts'

describe('wallet architecture boundaries', () => {
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

	it('keeps Aptos AIP-62 and Polkadot capabilities truthful to their adapters', () => {
		const aip62 = walletConnectionMethods.find(({ protocol }) => protocol === WalletProtocol.AptosAip62)
		const polkadot = walletConnectionMethods.find(({ protocol }) => protocol === WalletProtocol.PolkadotInjectedWeb3)

		expect(aip62?.capabilities).toEqual(expect.arrayContaining([
			WalletCapability.SignMessage,
		]))
		expect(aip62?.capabilities).not.toContain(WalletCapability.SignTransaction)
		expect(polkadot?.capabilities).toEqual(expect.arrayContaining([
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.Disconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
		]))
		expect(polkadot?.capabilities).not.toContain(WalletCapability.SignMessage)
		expect(polkadot?.capabilities).not.toContain(WalletCapability.SignTransaction)
	})
})
