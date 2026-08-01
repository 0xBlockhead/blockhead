// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentCredentialState,
	labels: {
		singular: 'blockhead agent credential state',
		plural: 'blockhead agent credential states',
	},
})({
	credentialId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		entityType: EntityType.BlockheadAgentConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	credentialKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadAgentCredentialState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CredentialId: [
			'credentialId',
		],
	},
})
