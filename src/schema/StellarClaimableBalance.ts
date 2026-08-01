// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarClaimableBalance,
	labels: {
		singular: 'stellar claimable balance',
		plural: 'stellar claimable balances',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	claimableBalanceId: {
		label: 'claimable balance ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarClaimableBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkClaimableBalanceId: [
			'$network',
			'claimableBalanceId',
		],
	},
})
