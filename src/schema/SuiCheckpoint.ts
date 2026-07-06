// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiCheckpointSelector {
	NetworkSequence = 'NetworkSequence',
	NetworkDigest = 'NetworkDigest',
}
export default {
	entityType: EntityType.SuiCheckpoint,
	label: 'sui checkpoint',
	labelPlural: 'sui checkpoints',
	selectors: [
		{
			name: SuiCheckpointSelector.NetworkSequence,
			fields: [
				'$network',
				'sequence',
			],
		},
		{
			name: SuiCheckpointSelector.NetworkDigest,
			fields: [
				'$network',
				'digest',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sequence',
			label: 'sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'digest',
			label: 'digest',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'epoch',
			label: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousDigest',
			label: 'previous digest',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
