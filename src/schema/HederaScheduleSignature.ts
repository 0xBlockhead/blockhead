// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaScheduleSignature,
	labels: {
		singular: 'hedera schedule signature',
		plural: 'hedera schedule signatures',
	},
})({
	$schedule: {
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.One,
	},
	publicKeyPrefix: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SchedulePublicKeyPrefix: [
			'$schedule',
			'publicKeyPrefix',
		],
	},
})
