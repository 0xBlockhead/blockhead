// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	metadataName: {
		label: 'metadata name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
