import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'


// Types

export type SessionLifecycleBase = {
	id: string
	name?: string
	createdAt: number
	updatedAt: number
}

export type SessionLifecycle =
	| (
		SessionLifecycleBase & {
			status: BlockheadSessionStatus.Draft
			lockedAt?: undefined
		}
	)
	| (
		SessionLifecycleBase & {
			status: BlockheadSessionStatus.Draft
			lockedAt: number
		}
	)
	| (
		SessionLifecycleBase & {
			status: BlockheadSessionStatus.Submitted
			lockedAt: number
		}
	)
	| (
		SessionLifecycleBase & {
			status: BlockheadSessionStatus.Finalized
			lockedAt: number
		}
	)

export type PersistedSessionLifecycle = {
	id: string
	name?: string
	status: BlockheadSessionStatus
	createdAt: number
	updatedAt: number
	lockedAt?: number
}

export type SessionCapabilityGrant = {
	grantId: string
	connectionKey?: string
	authorizationKind: string
	scope: object | string | number | boolean | bigint
	methods: readonly string[]
	resources: readonly string[]
	issuedAt?: number
	notBefore?: number
	expiresAt?: number
	revokedAt?: number
	proofKind?: string
	proofSummary?: string
}

export type SessionCapabilityGrantPhase =
	| 'pending'
	| 'active'
	| 'expired'
	| 'revoked'

export type PersistedSessionCapabilityGrant = SessionCapabilityGrant


// Session lifecycle

export const isLockedSessionLifecycle = (
	session: SessionLifecycle
): session is Extract<SessionLifecycle, { lockedAt: number }> => (
	session.lockedAt != null
)

export const isEditableSessionLifecycle = (
	session: SessionLifecycle
): session is Extract<SessionLifecycle, { status: BlockheadSessionStatus.Draft }> => (
	session.status === BlockheadSessionStatus.Draft
)

export const draftSessionLifecycle = (
	base: SessionLifecycleBase & {
		lockedAt?: number
	}
): Extract<SessionLifecycle, { status: BlockheadSessionStatus.Draft }> => (
	base.lockedAt != null ?
		{
			...base,
			status: BlockheadSessionStatus.Draft,
			lockedAt: base.lockedAt,
		}
	:
		{
			id: base.id,
			...(base.name != null && { name: base.name }),
			createdAt: base.createdAt,
			updatedAt: base.updatedAt,
			status: BlockheadSessionStatus.Draft,
		}
)

export const submittedSessionLifecycle = (
	base: SessionLifecycleBase & {
		lockedAt: number
	}
): Extract<SessionLifecycle, { status: BlockheadSessionStatus.Submitted }> => ({
	...base,
	status: BlockheadSessionStatus.Submitted,
	lockedAt: base.lockedAt,
})

export const finalizedSessionLifecycle = (
	base: SessionLifecycleBase & {
		lockedAt: number
	}
): Extract<SessionLifecycle, { status: BlockheadSessionStatus.Finalized }> => ({
	...base,
	status: BlockheadSessionStatus.Finalized,
	lockedAt: base.lockedAt,
})

export const buildSessionLifecycle = (
	row: PersistedSessionLifecycle
): SessionLifecycle => {
	const base = {
		id: row.id,
		...(row.name != null && { name: row.name }),
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	}

	switch (row.status) {
		case BlockheadSessionStatus.Draft:
			return draftSessionLifecycle({
				...base,
				...(row.lockedAt != null && { lockedAt: row.lockedAt }),
			})
		case BlockheadSessionStatus.Submitted:
			return submittedSessionLifecycle({
				...base,
				lockedAt: row.lockedAt ?? row.updatedAt,
			})
		case BlockheadSessionStatus.Finalized:
			return finalizedSessionLifecycle({
				...base,
				lockedAt: row.lockedAt ?? row.updatedAt,
			})
	}
}

export const persistSessionLifecycle = (
	session: SessionLifecycle
): PersistedSessionLifecycle => ({
	id: session.id,
	...(session.name != null && { name: session.name }),
	status: session.status,
	createdAt: session.createdAt,
	updatedAt: session.updatedAt,
	...(session.lockedAt != null && { lockedAt: session.lockedAt }),
})

/** Flat OPFS/local rows may omit lock stamps on terminal statuses; coerce to a legal machine. */
export const sessionLifecycleFromPersisted = (
	row: PersistedSessionLifecycle
): SessionLifecycle => (
	buildSessionLifecycle(row)
)

export const sessionLifecyclePersistRoundTrip = (
	row: PersistedSessionLifecycle | SessionLifecycle
): PersistedSessionLifecycle => (
	persistSessionLifecycle(
		sessionLifecycleFromPersisted(
			'status' in row && 'createdAt' in row ?
				{
					id: row.id,
					...(row.name != null && { name: row.name }),
					status: row.status,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					...('lockedAt' in row && row.lockedAt != null && { lockedAt: row.lockedAt }),
				}
			:
				persistSessionLifecycle(row)
		)
	)
)

export const lockSessionLifecycle = (
	session: SessionLifecycle,
	lockedAt: number,
	updatedAt = lockedAt
): SessionLifecycle | undefined => {
	if (session.status !== BlockheadSessionStatus.Draft)
		return undefined

	return draftSessionLifecycle({
		id: session.id,
		...(session.name != null && { name: session.name }),
		createdAt: session.createdAt,
		updatedAt,
		lockedAt,
	})
}

export const unlockSessionLifecycle = (
	session: SessionLifecycle,
	updatedAt: number
): SessionLifecycle | undefined => {
	if (session.status !== BlockheadSessionStatus.Draft || session.lockedAt == null)
		return undefined

	return draftSessionLifecycle({
		id: session.id,
		...(session.name != null && { name: session.name }),
		createdAt: session.createdAt,
		updatedAt,
	})
}

export const submitSessionLifecycle = (
	session: SessionLifecycle,
	updatedAt: number
): SessionLifecycle | undefined => {
	if (session.status !== BlockheadSessionStatus.Draft || session.lockedAt == null)
		return undefined

	return submittedSessionLifecycle({
		id: session.id,
		...(session.name != null && { name: session.name }),
		createdAt: session.createdAt,
		updatedAt,
		lockedAt: session.lockedAt,
	})
}

export const finalizeSessionLifecycle = (
	session: SessionLifecycle,
	updatedAt: number
): SessionLifecycle | undefined => {
	if (session.status !== BlockheadSessionStatus.Submitted)
		return undefined

	return finalizedSessionLifecycle({
		id: session.id,
		...(session.name != null && { name: session.name }),
		createdAt: session.createdAt,
		updatedAt,
		lockedAt: session.lockedAt,
	})
}

/** Monotonic `updatedAt` wins; equal clocks keep the incumbent (stale reload / out-of-order event). */
export const applySessionLifecycleUpdate = (
	previous: SessionLifecycle | undefined,
	next: SessionLifecycle
): SessionLifecycle => {
	if (previous == null)
		return next

	if (next.updatedAt < previous.updatedAt)
		return previous

	if (next.updatedAt > previous.updatedAt)
		return next

	return previous
}

export const canRemoveSessionLifecycle = (
	session: SessionLifecycle
) => (
	session.status === BlockheadSessionStatus.Draft
)

/** Fail-closed: only Draft sessions leave the working set; Submitted/Finalized rows stay. */
export const removeSessionLifecycle = (
	sessions: readonly SessionLifecycle[],
	sessionId: string
): SessionLifecycle[] => (
	sessions.filter((session) => (
		!(
			session.id === sessionId
			&& canRemoveSessionLifecycle(session)
		)
	))
)


// Capability grant lifecycle (authorization scope for session prep; orthogonal to wallets/** runtime)

export const sessionCapabilityGrantPhase = (
	grant: Pick<SessionCapabilityGrant, 'notBefore' | 'expiresAt' | 'revokedAt'>,
	now = Date.now()
): SessionCapabilityGrantPhase => {
	if (grant.revokedAt != null && grant.revokedAt <= now)
		return 'revoked'

	if (grant.expiresAt != null && grant.expiresAt <= now)
		return 'expired'

	if (grant.notBefore != null && grant.notBefore > now)
		return 'pending'

	return 'active'
}

export const isActiveSessionCapabilityGrant = (
	grant: SessionCapabilityGrant,
	now = Date.now()
) => (
	sessionCapabilityGrantPhase(grant, now) === 'active'
)

export const persistSessionCapabilityGrant = (
	grant: SessionCapabilityGrant
): PersistedSessionCapabilityGrant => ({
	grantId: grant.grantId,
	...(grant.connectionKey != null && { connectionKey: grant.connectionKey }),
	authorizationKind: grant.authorizationKind,
	scope: grant.scope,
	methods: [...grant.methods],
	resources: [...grant.resources],
	...(grant.issuedAt != null && { issuedAt: grant.issuedAt }),
	...(grant.notBefore != null && { notBefore: grant.notBefore }),
	...(grant.expiresAt != null && { expiresAt: grant.expiresAt }),
	...(grant.revokedAt != null && { revokedAt: grant.revokedAt }),
	...(grant.proofKind != null && { proofKind: grant.proofKind }),
	...(grant.proofSummary != null && { proofSummary: grant.proofSummary }),
})

export const sessionCapabilityGrantFromPersisted = (
	grant: PersistedSessionCapabilityGrant,
	_now = Date.now()
): SessionCapabilityGrant => (
	persistSessionCapabilityGrant(grant)
)

export const revokeSessionCapabilityGrant = (
	grant: SessionCapabilityGrant,
	revokedAt: number
): SessionCapabilityGrant => (
	persistSessionCapabilityGrant({
		...grant,
		revokedAt,
	})
)

/** Later `issuedAt` wins; equal clocks keep incumbent. Revoke of a newer grant must not lose to stale reissue. */
export const applySessionCapabilityGrantUpdate = (
	previous: SessionCapabilityGrant | undefined,
	next: SessionCapabilityGrant
): SessionCapabilityGrant => {
	if (previous == null)
		return next

	const previousIssuedAt = previous.issuedAt ?? 0
	const nextIssuedAt = next.issuedAt ?? 0
	if (nextIssuedAt < previousIssuedAt)
		return previous

	if (nextIssuedAt > previousIssuedAt)
		return next

	const previousRevokedAt = previous.revokedAt ?? Number.POSITIVE_INFINITY
	const nextRevokedAt = next.revokedAt ?? Number.POSITIVE_INFINITY
	if (nextRevokedAt < previousRevokedAt)
		return next

	if (nextRevokedAt > previousRevokedAt)
		return previous

	return previous
}

export const removeSessionCapabilityGrantsForConnection = (
	grants: readonly SessionCapabilityGrant[],
	connectionKey: string,
	revokedAt = Date.now()
): SessionCapabilityGrant[] => (
	grants.map((grant) => (
		grant.connectionKey === connectionKey && grant.revokedAt == null ?
			revokeSessionCapabilityGrant(grant, revokedAt)
		:
			grant
	))
)

export const retainCurrentSessionCapabilityGrants = (
	grants: readonly SessionCapabilityGrant[],
	_now = Date.now()
): SessionCapabilityGrant[] => (
	grants.map(persistSessionCapabilityGrant)
)


// Session simulation observation (RPC evidence rows; orthogonal to wallet prep/send)

export type SessionSimulationStatus = 'succeeded' | 'failed'

export type SessionSimulationObservation = {
	id: string
	sessionId: string
	status: SessionSimulationStatus
	createdAt: number
	completedAt?: number
	paramsHash: string
	error?: string
}

export type SessionPreparedRequestObservation = {
	id?: string
	status?: string
	submittedAt?: number
	evmTransactionIds?: readonly string[]
}

export type SessionSimulationPrepCompose = {
	sessionEditable: boolean
	simulationComplete: boolean
	simulationWithoutPreparedRequest: boolean
	simulationWithoutSend: boolean
}

export const isTerminalSessionSimulationStatus = (
	status: string
): status is SessionSimulationStatus => (
	status === 'succeeded' || status === 'failed'
)

export const isCompletedSessionSimulation = (
	simulation: Pick<SessionSimulationObservation, 'status' | 'completedAt'>
) => (
	simulation.completedAt != null
	&& isTerminalSessionSimulationStatus(simulation.status)
)

/** Normalize terminal simulation rows so completedAt is always present for status evidence. */
export const sessionSimulationObservation = (
	row: SessionSimulationObservation
): SessionSimulationObservation => (
	row.completedAt != null || !isTerminalSessionSimulationStatus(row.status) ?
		row
	:
		{
			...row,
			completedAt: row.createdAt,
		}
)

export const isSessionSimulationWithoutPreparedRequest = (
	simulation: SessionSimulationObservation,
	preparedRequest?: SessionPreparedRequestObservation | null
) => (
	simulation.id.trim() !== ''
	&& (preparedRequest?.id == null || preparedRequest.id.trim() === '')
	&& preparedRequest?.status !== 'prepared'
)

export const isSessionSimulationWithoutSend = (
	send?: SessionPreparedRequestObservation | null
) => (
	send?.submittedAt == null
	&& (send?.evmTransactionIds?.length ?? 0) === 0
)

export const composeSessionSimulationVsPreparedRequest = ({
	session,
	simulation,
	preparedRequest,
	send = preparedRequest,
}: {
	session: SessionLifecycle
	simulation: SessionSimulationObservation
	preparedRequest?: SessionPreparedRequestObservation | null
	send?: SessionPreparedRequestObservation | null
}): SessionSimulationPrepCompose => ({
	sessionEditable: isEditableSessionLifecycle(session),
	simulationComplete: isCompletedSessionSimulation(simulation),
	simulationWithoutPreparedRequest: isSessionSimulationWithoutPreparedRequest(
		simulation,
		preparedRequest
	),
	simulationWithoutSend: isSessionSimulationWithoutSend(send),
})
