// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoNativeAssetSelector {
	NetworkPolicyIdAssetName = 'NetworkPolicyIdAssetName',
}
export const CardanoNativeAsset = entity({
	entityType: EntityType.CardanoNativeAsset,
	labels: {
		singular: 'cardano native asset',
		plural: 'cardano native assets',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoNetwork,
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
