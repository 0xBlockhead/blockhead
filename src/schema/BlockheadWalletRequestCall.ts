// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletRequestCall,
	labels: {
		singular: 'blockhead wallet request call',
		plural: 'blockhead wallet request calls',
	},
})({
	$evmRequest: {
		entityType: EntityType.BlockheadEvmWalletRequest,
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmWalletRequestCallIndex: [
			'$evmRequest',
			'callIndex',
		],
	},
})
