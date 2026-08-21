import { describe, expect, it } from 'vitest'

import {
	WalletCapability,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { discoverableStateFromConnection } from './walletConnectionSurface.ts'


describe('walletConnectionSurface', () => {
	it('projects discoverable scopes, accounts, capabilities, and session state', () => {
		const account = {
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			capabilities: [
				WalletCapability.SignMessage,
				WalletCapability.SignTypedData,
				WalletCapability.SwitchScope,
			],
		}
		const state = discoverableStateFromConnection({
			walletId: 'eip6963:com.example',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1,
			sessionTopic: 'topic-1',
			scopes: [{
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
			}],
			accounts: [account],
			activeAccount: account,
		}, 'eip6963:com.example:eip155:1')

		expect(state).toMatchObject({
			connectionKey: 'eip6963:com.example:eip155:1',
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			sessionTopic: 'topic-1',
			activeAccountAddress: account.accountAddress,
			scopes: [{
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
			}],
		})
		expect(state.accounts[0]?.capabilities).toEqual(expect.arrayContaining(account.capabilities))
	})
})
