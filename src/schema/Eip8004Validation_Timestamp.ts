// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Eip8004Validation_TimestampSelector {
	RequestHashAlgorithmRequestHashTimestampMsSource = 'RequestHashAlgorithmRequestHashTimestampMsSource',
}
export default {
	entityType: EntityType.Eip8004Validation_Timestamp,
	label: 'EIP-8004 validation timestamp',
	labelPlural: 'EIP-8004 validation observations',
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
				label: 'Request hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'requestHash',
				label: 'Request hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
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
				name: '$registration',
				label: 'Registration',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Eip8004AgentRegistration,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'validatorAddress',
				label: 'Validator address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestUri',
				label: 'Request URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'response',
				label: 'Response',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'responseUri',
				label: 'Response URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'responseHashAlgorithm',
				label: 'Response hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'responseHash',
				label: 'Response hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tag',
				label: 'Tag',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastUpdate',
				label: 'Last update',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionHash',
				label: 'Transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
