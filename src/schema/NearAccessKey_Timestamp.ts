// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearAccessKey_TimestampSelector {
	AccessKeyTimestampMsSource = 'AccessKeyTimestampMsSource',
}
export default {
	entityType: EntityType.NearAccessKey_Timestamp,
	label: 'near access key timestamp',
	labelPlural: 'near access key observations',
	selectors: [
		{
			name: NearAccessKey_TimestampSelector.AccessKeyTimestampMsSource,
			fields: [
				'$accessKey',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$accessKey',
				label: 'Access key',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccessKey,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockHeight',
				label: 'Block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockHash',
				label: 'Block hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nonce',
				label: 'Nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'permission',
				label: 'Permission',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'allowanceYoctoNear',
				label: 'Allowance yocto near',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'receiverId',
				label: 'Receiver ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'methodNames',
				label: 'Method names',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
