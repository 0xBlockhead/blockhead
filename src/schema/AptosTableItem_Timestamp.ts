// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosTableItem_TimestampSelector {
	TableItemLedgerVersionSource = 'TableItemLedgerVersionSource',
}
export default {
	entityType: EntityType.AptosTableItem_Timestamp,
	label: 'aptos table item timestamp',
	labelPlural: 'aptos table item observations',
	selectors: [
		{
			name: AptosTableItem_TimestampSelector.TableItemLedgerVersionSource,
			fields: [
				'$tableItem',
				'ledgerVersion',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$tableItem',
				label: 'table item',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AptosTableItem,
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
		{
				name: 'valueHash',
				label: 'value hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'pruned',
				label: 'pruned',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
