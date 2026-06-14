import { type } from 'arktype'

// Directed transfer within a channel turn; not wired to Local catalog or resolvers yet.
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum StateChannelTransferSelector {
	Id = 'id',
}

export default {
	entityType: EntityType.StateChannelTransfer,

	label: 'State Channel Transfer',
	labelPlural: 'State Channel Transfers',

	selectors: [
		{
			name: StateChannelTransferSelector.Id,
			fields: [
				'id',
			],
		},
	],

	fields: [
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StateChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'turnNum',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("'pending' | 'confirmed' | 'failed'"),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
