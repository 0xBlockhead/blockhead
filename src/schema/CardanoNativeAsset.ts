// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoNativeAsset,
	labels: {
		singular: 'cardano native asset',
		plural: 'cardano native assets',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	policyId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fingerprint: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.CardanoNativeAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPolicyIdAssetName: [
			'$network',
			'policyId',
			'assetName',
		],
	},
})
