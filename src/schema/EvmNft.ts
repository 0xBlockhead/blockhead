// Generated from APP.ts. Do not edit by hand.

import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNft,
	labels: {
		singular: 'EVM NFT',
		plural: 'EVM NFTs',
	},
	description: 'A non-fungible token on an EVM contract, with ERC-8004 agent registration fields shown when the resolver supplies registry evidence.',
})({
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'Standard',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmNftStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	format: {
		label: 'Format',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmNftFormat)),
		cardinality: EntityFieldCardinality.One,
	},
	tokenUri: {
		label: 'Token URI',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	image: {
		label: 'Image',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'Active',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmContractTokenId: [
			'$contract',
			'tokenId',
		],
	},

	facets: {
		Eip8004Registration: facet({
			path: [
				'format',
			],
			is: 'Eip8004Registration',
		})({
			agentRegistry: {
				label: 'Agent registry',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentId: {
				label: 'Agent ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentUri: {
				label: 'Agent URI',
				type: EntityFieldType.Primitive,
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			contactEndpoint: {
				label: 'Contact endpoint',
				type: EntityFieldType.Primitive,
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$agentWallet: {
				label: 'Agent wallet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			x402Support: {
				label: 'x402 support',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			supportedTrust: {
				label: 'Supported trust',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registrationTypeIri: {
				label: 'Registration type IRI',
				type: EntityFieldType.Primitive,
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			fetchedAt: {
				label: 'Fetched at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})
