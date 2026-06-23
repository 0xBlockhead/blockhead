import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BittensorMetagraph_TimestampSelector {
	SubnetTimestampMsSource = '$subnet+timestampMs+source',
}
export default {
	entityType: EntityType.BittensorMetagraph_Timestamp,
	label: 'bittensor metagraph timestamp',
	labelPlural: 'bittensor metagraph observations',
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
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'metagraphByteLength',
			label: 'metagraph byte length',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'neuronCount',
			label: 'neuron count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
