// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum LensAccountManagerSelector {
	AccountManager = 'AccountManager',
}
export default {
	entityType: EntityType.LensAccountManager,
	label: 'Lens account manager',
	labelPlural: 'Lens account managers',
	selectors: [
		{
			name: LensAccountManagerSelector.AccountManager,
			fields: [
				'$account',
				'manager',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'manager',
				label: 'Manager',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'addedAt',
				label: 'Added at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isLensManager',
				label: 'Is Lens manager',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canExecuteTransactions',
				label: 'Can execute transactions',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canSetMetadataUri',
				label: 'Can set metadata URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canTransferNative',
				label: 'Can transfer native',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canTransferTokens',
				label: 'Can transfer tokens',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$managerAccount',
				label: 'Manager account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
