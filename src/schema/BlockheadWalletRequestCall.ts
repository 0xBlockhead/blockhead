// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadWalletRequestCallSelector {
	WalletRequestCallIndex = 'WalletRequestCallIndex',
}
export const BlockheadWalletRequestCall = entity({
	entityType: EntityType.BlockheadWalletRequestCall,
	labels: {
		singular: 'blockhead wallet request call',
		plural: 'blockhead wallet request calls',
	},
})({
	$walletRequest: {
		label: 'wallet request',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		label: 'call index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	caip2: {
		label: 'CAIP-2',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		label: 'input data hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
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
