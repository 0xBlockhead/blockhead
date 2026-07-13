// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonJettonBalance_TimestampSelector {
	AccountJettonTimestampMsSource = 'AccountJettonTimestampMsSource',
}
export const TonJettonBalance_Timestamp = entity({
	entityType: EntityType.TonJettonBalance_Timestamp,
	labels: {
		singular: 'ton jetton balance timestamp',
		plural: 'ton jetton balance observations',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$jetton: {
		label: 'jetton',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonJetton,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	jettonWalletAddress: {
		label: 'jetton wallet address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceNano: {
		label: 'balance nano',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddress: {
		label: 'owner address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	masterAddress: {
		label: 'master address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastTransactionLt: {
		label: 'last transaction lt',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	locked: {
		label: 'locked',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountJettonTimestampMsSource: [
			'$account',
			'$jetton',
			'timestampMs',
			'source',
		],
	},
})
