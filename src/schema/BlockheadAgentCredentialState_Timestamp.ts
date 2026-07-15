// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadAgentCredentialState_TimestampSelector {
	CredentialTimestampMsSource = 'CredentialTimestampMsSource',
}
export const BlockheadAgentCredentialState_Timestamp = entity({
	entityType: EntityType.BlockheadAgentCredentialState_Timestamp,
	labels: {
		singular: 'blockhead agent credential state timestamp',
		plural: 'blockhead agent credential state observations',
	},
})({
	$credential: {
		label: 'credential',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentCredentialState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiresAt: {
		label: 'expires AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CredentialTimestampMsSource: [
			'$credential',
			'timestampMs',
			'source',
		],
	},
})
