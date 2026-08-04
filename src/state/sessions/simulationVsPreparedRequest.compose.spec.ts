import { describe, expect, it } from 'vitest'

import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import {
	isPreparedWalletRequestWithoutSend,
	preparedWalletRequestObservation,
} from '$/state/wallets/walletRequestPreparation.ts'
import {
	composeSessionSimulationVsPreparedRequest,
	draftSessionLifecycle,
	isCompletedSessionSimulation,
	isSessionSimulationWithoutPreparedRequest,
	isSessionSimulationWithoutSend,
	lockSessionLifecycle,
	sessionSimulationObservation,
} from './sessionLifecycleState.ts'


const sessionId = 'session-simulation-compose'
const paramsHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

const succeededSimulation = sessionSimulationObservation({
	id: 'simulation-succeeded',
	sessionId,
	status: 'succeeded',
	createdAt: 100,
	paramsHash,
})

const failedSimulation = sessionSimulationObservation({
	id: 'simulation-failed',
	sessionId,
	status: 'failed',
	createdAt: 200,
	paramsHash,
	error: 'eth_call: execution reverted',
})


describe('simulation vs prepared-unsent request compose', () => {
	it('keeps completed simulation evidence without any prepared wallet request or send', () => {
		const locked = lockSessionLifecycle(
			draftSessionLifecycle({
				id: sessionId,
				name: 'simulate-only',
				createdAt: 1,
				updatedAt: 1,
			}),
			50,
			50
		)!

		expect(isCompletedSessionSimulation(succeededSimulation)).toBe(true)
		expect(isSessionSimulationWithoutPreparedRequest(succeededSimulation, null)).toBe(true)
		expect(isSessionSimulationWithoutSend(null)).toBe(true)

		const compose = composeSessionSimulationVsPreparedRequest({
			session: locked,
			simulation: succeededSimulation,
			preparedRequest: null,
		})
		expect(compose).toEqual({
			sessionEditable: true,
			simulationComplete: true,
			simulationWithoutPreparedRequest: true,
			simulationWithoutSend: true,
		})
		expect(locked.status).toBe(BlockheadSessionStatus.Draft)
		expect(locked).not.toHaveProperty('submittedAt')
	})

	it('keeps failed simulation rows as session evidence without wallet prep or broadcast', () => {
		expect(isCompletedSessionSimulation(failedSimulation)).toBe(true)
		expect(failedSimulation.completedAt).toBe(200)

		const compose = composeSessionSimulationVsPreparedRequest({
			session: draftSessionLifecycle({
				id: sessionId,
				createdAt: 1,
				updatedAt: 1,
			}),
			simulation: failedSimulation,
		})
		expect(compose).toMatchObject({
			simulationComplete: true,
			simulationWithoutPreparedRequest: true,
			simulationWithoutSend: true,
		})
		expect(compose.sessionEditable).toBe(true)
	})

	it('allows succeeded simulation alongside prepared-unsent request without submit', () => {
		const prepared = preparedWalletRequestObservation()
		expect(isPreparedWalletRequestWithoutSend(prepared)).toBe(true)

		const compose = composeSessionSimulationVsPreparedRequest({
			session: lockSessionLifecycle(
				draftSessionLifecycle({
					id: sessionId,
					createdAt: 1,
					updatedAt: 1,
				}),
				70,
				70
			)!,
			simulation: succeededSimulation,
			preparedRequest: {
				id: 'wallet-request-1',
				status: prepared.status,
			},
			send: prepared,
		})
		expect(compose).toEqual({
			sessionEditable: true,
			simulationComplete: true,
			simulationWithoutPreparedRequest: false,
			simulationWithoutSend: true,
		})
		expect(prepared).not.toHaveProperty('submittedAt')
	})

	it('separates simulation completion from prepared request and from public send binding', () => {
		const compose = composeSessionSimulationVsPreparedRequest({
			session: draftSessionLifecycle({
				id: sessionId,
				createdAt: 1,
				updatedAt: 1,
			}),
			simulation: succeededSimulation,
			preparedRequest: {
				id: 'wallet-request-2',
				status: 'prepared',
			},
			send: {
				submittedAt: 999,
				evmTransactionIds: ['0xdeadbeef'],
			},
		})
		expect(compose.simulationComplete).toBe(true)
		expect(compose.simulationWithoutPreparedRequest).toBe(false)
		expect(compose.simulationWithoutSend).toBe(false)
		expect(isSessionSimulationWithoutSend({
			submittedAt: 999,
			evmTransactionIds: ['0xdeadbeef'],
		})).toBe(false)
	})
})
