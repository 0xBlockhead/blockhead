// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.HederaTokenAssociation,
	labels: {
		singular: 'hedera token association',
		plural: 'hedera token associations',
	},
})({
	$account: {
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.HederaTokenAssociation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountToken: [
			'$account',
			'$token',
		],
	},
})
