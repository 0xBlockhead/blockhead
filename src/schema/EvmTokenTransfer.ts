// Generated from APP.ts.

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockscoutRestEtherscanRestSources = [
	Source.Blockscout_Rest,
	Source.Etherscan_Rest,
] as const

export default entity({
	entityType: EntityType.EvmTokenTransfer,
	labels: {
		singular: 'Token transfer',
		plural: 'token transfers',
	},
})({
	$log: {
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type.enumerated(...Object.values(EvmTokenStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInLog: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestEtherscanRestSources,
	},
	tokenName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestEtherscanRestSources,
	},
	tokenDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockscoutRestEtherscanRestSources,
	},
})({
	selectors: {
		LogIndexInLog: [
			'$log',
			'indexInLog',
		],
	},

	facets: {
		Nft: facet({
			path: [
				'standard',
			],
			isOneOf: [
				'ERC-721',
				'ERC-1155',
			],
		})({
			tokenId: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
	},
})
