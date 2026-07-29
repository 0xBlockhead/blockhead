// Generated from APP.ts. Do not edit by hand.

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(EvmTokenStandard)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInLog: {
		label: 'Index in log',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'From',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'To',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenContract: {
		label: 'Token contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinInstance: {
		label: 'Token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'Amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenSymbol: {
		label: 'Token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
		],
	},
	tokenName: {
		label: 'Token name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
		],
	},
	tokenDecimals: {
		label: 'Token decimals',
		type: EntityFieldType.Primitive,
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
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
	},
})
