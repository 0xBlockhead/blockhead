import { describe, expect, it } from 'vitest'

import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { walletConnectionFromPersisted } from './walletConnectionState.ts'
import { resolveWalletTransactionPrepGate } from './walletRequestPreparation.ts'


describe('persisted wallet authority restoration', () => {
	it('keeps disconnected and chain-mismatched history without restoring signing authority', () => {
		const accountAddress = '0x1111111111111111111111111111111111111111'
		const persistedConnections = [
			walletConnectionFromPersisted({
				connectionKey: 'disconnected-mainnet',
				walletId: 'eip6963:history',
				status: BlockheadConnectionStatus.Disconnected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [{
					namespace: 'eip155',
					reference: '1',
					methods: ['eth_sendTransaction'],
					events: [],
				}],
				accounts: [{
					namespace: 'eip155',
					reference: '1',
					accountAddress,
					capabilities: [WalletCapability.SendTransaction],
				}],
				activeAccount: {
					namespace: 'eip155',
					reference: '1',
					accountAddress,
					capabilities: [WalletCapability.SendTransaction],
				},
				selected: true,
				connectedAt: 1_700_000_000_000,
				disconnectedAt: 1_700_000_001_000,
			}),
			walletConnectionFromPersisted({
				connectionKey: 'connected-sepolia',
				walletId: 'eip6963:current',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [{
					namespace: 'eip155',
					reference: '11155111',
					methods: ['eth_sendTransaction'],
					events: [],
				}],
				accounts: [{
					namespace: 'eip155',
					reference: '11155111',
					accountAddress,
					capabilities: [WalletCapability.SendTransaction],
				}],
				activeAccount: {
					namespace: 'eip155',
					reference: '11155111',
					accountAddress,
					capabilities: [WalletCapability.SendTransaction],
				},
				selected: true,
			}),
		]

		expect(persistedConnections).toHaveLength(2)
		expect(persistedConnections[0]).toMatchObject({
			connectionKey: 'disconnected-mainnet',
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [expect.objectContaining({
				reference: '1',
				accountAddress,
			})],
		})
		expect(resolveWalletTransactionPrepGate({
			connections: [persistedConnections[0]],
			namespace: 'eip155',
			reference: '1',
			accountAddress,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})
		expect(resolveWalletTransactionPrepGate({
			connections: persistedConnections,
			namespace: 'eip155',
			reference: '1',
			accountAddress,
		})).toEqual({
			ready: false,
			error: 'Selected wallet account is connected to a different chain.',
		})
	})
})
