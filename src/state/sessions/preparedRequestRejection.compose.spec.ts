import { describe, expect, it } from 'vitest'

import { ActionType } from '$/constants/actions.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
} from '$/state/wallets/walletRequestPreparation.ts'
import { preparedWalletRequestRejection } from '$/state/wallets/preparedWalletRequestRejection.ts'
import {
	draftSessionLifecycle,
	isEditableSessionLifecycle,
	isSessionSimulationWithoutSend,
	lockSessionLifecycle,
} from './sessionLifecycleState.ts'


describe('prepared request rejection compose', () => {
	it.each([
		ActionType.Transfer,
		ActionType.Swap,
	])('keeps a rejected %s request and its session unsubmitted', (actionType) => {
		const session = lockSessionLifecycle(
			draftSessionLifecycle({
				id: `session-${actionType}`,
				createdAt: 1,
				updatedAt: 1,
			}),
			2,
			2
		)!
		const prepared = {
			...preparedWalletRequestObservation(),
			timestampMs: 10,
		}
		const request = {
			id: `wallet-request-${actionType}`,
			requestKind: 'transaction',
			requestMethod: 'eth_sendTransaction',
			requestedAt: 5,
		} as const
		const rejection = preparedWalletRequestRejection({
			request,
			preparedObservation: prepared,
			rejectedAt: 11,
		})

		expect(isPreparedWalletRequestWithoutSend(prepared)).toBe(true)
		expect(isSessionSimulationWithoutSend(prepared)).toBe(true)
		expect(isSessionSimulationWithoutSend(request)).toBe(true)
		expect(isSessionSimulationWithoutSend(rejection.observation)).toBe(true)
		expect(isPreparedWalletRequestWithoutSend(rejection.observation)).toBe(false)
		expect(rejection.walletRequestSelector).toEqual({
			id: request.id,
		})
		expect(rejection.observation).toMatchObject({
			status: 'failed',
			timestampMs: 11,
			error: 'Wallet signing request rejected',
		})
		expect(rejection.observation).not.toHaveProperty('submittedAt')
		expect(rejection.observation).not.toHaveProperty('evmTransactions')
		expect(rejection.observation).not.toHaveProperty('transactionId')
		expect(request).toEqual({
			id: `wallet-request-${actionType}`,
			requestKind: 'transaction',
			requestMethod: 'eth_sendTransaction',
			requestedAt: 5,
		})
		expect(session.status).toBe(BlockheadSessionStatus.Draft)
		expect(session).not.toHaveProperty('submittedAt')
		expect(isEditableSessionLifecycle(session)).toBe(true)
	})
})
