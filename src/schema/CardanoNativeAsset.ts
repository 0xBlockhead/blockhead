import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoNativeAssetSelector {
	NetworkPolicyIdAssetName = '$network+policyId+assetName',
}
export default {
	entityType: EntityType.CardanoNativeAsset,
	label: 'cardano native asset',
	labelPlural: 'cardano native assets',
	selectors: [
		{
			name: CardanoNativeAssetSelector.NetworkPolicyIdAssetName,
			fields: [
				'$network',
				'policyId',
				'assetName',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'policyId',
			label: 'policy ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assetName',
			label: 'asset name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fingerprint',
			label: 'fingerprint',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoNativeAsset_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
