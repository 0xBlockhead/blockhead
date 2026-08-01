// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RegulatedAssetProfile,
	labels: {
		singular: 'regulated asset profile',
		plural: 'regulated asset profiles',
	},
})({
	$assetInstance: {
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'standard',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RegulatedAssetProfile_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issuerPowers: {
		label: 'issuer powers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IssuerPower,
		cardinality: EntityFieldCardinality.Many,
	},
	$$claimRequirements: {
		label: 'claim requirements',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ClaimTopicRequirement,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustedIssuers: {
		label: 'trusted issuers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TrustedIssuer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$complianceModules: {
		label: 'compliance modules',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ComplianceModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$restrictions: {
		label: 'restrictions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TransferRestriction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AssetInstance: [
			'$assetInstance',
		],
	},
})
