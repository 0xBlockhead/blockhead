// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearValidatorSelector {
	NetworkAccountId = 'NetworkAccountId',
}
export default {
	entityType: EntityType.NearValidator,
	label: 'near validator',
	labelPlural: 'near validators',
	selectors: [
		{
			name: NearValidatorSelector.NetworkAccountId,
			fields: [
				'$network',
				'accountId',
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
			name: 'accountId',
			label: 'Account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			label: 'Public key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'stakeYoctoNear',
			label: 'Stake yocto near',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'isSlashed',
			label: 'Slashed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'expectedBlocks',
			label: 'Expected blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'producedBlocks',
			label: 'Produced blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'expectedChunks',
			label: 'Expected chunks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'producedChunks',
			label: 'Produced chunks',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
