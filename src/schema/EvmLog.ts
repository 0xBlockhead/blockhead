import { type } from 'arktype'

import { ZeroExHex, lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldEntry,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import {
	conditionalFieldGroup,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

const evmLogBaseFields = [
	{
		name: 'txHash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'logIndex',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'topics',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex.array(),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'blockNumber',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'blockHash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'transactionIndex',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: 'removed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
	{
		name: '$emitter',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Voltaire_JsonRpc,
			Source.Blockscout_Rest,
		],
	},
] as const satisfies readonly EntityFieldDefinition[]

export default {
	entityType: EntityType.EvmLog,

	label: 'EVM log',
	labelPlural: 'EVM logs',

	id: type({
		$network: Network.id,
		txHash: ZeroExHex,
		logIndex: 'number',
	}),

	identities: [
		{
			name: 'txHashLogIndex',
			fields: [
				{
					name: '$network',
				},
				{
					name: 'txHash',
					normalize: lowercaseHexIdentityValue,
				},
				{
					name: 'logIndex',
				},
			],
		},
	],

	fields: [
		...evmLogBaseFields,
		conditionalFieldGroup(
			evmLogBaseFields,
			'topics',
			[
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				'0xc3d58168c5ae7397731d063d5bbf3d89e2dc00c66cb903c17f4a2cd2d1f5f0f0',
				'0x4a39dc06d4c0dbc64b70f1d4d6757603d1ef3e8d6935b7f0b4c97fe61e099437',
			],
			{
				itemIndex: 0,
			},
			[
				{
					name: '$$tokenTransfers',
					type: EntityFieldType.EntitiesReference,
					entityType: EntityType.EvmTokenTransfer,
					cardinality: EntityFieldCardinality.Many,
					defaultSources: [
						Source.Blockscout_Rest,
						Source.Etherscan_Rest,
					],
				},
			],
		),
	] as const satisfies readonly EntityFieldEntry[],
} as const satisfies EntityDefinition
