// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCanisterMetadata,
	labels: {
		singular: 'icp canister metadata',
		plural: 'icp canister metadata entries',
	},
})({
	$canister: {
		label: 'canister',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	metadataName: {
		label: 'metadata name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.IcpCanisterMetadata_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CanisterMetadataName: [
			'$canister',
			'metadataName',
		],
	},
})
