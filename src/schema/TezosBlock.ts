// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBlockSelector {
	NetworkLevel = 'NetworkLevel',
	NetworkHash = 'NetworkHash',
}
export default {
	entityType: EntityType.TezosBlock,
	label: 'tezos block',
	labelPlural: 'tezos blocks',
	selectors: [
		{
			name: TezosBlockSelector.NetworkLevel,
			fields: [
				'$network',
				'level',
			],
		},
		{
			name: TezosBlockSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'level',
			label: 'level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protocolHash',
			label: 'protocol hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'predecessorHash',
			label: 'predecessor hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bakerAddress',
			label: 'baker address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'round',
			label: 'round',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'cycle',
			label: 'cycle',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payloadHash',
			label: 'payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'operationsHash',
			label: 'operations hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fitness',
			label: 'fitness',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$operationGroups',
			label: 'operation groups',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperationGroup,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
