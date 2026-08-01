// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ElementsAsset,
	labels: {
		singular: 'Elements asset',
		plural: 'Elements assets',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.ElementsNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		label: 'Asset ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ticker: {
		label: 'Ticker',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	precision: {
		label: 'Precision',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	entityDomain: {
		label: 'Entity domain',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractJson: {
		label: 'Contract JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hasBlindedIssuances: {
		label: 'Has blinded issuances',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$issuances: {
		label: 'Issuances',
		entityType: EntityType.ElementsIssuance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.ElementsAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Esplora_Rest,
		],
	},
})({
	selectors: {
		ElementsNetworkAssetId: [
			'$network',
			'assetId',
		],
	},
})
