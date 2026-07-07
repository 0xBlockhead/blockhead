import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
import { TronAccount_TimestampSelector } from '$/schema/TronAccount_Timestamp.ts'
import { TronWitnessSelector } from '$/schema/TronWitness.ts'
import { TronWitness_TimestampSelector } from '$/schema/TronWitness_Timestamp.ts'
import { TronTransactionReceiptSelector } from '$/schema/TronTransactionReceipt.ts'
import { NetworkSelector } from '$/schema/Network.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const tronGridRestBaseUrl = async () => (
	(await import('$/sources/TronGrid/Rest/queries.ts')).tronGridRestEndpoints[0].restBaseUrl
)

const assertTronMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.tron.slug)
		throw new Error('TronGrid_Rest: unsupported network')
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
	network: NetworkSelector,
	block: TronNodeBlock
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null)
		throw new Error('TronGrid_Rest: block is missing height')
	if (block.blockID == null)
		throw new Error('TronGrid_Rest: block is missing hash')
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
							}
						),
					},
				]
		)),
	}
}

const transactionFields = (
	network: NetworkSelector,
	transaction: TronNodeTransaction,
	info?: TronNodeTransactionInfo
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
		...(transaction.txID != null && {
			$receipt: {
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: network,
						transactionId: transaction.txID,
					},
				},
			},
		}),
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
		signatures: transaction.signature ?? [],
	}
}

const receiptFields = (info: TronNodeTransactionInfo) => ({
	feeSun: bigintFromNumberOrString(info.fee),
	result: info.receipt?.result,
	energyUsageTotal: bigintFromNumberOrString(info.receipt?.energy_usage_total),
	netUsage: bigintFromNumberOrString(info.receipt?.net_usage),
	contractResultHex: info.contractResult ?? [],
})

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
		latestSlotNumber: BigInt(witness.latestBlockNum),
	}),
	active: witness.isJobs,
})

const witnessRows = (
	network: NetworkSelector,
	witnesses: TronNodeWitness[]
) => (
	witnesses.map((witness) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			address: witness.address,
		},
		$$timestamps: [
			{
				[EntityMetaKey.Selector]: {
					$witness: {
						$network: network,
						address: witness.address,
					},
					timestampMs: Date.now(),
					source: Source.TronGrid_Rest,
				},
			},
		],
	}))
)

const chainParameterValue = (
	parameters: {
		key: string
		value?: number | string
	}[],
	key: string
) => (
	bigintFromNumberOrString(parameters.find((parameter) => parameter.key === key)?.value)
)

export default {
	source: Source.TronGrid_Rest,

	resolvers: [
		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async ({ $network }) => {
					assertTronMainnet($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						restEndpoints: [
							{
								url: await tronGridRestBaseUrl(),
								transportType: TransportType.Http,
								providerName: 'TronGrid',
							},
						],
					}
				}
			},
		})({
			fields: {
				$network: (network) => network.$network,
				restEndpoints: (network) => network.restEndpoints,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertTronMainnet(network)
					return [
						{
							url: await tronGridRestBaseUrl(),
							transportType: TransportType.Http,
							providerName: 'TronGrid',
						},
					]
				}
			},
		})({
			fields: {
				tronRestEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork_Timestamp,
			resolve: {
				[TronNetwork_TimestampSelector.NetworkTimestampMsSource]: async ({ $network }) => {
					assertTronMainnet($network)
					const {
						getChainParameters,
						getNodeInfo,
						getNowBlock,
						listWitnesses,
					} = await import('$/sources/TronGrid/Rest/queries.ts')
					const block = await getNowBlock({ restBaseUrl: await tronGridRestBaseUrl() })
					const witnesses = await listWitnesses({ restBaseUrl: await tronGridRestBaseUrl() })
					const chainParameters = await getChainParameters({ restBaseUrl: await tronGridRestBaseUrl() }).catch(() => undefined)
					const nodeInfo = await getNodeInfo({ restBaseUrl: await tronGridRestBaseUrl() }).catch(() => undefined)
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
			},
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
							restBaseUrl: await tronGridRestBaseUrl(),
							height: height,
						})
					)
				}
			},
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
						restBaseUrl: await tronGridRestBaseUrl(),
						transactionId: transactionId,
					})
					if (transaction.txID == null) throw new Error(`TronGrid_Rest: transaction not found for ${transactionId}`)
					return transactionFields(
						$network,
						transaction,
						await getTransactionInfoById({
							restBaseUrl: await tronGridRestBaseUrl(),
							transactionId: transactionId,
						})
					)
				}
			},
		})({
			fields: {
				$block: (transaction) => transaction.$block,
				blockHeight: (transaction) => transaction.blockHeight,
				timestampMs: (transaction) => transaction.timestampMs,
				expirationTimestampMs: (transaction) => transaction.expirationTimestampMs,
				contractType: (transaction) => transaction.contractType,
				result: (transaction) => transaction.result,
				feeSun: (transaction) => transaction.feeSun,
				$receipt: (transaction) => transaction.$receipt,
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
						restBaseUrl: await tronGridRestBaseUrl(),
						address: address,
					})
					return {
						name: account.account_name,
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$account: {
										$network,
										address,
									},
									timestampMs: Date.now(),
									source: Source.TronGrid_Rest,
								},
							},
						],
					}
				}
			},
		})({
			fields: {
				name: (account) => account.name,
				$$timestamps: (account) => account.$$timestamps,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				[TronAccount_TimestampSelector.AccountTimestampMsSource]: async ({ $account }) => {
					assertTronMainnet($account.$network)
					const {
						getAccount,
						getAccountResource,
					} = await import('$/sources/TronGrid/Rest/queries.ts')
					const restBaseUrl = await tronGridRestBaseUrl()
					const [
						account,
						accountResource,
					] = await Promise.all([
						getAccount({
							restBaseUrl,
							address: $account.address,
						}),
						getAccountResource({
							restBaseUrl,
							address: $account.address,
						}),
					])
					return {
						...(account.balance != null && {
							balanceSun: BigInt(account.balance),
						}),
						createdTimestampMs: account.create_time,
						latestOperationTimestampMs: account.latest_opration_time,
						freeNetUsed: bigintFromNumberOrString(accountResource.freeNetUsed),
						freeNetLimit: bigintFromNumberOrString(accountResource.freeNetLimit),
						netUsed: bigintFromNumberOrString(accountResource.NetUsed),
						netLimit: bigintFromNumberOrString(accountResource.NetLimit),
						energyUsed: bigintFromNumberOrString(accountResource.EnergyUsed),
						energyLimit: bigintFromNumberOrString(accountResource.EnergyLimit),
					}
				}
			},
		})({
			fields: {
				balanceSun: (account) => account.balanceSun,
				createdTimestampMs: (account) => account.createdTimestampMs,
				latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
				freeNetUsed: (account) => account.freeNetUsed,
				freeNetLimit: (account) => account.freeNetLimit,
				netUsed: (account) => account.netUsed,
				netLimit: (account) => account.netLimit,
				energyUsed: (account) => account.energyUsed,
				energyLimit: (account) => account.energyLimit,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronTransactionReceipt,
			resolve: {
				[TronTransactionReceiptSelector.Transaction]: async ({ $transaction }) => {
					assertTronMainnet($transaction.$network)
					const { getTransactionInfoById } = await import('$/sources/TronGrid/Rest/queries.ts')
					return receiptFields(await getTransactionInfoById({
						restBaseUrl: await tronGridRestBaseUrl(),
						transactionId: $transaction.transactionId,
					}))
				}
			},
		})({
			fields: {
				feeSun: (receipt) => receipt.feeSun,
				result: (receipt) => receipt.result,
				energyUsageTotal: (receipt) => receipt.energyUsageTotal,
				netUsage: (receipt) => receipt.netUsage,
				contractResultHex: (receipt) => receipt.contractResultHex,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronWitness,
			resolve: {
				[TronWitnessSelector.NetworkAddress]: async ({ $network, address }) => {
					assertTronMainnet($network)
					const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
					const witness = (await listWitnesses({ restBaseUrl: await tronGridRestBaseUrl() })).witnesses
						.find((tronAccount) => tronAccount.address === address)
					if (witness == null) throw new Error(`TronGrid_Rest: witness not found for ${address}`)
					return {
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$witness: {
										$network,
										address,
									},
									timestampMs: Date.now(),
									source: Source.TronGrid_Rest,
								},
							},
						],
					}
				}
			},
		})({
			fields: {
				$$timestamps: (witness) => witness.$$timestamps,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronWitness_Timestamp,
			resolve: {
				[TronWitness_TimestampSelector.WitnessTimestampMsSource]: async ({ $witness }) => {
					assertTronMainnet($witness.$network)
					const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
					const witness = (await listWitnesses({ restBaseUrl: await tronGridRestBaseUrl() })).witnesses
						.find((tronAccount) => tronAccount.address === $witness.address)
					if (witness == null) throw new Error(`TronGrid_Rest: witness not found for ${$witness.address}`)
					return witnessFields(witness)
				}
			},
		})({
			fields: {
				url: (timestamp) => timestamp.url,
				voteCount: (timestamp) => timestamp.voteCount,
				totalProduced: (timestamp) => timestamp.totalProduced,
				totalMissed: (timestamp) => timestamp.totalMissed,
				latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
				latestSlotNumber: (timestamp) => timestamp.latestSlotNumber,
				active: (timestamp) => timestamp.active,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async ({ $network }) => {
					assertTronMainnet($network)
					return [
						{
							url: await tronGridRestBaseUrl(),
							transportType: TransportType.Http,
							providerName: 'TronGrid',
						},
					]
				}
			},
		})({
			fields: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertTronMainnet(network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: Date.now(),
								source: Source.TronGrid_Rest,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$tronTimestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async ({ $network }) => {
					assertTronMainnet($network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network,
								timestampMs: Date.now(),
								source: Source.TronGrid_Rest,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertTronMainnet(network)
					const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
					return witnessRows(
						network,
						(await listWitnesses({ restBaseUrl: await tronGridRestBaseUrl() })).witnesses
					)
				}
			},
		})({
			fields: {
				$$tronWitnesses: (witnesses) => witnesses,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async ({ $network }) => {
					assertTronMainnet($network)
					const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
					return witnessRows(
						$network,
						(await listWitnesses({ restBaseUrl: await tronGridRestBaseUrl() })).witnesses
					)
				}
			},
		})({
			fields: {
				$$witnesses: (witnesses) => witnesses,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.TronNetwork,
			resolve: {
				[TronNetworkSelector.Network]: async ({ $network }, context) => {
					assertTronMainnet($network)
					const { getNowBlock } = await import('$/sources/TronGrid/Rest/queries.ts')
					const block = await getNowBlock({ restBaseUrl: await tronGridRestBaseUrl() })
					const headBlockHeight = BigInt(block.block_header?.raw_data?.number ?? 0)
					return Array.from({
						length: Math.min(
							Number(headBlockHeight + 1n),
							resolverContextRowLimit(context)
					),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network,
							height: headBlockHeight - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: block.blockID,
							}),
						},
						...(blockOffset === 0 && blockFields(
								$network,
								block
						)),
					}))
				}
			},
		})({
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver(Source.TronGrid_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertTronMainnet(network)
					const { getNowBlock } = await import('$/sources/TronGrid/Rest/queries.ts')
					const block = await getNowBlock({ restBaseUrl: await tronGridRestBaseUrl() })
					const headBlockHeight = BigInt(block.block_header?.raw_data?.number ?? 0)
					return Array.from({
						length: Math.min(
							Number(headBlockHeight + 1n),
							resolverContextRowLimit(context)
						),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							height: headBlockHeight - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: block.blockID,
							}),
						},
					}))
				}
			},
		})({
			fields: {
				$$tronBlocks: (blocks) => blocks,
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
							restBaseUrl: await tronGridRestBaseUrl(),
							height: height,
						})
						).$$transactions
				}
			},
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
						restBaseUrl: await tronGridRestBaseUrl(),
						address: address,
						limit: resolverContextRowLimit(context),
					})).data.flatMap((transaction) => (
						transaction.txID == null ?
							[]
						:
							[
								{
									[EntityMetaKey.Selector]: {
										$network,
										transactionId: transaction.txID,
									},
									...transactionFields(
										$network,
										transaction
								),
								},
							]
					))
				}
			},
		})({
			fields: {
				$$transactions: (transactions) => transactions,
			},
		}),
	],
}
