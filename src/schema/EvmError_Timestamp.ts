// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmError_TimestampSelector {
	ErrorTimestampMsSource = 'ErrorTimestampMsSource',
}
export default {
	entityType: EntityType.EvmError_Timestamp,
	label: 'EVM error observation',
	labelPlural: 'EVM error observations',
	selectors: [
		{
			name: EvmError_TimestampSelector.ErrorTimestampMsSource,
			fields: [
				'$error',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$error',
				label: 'Error',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmError,
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
				name: 'signatures',
				label: 'Signatures',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'filteredSignatureCount',
				label: 'Filtered signature count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verifiedCandidateCount',
				label: 'Verified candidate count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reachable',
				label: 'Reachable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
