// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BittensorMetagraph_TimestampSelector {
	SubnetTimestampMsSource = 'SubnetTimestampMsSource',
}
export default {
	entityType: EntityType.BittensorMetagraph_Timestamp,
	label: 'Bittensor metagraph observation',
	labelPlural: 'Bittensor metagraph observations',
	selectors: [
		{
			name: BittensorMetagraph_TimestampSelector.SubnetTimestampMsSource,
			fields: [
				'$subnet',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$subnet',
			label: 'Subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BittensorSubnet,
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
			name: 'metagraphByteLength',
			label: 'Metagraph bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'neuronCount',
			label: 'Neurons',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
