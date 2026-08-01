// Generated from APP.ts.

import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'Standard',
		primitiveType: type.enumerated(...Object.values(EvmNftStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	format: {
		label: 'Format',
		primitiveType: type.enumerated(...Object.values(EvmNftFormat)),
		cardinality: EntityFieldCardinality.One,
	},
	tokenUri: {
		label: 'Token URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	image: {
		label: 'Image',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'Active',
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentId: {
				label: 'Agent ID',
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentUri: {
				label: 'Agent URI',
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			contactEndpoint: {
				label: 'Contact endpoint',
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$agentWallet: {
				label: 'Agent wallet',
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			x402Support: {
				label: 'x402 support',
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			supportedTrust: {
				label: 'Supported trust',
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registrationTypeIri: {
				label: 'Registration type IRI',
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			fetchedAt: {
				label: 'Fetched at',
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})
