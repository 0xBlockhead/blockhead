// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	policyId: {
		label: 'policy ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assetName: {
		label: 'asset name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fingerprint: {
		label: 'fingerprint',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
