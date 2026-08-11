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
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	address: {
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
				entityType: EntityType.SolanaAccount,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
		Sui: facet({
			path: [
				'namespace',
			],
			is: 'sui',
		})({
			$account: {
				entityType: EntityType.SuiAccount,
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
				entityType: EntityType.UtxoAddress,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
				],
			},
		}),
	},
})
