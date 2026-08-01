// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensAccountManager,
	labels: {
		singular: 'Lens account manager',
		plural: 'Lens account managers',
	},
})({
	$account: {
		label: 'Account',
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.One,
	},
	manager: {
		label: 'Manager',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	addedAt: {
		label: 'Added at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isLensManager: {
		label: 'Is Lens manager',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canExecuteTransactions: {
		label: 'Can execute transactions',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canSetMetadataUri: {
		label: 'Can set metadata URI',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canTransferNative: {
		label: 'Can transfer native',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canTransferTokens: {
		label: 'Can transfer tokens',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$managerAccount: {
		label: 'Manager account',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountManager: [
			'$account',
			'manager',
		],
	},
})
