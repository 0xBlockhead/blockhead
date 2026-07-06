// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountResource_TimestampSelector {
	ResourceLedgerVersionSource = 'ResourceLedgerVersionSource',
}
export default {
	entityType: EntityType.AptosAccountResource_Timestamp,
	label: 'aptos account resource timestamp',
	labelPlural: 'aptos account resource observations',
	selectors: [
		{
			name: AptosAccountResource_TimestampSelector.ResourceLedgerVersionSource,
			fields: [
				'$resource',
				'ledgerVersion',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$resource',
			label: 'resource',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosAccountResource,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerVersion',
			label: 'ledger version',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
