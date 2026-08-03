// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType.Account,
	labels: {
		singular: 'account',
		plural: 'accounts',
	},
	description: 'A cross-chain account identity expressed with CAIP namespace, reference, and address fields.',
})({
	caip10: {
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
})({
	selectors: {
		Caip10: [
			'caip10',
		],
	},

	facets: {
		Evm: facet({
			path: [
				'namespace',
			],
			is: 'eip155',
		})({
			$account: {
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Aptos: facet({
			path: [
				'namespace',
			],
			is: 'aptos',
		})({
			$account: {
				entityType: EntityType.AptosAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Cardano: facet({
			path: [
				'namespace',
			],
			is: 'cip34',
		})({
			$account: {
				entityType: EntityType.CardanoAddress,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Cosmos: facet({
			path: [
				'namespace',
			],
			is: 'cosmos',
		})({
			$account: {
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Hedera: facet({
			path: [
				'namespace',
			],
			is: 'hedera',
		})({
			$account: {
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Polkadot: facet({
			path: [
				'namespace',
			],
			is: 'polkadot',
		})({
			$account: {
				entityType: EntityType.PolkadotAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Solana: facet({
			path: [
				'namespace',
			],
			is: 'solana',
		})({
			$account: {
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Starknet: facet({
			path: [
				'namespace',
			],
			is: 'starknet',
		})({
			$account: {
				entityType: EntityType.StarknetContract,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Tron: facet({
			path: [
				'namespace',
			],
			is: 'tron',
		})({
			$account: {
				entityType: EntityType.TronAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Ton: facet({
			path: [
				'namespace',
			],
			is: 'ton',
		})({
			$account: {
				entityType: EntityType.TonAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Xrpl: facet({
			path: [
				'namespace',
			],
			is: 'xrpl',
		})({
			$account: {
				entityType: EntityType.XrplAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
		Utxo: facet({
			path: [
				'namespace',
			],
			is: 'bip122',
		})({
			$account: {
				entityType: EntityType.UtxoAddress,
				cardinality: EntityFieldCardinality.One,
				defaultSources: constantsInternalSources,
			},
		}),
	},
})
