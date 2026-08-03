import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TronNodeBlock,
	TronNodeContractValue,
	TronNodeTransaction,
	TronNodeTransactionInfo,
	TronNodeWitness,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const tronMainnetCaip2 = {
	namespace: Caip2Namespace.Tron,
	reference: Caip2Reference.TronMainnet,
} as const

const tronNetworkApplicability = [
	{
		caip2: tronMainnetCaip2,
	},
	{
		slug: networkBySlug.tron.slug,
	},
] as const

const tronNetworkResolverSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [tronNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [tronNetworkApplicability[1]],
		resolve,
	},
})

const tronNetworkReferenceApplicability = [
	{
		$network: tronNetworkApplicability[0],
	},
	{
		$network: tronNetworkApplicability[1],
	},
] as const

const tronNetworkTimestampApplicability = [
	{
		...tronNetworkReferenceApplicability[0],
		source: Source.TronGrid_Rest,
	},
	{
		...tronNetworkReferenceApplicability[1],
		source: Source.TronGrid_Rest,
	},
] as const

const tronAccountTimestampApplicability = [
	{
		$account: tronNetworkReferenceApplicability[0],
		source: Source.TronGrid_Rest,
	},
	{
		$account: tronNetworkReferenceApplicability[1],
		source: Source.TronGrid_Rest,
	},
] as const

const tronTransactionReferenceApplicability = [
	{
		$transaction: tronNetworkReferenceApplicability[0],
	},
	{
		$transaction: tronNetworkReferenceApplicability[1],
	},
] as const

const tronWitnessTimestampApplicability = [
	{
		$witness: tronNetworkReferenceApplicability[0],
		source: Source.TronGrid_Rest,
	},
	{
		$witness: tronNetworkReferenceApplicability[1],
		source: Source.TronGrid_Rest,
	},
] as const

const assertTronMainnet = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.tron.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === tronMainnetCaip2.namespace
			&& network.caip2.reference === tronMainnetCaip2.reference
		)
	)
		return

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
	network: NetworkId,
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
						[EntityMetaKey.Fields]: Object.fromEntries(
							Object.entries(transactionFields(
								network,
								transaction,
								{
									blockNumber: rawBlock.number,
									blockTimeStamp: rawBlock.timestamp,
								}
							)).map(([fieldName, value]) => [
								entityFieldAddressKey(EntityType.TronTransaction, [], fieldName),
								value,
							])
						),
					},
				]
		)),
	}
}

const transactionFields = (
	network: NetworkId,
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
	network: NetworkId,
	witnesses: TronNodeWitness[]
) => (
	witnesses.map((witness) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			address: witness.address,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.TronWitness, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$witness: {
						$network: network,
						address: witness.address,
					},
					timestampMs: Date.now(),
					source: Source.TronGrid_Rest,
				},
			}],
		},
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
		defineResolver({
			entityType: EntityType.Network,
			resolve: tronNetworkResolverSelectors(
				async (network) => {
					assertTronMainnet(network)
					const { getRestEndpoints } = await import('$/sources/TronGrid/Rest/queries.ts')
					return getRestEndpoints()
				}
			),
		})({
				Tron: {
					restEndpoints: (restEndpoints) => restEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.TronNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: tronNetworkTimestampApplicability,
					resolve: async ({ $network }) => {
						assertTronMainnet($network)
						const {
							getChainParameters,
							getNodeInfo,
							getNowBlock,
							listWitnesses,
						} = await import('$/sources/TronGrid/Rest/queries.ts')
						const block = await getNowBlock()
						const witnesses = await listWitnesses()
						const chainParameters = await getChainParameters()
						const nodeInfo = await getNodeInfo()
						return {
							latestBlockHeight: BigInt(block.block_header?.raw_data?.number ?? 0),
							latestBlockHash: block.blockID,
							latestBlockTimeMs: block.block_header?.raw_data?.timestamp,
							latestBlockTransactionCount: block.transactions?.length ?? 0,
							witnessCount: witnesses.witnesses.length,
							activeWitnessCount: witnesses.witnesses.filter((witness) => witness.isJobs).length,
							nodeBlockHeight: heightFromNodeInfoBlock(nodeInfo.block),
							solidityBlockHeight: heightFromNodeInfoBlock(nodeInfo.solidityBlock),
							currentPeerCount: nodeInfo.currentConnectCount,
							maintenanceIntervalMs: Number(chainParameterValue(chainParameters.chainParameter, 'getMaintenanceTimeInterval') ?? 0n),
							transactionFeeSun: chainParameterValue(chainParameters.chainParameter, 'getTransactionFee'),
							createAccountFeeSun: chainParameterValue(chainParameters.chainParameter, 'getCreateAccountFee'),
						}
					},
				}
			},
		})({
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
			}),

		defineResolver({
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeightHash: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {
						assertTronMainnet($network)
						const { getBlockByNumber } = await import('$/sources/TronGrid/Rest/queries.ts')
						return blockFields(
							$network,
							await getBlockByNumber({
								height: height,
							})
						)
					},
				}
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				parentHash: (block) => block.parentHash,
				timestampMs: (block) => block.timestampMs,
				$witness: (block) => block.$witness,
				txTrieRoot: (block) => block.txTrieRoot,
				version: (block) => block.version,
				transactionCount: (block) => block.transactionCount,
				$$transactions: (block) => block.$$transactions,
			}),

		defineResolver({
			entityType: EntityType.TronTransaction,
			resolve: {
				NetworkTransactionId: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, transactionId }) => {
						assertTronMainnet($network)
						const {
							getTransactionById,
							getTransactionInfoById,
						} = await import('$/sources/TronGrid/Rest/queries.ts')
						const transaction = await getTransactionById({
							transactionId: transactionId,
						})
						if (transaction.txID == null) throw new Error(`TronGrid_Rest: transaction not found for ${transactionId}`)
						return transactionFields(
							$network,
							transaction,
							await getTransactionInfoById({
								transactionId: transactionId,
							})
						)
					},
				}
			},
		})({
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
			}),

		defineResolver({
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getAccount } = await import('$/sources/TronGrid/Rest/queries.ts')
						const account = await getAccount({
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
										timestampMs: account.latest_opration_time ?? account.create_time ?? Date.now(),
										source: Source.TronGrid_Rest,
									},
								},
							],
						}
					},
				}
			},
		})({
				name: (account) => account.name,
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					appliesTo: tronAccountTimestampApplicability,
					resolve: async ({ $account }) => {
						assertTronMainnet($account.$network)
						const {
							getAccount,
							getAccountResource,
						} = await import('$/sources/TronGrid/Rest/queries.ts')
						const [
							account,
							accountResource,
						] = await Promise.all([
							getAccount({
								address: $account.address,
							}),
							getAccountResource({
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
					},
				}
			},
		})({
				balanceSun: (account) => account.balanceSun,
				createdTimestampMs: (account) => account.createdTimestampMs,
				latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
				freeNetUsed: (account) => account.freeNetUsed,
				freeNetLimit: (account) => account.freeNetLimit,
				netUsed: (account) => account.netUsed,
				netLimit: (account) => account.netLimit,
				energyUsed: (account) => account.energyUsed,
				energyLimit: (account) => account.energyLimit,
			}),

		defineResolver({
			entityType: EntityType.TronTransactionReceipt,
			resolve: {
				Transaction: {
					appliesTo: tronTransactionReferenceApplicability,
					resolve: async ({ $transaction }) => {
						assertTronMainnet($transaction.$network)
						const { getTransactionInfoById } = await import('$/sources/TronGrid/Rest/queries.ts')
						return receiptFields(await getTransactionInfoById({
							transactionId: $transaction.transactionId,
						}))
					},
				}
			},
		})({
				feeSun: (receipt) => receipt.feeSun,
				result: (receipt) => receipt.result,
				energyUsageTotal: (receipt) => receipt.energyUsageTotal,
				netUsage: (receipt) => receipt.netUsage,
				contractResultHex: (receipt) => receipt.contractResultHex,
			}),

		defineResolver({
			entityType: EntityType.TronWitness,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
						const witness = (await listWitnesses()).witnesses
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
					},
				}
			},
		})({
				$$timestamps: (witness) => witness.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.TronWitness_Timestamp,
			resolve: {
				WitnessTimestampMsSource: {
					appliesTo: tronWitnessTimestampApplicability,
					resolve: async ({ $witness }) => {
						assertTronMainnet($witness.$network)
						const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
						const witness = (await listWitnesses()).witnesses
							.find((tronAccount) => tronAccount.address === $witness.address)
						if (witness == null) throw new Error(`TronGrid_Rest: witness not found for ${$witness.address}`)
						return witnessFields(witness)
					},
				}
			},
		})({
				url: (timestamp) => timestamp.url,
				voteCount: (timestamp) => timestamp.voteCount,
				totalProduced: (timestamp) => timestamp.totalProduced,
				totalMissed: (timestamp) => timestamp.totalMissed,
				latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
				latestSlotNumber: (timestamp) => timestamp.latestSlotNumber,
				active: (timestamp) => timestamp.active,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tronNetworkResolverSelectors(
				async (network) => {
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
			),
		})({
				Tron: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tronNetworkResolverSelectors(
				async (network) => {
					assertTronMainnet(network)
					const { listWitnesses } = await import('$/sources/TronGrid/Rest/queries.ts')
					return witnessRows(
						network,
						(await listWitnesses()).witnesses
					)
				}
			),
		})({
				Tron: {
					$$witnesses: (witnesses) => witnesses,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: tronNetworkResolverSelectors(
				async (network, context) => {
					assertTronMainnet(network)
					const { getNowBlock } = await import('$/sources/TronGrid/Rest/queries.ts')
					const block = await getNowBlock()
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
			),
		})({
				Tron: {
					$$blocks: (blocks) => blocks,
				},
			}),


		defineResolver({
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						assertTronMainnet($network)
						const { getAccountTransactions } = await import('$/sources/TronGrid/Rest/queries.ts')
						return (await getAccountTransactions({
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
									},
								]
						))
					},
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),
	],
} satisfies RegisteredSourceResolverModule
