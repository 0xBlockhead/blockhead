// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroRingSelector {
	MoneroKeyImage = 'MoneroKeyImage',
}
export const MoneroRing = entity({
	entityType: EntityType.MoneroRing,
	labels: {
		singular: 'monero ring',
		plural: 'monero rings',
	},
})({
	$keyImage: {
		label: 'Key image',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroKeyImage,
		cardinality: EntityFieldCardinality.One,
	},
	$$members: {
		label: 'Members',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoneroRingMember,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		MoneroKeyImage: [
			'$keyImage',
		],
	},
})
