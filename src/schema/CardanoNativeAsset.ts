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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	policyId: {
		label: 'policy ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetName: {
		label: 'asset name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fingerprint: {
		label: 'fingerprint',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
