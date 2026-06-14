import { type } from 'arktype'
import {
	WalletCapability,
} from '$/constants/Wallet.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadWalletAccountSelector {
	Caip10 = 'caip10',
}

export default {
	entityType: EntityType.BlockheadWalletAccount,

	label: 'Wallet Account',
	labelPlural: 'Wallet Accounts',

	selectors: [
		{
			name: BlockheadWalletAccountSelector.Caip10,
			fields: [
				'caip10',
			],
		},
	],

	fields: [
		{
			name: 'caip10',
			type: EntityFieldType.Primitive,
			primitiveType: type({
				namespace: 'string',
				reference: 'string',
				accountAddress: 'string',
			}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capabilities',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletCapability).array(),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
