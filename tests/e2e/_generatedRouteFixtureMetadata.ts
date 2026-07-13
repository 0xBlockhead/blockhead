// Generated from APP.ts. Do not edit by hand.

export type E2eRouteFixtureMapping = {
	id?: string
	label?: string
	routeKind?: string
	projectionEntity?: string
	fixture?: Readonly<Partial<Record<string, string>>>
	variants?: readonly Readonly<Partial<Record<string, string>>>[]
	projectionPath?: readonly [string, ...string[]]
	boundaryLiveOptional?: true
}

export type E2eRouteFixtureMetadata = {
	nodeId: string
	publicPath: string
	mappings: readonly E2eRouteFixtureMapping[]
	fixture?: Readonly<Partial<Record<string, string>>>
	variants?: readonly Readonly<Partial<Record<string, string>>>[]
	boundaryLiveOptional?: true
}

export const e2eRouteFixtureMetadataByNodeId = {
	'/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]': {
		nodeId: '/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]',
		publicPath: '/currency/[iso4217]/observations/[timestampMs]',
		mappings: [
			{
				id: 'Currency_Timestamp.CurrencyTimestampMs',
				routeKind: 'detail',
				fixture: {
					timestampMs: '1735689600000',
				},
				variants: [
					{
						timestampMs: '1735689600000',
					},
				],
			},
		],
		fixture: {
			timestampMs: '1735689600000',
		},
		variants: [
			{
				timestampMs: '1735689600000',
			},
		],
	},
	'/(assets)/coin-instance/[chainId]/[coinInstanceSlug]': {
		nodeId: '/(assets)/coin-instance/[chainId]/[coinInstanceSlug]',
		publicPath: '/coin-instance/[chainId]/[coinInstanceSlug]',
		mappings: [
			{
				id: 'EvmCoinInstance.NetworkType',
				routeKind: 'projection',
				projectionEntity: 'EvmCoinInstance',
				projectionPath: [
					'NativeCurrency',
				],
			},
			{
				id: 'EvmCoinInstance.NetworkTypeContract',
				routeKind: 'projection',
				projectionEntity: 'EvmCoinInstance',
				projectionPath: [
					'Erc20Token',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]': {
		nodeId: '/(explore)/(networks)/network/[network]',
		publicPath: '/network/[network]',
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				fixture: {
					network: 'eip155:1',
				},
				variants: [
					{
						network: 'eip155:1',
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				fixture: {
					network: 'bitcoin',
				},
				variants: [
					{
						network: '0g',
					},
					{
						network: 'bittensor',
					},
					{
						network: 'bitcoin',
					},
					{
						network: 'bitcoin-cash',
					},
					{
						network: 'cosmos',
					},
					{
						network: 'filecoin',
					},
					{
						network: 'hyperliquid',
					},
					{
						network: 'lightning',
					},
					{
						network: 'monero',
					},
					{
						network: 'near',
					},
					{
						network: 'polkadot',
					},
					{
						network: 'quilibrium',
					},
					{
						network: 'solana',
					},
					{
						network: 'tron',
					},
					{
						network: 'zcash',
					},
				],
			},
		],
		fixture: {
			network: 'eip155:1',
		},
		variants: [
			{
				network: 'eip155:1',
			},
			{
				network: 'bitcoin',
			},
			{
				network: '0g',
			},
			{
				network: 'bittensor',
			},
			{
				network: 'bitcoin-cash',
			},
			{
				network: 'cosmos',
			},
			{
				network: 'filecoin',
			},
			{
				network: 'hyperliquid',
			},
			{
				network: 'lightning',
			},
			{
				network: 'monero',
			},
			{
				network: 'near',
			},
			{
				network: 'polkadot',
			},
			{
				network: 'quilibrium',
			},
			{
				network: 'solana',
			},
			{
				network: 'tron',
			},
			{
				network: 'zcash',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]': {
		nodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]',
		publicPath: '/network/[network]/account/[accountId]',
		mappings: [
			{
				id: 'PolkadotAccount.NetworkAccountId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
					accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
				},
				variants: [
					{
						network: 'polkadot',
						accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'EvmNetworkAccount.EvmNetworkEvmAccount',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaAccount.NetworkPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
		fixture: {
			network: 'polkadot',
			accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
		},
		variants: [
			{
				network: 'polkadot',
				accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]',
		publicPath: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]',
		mappings: [
			{
				id: 'PolkadotAccount_Timestamp.AccountTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
					accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
					timestampMs: '0',
					source: 'SubstrateSidecar_Rest',
				},
				variants: [
					{
						network: 'polkadot',
						accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
						timestampMs: '0',
						source: 'SubstrateSidecar_Rest',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		fixture: {
			network: 'polkadot',
			accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
			timestampMs: '0',
			source: 'SubstrateSidecar_Rest',
		},
		variants: [
			{
				network: 'polkadot',
				accountId: '5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F',
				timestampMs: '0',
				source: 'SubstrateSidecar_Rest',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]',
		publicPath: '/network/[network]/blob/[transactionId]/[indexInTransaction]',
		mappings: [
			{
				id: 'EvmBlob.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'eip155:1',
					transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
					indexInTransaction: '0',
				},
				variants: [
					{
						network: 'eip155:1',
						transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
						indexInTransaction: '0',
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		fixture: {
			network: 'eip155:1',
			transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
			indexInTransaction: '0',
		},
		variants: [
			{
				network: 'eip155:1',
				transactionId: '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
				indexInTransaction: '0',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]',
		publicPath: '/network/[network]/block/[blockNumber]',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]',
		mappings: [
			{
				id: 'PolkadotBlock.NetworkBlockNumberHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
				},
				variants: [
					{
						network: 'polkadot',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeightHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
		fixture: {
			network: 'polkadot',
		},
		variants: [
			{
				network: 'polkadot',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]',
		mappings: [
			{
				id: 'PolkadotEvent.BlockIndexInBlock',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
				},
				variants: [
					{
						network: 'polkadot',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		fixture: {
			network: 'polkadot',
		},
		variants: [
			{
				network: 'polkadot',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]',
		mappings: [
			{
				id: 'PolkadotExtrinsic.BlockIndexInBlock',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
				},
				variants: [
					{
						network: 'polkadot',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		fixture: {
			network: 'polkadot',
		},
		variants: [
			{
				network: 'polkadot',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]',
		publicPath: '/network/[network]/contract/[address]',
		mappings: [
			{
				id: 'EvmContract.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification': {
		nodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification',
		publicPath: '/network/[network]/contract/[address]/verification',
		mappings: [
			{
				id: 'EvmContractVerification.EvmContract',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'eip155:1',
					address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				variants: [
					{
						network: 'eip155:1',
						address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		fixture: {
			network: 'eip155:1',
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		},
		variants: [
			{
				network: 'eip155:1',
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		publicPath: '/network/[network]/tx/[transactionId]',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]',
		publicPath: '/network/[network]/tx/[transactionId]/input/[inputIndex]',
		mappings: [
			{
				id: 'UtxoInput.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]',
		publicPath: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]',
		publicPath: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInInstruction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]',
		publicPath: '/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]',
		mappings: [
			{
				id: 'EvmInternalTransfer.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]',
		publicPath: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]',
		mappings: [
			{
				id: 'EvmLog.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]',
		publicPath: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]',
		mappings: [
			{
				id: 'EvmTokenTransfer.LogIndexInLog',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]',
		publicPath: '/network/[network]/tx/[transactionId]/output/[outputIndex]',
		mappings: [
			{
				id: 'UtxoOutput.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/fungible-amount': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/fungible-amount',
		publicPath: '/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token/fungible-amount',
		mappings: [
			{
				id: 'BitcoinCashCashTokenFungibleAmount.UtxoOutput',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'bitcoin-cash',
				},
				variants: [
					{
						network: 'bitcoin-cash',
					},
				],
				projectionPath: [
					'CashTokens',
				],
			},
		],
		fixture: {
			network: 'bitcoin-cash',
		},
		variants: [
			{
				network: 'bitcoin-cash',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/nft': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/nft',
		publicPath: '/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token/nft',
		mappings: [
			{
				id: 'BitcoinCashCashTokenNft.UtxoOutput',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'bitcoin-cash',
				},
				variants: [
					{
						network: 'bitcoin-cash',
					},
				],
				projectionPath: [
					'CashTokens',
				],
			},
		],
		fixture: {
			network: 'bitcoin-cash',
		},
		variants: [
			{
				network: 'bitcoin-cash',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/nft/commitment': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token/nft/commitment',
		publicPath: '/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token/nft/commitment',
		mappings: [
			{
				id: 'BitcoinCashCashTokenCommitment.UtxoOutput',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'bitcoin-cash',
				},
				variants: [
					{
						network: 'bitcoin-cash',
					},
				],
				projectionPath: [
					'CashTokens',
				],
			},
		],
		fixture: {
			network: 'bitcoin-cash',
		},
		variants: [
			{
				network: 'bitcoin-cash',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]',
		publicPath: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]',
		mappings: [
			{
				id: 'ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'zcash',
					transactionId: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
					pool: 'sapling',
					actionKind: 'spend',
					actionIndex: '0',
				},
				projectionPath: [
					'Zcash',
				],
			},
		],
		fixture: {
			network: 'zcash',
			transactionId: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
			pool: 'sapling',
			actionKind: 'spend',
			actionIndex: '0',
		},
		variants: [
			{
				network: 'zcash',
				transactionId: '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff',
				pool: 'sapling',
				actionKind: 'spend',
				actionIndex: '0',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]',
		publicPath: '/network/[network]/consensus/[upgradeSlug]',
		mappings: [
			{
				id: 'EthereumConsensusUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'eip155:1',
					upgradeSlug: 'bellatrix',
				},
				variants: [
					{
						network: 'eip155:1',
						upgradeSlug: 'bellatrix',
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		fixture: {
			network: 'eip155:1',
			upgradeSlug: 'bellatrix',
		},
		variants: [
			{
				network: 'eip155:1',
				upgradeSlug: 'bellatrix',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]',
		publicPath: '/network/[network]/execution/[upgradeSlug]',
		mappings: [
			{
				id: 'EthereumExecutionUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]',
		publicPath: '/network/[network]/upgrade/[upgradeSlug]',
		mappings: [
			{
				id: 'EthereumNetworkUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/address/[address]',
		publicPath: '/network/[network]/address/[address]',
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/address/[address]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'UtxoAddress_Timestamp.AddressTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]': {
		nodeId: '/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]',
		publicPath: '/network/[network]/asset/[kind]/[assetKey]',
		mappings: [
			{
				id: 'AssetInstance.NetworkKindAssetKey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					kind: 'Native',
					assetKey: 'ETH',
				},
				projectionPath: [
					'Evm',
				],
			},
		],
		fixture: {
			kind: 'Native',
			assetKey: 'ETH',
		},
		variants: [
			{
				kind: 'Native',
				assetKey: 'ETH',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]': {
		nodeId: '/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]',
		publicPath: '/network/[network]/bridges/[toCaip2]/[url]',
		mappings: [
			{
				id: 'EvmNetworkBridge.FromToUrl',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]': {
		nodeId: '/(explore)/(networks)/network/[network]/channels/[channelId]',
		publicPath: '/network/[network]/channels/[channelId]',
		mappings: [
			{
				id: 'LightningChannel.NetworkChannelId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/epoch/[epoch]': {
		nodeId: '/(explore)/(networks)/network/[network]/epoch/[epoch]',
		publicPath: '/network/[network]/epoch/[epoch]',
		mappings: [
			{
				id: 'BeaconEpoch.EvmNetworkEpoch',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]',
		publicPath: '/network/[network]/erc-4337/account-factory/[address]',
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]',
		publicPath: '/network/[network]/erc-4337/bundler/[address]',
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'Erc4337Bundler_Timestamp.BundlerTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]',
		publicPath: '/network/[network]/erc-4337/paymaster/[address]',
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]',
		publicPath: '/network/[network]/erc-4337/smart-account/[address]',
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'Erc4337SmartAccount_Timestamp.AccountTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]': {
		nodeId: '/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]',
		publicPath: '/network/[network]/fee-market/block/[blockNumber]',
		mappings: [
			{
				id: 'EvmNetwork_GasFee_Block.EvmNetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/finality/[timestampMs]': {
		nodeId: '/(explore)/(networks)/network/[network]/finality/[timestampMs]',
		publicPath: '/network/[network]/finality/[timestampMs]',
		mappings: [
			{
				id: 'EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]',
		publicPath: '/network/[network]/gas-estimates/[timestampMs]/[source]',
		mappings: [
			{
				id: 'EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices/[paymentHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/invoices/[paymentHash]',
		publicPath: '/network/[network]/invoices/[paymentHash]',
		mappings: [
			{
				id: 'BlockheadLightningInvoice.NetworkPaymentHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]',
		publicPath: '/network/[network]/mempool/[timestampMs]/[source]',
		mappings: [
			{
				id: 'EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]',
		publicPath: '/network/[network]/mev/builder/[builderPubkey]',
		mappings: [
			{
				id: 'MevBuilder.EvmNetworkBuilderPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]',
		publicPath: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]',
		mappings: [
			{
				id: 'MevBuilder_Timestamp.BuilderTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]',
		publicPath: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]',
		mappings: [
			{
				id: 'MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]',
		publicPath: '/network/[network]/mev/relay/[host]',
		mappings: [
			{
				id: 'MevRelay.EvmNetworkHost',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]',
		publicPath: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]',
		mappings: [
			{
				id: 'MevRelay_Timestamp.RelayTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes/[pubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/nodes/[pubkey]',
		publicPath: '/network/[network]/nodes/[pubkey]',
		mappings: [
			{
				id: 'LightningNode.NetworkPublicKey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]',
		publicPath: '/network/[network]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'EvmNetwork_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/pallet/[palletName]': {
		nodeId: '/(explore)/(networks)/network/[network]/pallet/[palletName]',
		publicPath: '/network/[network]/pallet/[palletName]',
		mappings: [
			{
				id: 'PolkadotPallet.NetworkPalletName',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'polkadot',
				},
				variants: [
					{
						network: 'polkadot',
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		fixture: {
			network: 'polkadot',
		},
		variants: [
			{
				network: 'polkadot',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments/[paymentHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/payments/[paymentHash]',
		publicPath: '/network/[network]/payments/[paymentHash]',
		mappings: [
			{
				id: 'BlockheadLightningPayment.NetworkPaymentHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/program/[programId]': {
		nodeId: '/(explore)/(networks)/network/[network]/program/[programId]',
		publicPath: '/network/[network]/program/[programId]',
		mappings: [
			{
				id: 'SolanaProgram.NetworkProgramId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]': {
		nodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]',
		publicPath: '/network/[network]/rollup/[projectId]',
		mappings: [
			{
				id: 'EvmRollup.EvmNetworkProjectId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]',
		publicPath: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]',
		mappings: [
			{
				id: 'EvmRollup_Timestamp.RollupTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/shielded-pool/[pool]': {
		nodeId: '/(explore)/(networks)/network/[network]/shielded-pool/[pool]',
		publicPath: '/network/[network]/shielded-pool/[pool]',
		mappings: [
			{
				id: 'ZcashShieldedPool.NetworkPool',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'zcash',
					pool: 'orchard',
				},
				variants: [
					{
						network: 'zcash',
						pool: 'sapling',
					},
					{
						network: 'zcash',
						pool: 'orchard',
					},
				],
				projectionPath: [
					'Zcash',
				],
			},
		],
		fixture: {
			network: 'zcash',
			pool: 'orchard',
		},
		variants: [
			{
				network: 'zcash',
				pool: 'orchard',
			},
			{
				network: 'zcash',
				pool: 'sapling',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]',
		publicPath: '/network/[network]/slot/[slot]',
		mappings: [
			{
				id: 'BeaconSlot.EvmNetworkSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]',
		publicPath: '/network/[network]/slot/[slot]/attestation/[index]',
		mappings: [
			{
				id: 'BeaconAttestation.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]',
		publicPath: '/network/[network]/slot/[slot]/committee/[index]',
		mappings: [
			{
				id: 'BeaconCommittee.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]',
		publicPath: '/network/[network]/slot/[slot]/slashing/[kind]/[index]',
		mappings: [
			{
				id: 'BeaconSlashing.EvmNetworkSlotKindIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				fixture: {
					network: 'eip155:1',
					slot: '9500000',
					kind: 'proposer',
					index: '0',
				},
				variants: [
					{
						network: 'eip155:1',
						slot: '9500000',
						kind: 'proposer',
						index: '0',
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		fixture: {
			network: 'eip155:1',
			slot: '9500000',
			kind: 'proposer',
			index: '0',
		},
		variants: [
			{
				network: 'eip155:1',
				slot: '9500000',
				kind: 'proposer',
				index: '0',
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]',
		publicPath: '/network/[network]/slot/[slot]/withdrawal/[index]',
		mappings: [
			{
				id: 'BeaconWithdrawal.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sync-committee/[period]': {
		nodeId: '/(explore)/(networks)/network/[network]/sync-committee/[period]',
		publicPath: '/network/[network]/sync-committee/[period]',
		mappings: [
			{
				id: 'BeaconSyncCommittee.EvmNetworkPeriod',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]',
		publicPath: '/network/[network]/token-account/[tokenAccountPubkey]',
		mappings: [
			{
				id: 'SolanaTokenAccount.NetworkTokenAccountPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mint/[mintAddress]': {
		nodeId: '/(explore)/(networks)/network/[network]/token-mint/[mintAddress]',
		publicPath: '/network/[network]/token-mint/[mintAddress]',
		mappings: [
			{
				id: 'SolanaTokenMint.NetworkMintAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]',
		publicPath: '/network/[network]/user-operation/[userOperationHash]',
		mappings: [
			{
				id: 'EvmUserOperation.EvmNetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]': {
		nodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]',
		publicPath: '/network/[network]/validator/[validatorId]',
		mappings: [
			{
				id: 'BeaconValidator.NetworkIndexInNetwork',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaValidator.NetworkVotePubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]',
		publicPath: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]',
		mappings: [
			{
				id: 'BeaconValidator_Timestamp.ValidatorSlotSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(social)/(nostr)/nostr/reaction/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/reaction/[eventId]',
		publicPath: '/nostr/reaction/[eventId]',
		mappings: [
			{
				id: 'NostrReaction.CanonicalEventId',
				routeKind: 'detail',
				fixture: {
					eventId: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
				},
			},
		],
		fixture: {
			eventId: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
		},
		variants: [
			{
				eventId: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
			},
		],
	},
	'/(social)/(nostr)/nostr/repost/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/repost/[eventId]',
		publicPath: '/nostr/repost/[eventId]',
		mappings: [
			{
				id: 'NostrRepost.CanonicalEventId',
				routeKind: 'detail',
				fixture: {
					eventId: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				},
			},
		],
		fixture: {
			eventId: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		},
		variants: [
			{
				eventId: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]',
		publicPath: '/reddit/comment/[fullname]',
		mappings: [
			{
				id: 'RedditComment.Fullname',
				routeKind: 'detail',
				fixture: {
					fullname: 't1_osbo75d',
				},
			},
		],
		fixture: {
			fullname: 't1_osbo75d',
		},
		variants: [
			{
				fullname: 't1_osbo75d',
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/(comment)/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]/(comment)/observations/[timestampMs]/[source]',
		publicPath: '/reddit/comment/[fullname]/observations/[timestampMs]/[source]',
		mappings: [
			{
				id: 'RedditComment_Timestamp.CommentTimestampMsSource',
				routeKind: 'detail',
				fixture: {
					fullname: 't1_osbo75d',
				},
			},
		],
		fixture: {
			fullname: 't1_osbo75d',
		},
		variants: [
			{
				fullname: 't1_osbo75d',
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]': {
		nodeId: '/(social)/(xmtp)/xmtp/conversation/[conversationId]',
		publicPath: '/xmtp/conversation/[conversationId]',
		mappings: [
			{
				id: 'XmtpConversation.Id',
				routeKind: 'detail',
				fixture: {
					conversationId: 'e2e-probe-conversation',
				},
			},
		],
		fixture: {
			conversationId: 'e2e-probe-conversation',
		},
		variants: [
			{
				conversationId: 'e2e-probe-conversation',
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]',
		publicPath: '/youtube/channel/[channelId]',
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				routeKind: 'detail',
				fixture: {
					channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
				},
			},
		],
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		variants: [
			{
				channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]',
		publicPath: '/youtube/channel/[channelId]/observations/[timestampMs]',
		mappings: [
			{
				id: 'YoutubeChannel_Timestamp.YoutubeChannelTimestampMs',
				routeKind: 'detail',
				fixture: {
					channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
				},
			},
		],
		fixture: {
			channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
		},
		variants: [
			{
				channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
			},
		],
	},
} as const satisfies Record<string, E2eRouteFixtureMetadata>
