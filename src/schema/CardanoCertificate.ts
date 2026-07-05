// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoCertificateSelector {
	TransactionCertificateIndex = 'TransactionCertificateIndex',
}
export default {
	entityType: EntityType.CardanoCertificate,
	label: 'cardano certificate',
	labelPlural: 'cardano certificates',
	selectors: [
		{
			name: CardanoCertificateSelector.TransactionCertificateIndex,
			fields: [
				'$transaction',
				'certificateIndex',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'certificateIndex',
				label: 'certificate index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'certificateKind',
				label: 'certificate kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$stakeCredential',
				label: 'stake credential',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoStakeCredential,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$stakePool',
				label: 'stake pool',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoStakePool,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$drep',
				label: 'drep',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoDRep,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'poolId',
				label: 'pool ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rewardAddress',
				label: 'reward address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'depositLovelace',
				label: 'deposit lovelace',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'epoch',
				label: 'epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataUrl',
				label: 'metadata URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataHash',
				label: 'metadata hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'payload',
				label: 'payload',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
