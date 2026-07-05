// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaScheduleSignatureSelector {
	SchedulePublicKeyPrefix = 'SchedulePublicKeyPrefix',
}
export default {
	entityType: EntityType.HederaScheduleSignature,
	label: 'hedera schedule signature',
	labelPlural: 'hedera schedule signatures',
	selectors: [
		{
			name: HederaScheduleSignatureSelector.SchedulePublicKeyPrefix,
			fields: [
				'$schedule',
				'publicKeyPrefix',
			],
		},
	],
	fields: [
		{
				name: '$schedule',
				label: 'schedule',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaSchedule,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'publicKeyPrefix',
				label: 'public key prefix',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'consensusTimestamp',
				label: 'consensus timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signature',
				label: 'signature',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
