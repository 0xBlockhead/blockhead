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
	scope: unknown
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

export const removeSessionLifecycle = (
	sessions: readonly SessionLifecycle[],
	sessionId: string
): SessionLifecycle[] => (
	sessions.filter((session) => session.id !== sessionId)
)

export const canRemoveSessionLifecycle = (
	session: SessionLifecycle
) => (
	session.status === BlockheadSessionStatus.Draft
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

/** Reload hydrates only grants that are still usable (active or pending); expired/revoked drop. */
export const sessionCapabilityGrantFromPersisted = (
	grant: PersistedSessionCapabilityGrant,
	now = Date.now()
): SessionCapabilityGrant | undefined => {
	const phase = sessionCapabilityGrantPhase(grant, now)
	if (phase === 'expired' || phase === 'revoked')
		return undefined

	return persistSessionCapabilityGrant(grant)
}

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
	connectionKey: string
): SessionCapabilityGrant[] => (
	grants.filter((grant) => grant.connectionKey !== connectionKey)
)

export const retainCurrentSessionCapabilityGrants = (
	grants: readonly SessionCapabilityGrant[],
	now = Date.now()
): SessionCapabilityGrant[] => (
	grants.flatMap((grant) => {
		const current = sessionCapabilityGrantFromPersisted(grant, now)
		return current == null ? [] : [current]
	})
)
