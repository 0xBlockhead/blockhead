// Generated from APP.ts.

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmTokenTransfer,
	labels: {
		singular: 'Token transfer',
		plural: 'token transfers',
	},
})({
	$log: {
		label: 'Log',
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type.enumerated(...Object.values(EvmTokenStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInLog: {
		label: 'Index in log',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'From',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'To',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenContract: {
		label: 'Token contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		label: 'Token',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'Amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenSymbol: {
		label: 'Token symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
		],
	},
	tokenName: {
		label: 'Token name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
		],
	},
	tokenDecimals: {
		label: 'Token decimals',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
		],
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
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
	},
})
