// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4337AccountFactory_TimestampSelector {
	FactoryTimestampMsSource = 'FactoryTimestampMsSource',
}
export const Erc4337AccountFactory_Timestamp = entity({
	entityType: EntityType.Erc4337AccountFactory_Timestamp,
	labels: {
		singular: 'ERC-4337 account factory timestamp',
		plural: 'ERC-4337 account factory observations',
	},
})({
	$factory: {
		label: 'Factory',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Erc4337AccountFactory,
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
	smartAccountsCount: {
		label: 'Smart accounts',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FactoryTimestampMsSource: [
			'$factory',
			'timestampMs',
			'source',
		],
	},
})
