// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashBcmrMetadataSelector {
	NetworkCategoryIdRegistryUrl = 'NetworkCategoryIdRegistryUrl',
}
export const BitcoinCashBcmrMetadata = entity({
	entityType: EntityType.BitcoinCashBcmrMetadata,
	labels: {
		singular: 'Bitcoin cash bcmr metadata',
		plural: 'Bitcoin Cash BCMR metadata entries',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	categoryId: {
		label: 'category ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	registryUrl: {
		label: 'registry URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashBcmr_Github,
		],
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashBcmr_Github,
		],
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashBcmr_Github,
		],
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashBcmr_Github,
		],
	},
})({
	selectors: {
		NetworkCategoryIdRegistryUrl: [
			'$network',
			'categoryId',
			'registryUrl',
		],
	},
})
