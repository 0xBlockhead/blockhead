// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.RegulatedAssetProfile_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issuerPowers: {
		entityType: EntityType.IssuerPower,
		cardinality: EntityFieldCardinality.Many,
	},
	$$claimRequirements: {
		entityType: EntityType.ClaimTopicRequirement,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustedIssuers: {
		entityType: EntityType.TrustedIssuer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$complianceModules: {
		entityType: EntityType.ComplianceModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$restrictions: {
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
