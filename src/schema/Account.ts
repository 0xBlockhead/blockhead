// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Account,
	labels: {
		singular: 'account',
		plural: 'accounts',
	},
	description: 'A cross-chain account identity expressed with CAIP namespace, reference, and address fields.',
})({
	caip10: {
		label: 'CAIP-10',
		description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	namespace: {
		label: 'Namespace',
		description: 'The CAIP namespace that selects this account\'s protocol projection.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
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
				label: 'EVM account',
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Aptos: facet({
			path: [
				'namespace',
			],
			is: 'aptos',
		})({
			$account: {
				label: 'Aptos account',
				entityType: EntityType.AptosAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Cardano: facet({
			path: [
				'namespace',
			],
			is: 'cip34',
		})({
			$account: {
				label: 'Cardano address',
				entityType: EntityType.CardanoAddress,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Cosmos: facet({
			path: [
				'namespace',
			],
			is: 'cosmos',
		})({
			$account: {
				label: 'Cosmos account',
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Hedera: facet({
			path: [
				'namespace',
			],
			is: 'hedera',
		})({
			$account: {
				label: 'Hedera account',
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Polkadot: facet({
			path: [
				'namespace',
			],
			is: 'polkadot',
		})({
			$account: {
				label: 'Polkadot account',
				entityType: EntityType.PolkadotAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Solana: facet({
			path: [
				'namespace',
			],
			is: 'solana',
		})({
			$account: {
				label: 'Solana account',
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Starknet: facet({
			path: [
				'namespace',
			],
			is: 'starknet',
		})({
			$account: {
				label: 'Starknet account contract',
				entityType: EntityType.StarknetContract,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Tron: facet({
			path: [
				'namespace',
			],
			is: 'tron',
		})({
			$account: {
				label: 'Tron account',
				entityType: EntityType.TronAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Ton: facet({
			path: [
				'namespace',
			],
			is: 'ton',
		})({
			$account: {
				label: 'TON account',
				entityType: EntityType.TonAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Xrpl: facet({
			path: [
				'namespace',
			],
			is: 'xrpl',
		})({
			$account: {
				label: 'XRPL account',
				entityType: EntityType.XrplAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Utxo: facet({
			path: [
				'namespace',
			],
			is: 'bip122',
		})({
			$account: {
				label: 'UTXO address',
				entityType: EntityType.UtxoAddress,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
	},
})
