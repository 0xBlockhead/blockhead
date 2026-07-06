// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonJettonSelector {
	NetworkMasterAddress = 'NetworkMasterAddress',
}
export default {
	entityType: EntityType.TonJetton,
	label: 'ton jetton',
	labelPlural: 'ton jettons',
	selectors: [
		{
			name: TonJettonSelector.NetworkMasterAddress,
			fields: [
				'$network',
				'masterAddress',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'masterAddress',
			label: 'master address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$masterAccount',
			label: 'master account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$balanceTimestamps',
			label: 'balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonJettonBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonJettonTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonJetton_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
