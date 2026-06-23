import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadStateChannelStateSelector {
	ChannelVersionStateData = '$channel+version+stateData',
}
export default {
	entityType: EntityType.BlockheadStateChannelState,
	label: 'blockhead state channel state',
	labelPlural: 'blockhead state channel states',
	selectors: [
		{
			name: BlockheadStateChannelStateSelector.ChannelVersionStateData,
			fields: [
				'$channel',
				'version',
				'stateData',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadStateChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stateData',
			label: 'state data',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'intent',
			label: 'intent',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allocations',
			label: 'allocations',
			type: EntityFieldType.Primitive,
			primitiveType: type({"destination": "string", "token": "string", "amount": "bigint"}).array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatures',
			label: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'isFinal',
			label: 'is final',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestamp',
			label: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
