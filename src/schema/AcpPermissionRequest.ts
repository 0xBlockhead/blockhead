// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AcpPermissionRequest,
	labels: {
		singular: 'acp permission request',
		plural: 'acp permission requests',
	},
})({
	$session: {
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolvedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionRequestId: [
			'$session',
			'requestId',
		],
	},
})
