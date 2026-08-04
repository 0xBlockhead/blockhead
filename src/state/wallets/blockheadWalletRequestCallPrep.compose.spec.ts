import { describe, expect, it } from 'vitest'

import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import {
	draftSessionLifecycle,
	isEditableSessionLifecycle,
	lockSessionLifecycle,
	unlockSessionLifecycle,
} from '$/state/sessions/sessionLifecycleState.ts'
import { connectedWalletConnection } from './walletConnectionState.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
	resolveWalletRequestCallsPreparation,
	resolveWalletTransactionPrepGate,
} from './walletRequestPreparation.ts'


const account = {
	namespace: 'eip155',
	reference: '1',
	accountAddress: '0x1111111111111111111111111111111111111111',
	capabilities: [WalletCapability.SendTransaction],
} as const

const connectionKey = 'call-prep-conn'

const selectedConnection = connectedWalletConnection({
	walletId: 'eip6963:com.example',
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	connectionKey,
	scopes: [{
		namespace: 'eip155',
		reference: '1',
		methods: ['eth_sendTransaction'],
		events: [],
	}],
	accounts: [account],
	activeAccount: account,
	selected: true,
})

const firstCallHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const secondCallHash = '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'

const orderedCalls = [
	{
		toAddress: '0x2222222222222222222222222222222222222222',
		value: 1n,
		inputDataHash: firstCallHash,
	},
	{
		toAddress: '0x3333333333333333333333333333333333333333',
		value: 2n,
		inputDataHash: secondCallHash,
	},
] as const

const resolveExecutableWalletRequestPrep = (
	connections: readonly ReturnType<typeof connectedWalletConnection>[],
	calls: Parameters<typeof resolveWalletRequestCallsPreparation>[0],
) => {
	const gate = resolveWalletTransactionPrepGate({
		connections,
		namespace: 'eip155',
		reference: '1',
		accountAddress: account.accountAddress,
	})
	if (!gate.ready)
		return gate

	const callBatch = resolveWalletRequestCallsPreparation(calls)
	if (!callBatch.ready)
		return callBatch

	return {
		ready: true as const,
		gate,
		calls: callBatch.calls,
		observation: preparedWalletRequestObservation(),
	}
}


describe('BlockheadWalletRequestCall prep compose', () => {
	it('blocks executable prep when the call batch is empty even if wallet gate is ready', () => {
		const gate = resolveWalletTransactionPrepGate({
			connections: [selectedConnection],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})
		expect(gate).toMatchObject({
			ready: true,
			connectionKey,
		})

		expect(resolveWalletRequestCallsPreparation([])).toEqual({
			ready: false,
			error: 'Wallet request preparation requires at least one BlockheadWalletRequestCall.',
		})

		const executable = resolveExecutableWalletRequestPrep([selectedConnection], [])
		expect(executable).toEqual({
			ready: false,
			error: 'Wallet request preparation requires at least one BlockheadWalletRequestCall.',
		})
		expect(isPreparedWalletRequestWithoutSend(preparedWalletRequestObservation())).toBe(true)
	})

	it('accepts ordered BlockheadWalletRequestCall rows with inputDataHash and yields prep-without-send', () => {
		const executable = resolveExecutableWalletRequestPrep([selectedConnection], orderedCalls)
		expect(executable).toMatchObject({
			ready: true,
			gate: {
				connectionKey,
				requestMethod: 'eth_sendTransaction',
				capability: WalletCapability.SendTransaction,
			},
			calls: [
				{
					toAddress: '0x2222222222222222222222222222222222222222',
					value: 1n,
					inputDataHash: firstCallHash,
				},
				{
					toAddress: '0x3333333333333333333333333333333333333333',
					value: 2n,
					inputDataHash: secondCallHash,
				},
			],
		})
		if (!executable.ready)
			throw new Error('expected executable prep')

		expect(executable.calls.map((call) => call.inputDataHash)).toEqual([
			firstCallHash,
			secondCallHash,
		])
		expect(isPreparedWalletRequestWithoutSend(executable.observation)).toBe(true)
		expect(executable.observation).not.toHaveProperty('submittedAt')
		expect(executable.observation).not.toHaveProperty('evmTransactionIds')
	})

	it('blocks executable prep when any ordered call lacks inputDataHash', () => {
		expect(resolveExecutableWalletRequestPrep([selectedConnection], [
			{
				toAddress: '0x2222222222222222222222222222222222222222',
				value: 1n,
				inputDataHash: firstCallHash,
			},
			{
				toAddress: '0x3333333333333333333333333333333333333333',
				value: 2n,
				inputDataHash: '',
			},
		])).toEqual({
			ready: false,
			error: 'Each BlockheadWalletRequestCall requires a non-empty inputDataHash.',
		})
	})

	it('keeps prepared wallet requests unsent through locked Draft session editing', () => {
		const locked = lockSessionLifecycle(
			draftSessionLifecycle({
				id: 'session-call-prep',
				name: 'ordered-call-prep',
				createdAt: 1,
				updatedAt: 1,
			}),
			3,
			3,
		)!
		expect(locked).toMatchObject({
			status: BlockheadSessionStatus.Draft,
			lockedAt: 3,
		})
		expect(isEditableSessionLifecycle(locked)).toBe(true)

		const executable = resolveExecutableWalletRequestPrep([selectedConnection], orderedCalls)
		if (!executable.ready)
			throw new Error('expected executable prep')

		expect(isPreparedWalletRequestWithoutSend(executable.observation)).toBe(true)

		const unlocked = unlockSessionLifecycle(locked, 7)
		expect(unlocked).toMatchObject({
			status: BlockheadSessionStatus.Draft,
			updatedAt: 7,
		})
		expect(unlocked).not.toHaveProperty('lockedAt')
		expect(unlocked).not.toHaveProperty('submittedAt')
		expect(isEditableSessionLifecycle(unlocked!)).toBe(true)
		expect(isPreparedWalletRequestWithoutSend(executable.observation)).toBe(true)
		expect(executable.observation).not.toHaveProperty('submittedAt')
	})
})
