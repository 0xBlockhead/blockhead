// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletRequest,
	labels: {
		singular: 'blockhead wallet request',
		plural: 'blockhead wallet requests',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$intentOrder: {
		label: 'intent order',
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		label: 'wallet connection',
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	walletProtocol: {
		label: 'wallet protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	caip10: {
		label: 'CAIP-10',
		description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		label: 'request kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestMethod: {
		label: 'request method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: EvmAddress,
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
	callCount: {
		label: 'call count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	atomicRequired: {
		label: 'atomic required',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestPayloadHash: {
		label: 'request payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	walletCallBundleId: {
		label: 'wallet call bundle ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestedAt: {
		label: 'requested AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	submittedAt: {
		label: 'submitted AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$calls: {
		label: 'calls',
		entityType: EntityType.BlockheadWalletRequestCall,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadWalletRequest_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
