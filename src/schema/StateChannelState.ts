import { type } from 'arktype'

// Signed channel state snapshot (Nitro-style); not wired to Local catalog or resolvers yet.
import { EvmAddress, ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const stateChannelAllocationRow = type({
	destination: EvmAddress,
	token: EvmAddress,
	amount: 'bigint',
})

export default {
	entityType: EntityType.StateChannelState,

	label: 'State Channel State',
	labelPlural: 'State Channel States',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StateChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'intent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stateData',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allocations',
			type: EntityFieldType.Primitive,
			primitiveType: stateChannelAllocationRow.array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex.array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'isFinal',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
