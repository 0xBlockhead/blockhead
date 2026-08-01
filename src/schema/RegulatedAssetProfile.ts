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
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'standard',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.RegulatedAssetProfile_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$issuerPowers: {
		label: 'issuer powers',
		entityType: EntityType.IssuerPower,
		cardinality: EntityFieldCardinality.Many,
	},
	$$claimRequirements: {
		label: 'claim requirements',
		entityType: EntityType.ClaimTopicRequirement,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trustedIssuers: {
		label: 'trusted issuers',
		entityType: EntityType.TrustedIssuer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$complianceModules: {
		label: 'compliance modules',
		entityType: EntityType.ComplianceModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$restrictions: {
		label: 'restrictions',
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
