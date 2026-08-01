// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
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
