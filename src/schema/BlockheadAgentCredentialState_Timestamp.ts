// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadAgentCredentialState_TimestampSelector {
	CredentialTimestampMsSource = 'CredentialTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadAgentCredentialState_Timestamp,
	label: 'blockhead agent credential state timestamp',
	labelPlural: 'blockhead agent credential state observations',
	selectors: [
		{
			name: BlockheadAgentCredentialState_TimestampSelector.CredentialTimestampMsSource,
			fields: [
				'$credential',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$credential',
				label: 'credential',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadAgentCredentialState,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expiresAt',
				label: 'expires AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
