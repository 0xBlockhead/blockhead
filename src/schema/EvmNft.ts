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
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type.enumerated(...Object.values(EvmNftStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	format: {
		primitiveType: type.enumerated(...Object.values(EvmNftFormat)),
		cardinality: EntityFieldCardinality.One,
	},
	tokenUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	image: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
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
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentId: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
			},
			agentUri: {
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			contactEndpoint: {
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			$agentWallet: {
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			x402Support: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			supportedTrust: {
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			registrationTypeIri: {
				primitiveType: UrlString,
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			fetchedAt: {
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})
