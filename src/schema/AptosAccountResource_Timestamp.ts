// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountResource_TimestampSelector {
	ResourceLedgerVersionSource = 'ResourceLedgerVersionSource',
}
export const AptosAccountResource_Timestamp = entity({
	entityType: EntityType.AptosAccountResource_Timestamp,
	labels: {
		singular: 'aptos account resource timestamp',
		plural: 'aptos account resource observations',
	},
})({
	$resource: {
		label: 'resource',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		label: 'ledger version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResourceLedgerVersionSource: [
			'$resource',
			'ledgerVersion',
			'source',
		],
	},
})
