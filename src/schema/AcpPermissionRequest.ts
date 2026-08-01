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
		label: 'session',
		entityType: EntityType.AcpSession,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		label: 'request ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestKind: {
		label: 'request kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolvedAt: {
		label: 'resolved AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decision: {
		label: 'decision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
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
