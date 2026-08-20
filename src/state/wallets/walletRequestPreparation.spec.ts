import { describe, expect, it } from 'vitest'

import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import {
	connectedWalletConnection,
	connectingWalletConnection,
	withExclusiveWalletConnectionSelection,
} from './walletConnectionState.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
	resolveExecutableWalletRequestPrep,
	resolveWalletPrepSelection,
	resolveWalletRequestCallsPreparation,
	resolveWalletTransactionPrepGate,
	selectedConnectedWalletConnections,
	walletPrepSelectionKey,
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

describe('walletRequestPreparation', () => {
	it('requires exactly one Connected+selected wallet before prep binding', () => {
		expect(resolveWalletPrepSelection([])).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})
		expect(resolveWalletPrepSelection([
			connectingWalletConnection(base),
			connectedWalletConnection({
				...base,
				connectionKey: 'unselected',
				selected: false,
			}),
		])).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		const exclusive = withExclusiveWalletConnectionSelection([
			connectedWalletConnection({
				...base,
				connectionKey: 'older',
				selected: true,
			}),
			connectedWalletConnection({
				...base,
				walletId: 'eip6963:other',
				connectionKey: 'newer',
				selected: true,
			}),
		])
		expect(selectedConnectedWalletConnections(exclusive)).toHaveLength(1)
		expect(resolveWalletPrepSelection(exclusive)).toEqual({
			ready: true,
			connection: expect.objectContaining({
				connectionKey: 'newer',
				selected: true,
				status: BlockheadConnectionStatus.Connected,
			}),
			connectionKey: 'newer',
			account,
		})
	})

	it('blocks prep when the selected connection lacks a bindable connectionKey', () => {
		expect(resolveWalletPrepSelection([
			connectedWalletConnection({
				...base,
				selected: true,
			}),
		])).toEqual({
			ready: false,
			error: 'Selected wallet connection has no connectionKey for request binding.',
		})
		expect(resolveWalletPrepSelection([
			connectedWalletConnection({
				...base,
				connectionKey: '   ',
				selected: true,
			}),
		])).toEqual({
			ready: false,
			error: 'Selected wallet connection has no connectionKey for request binding.',
		})
	})

	it('blocks prep when Connected selection has no active account', () => {
		expect(resolveWalletPrepSelection([
			connectedWalletConnection({
				...base,
				connectionKey: 'selected',
				accounts: [],
				activeAccount: undefined,
				selected: true,
			}),
		])).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		expect(resolveWalletPrepSelection([
			{
				...base,
				connectionKey: 'selected',
				status: BlockheadConnectionStatus.Connected,
				selected: true,
				activeAccount: undefined,
			},
		])).toEqual({
			ready: false,
			error: 'Selected wallet connection has no active account.',
		})

		expect(resolveWalletPrepSelection([
			{
				...base,
				connectionKey: 'selected',
				status: BlockheadConnectionStatus.Connected,
				selected: true,
				accounts: [account],
				activeAccount: {
					...account,
					accountAddress: '0x9999999999999999999999999999999999999999',
				},
			},
		])).toEqual({
			ready: false,
			error: 'Selected wallet connection has no active account.',
		})
	})

	it('gates transaction prep on sender, capability, and eth_sendTransaction scope without sending', () => {
		const selected = connectedWalletConnection({
			...base,
			connectionKey: 'selected',
			selected: true,
		})
		expect(resolveWalletTransactionPrepGate({
			connections: [selected],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: true,
			connection: selected,
			connectionKey: 'selected',
			account,
			requestMethod: 'eth_sendTransaction',
			capability: WalletCapability.SendTransaction,
		})
		expect(walletPrepSelectionKey({
			ready: true,
			connection: selected,
			connectionKey: 'selected',
			account,
		})).toBe('selected')

		expect(resolveWalletTransactionPrepGate({
			connections: [selected],
			namespace: 'eip155',
			reference: '10',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: false,
			error: 'Selected wallet account is connected to a different chain.',
		})

		expect(resolveWalletTransactionPrepGate({
			connections: [selected],
			namespace: 'solana',
			reference: '1',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: false,
			error: 'Selected wallet account is not a solana account.',
		})

		expect(resolveWalletTransactionPrepGate({
			connections: [selected],
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0x9999999999999999999999999999999999999999',
		})).toEqual({
			ready: false,
			error: 'Selected wallet account does not match the request sender.',
		})

		const withoutCapability = connectedWalletConnection({
			...base,
			connectionKey: 'selected',
			selected: true,
			accounts: [{
				...account,
				capabilities: [WalletCapability.SignMessage],
			}],
			activeAccount: {
				...account,
				capabilities: [WalletCapability.SignMessage],
			},
		})
		expect(resolveWalletTransactionPrepGate({
			connections: [withoutCapability],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: false,
			error: 'Selected wallet account does not authorize transaction sending.',
		})

		const withoutScope = connectedWalletConnection({
			...base,
			connectionKey: 'selected',
			selected: true,
			scopes: [{
				namespace: 'eip155',
				reference: '1',
				methods: ['personal_sign'],
				events: [],
			}],
		})
		expect(resolveWalletTransactionPrepGate({
			connections: [withoutScope],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: false,
			error: 'Selected wallet scope does not authorize eth_sendTransaction on the request chain.',
		})
	})

	it('requires ordered BlockheadWalletRequestCall rows for executable prep', () => {
		expect(resolveWalletRequestCallsPreparation([])).toEqual({
			ready: false,
			error: 'Wallet request preparation requires at least one BlockheadWalletRequestCall.',
		})
		expect(resolveWalletRequestCallsPreparation([
			{
				toAddress: '0x2222222222222222222222222222222222222222',
				value: 1n,
				inputDataHash: '',
			},
		])).toEqual({
			ready: false,
			error: 'Each BlockheadWalletRequestCall requires a non-empty inputDataHash.',
		})
		expect(resolveWalletRequestCallsPreparation([
			{
				toAddress: '0x2222222222222222222222222222222222222222',
				value: 1n,
				inputDataHash: '   ',
			},
		])).toEqual({
			ready: false,
			error: 'Each BlockheadWalletRequestCall requires a non-empty inputDataHash.',
		})
		expect(resolveWalletRequestCallsPreparation([
			{
				toAddress: '0x2222222222222222222222222222222222222222',
				value: 1n,
				inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			},
			{
				inputDataHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
			},
		])).toEqual({
			ready: true,
			calls: [
				{
					toAddress: '0x2222222222222222222222222222222222222222',
					value: 1n,
					inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				},
				{
					inputDataHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
				},
			],
		})
	})

	it('orchestrates gate + call batch into executable prep-without-send', () => {
		const selected = connectedWalletConnection({
			...base,
			connectionKey: 'selected',
			selected: true,
		})
		const calls = [{
			toAddress: '0x2222222222222222222222222222222222222222',
			value: 1n,
			inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		}] as const

		const executable = resolveExecutableWalletRequestPrep({
			connections: [selected],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
			calls,
		})
		expect(executable).toMatchObject({
			ready: true,
			gate: {
				connectionKey: 'selected',
				requestMethod: 'eth_sendTransaction',
				capability: WalletCapability.SendTransaction,
			},
			calls,
		})
		if (!executable.ready)
			throw new Error('expected executable prep')
		expect(isPreparedWalletRequestWithoutSend(executable.observation)).toBe(true)
		expect(executable.observation).not.toHaveProperty('submittedAt')
		expect(executable.observation).not.toHaveProperty('evmTransactionIds')

		expect(resolveExecutableWalletRequestPrep({
			connections: [selected],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
			calls: [{
				...calls[0],
				inputDataHash: '\t',
			}],
		})).toEqual({
			ready: false,
			error: 'Each BlockheadWalletRequestCall requires a non-empty inputDataHash.',
		})
	})

	it('marks prepared wallet requests as complete without send or public EvmTransaction ids', () => {
		expect(preparedWalletRequestObservation()).toEqual({
			status: 'prepared',
		})
		expect(preparedWalletRequestObservation()).not.toHaveProperty('submittedAt')
		expect(isPreparedWalletRequestWithoutSend({
			status: 'prepared',
		})).toBe(true)
		expect(isPreparedWalletRequestWithoutSend({
			status: 'prepared',
			submittedAt: 1,
		})).toBe(false)
		expect(isPreparedWalletRequestWithoutSend({
			status: 'prepared',
			evmTransactionIds: ['0xdead'],
		})).toBe(false)
		expect(isPreparedWalletRequestWithoutSend({
			status: 'signed',
		})).toBe(false)
	})
})
