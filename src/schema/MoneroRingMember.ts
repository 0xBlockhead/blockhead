// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroRing,
		cardinality: EntityFieldCardinality.One,
	},
	memberIndex: {
		label: 'Member index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	globalOutputIndex: {
		label: 'Global output index',
		type: EntityFieldType.Primitive,
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
