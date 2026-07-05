// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroTransactionSelector {
	NetworkTxHash = 'NetworkTxHash',
}
export default {
	entityType: EntityType.MoneroTransaction,
	label: 'monero transaction',
	labelPlural: 'monero transactions',
	selectors: [
		{
			name: MoneroTransactionSelector.NetworkTxHash,
			fields: [
				'$network',
				'txHash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'txHash',
				label: 'Transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$block',
				label: 'Block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoneroBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'version',
				label: 'Version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'unlockTime',
				label: 'Unlock time',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'feeAtomicUnits',
				label: 'Fee atomic units',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: '$$keyImages',
				label: 'Key images',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoneroKeyImage,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: '$$stealthOutputs',
				label: 'Stealth outputs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoneroStealthOutput,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
