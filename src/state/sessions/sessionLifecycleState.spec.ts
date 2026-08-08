import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import type {
	SessionCapabilityGrant,
	SessionLifecycle,
} from './sessionLifecycleState.ts'
import {
	applySessionCapabilityGrantUpdate,
	applySessionLifecycleUpdate,
	buildSessionLifecycle,
	canRemoveSessionLifecycle,
	draftSessionLifecycle,
	finalizeSessionLifecycle,
	isActiveSessionCapabilityGrant,
	isEditableSessionLifecycle,
	isLockedSessionLifecycle,
	lockSessionLifecycle,
	persistSessionCapabilityGrant,
	persistSessionLifecycle,
	removeSessionCapabilityGrantsForConnection,
	removeSessionLifecycle,
	retainCurrentSessionCapabilityGrants,
	revokeSessionCapabilityGrant,
	sessionCapabilityGrantFromPersisted,
	sessionCapabilityGrantPhase,
	sessionLifecycleFromPersisted,
	sessionLifecyclePersistRoundTrip,
	submitSessionLifecycle,
	unlockSessionLifecycle,
	composeSessionSimulationVsPreparedRequest,
	isCompletedSessionSimulation,
	isSessionSimulationWithoutPreparedRequest,
	isSessionSimulationWithoutSend,
	sessionSimulationObservation,
} from './sessionLifecycleState.ts'


const sessionBase = {
	id: 'session-1',
	name: 'prep',
	createdAt: 1,
	updatedAt: 1,
} as const

const grantBase = {
	grantId: 'grant-1',
	connectionKey: 'conn-a',
	authorizationKind: 'wallet-scope',
	scope: { namespace: 'eip155', reference: '1' },
	methods: ['eth_sendTransaction'],
	resources: ['eip155:1'],
	issuedAt: 10,
} as const satisfies SessionCapabilityGrant

const sessionsE2eSource = readFileSync(
	new URL('../../routes/~/sessions/sessions.e2e.ts', import.meta.url),
	'utf8'
)


describe('sessionLifecycleState', () => {
	it('attaches sessions/account e2e prep-without-send journey proofs', () => {
		expect(sessionsE2eSource).toMatch(/prepares a locked native transfer without sending/)
		expect(sessionsE2eSource).toMatch(/Prep journey must not broadcast eth_sendTransaction/)
		expect(sessionsE2eSource).toMatch(/Lock session/)
		expect(sessionsE2eSource).toMatch(/Prepare EVM native transfer/)
	})

	it('keeps Draft lock optional and requires lock on terminal statuses', () => {
		const unlocked = draftSessionLifecycle(sessionBase)
		const locked = draftSessionLifecycle({
			...sessionBase,
			lockedAt: 5,
		})
		expect(isEditableSessionLifecycle(unlocked)).toBe(true)
		expect(isLockedSessionLifecycle(unlocked)).toBe(false)
		expect(isLockedSessionLifecycle(locked)).toBe(true)
		expect(unlocked).not.toHaveProperty('lockedAt')

		const submitted = buildSessionLifecycle({
			...sessionBase,
			status: BlockheadSessionStatus.Submitted,
			updatedAt: 9,
		})
		expect(submitted).toMatchObject({
			status: BlockheadSessionStatus.Submitted,
			lockedAt: 9,
		})
		expect(isEditableSessionLifecycle(submitted)).toBe(false)
	})

	it('coerces illegal persisted terminal rows missing lockedAt on reload', () => {
		const submitted = sessionLifecycleFromPersisted({
			...sessionBase,
			status: BlockheadSessionStatus.Submitted,
			updatedAt: 20,
		})
		expect(persistSessionLifecycle(submitted)).toEqual({
			...sessionBase,
			status: BlockheadSessionStatus.Submitted,
			updatedAt: 20,
			lockedAt: 20,
		})

		const finalized = sessionLifecyclePersistRoundTrip({
			...sessionBase,
			status: BlockheadSessionStatus.Finalized,
			updatedAt: 30,
		})
		expect(finalized).toEqual({
			...sessionBase,
			status: BlockheadSessionStatus.Finalized,
			updatedAt: 30,
			lockedAt: 30,
		})
	})

	it('locks and unlocks only Draft; submit requires lock; finalize requires Submitted', () => {
		const unlocked = draftSessionLifecycle(sessionBase)
		expect(unlockSessionLifecycle(unlocked, 2)).toBeUndefined()

		const locked = lockSessionLifecycle(unlocked, 3, 3)
		expect(locked).toMatchObject({
			status: BlockheadSessionStatus.Draft,
			lockedAt: 3,
			updatedAt: 3,
		})

		const unlockedAgain = unlockSessionLifecycle(locked!, 4)
		expect(unlockedAgain).toEqual(draftSessionLifecycle({
			...sessionBase,
			updatedAt: 4,
		}))

		expect(submitSessionLifecycle(unlocked, 5)).toBeUndefined()
		const submitted = submitSessionLifecycle(locked!, 6)
		expect(submitted).toMatchObject({
			status: BlockheadSessionStatus.Submitted,
			lockedAt: 3,
			updatedAt: 6,
		})
		expect(lockSessionLifecycle(submitted!, 7)).toBeUndefined()
		expect(unlockSessionLifecycle(submitted!, 7)).toBeUndefined()

		const finalized = finalizeSessionLifecycle(submitted!, 8)
		expect(finalized).toMatchObject({
			status: BlockheadSessionStatus.Finalized,
			lockedAt: 3,
			updatedAt: 8,
		})
		expect(finalizeSessionLifecycle(locked!, 9)).toBeUndefined()
	})

	it('ignores stale lifecycle updates and keeps equal-clock incumbent', () => {
		const locked = lockSessionLifecycle(
			draftSessionLifecycle(sessionBase),
			10,
			10
		)!
		const staleUnlock = unlockSessionLifecycle(
			draftSessionLifecycle({
				...sessionBase,
				lockedAt: 10,
				updatedAt: 9,
			}),
			9
		)!
		expect(applySessionLifecycleUpdate(locked, staleUnlock)).toBe(locked)

		const sameClockUnlock = unlockSessionLifecycle(locked, 10)!
		expect(applySessionLifecycleUpdate(locked, sameClockUnlock)).toBe(locked)

		const newerUnlock = unlockSessionLifecycle(locked, 11)!
		expect(applySessionLifecycleUpdate(locked, newerUnlock)).toEqual(newerUnlock)
	})

	it('removes only Draft sessions from the working set', () => {
		const draft = draftSessionLifecycle(sessionBase)
		const submitted = submitSessionLifecycle(
			lockSessionLifecycle(draft, 2, 2)!,
			3
		)!
		const sessions: SessionLifecycle[] = [
			draft,
			submitted,
			draftSessionLifecycle({
				...sessionBase,
				id: 'session-2',
				updatedAt: 4,
			}),
		]
		expect(canRemoveSessionLifecycle(draft)).toBe(true)
		expect(canRemoveSessionLifecycle(submitted)).toBe(false)
		expect(removeSessionLifecycle(sessions, 'session-1').map((session) => ({
			id: session.id,
			status: session.status,
		}))).toEqual([
			{
				id: 'session-1',
				status: BlockheadSessionStatus.Submitted,
			},
			{
				id: 'session-2',
				status: BlockheadSessionStatus.Draft,
			},
		])
		expect(removeSessionLifecycle([submitted], 'session-1')).toEqual([submitted])
	})
})


describe('sessionCapabilityGrant lifecycle', () => {
	it('classifies pending/active/expired/revoked from timestamps', () => {
		expect(sessionCapabilityGrantPhase({
			notBefore: 100,
		}, 50)).toBe('pending')
		expect(sessionCapabilityGrantPhase(grantBase, 50)).toBe('active')
		expect(sessionCapabilityGrantPhase({
			expiresAt: 40,
		}, 50)).toBe('expired')
		expect(sessionCapabilityGrantPhase({
			expiresAt: 80,
			revokedAt: 45,
		}, 50)).toBe('revoked')
		expect(isActiveSessionCapabilityGrant(grantBase, 50)).toBe(true)
	})

	it('preserves expired and revoked grants as durable lifecycle evidence', () => {
		expect(sessionCapabilityGrantFromPersisted({
			...grantBase,
			expiresAt: 20,
		}, 50)).toMatchObject({
			grantId: 'grant-1',
			expiresAt: 20,
		})
		expect(sessionCapabilityGrantFromPersisted({
			...grantBase,
			revokedAt: 20,
		}, 50)).toMatchObject({
			grantId: 'grant-1',
			revokedAt: 20,
		})
		expect(sessionCapabilityGrantFromPersisted({
			...grantBase,
			notBefore: 60,
		}, 50)).toMatchObject({
			grantId: 'grant-1',
			notBefore: 60,
		})
		expect(retainCurrentSessionCapabilityGrants([
			grantBase,
			{
				...grantBase,
				grantId: 'grant-expired',
				expiresAt: 1,
			},
			{
				...grantBase,
				grantId: 'grant-revoked',
				revokedAt: 1,
			},
		], 50).map((grant) => grant.grantId)).toEqual([
			'grant-1',
			'grant-expired',
			'grant-revoked',
		])
	})

	it('rejects stale reissues and prefers earlier revoke at equal issuedAt', () => {
		const active = persistSessionCapabilityGrant(grantBase)
		const stale = persistSessionCapabilityGrant({
			...grantBase,
			issuedAt: 5,
			methods: ['eth_sign'],
		})
		expect(applySessionCapabilityGrantUpdate(active, stale)).toBe(active)

		const newer = persistSessionCapabilityGrant({
			...grantBase,
			issuedAt: 20,
			methods: ['personal_sign'],
		})
		expect(applySessionCapabilityGrantUpdate(active, newer)).toEqual(newer)

		const revoked = revokeSessionCapabilityGrant(active, 15)
		const sameIssueActive = persistSessionCapabilityGrant(grantBase)
		expect(applySessionCapabilityGrantUpdate(revoked, sameIssueActive)).toEqual(revoked)
		expect(applySessionCapabilityGrantUpdate(sameIssueActive, revoked)).toEqual(revoked)
	})

	it('revokes grants when their connection is removed', () => {
		const grants = [
			grantBase,
			{
				...grantBase,
				grantId: 'grant-2',
				connectionKey: 'conn-b',
			},
			{
				...grantBase,
				grantId: 'grant-3',
				connectionKey: undefined,
			},
		]
		expect(removeSessionCapabilityGrantsForConnection(grants, 'conn-a', 50)).toEqual([
			{
				...grantBase,
				revokedAt: 50,
			},
			grants[1],
			grants[2],
		])
		expect(isActiveSessionCapabilityGrant(
			removeSessionCapabilityGrantsForConnection(grants, 'conn-a', 50)[0],
			50
		)).toBe(false)
	})
})


describe('sessionSimulation observation', () => {
	it('normalizes terminal statuses with completedAt and classifies prep/send orthogonality', () => {
		const simulation = sessionSimulationObservation({
			id: 'sim-1',
			sessionId: 'session-1',
			status: 'succeeded',
			createdAt: 40,
			paramsHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		})
		expect(simulation.completedAt).toBe(40)
		expect(isCompletedSessionSimulation(simulation)).toBe(true)
		expect(isSessionSimulationWithoutPreparedRequest(simulation, null)).toBe(true)
		expect(isSessionSimulationWithoutSend(null)).toBe(true)

		const compose = composeSessionSimulationVsPreparedRequest({
			session: draftSessionLifecycle(sessionBase),
			simulation,
		})
		expect(compose).toMatchObject({
			sessionEditable: true,
			simulationComplete: true,
			simulationWithoutPreparedRequest: true,
			simulationWithoutSend: true,
		})
	})
})
