// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconWithdrawal,
	labels: {
		singular: 'beacon withdrawal',
		plural: 'Beacon withdrawals',
	},
})({
	$block: {
		entityType: EntityType.BeaconBlock,
		cardinality: EntityFieldCardinality.One,
	},
	withdrawalIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$validator: {
		entityType: EntityType.BeaconValidator,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	amountGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		BlockWithdrawalIndex: [
			'$block',
			'withdrawalIndex',
		],
	},
})
