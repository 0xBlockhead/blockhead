import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TonJettonBalance_TimestampSelector {
	AccountJettonTimestampMsSource = '$account+$jetton+timestampMs+source',
}
export default {
	entityType: EntityType.TonJettonBalance_Timestamp,
	label: 'ton jetton balance timestamp',
	labelPlural: 'ton jetton balance observations',
	selectors: [
		{
			name: TonJettonBalance_TimestampSelector.AccountJettonTimestampMsSource,
			fields: [
				'$account',
				'$jetton',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$jetton',
			label: 'jetton',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonJetton,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'jettonWalletAddress',
			label: 'jetton wallet address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balanceNano',
			label: 'balance nano',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ownerAddress',
			label: 'owner address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'masterAddress',
			label: 'master address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastTransactionLt',
			label: 'last transaction lt',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'locked',
			label: 'locked',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
