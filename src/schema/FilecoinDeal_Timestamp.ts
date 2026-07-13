// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FilecoinDeal_TimestampSelector {
	DealTimestampMsSource = 'DealTimestampMsSource',
}
export const FilecoinDeal_Timestamp = entity({
	entityType: EntityType.FilecoinDeal_Timestamp,
	labels: {
		singular: 'filecoin deal timestamp',
		plural: 'filecoin deal observations',
	},
})({
	$deal: {
		label: 'Deal',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinDeal,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block height.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tipsetKey: {
		label: 'Tipset key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tipset: {
		label: 'Tipset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sectorStartEpoch: {
		label: 'Sector start epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastUpdatedEpoch: {
		label: 'Last updated epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashEpoch: {
		label: 'Slash epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedDeal: {
		label: 'Verified deal',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerCollateralAttoFil: {
		label: 'Provider collateral attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientCollateralAttoFil: {
		label: 'Client collateral attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		DealTimestampMsSource: [
			'$deal',
			'timestampMs',
			'source',
		],
	},
})
