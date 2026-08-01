// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoneroRingMember,
	labels: {
		singular: 'monero ring member',
		plural: 'monero ring members',
	},
})({
	$ring: {
		label: 'Ring',
		entityType: EntityType.MoneroRing,
		cardinality: EntityFieldCardinality.One,
	},
	memberIndex: {
		label: 'Member index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	globalOutputIndex: {
		label: 'Global output index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		MoneroRingMemberIndex: [
			'$ring',
			'memberIndex',
		],
	},
})
