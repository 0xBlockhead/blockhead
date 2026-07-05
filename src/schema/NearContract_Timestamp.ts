// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearContract_TimestampSelector {
	ContractTimestampMsSource = 'ContractTimestampMsSource',
}
export default {
	entityType: EntityType.NearContract_Timestamp,
	label: 'near contract timestamp',
	labelPlural: 'near contract observations',
	selectors: [
		{
			name: NearContract_TimestampSelector.ContractTimestampMsSource,
			fields: [
				'$contract',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$contract',
				label: 'Contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearContract,
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
				name: 'codeHash',
				label: 'Code hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'codeSizeBytes',
				label: 'Code size bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'codeBase64',
				label: 'Code base64',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deployerTransactionHash',
				label: 'Deployer transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
