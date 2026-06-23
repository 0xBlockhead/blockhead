import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoTransactionSelector {
	NetworkHash = '$network+hash',
}
export default {
	entityType: EntityType.CardanoTransaction,
	label: 'cardano transaction',
	labelPlural: 'cardano transactions',
	selectors: [
		{
			name: CardanoTransactionSelector.NetworkHash,
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
			entityType: EntityType.CardanoNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockSlot',
			label: 'block slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fee',
			label: 'fee',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deposit',
			label: 'deposit',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			label: 'size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validityStartSlot',
			label: 'validity start slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ttlSlot',
			label: 'ttl slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metadata',
			label: 'metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$inputs',
			label: 'inputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoTxInput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$outputs',
			label: 'outputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoTxOutput,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$certificates',
			label: 'certificates',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoCertificate,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$scripts',
			label: 'scripts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoScriptWitness,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$governanceProposals',
			label: 'governance proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoGovernanceProposal,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$governanceVotes',
			label: 'governance votes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoGovernanceVote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoNativeAsset,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
