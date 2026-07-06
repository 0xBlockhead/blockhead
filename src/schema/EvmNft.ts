// Generated from APP.ts. Do not edit by hand.

import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum EvmNftSelector {
	EvmContractTokenId = 'EvmContractTokenId',
}
export default {
	entityType: EntityType.EvmNft,
	label: 'EVM NFT',
	labelPlural: 'EVM NFTs',
	description: 'A non-fungible token on an EVM contract, with ERC-8004 agent registration fields shown when the resolver supplies registry evidence.',
	selectors: [
		{
			name: EvmNftSelector.EvmContractTokenId,
			fields: [
				'$contract',
				'tokenId',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenId',
			label: 'Token ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'standard',
			label: 'Standard',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(EvmNftStandard)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'format',
			label: 'Format',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(EvmNftFormat)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenUri',
			label: 'Token URI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'name',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'image',
			label: 'Image',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'agentRegistry',
			label: 'Agent registry',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'agentId',
			label: 'Agent ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'agentUri',
			label: 'Agent URI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contactEndpoint',
			label: 'Contact endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$agentWallet',
			label: 'Agent wallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'x402Support',
			label: 'x402 support',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'Active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportedTrust',
			label: 'Supported trust',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registrationTypeIri',
			label: 'Registration type IRI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fetchedAt',
			label: 'Fetched at',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
