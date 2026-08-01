// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4337Paymaster_Timestamp,
	labels: {
		singular: 'ERC-4337 paymaster timestamp',
		plural: 'ERC-4337 paymaster observations',
	},
})({
	$paymaster: {
		entityType: EntityType.Erc4337Paymaster,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	userOperationsCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PaymasterTimestampMsSource: [
			'$paymaster',
			'timestampMs',
			'source',
		],
	},
})
