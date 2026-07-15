// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaScheduleSignatureSelector {
	SchedulePublicKeyPrefix = 'SchedulePublicKeyPrefix',
}
export const HederaScheduleSignature = entity({
	entityType: EntityType.HederaScheduleSignature,
	labels: {
		singular: 'hedera schedule signature',
		plural: 'hedera schedule signatures',
	},
})({
	$schedule: {
		label: 'schedule',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.One,
	},
	publicKeyPrefix: {
		label: 'public key prefix',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
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
