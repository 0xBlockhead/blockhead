import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004Validation_TimestampSelector {
	RequestHashAlgorithmRequestHashTimestampMsSource = 'requestHashAlgorithm+requestHash+timestampMs+source',
}
export default {
	entityType: EntityType.Eip8004Validation_Timestamp,
	label: 'eip8004 validation timestamp',
	labelPlural: 'eip8004 validation observations',
	selectors: [
		{
			name: Eip8004Validation_TimestampSelector.RequestHashAlgorithmRequestHashTimestampMsSource,
			fields: [
				'requestHashAlgorithm',
				'requestHash',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'requestHashAlgorithm',
			label: 'request hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'requestHash',
			label: 'request hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: '$registration',
			label: 'registration',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistration,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validatorAddress',
			label: 'validator address',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestUri',
			label: 'request URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'response',
			label: 'response',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseUri',
			label: 'response URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseHashAlgorithm',
			label: 'response hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responseHash',
			label: 'response hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tag',
			label: 'tag',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastUpdate',
			label: 'last update',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
