// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337Bundler_TimestampSelector {
	BundlerTimestampMsSource = 'BundlerTimestampMsSource',
}
export const Erc4337Bundler_Timestamp = entity({
	entityType: EntityType.Erc4337Bundler_Timestamp,
	labels: {
		singular: 'ERC-4337 bundler timestamp',
		plural: 'ERC-4337 bundler observations',
	},
})({
	$bundler: {
		label: 'Bundler',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Erc4337Bundler,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	userOperationsCount: {
		label: 'User operations',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BundlerTimestampMsSource: [
			'$bundler',
			'timestampMs',
			'source',
		],
	},
})
