import { describe, expect, it } from 'vitest'

import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import {
	connectedWalletConnection,
	connectingWalletConnection,
	disconnectedWalletConnection,
} from './walletConnectionState.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
	resolveExecutableWalletRequestPrep,
} from './walletRequestPreparation.ts'


const account = {
	namespace: 'eip155',
	reference: '1',
	accountAddress: '0x1111111111111111111111111111111111111111',
	capabilities: [WalletCapability.SendTransaction],
} as const

const base = {
	walletId: 'eip6963:com.example',
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [{
		namespace: 'eip155',
		reference: '1',
		methods: ['eth_sendTransaction'],
		events: [],
	}],
	accounts: [account],
	activeAccount: account,
} as const

const prepableCalls = [{
	toAddress: '0x2222222222222222222222222222222222222222',
	value: 1n,
	inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
}] as const

const prepRequest = {
	namespace: 'eip155',
	reference: '1',
	accountAddress: account.accountAddress,
	calls: prepableCalls,
} as const

const connectedUnselected = (connectionKey: string) => (
	connectedWalletConnection({
		...base,
		walletId: `eip6963:${connectionKey}`,
		connectionKey,
		selected: false,
	})
)


describe('wallet prep blocked compose', () => {
	it('blocks executable prep with zero Connected wallets and leaves prep-without-send intact', () => {
		expect(resolveExecutableWalletRequestPrep({
			connections: [],
			...prepRequest,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		const disconnected = disconnectedWalletConnection({
			...base,
			connectionKey: 'was-connected',
		})
		expect(disconnected.status).toBe(BlockheadConnectionStatus.Disconnected)
		expect(resolveExecutableWalletRequestPrep({
			connections: [disconnected],
			...prepRequest,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		const connecting = connectingWalletConnection({
			...base,
			connectionKey: 'still-connecting',
		})
		expect(connecting.status).toBe(BlockheadConnectionStatus.Connecting)
		expect(resolveExecutableWalletRequestPrep({
			connections: [connecting],
			...prepRequest,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		expect(isPreparedWalletRequestWithoutSend(preparedWalletRequestObservation())).toBe(true)
	})

	it('blocks executable prep when two Connected wallets exist but none is selected', () => {
		const first = connectedUnselected('conn-a')
		const second = connectedUnselected('conn-b')
		expect(first.status).toBe(BlockheadConnectionStatus.Connected)
		expect(second.status).toBe(BlockheadConnectionStatus.Connected)
		expect(first.selected).toBe(false)
		expect(second.selected).toBe(false)

		expect(resolveExecutableWalletRequestPrep({
			connections: [first, second],
			...prepRequest,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})
		expect(isPreparedWalletRequestWithoutSend(preparedWalletRequestObservation())).toBe(true)
	})

	it('blocks executable prep when the selected wallet lacks SendTransaction capability', () => {
		const signOnlyAccount = {
			...account,
			capabilities: [WalletCapability.SignMessage],
		}
		const selectedWithoutSend = connectedWalletConnection({
			...base,
			connectionKey: 'sign-only',
			accounts: [signOnlyAccount],
			activeAccount: signOnlyAccount,
			selected: true,
		})

		expect(resolveExecutableWalletRequestPrep({
			connections: [selectedWithoutSend],
			...prepRequest,
		})).toEqual({
			ready: false,
			error: 'Selected wallet account does not authorize transaction sending.',
		})
		expect(isPreparedWalletRequestWithoutSend(preparedWalletRequestObservation())).toBe(true)
	})
})
