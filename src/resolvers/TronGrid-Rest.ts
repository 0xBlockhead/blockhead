import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { tronGridMainnetRestBaseUrl } from '$/constants/TronNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TronTokenStandard } from '$/schema/TronToken.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TronNodeBlock,
	TronNodeContractValue,
	TronNodeTransaction,
	TronNodeTransactionInfo,
	TronNodeWitness,
} from '$/sources/TronGrid/Rest/types.ts'
import { TronNetworkSelector } from '$/schema/TronNetwork.ts'
import { TronNetwork_TimestampSelector } from '$/schema/TronNetwork_Timestamp.ts'
import { TronBlockSelector } from '$/schema/TronBlock.ts'
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { TronAccountSelector } from '$/schema/TronAccount.ts'
import { TronWitnessSelector } from '$/schema/TronWitness.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertTronMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.tron.slug) {
		throw new Error('TronGrid_Rest: unsupported network')
	}
}

const bigintFromNumberOrString = (value: number | string | undefined): bigint | undefined => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const heightFromNodeInfoBlock = (block: string | undefined): bigint | undefined => (
	block == null ?
		undefined
	:
		BigInt(block.match(/Num:(\d+)/)?.[1] ?? 0)
)

const firstContractValue = (transaction: TronNodeTransaction): TronNodeContractValue | undefined => (
	transaction.raw_data?.contract?.[0]?.parameter?.value
)

const blockFields = (
	network: NetworkId,
	block: TronNodeBlock,
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null) {
		throw new Error('TronGrid_Rest: block is missing height')
	}
	return {
		hash: block.blockID,
		...(rawBlock.number > 0 && rawBlock.parentHash != null && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(rawBlock.number - 1),
					hash: rawBlock.parentHash,
				},
			},
		}),
		parentHash: rawBlock.parentHash,
		timestampMs: rawBlock.timestamp,
		...(rawBlock.witness_address != null && {
			$witness: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: rawBlock.witness_address,
				},
			},
		}),
		txTrieRoot: rawBlock.txTrieRoot,
		version: rawBlock.version,
		transactionCount: block.transactions?.length,
		$$transactions: (block.transactions ?? []).flatMap((transaction) => (
			transaction.txID == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							transactionId: transaction.txID,
						},
						...transactionFields(
							network,
							transaction,
							{
								blockNumber: rawBlock.number,
								blockTimeStamp: rawBlock.timestamp,
							},
						),
					},
				]
		)),
	}
}

const transactionFields = (
	network: NetworkId,
	transaction: TronNodeTransaction,
	info?: TronNodeTransactionInfo,
) => {
	const contract = transaction.raw_data?.contract?.[0]
	const value = firstContractValue(transaction)
	const amountSun = bigintFromNumberOrString(value?.amount)
	return {
		...(info?.blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(info.blockNumber),
				},
			},
			blockHeight: BigInt(info.blockNumber),
		}),
		timestampMs: info?.blockTimeStamp ?? transaction.raw_data?.timestamp,
		expirationTimestampMs: transaction.raw_data?.expiration,
		contractType: contract?.type,
		result: info?.receipt?.result ?? transaction.ret?.[0]?.contractRet,
		feeSun: bigintFromNumberOrString(info?.fee ?? transaction.ret?.[0]?.fee),
		...(value?.owner_address != null && {
			$owner: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: value.owner_address,
				},
			},
		}),
		...(value?.to_address != null && {
			$to: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: value.to_address,
				},
			},
		}),
		...(value?.contract_address != null && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: value.contract_address,
				},
			},
		}),
		...(amountSun != null && {
			amountSun,
		}),
		assetName: value?.asset_name,
		rawDataHex: transaction.raw_data_hex,
		...(transaction.signature != null && {
			signatures: transaction.signature,
		}),
	}
}

const witnessFields = (witness: TronNodeWitness) => ({
	url: witness.url,
	...(witness.voteCount != null && {
		voteCount: BigInt(witness.voteCount),
	}),
	...(witness.totalProduced != null && {
		totalProduced: BigInt(witness.totalProduced),
	}),
	...(witness.totalMissed != null && {
		totalMissed: BigInt(witness.totalMissed),
	}),
	...(witness.latestBlockNum != null && {
		latestBlockHeight: BigInt(witness.latestBlockNum),
	}),
	active: witness.isJobs,
})

const witnessRows = (
	network: NetworkId,
	witnesses: TronNodeWitness[],
) => (
	witnesses.map((witness) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			address: witness.address,
		},
		...witnessFields(witness),
	}))
)

const chainParameterValue = (
	parameters: {
		key: string
		value?: number | string
	}[],
	key: string,
) => (
	bigintFromNumberOrString(parameters.find((parameter) => parameter.key === key)?.value)
)

export default {
	source: Source.TronGrid_Rest,

	resolvers: [
		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async (entitySelector) => {
				assertTronMainnet(entitySelector)
				return {
					$network: {
						[EntityMetaKey.Selector]: entitySelector,
					},
					restEndpoints: [
						{
							url: tronGridMainnetRestBaseUrl,
							transportType: TransportType.Http,
							providerName: 'TronGrid',
						},
					],
				}
			}
			}
		})({
				fields: {
			$network: (network) => network.$network,
			restEndpoints: (network) => network.restEndpoints,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork_Timestamp,
			resolve: {
				[TronNetwork_TimestampSelector.NetworkTimestampMs]: async ({ $network }) => {
				assertTronMainnet($network)
				const {
					getChainParameters,
					getNodeInfo,
					getNowBlock,
					listWitnesses,
				} = await import('$/sources/TronGrid/Rest/queries.ts')
				const block = await getNowBlock({ restBaseUrl: tronGridMainnetRestBaseUrl })
				const witnesses = await listWitnesses({ restBaseUrl: tronGridMainnetRestBaseUrl })
				const chainParameters = await getChainParameters({ restBaseUrl: tronGridMainnetRestBaseUrl }).catch(() => undefined)
				const nodeInfo = await getNodeInfo({ restBaseUrl: tronGridMainnetRestBaseUrl }).catch(() => undefined)
				return {
					latestBlockHeight: BigInt(block.block_header?.raw_data?.number ?? 0),
					latestBlockHash: block.blockID,
					latestBlockTimeMs: block.block_header?.raw_data?.timestamp,
					latestBlockTransactionCount: block.transactions?.length ?? 0,
					witnessCount: witnesses.witnesses.length,
					activeWitnessCount: witnesses.witnesses.filter((witness) => witness.isJobs).length,
					nodeBlockHeight: heightFromNodeInfoBlock(nodeInfo?.block),
					solidityBlockHeight: heightFromNodeInfoBlock(nodeInfo?.solidityBlock),
					currentPeerCount: nodeInfo?.currentConnectCount,
					maintenanceIntervalMs: chainParameters == null ? undefined : Number(chainParameterValue(chainParameters.chainParameter, 'getMaintenanceTimeInterval') ?? 0n),
					transactionFeeSun: chainParameters == null ? undefined : chainParameterValue(chainParameters.chainParameter, 'getTransactionFee'),
					createAccountFeeSun: chainParameters == null ? undefined : chainParameterValue(chainParameters.chainParameter, 'getCreateAccountFee'),
				}
			}
			}
		})({
				fields: {
			latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
			latestBlockHash: (timestamp) => timestamp.latestBlockHash,
			latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
			latestBlockTransactionCount: (timestamp) => timestamp.latestBlockTransactionCount,
			witnessCount: (timestamp) => timestamp.witnessCount,
			activeWitnessCount: (timestamp) => timestamp.activeWitnessCount,
			nodeBlockHeight: (timestamp) => timestamp.nodeBlockHeight,
			solidityBlockHeight: (timestamp) => timestamp.solidityBlockHeight,
			currentPeerCount: (timestamp) => timestamp.currentPeerCount,
			maintenanceIntervalMs: (timestamp) => timestamp.maintenanceIntervalMs,
			transactionFeeSun: (timestamp) => timestamp.transactionFeeSun,
			createAccountFeeSun: (timestamp) => timestamp.createAccountFeeSun,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[TronBlockSelector.NetworkHeightHash]: async ({ $network, height }) => {
				assertTronMainnet($network)
				const { getBlockByNumber } = await import('$/sources/TronGrid/Rest/queries.ts')
				return blockFields(
					$network,
					await getBlockByNumber({
						restBaseUrl: tronGridMainnetRestBaseUrl,
						height: height,
					}),
				)
			}
			}
		})({
				fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			parentHash: (block) => block.parentHash,
			timestampMs: (block) => block.timestampMs,
			$witness: (block) => block.$witness,
			txTrieRoot: (block) => block.txTrieRoot,
			version: (block) => block.version,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.$$transactions,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }) => {
				assertTronMainnet($network)
				const {
					getTransactionById,
					getTransactionInfoById,
				} = await import('$/sources/TronGrid/Rest/queries.ts')
				const transaction = await getTransactionById({
					restBaseUrl: tronGridMainnetRestBaseUrl,
					transactionId: transactionId,
				})
				if (transaction.txID == null) throw new Error(`TronGrid_Rest: transaction not found for ${transactionId}`)
				return transactionFields(
					$network,
					transaction,
					await getTransactionInfoById({
						restBaseUrl: tronGridMainnetRestBaseUrl,
						transactionId: transactionId,
					}),
				)
			}
			}
		})({
				fields: {
			$block: (transaction) => transaction.$block,
			blockHeight: (transaction) => transaction.blockHeight,
			timestampMs: (transaction) => transaction.timestampMs,
			expirationTimestampMs: (transaction) => transaction.expirationTimestampMs,
			contractType: (transaction) => transaction.contractType,
			result: (transaction) => transaction.result,
			feeSun: (transaction) => transaction.feeSun,
			$owner: (transaction) => transaction.$owner,
			$to: (transaction) => transaction.$to,
			$contract: (transaction) => transaction.$contract,
			amountSun: (transaction) => transaction.amountSun,
			assetName: (transaction) => transaction.assetName,
			rawDataHex: (transaction) => transaction.rawDataHex,
			signatures: (transaction) => transaction.signatures,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }) => {
				assertTronMainnet($network)
				const { getAccount } = await import('$/sources/TronGrid/Rest/queries.ts')
				const account = await getAccount({
					restBaseUrl: tronGridMainnetRestBaseUrl,
					address: address,
				})
				return {
					name: account.account_name,
					...(account.balance != null && {
						balanceSun: BigInt(account.balance),
					}),
					createdTimestampMs: account.create_time,
					latestOperationTimestampMs: account.latest_opration_time,
				}
			}
			}
		})({
				fields: {
			name: (account) => account.name,
			balanceSun: (account) => account.balanceSun,
			createdTimestampMs: (account) => account.createdTimestampMs,
			latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronWitness,
			resolve: {
				[TronWitnessSelector.NetworkAddress]: async ({ $network, address }) => {
				assertTronMainnet($network)
				const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
				const witness = (await listWitnesses({ restBaseUrl: tronGridMainnetRestBaseUrl })).witnesses
					.find((tronAccount) => tronAccount.address === entitySelector.address)
				if (witness == null) throw new Error(`TronGrid_Rest: witness not found for ${address}`)
				return witnessFields(witness)
			}
			},
			})({
				fields: {
					url: (witness) => witness.url,
					voteCount: (witness) => witness.voteCount,
					totalProduced: (witness) => witness.totalProducedBlocks,
					latestBlockHeight: (witness) => witness.latestBlockNumber,
					active: (witness) => witness.isActive,
				},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async (entitySelector) => {
				assertTronMainnet(entitySelector)
				return [
					{
						url: tronGridMainnetRestBaseUrl,
						transportType: TransportType.Http,
						providerName: 'TronGrid',
					},
				]
			}
			}
		})({
				fields: {
			restEndpoints: (restEndpoints) => restEndpoints,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async (entitySelector) => {
				assertTronMainnet(entitySelector)
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							timestampMs: Date.now(),
						},
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (timestamps) => timestamps,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async (entitySelector) => {
				assertTronMainnet(entitySelector)
				const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
				return witnessRows(
					entitySelector,
					(await listWitnesses({ restBaseUrl: tronGridMainnetRestBaseUrl })).witnesses,
				)
			}
			}
		})({
				fields: {
			$$witnesses: (witnesses) => witnesses,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async (entitySelector, context) => {
				assertTronMainnet(entitySelector)
				const { getNowBlock } = await import('$/sources/TronGrid/Rest/queries.ts')
				const block = await getNowBlock({ restBaseUrl: tronGridMainnetRestBaseUrl })
				const headBlockHeight = BigInt(block.block_header?.raw_data?.number ?? 0)
				return Array.from({
					length: Math.min(
						Number(headBlockHeight + 1n),
						resolverContextRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						height: headBlockHeight - BigInt(blockOffset),
						...(blockOffset === 0 && {
							hash: block.blockID,
						}),
					},
					...(blockOffset === 0 && blockFields(
						entitySelector,
						block,
					)),
				}))
			}
			}
		})({
				fields: {
			$$blocks: (blocks) => blocks,
		},
			}),






		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[TronBlockSelector.NetworkHeightHash]: async ({ $network, height }) => {
				assertTronMainnet($network)
				const { getBlockByNumber } = await import('$/sources/TronGrid/Rest/queries.ts')
				return blockFields(
					$network,
					await getBlockByNumber({
						restBaseUrl: tronGridMainnetRestBaseUrl,
						height: height,
					}),
				).$$transactions
			}
			}
		})({
				fields: {
			$$transactions: (transactions) => transactions,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }, context) => {
				assertTronMainnet($network)
				const { getAccountTransactions } = await import('$/sources/TronGrid/Rest/queries.ts')
				return (await getAccountTransactions({
					restBaseUrl: tronGridMainnetRestBaseUrl,
					address: address,
					limit: resolverContextRowLimit(context),
				})).data.flatMap((transaction) => (
					transaction.txID == null ?
						[]
					:
						[
							{
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									transactionId: transaction.txID,
								},
								...transactionFields(
									entitySelector.$network,
									transaction,
								),
							},
						]
				))
			}
			}
		})({
				fields: {
			$$transactions: (transactions) => transactions,
		},
			}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }, context) => {
				assertTronMainnet($network)
				const { getAccountTrc20Transfers } = await import('$/sources/TronGrid/Rest/queries.ts')
				return (await getAccountTrc20Transfers({
					restBaseUrl: tronGridMainnetRestBaseUrl,
					address: address,
					limit: resolverContextRowLimit(context),
				})).data.flatMap((transfer) => (
					transfer.token_info?.address == null ?
						[]
					:
						[
							{
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									tokenId: transfer.token_info.address,
								},
								standard: TronTokenStandard.Trc20,
								name: transfer.token_info.name,
								symbol: transfer.token_info.symbol,
								decimals: transfer.token_info.decimals,
							},
						]
				))
			}
			}
		})({
				fields: {
			$$tokens: (tokens) => tokens,
		},
			}),

	],
}
