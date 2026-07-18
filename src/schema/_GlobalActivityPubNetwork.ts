// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalActivityPubNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalActivityPubNetwork = entity({
	entityType: EntityType._GlobalActivityPubNetwork,
	labels: {
		singular: 'global ActivityPub network',
		plural: 'global ActivityPub networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalActivityPubNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedActors: {
		label: 'Observed actors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedNotes: {
		label: 'Observed notes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$instances: {
		label: 'Instances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalActivityPubNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
