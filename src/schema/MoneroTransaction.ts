// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroTransactionSelector {
	NetworkTxHash = 'NetworkTxHash',
}
export const MoneroTransaction = entity({
	entityType: EntityType.MoneroTransaction,
	labels: {
		singular: 'monero transaction',
		plural: 'monero transactions',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		label: 'Transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	unlockTime: {
		label: 'Unlock time',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	feeAtomicUnits: {
		label: 'Fee atomic units',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	$$keyImages: {
		label: 'Key images',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoneroKeyImage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	$$stealthOutputs: {
		label: 'Stealth outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoneroStealthOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkTxHash: [
			'$network',
			'txHash',
		],
	},
})
