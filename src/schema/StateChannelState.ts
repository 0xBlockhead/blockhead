import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const stateChannelAllocationRow = type({
	destination: 'string.hex' as type.cast<`0x${string}`>,
	token: 'string.hex' as type.cast<`0x${string}`>,
	amount: 'bigint',
})

export default {
	entityType: EntityType.StateChannelState,

	label: 'State Channel State',

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
			primitiveType: type('string.hex' as type.cast<`0x${string}`>),
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
			primitiveType: type('string[]' as type.cast<`0x${string}`[]>),
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
