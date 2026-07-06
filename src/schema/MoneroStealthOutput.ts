// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroStealthOutputSelector {
	MoneroTransactionOutputIndex = 'MoneroTransactionOutputIndex',
}
export default {
	entityType: EntityType.MoneroStealthOutput,
	label: 'monero stealth output',
	labelPlural: 'monero stealth outputs',
	selectors: [
		{
			name: MoneroStealthOutputSelector.MoneroTransactionOutputIndex,
			fields: [
				'$transaction',
				'outputIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			label: 'Output index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			label: 'Public key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'commitment',
			label: 'Commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
