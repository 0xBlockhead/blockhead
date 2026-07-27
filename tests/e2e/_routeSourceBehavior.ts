import { e2eRouteFixtureMetadataByNodeId } from './_generatedRouteFixtureMetadata.ts'


export type RouteSourceBehavior =
	| 'local-service-required'
	| 'supported'
	| 'unsupported'
	| 'upstream-unavailable'

type RouteSourceAuthorityMetadata = {
	routeId: string
	routedEntityTypes?: readonly string[]
	sourceBehaviorByEntityType?: Readonly<Record<string, string>>
}


const routeSourceBehavior = (behavior: string | undefined): RouteSourceBehavior | undefined => (
	behavior === 'local-service-required'
	|| behavior === 'supported'
	|| behavior === 'unsupported'
	|| behavior === 'upstream-unavailable' ?
		behavior
	:
		undefined
)

export const deriveRouteSourceBehaviorByEntityType = (
	metadataByNodeId: Readonly<Record<string, RouteSourceAuthorityMetadata>>
) => {
	const behaviorByEntityType = new Map<string, RouteSourceBehavior>()
	const failures: string[] = []

	for (const [nodeId, metadata] of Object.entries(metadataByNodeId)) {
		for (const entityType of metadata.routedEntityTypes ?? []) {
			const behavior = routeSourceBehavior(metadata.sourceBehaviorByEntityType?.[entityType])
			if (behavior == null) {
				failures.push(`${nodeId}: ${entityType} is missing explicit route source authority`)
				continue
			}

			const existingBehavior = behaviorByEntityType.get(entityType)
			if (existingBehavior != null && existingBehavior !== behavior)
				failures.push(`${entityType}: ambiguous route source authority ${existingBehavior}/${behavior}`)
			else
				behaviorByEntityType.set(entityType, behavior)
		}

		for (const [entityType, rawBehavior] of Object.entries(metadata.sourceBehaviorByEntityType ?? {})) {
			if (metadata.routedEntityTypes != null && !metadata.routedEntityTypes.includes(entityType)) {
				failures.push(`${nodeId}: ${entityType} source authority is not attached to a routed entity`)
				continue
			}

			const behavior = routeSourceBehavior(rawBehavior)
			if (behavior == null) {
				failures.push(`${nodeId}: ${entityType} has forbidden route source authority ${rawBehavior}`)
				continue
			}

			const existingBehavior = behaviorByEntityType.get(entityType)
			if (existingBehavior != null && existingBehavior !== behavior)
				failures.push(`${entityType}: ambiguous route source authority ${existingBehavior}/${behavior}`)
			else
				behaviorByEntityType.set(entityType, behavior)
		}
	}

	if (failures.length > 0)
		throw new Error(`Invalid generated route source authority:\n${failures.join('\n')}`)

	return Object.fromEntries(
		[...behaviorByEntityType.entries()].sort(([left], [right]) => left.localeCompare(right))
	)
}


/**
 * Assertion metadata only. Route discovery must never consume this map to decide
 * whether a valid APP route exists or should be visited.
 */
export const routeSourceBehaviorByEntityType = deriveRouteSourceBehaviorByEntityType(
	e2eRouteFixtureMetadataByNodeId
)
