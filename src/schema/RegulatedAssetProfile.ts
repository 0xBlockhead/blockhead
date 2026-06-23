import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum RegulatedAssetProfileSelector {
	AssetInstance = '$assetInstance',
}
export default {
	entityType: EntityType.RegulatedAssetProfile,
	label: 'regulated asset profile',
	labelPlural: 'regulated asset profiles',
	selectors: [
		{
			name: RegulatedAssetProfileSelector.AssetInstance,
			fields: [
				'$assetInstance',
			],
		},
	],
	fields: [
		{
			name: '$assetInstance',
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'standard',
			label: 'standard',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RegulatedAssetProfile_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$issuerPowers',
			label: 'issuer powers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IssuerPower,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$claimRequirements',
			label: 'claim requirements',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ClaimTopicRequirement,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$trustedIssuers',
			label: 'trusted issuers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TrustedIssuer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$complianceModules',
			label: 'compliance modules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ComplianceModule,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$restrictions',
			label: 'restrictions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TransferRestriction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
