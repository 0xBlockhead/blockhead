import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum KaspaTransactionSelector {
	NetworkTransactionId = '$network+transactionId',
}
export default {
	entityType: EntityType.KaspaTransaction,
	label: 'kaspa transaction',
	labelPlural: 'kaspa transactions',
	selectors: [
		{
			name: KaspaTransactionSelector.NetworkTransactionId,
			fields: [
				'$network',
				'transactionId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.KaspaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionId',
			label: 'transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lockTime',
			label: 'lock time',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subnetworkId',
			label: 'subnetwork ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gas',
			label: 'gas',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payloadHash',
			label: 'payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payloadLength',
			label: 'payload length',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mass',
			label: 'mass',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockHashes',
			label: 'block hashes',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$inputs',
			label: 'inputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoInput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$outputs',
			label: 'outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$acceptances',
			label: 'acceptances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaAcceptedTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
