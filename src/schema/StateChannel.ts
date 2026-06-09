import { type } from 'arktype'

// Off-chain bilateral payment channel (Lightning/Raiden-style ledger), not chat rooms or AMM pools.
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.StateChannel,

	label: 'State Channel',
	labelPlural: 'State Channels',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$participant0',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$participant1',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'totalDeposited',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance0',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance1',
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
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("'pending' | 'active' | 'closing' | 'closed' | 'disputed'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$room',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRoom,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StateChannelTransfer,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
		{
			name: '$$states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StateChannelState,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
		{
			name: '$$deposits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StateChannelDeposit,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Local_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
