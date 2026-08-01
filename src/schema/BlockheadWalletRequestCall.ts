// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletRequestCall,
	labels: {
		singular: 'blockhead wallet request call',
		plural: 'blockhead wallet request calls',
	},
})({
	$walletRequest: {
		label: 'wallet request',
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		label: 'call index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	caip2: {
		label: 'CAIP-2',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		label: 'input data hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		WalletRequestCallIndex: [
			'$walletRequest',
			'callIndex',
		],
	},
})
