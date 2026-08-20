import { describe, expect, it } from 'vitest'

import { NetworkNamespace } from '$/constants/Network.ts'
import {
	WalletArchitectureCoverageKind,
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
})
