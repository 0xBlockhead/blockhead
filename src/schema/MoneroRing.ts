// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.MoneroRing,
	labels: {
		singular: 'monero ring',
		plural: 'monero rings',
	},
})({
	$keyImage: {
		entityType: EntityType.MoneroKeyImage,
		cardinality: EntityFieldCardinality.One,
	},
	$$members: {
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
