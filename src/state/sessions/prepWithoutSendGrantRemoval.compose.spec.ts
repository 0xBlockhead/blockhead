import { describe, expect, it } from 'vitest'

import { account, base } from '$/state/wallets/walletRequestPreparation.fixtures.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import {
	connectedWalletConnection,
	disconnectWalletConnection,
} from '$/state/wallets/walletConnectionState.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
	resolveWalletRequestCallsPreparation,
	resolveWalletTransactionPrepGate,
} from '$/state/wallets/walletRequestPreparation.ts'
import type { SessionCapabilityGrant } from './sessionLifecycleState.ts'
import {
	draftSessionLifecycle,
	isActiveSessionCapabilityGrant,
	isEditableSessionLifecycle,
	lockSessionLifecycle,
	removeSessionCapabilityGrantsForConnection,
	retainCurrentSessionCapabilityGrants,
	revokeSessionCapabilityGrant,
	submitSessionLifecycle,
	unlockSessionLifecycle,
} from './sessionLifecycleState.ts'


const connectionKey = 'compose-conn'

const selectedConnection = connectedWalletConnection({
	...base,
	connectionKey,
	selected: true,
})

const grantForConnection = {
	grantId: 'grant-compose-a',
	connectionKey,
	authorizationKind: 'wallet-scope',
	scope: { namespace: 'eip155', reference: '1' },
	methods: ['eth_sendTransaction'],
	resources: ['eip155:1'],
	issuedAt: 10,
} as const satisfies SessionCapabilityGrant

const grantOtherConnection = {
	...grantForConnection,
	grantId: 'grant-compose-b',
	connectionKey: 'other-conn',
} as const satisfies SessionCapabilityGrant


describe('prep-without-send + session grant removal compose', () => {
	it('prepares a locked Draft session wallet request without submit, then drops connection grants', () => {
		const unlocked = draftSessionLifecycle({
			id: 'session-compose',
			name: 'prep-without-send',
			createdAt: 1,
			updatedAt: 1,
		})
		const locked = lockSessionLifecycle(unlocked, 2, 2)
		expect(locked).toMatchObject({
			status: BlockheadSessionStatus.Draft,
			lockedAt: 2,
		})
		expect(isEditableSessionLifecycle(locked!)).toBe(true)

		const grants = [
			grantForConnection,
			grantOtherConnection,
		]
		expect(isActiveSessionCapabilityGrant(grantForConnection, 50)).toBe(true)

		const prepGate = resolveWalletTransactionPrepGate({
			connections: [selectedConnection],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})
		expect(prepGate).toMatchObject({
			ready: true,
			connectionKey,
		})

		const calls = resolveWalletRequestCallsPreparation([{
			toAddress: '0x2222222222222222222222222222222222222222',
			value: 1n,
			inputDataHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		}])
		expect(calls).toMatchObject({ ready: true })

		const observation = preparedWalletRequestObservation()
		expect(isPreparedWalletRequestWithoutSend(observation)).toBe(true)
		expect(observation).not.toHaveProperty('submittedAt')

		const afterRemoval = removeSessionCapabilityGrantsForConnection(grants, connectionKey, 50)
		expect(afterRemoval.map((grant) => grant.grantId)).toEqual([
			'grant-compose-a',
			'grant-compose-b',
		])
		expect(afterRemoval[0].revokedAt).toBe(50)
		expect(retainCurrentSessionCapabilityGrants(afterRemoval, 50).map((grant) => grant.grantId)).toEqual([
			'grant-compose-a',
			'grant-compose-b',
		])

		expect(isPreparedWalletRequestWithoutSend(observation)).toBe(true)
		expect(isPreparedWalletRequestWithoutSend({
			...observation,
			evmTransactionIds: [],
		})).toBe(true)
		expect(locked!.status).toBe(BlockheadSessionStatus.Draft)
		expect(isEditableSessionLifecycle(locked!)).toBe(true)
	})

	it('revoking the prep connection grant leaves the prepared request unsent and Draft editable', () => {
		const locked = lockSessionLifecycle(
			draftSessionLifecycle({
				id: 'session-compose-revoke',
				createdAt: 1,
				updatedAt: 1,
			}),
			5,
			5
		)!

		const prepGate = resolveWalletTransactionPrepGate({
			connections: [selectedConnection],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})
		expect(prepGate.ready).toBe(true)

		const prepared = preparedWalletRequestObservation()
		const revoked = revokeSessionCapabilityGrant(grantForConnection, 20)
		expect(isActiveSessionCapabilityGrant(revoked, 50)).toBe(false)
		expect(retainCurrentSessionCapabilityGrants([
			revoked,
			grantOtherConnection,
		], 50).map((grant) => grant.grantId)).toEqual([
			'grant-compose-a',
			'grant-compose-b',
		])

		expect(isPreparedWalletRequestWithoutSend(prepared)).toBe(true)
		expect(isEditableSessionLifecycle(locked)).toBe(true)
		expect(locked).not.toHaveProperty('submittedAt')
		expect(prepared).not.toHaveProperty('submittedAt')
	})

	it('disconnect clears prep readiness and connection grants while leaving prepared Draft unsent', () => {
		const locked = lockSessionLifecycle(
			draftSessionLifecycle({
				id: 'session-compose-disconnect',
				name: 'chrome settle compose',
				createdAt: 1,
				updatedAt: 1,
			}),
			8,
			8
		)!

		expect(resolveWalletTransactionPrepGate({
			connections: [selectedConnection],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		}).ready).toBe(true)

		const prepared = preparedWalletRequestObservation()
		expect(isPreparedWalletRequestWithoutSend(prepared)).toBe(true)

		const disconnected = disconnectWalletConnection(selectedConnection, 9)
		expect(disconnected).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			connectionKey,
		})
		expect(disconnected).not.toHaveProperty('selected')

		expect(resolveWalletTransactionPrepGate({
			connections: [disconnected],
			namespace: 'eip155',
			reference: '1',
			accountAddress: account.accountAddress,
		})).toEqual({
			ready: false,
			error: 'Wallet request preparation requires exactly one selected wallet connection; received 0.',
		})

		const grantsAfterDisconnect = removeSessionCapabilityGrantsForConnection([
			grantForConnection,
			grantOtherConnection,
		], connectionKey, 50)
		expect(grantsAfterDisconnect.map((grant) => grant.grantId)).toEqual([
			'grant-compose-a',
			'grant-compose-b',
		])
		expect(grantsAfterDisconnect[0].revokedAt).toBe(50)
		expect(retainCurrentSessionCapabilityGrants(grantsAfterDisconnect, 50).map((grant) => grant.grantId)).toEqual([
			'grant-compose-a',
			'grant-compose-b',
		])

		const unlocked = unlockSessionLifecycle(locked, 11)
		expect(unlocked).toMatchObject({
			status: BlockheadSessionStatus.Draft,
			updatedAt: 11,
		})
		expect(unlocked).not.toHaveProperty('lockedAt')
		expect(isEditableSessionLifecycle(unlocked!)).toBe(true)
		expect(submitSessionLifecycle(unlocked!, 12)).toBeUndefined()

		expect(isPreparedWalletRequestWithoutSend(prepared)).toBe(true)
		expect(prepared).not.toHaveProperty('submittedAt')
		expect(locked.status).toBe(BlockheadSessionStatus.Draft)
		expect(locked).not.toHaveProperty('submittedAt')
	})
})
