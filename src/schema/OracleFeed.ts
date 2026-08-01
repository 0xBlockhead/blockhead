// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OracleFeed,
	labels: {
		singular: 'oracle feed',
		plural: 'oracle feeds',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		label: 'market',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feedKind: {
		label: 'feed kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$rounds: {
		label: 'rounds',
		entityType: EntityType.OracleFeed_Round,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.OracleFeed_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkAddress: [
			'$network',
			'address',
		],
	},
})
