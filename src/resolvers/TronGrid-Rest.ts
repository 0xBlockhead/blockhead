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

const tronTransactionReferenceApplicability = [
	{
		$transaction: tronNetworkReferenceApplicability[0],
	},
	{
		$transaction: tronNetworkReferenceApplicability[1],
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

const bigintFromNumberOrString = (value: number | string | undefined) => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const heightFromNodeInfoBlock = (block: string | undefined) => (
	block == null ?
		undefined
	:
		BigInt(block.match(/Num:(\d+)/)?.[1] ?? 0)
)

const firstContractValue = (transaction: TronNodeTransaction) => (
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
	resMessageHex: info.resMessage,
	contractAddress: info.contract_address,
	energyUsage: bigintFromNumberOrString(info.receipt?.energy_usage),
	originEnergyUsage: bigintFromNumberOrString(info.receipt?.origin_energy_usage),
	energyUsageTotal: bigintFromNumberOrString(info.receipt?.energy_usage_total),
	energyFeeSun: bigintFromNumberOrString(info.receipt?.energy_fee),
	energyPenaltyTotal: bigintFromNumberOrString(info.receipt?.energy_penalty_total),
	netUsage: bigintFromNumberOrString(info.receipt?.net_usage),
	netFeeSun: bigintFromNumberOrString(info.receipt?.net_fee),
	...(info.log != null && {
		logCount: info.log.length,
	}),
	...(info.internal_transactions != null && {
		internalTransactionCount: info.internal_transactions.length,
	}),
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

const observationCoordinate = (block: TronNodeBlock) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null || rawBlock.timestamp == null)
		throw new Error('TronGrid_Rest: head block is missing observation coordinates')

	return {
		height: BigInt(rawBlock.number),
		timestampMs: rawBlock.timestamp,
	}
}

const witnessRows = (
	network: NetworkId,
	witnesses: TronNodeWitness[],
	coordinate: ReturnType<typeof observationCoordinate>
) => (
	witnesses.map((witness) => {
		const fields = witnessFields(witness)
		if (fields.latestBlockHeight != null && fields.latestBlockHeight > coordinate.height)
			throw new Error('TronGrid_Rest: witness latest block exceeds observed head')

		return {
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
						timestampMs: coordinate.timestampMs,
						source: Source.TronGrid_Rest,
					},
					[EntityMetaKey.Fields]: Object.fromEntries(
						Object.entries(fields).flatMap(([fieldName, value]) => (
							value == null ?
								[]
							:
								[[
									entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], fieldName),
									value,
								]]
						))
					),
				}],
			},
		}
	})
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
					return (await import('$/sources/TronGrid/Rest/queries.ts')).restEndpoints
				}
			),
		})({
				Tron: {
					restEndpoints: (restEndpoints) => restEndpoints,
				},
			}),

		defineResolver({
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeightHash: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, height, hash }) => {
						assertTronMainnet($network)
						const { getBlockByNumber } = await import('$/sources/TronGrid/Rest/queries.ts')
						const wireBlock = await getBlockByNumber({
							height: height,
						})
						if (
							wireBlock.block_header?.raw_data?.number == null
							|| BigInt(wireBlock.block_header.raw_data.number) !== height
						)
							throw new Error(`TronGrid_Rest: block height does not match selector ${height.toString()}`)
						const block = blockFields(
							$network,
							wireBlock
						)
						if (block.hash !== hash)
							throw new Error(`TronGrid_Rest: block hash ${block.hash} does not match selector ${hash}`)
						return block
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
				$$transactions: {
					select: (block) => block.$$transactions,
					resolveCount: (block) => block.$$transactions.length,
				},
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
						const {
							getAccount,
							getAccountResource,
							getNowBlock,
						} = await import('$/sources/TronGrid/Rest/queries.ts')
						const [
							account,
							accountResource,
						] = await Promise.all([
							getAccount({
								address: address,
							}),
							getAccountResource({
								address: address,
							}),
						])
						const observationTimestampMs = observationCoordinate(await getNowBlock()).timestampMs
						const balanceSun = (
							account.balance != null ?
								BigInt(account.balance)
							:
								undefined
						)
						const createdTimestampMs = account.create_time
						const latestOperationTimestampMs = account.latest_opration_time
						const freeNetUsed = bigintFromNumberOrString(accountResource.freeNetUsed)
						const freeNetLimit = bigintFromNumberOrString(accountResource.freeNetLimit)
						const netUsed = bigintFromNumberOrString(accountResource.NetUsed)
						const netLimit = bigintFromNumberOrString(accountResource.NetLimit)
						const energyUsed = bigintFromNumberOrString(accountResource.EnergyUsed)
						const energyLimit = bigintFromNumberOrString(accountResource.EnergyLimit)
						return {
							name: account.account_name,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										timestampMs: observationTimestampMs,
										source: Source.TronGrid_Rest,
									},
									[EntityMetaKey.Fields]: {
										...(balanceSun != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'balanceSun')]: balanceSun,
										}),
										...(createdTimestampMs != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'createdTimestampMs')]: createdTimestampMs,
										}),
										...(latestOperationTimestampMs != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'latestOperationTimestampMs')]: latestOperationTimestampMs,
										}),
										...(freeNetUsed != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'freeNetUsed')]: freeNetUsed,
										}),
										...(freeNetLimit != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'freeNetLimit')]: freeNetLimit,
										}),
										...(netUsed != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'netUsed')]: netUsed,
										}),
										...(netLimit != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'netLimit')]: netLimit,
										}),
										...(energyUsed != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'energyUsed')]: energyUsed,
										}),
										...(energyLimit != null && {
											[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'energyLimit')]: energyLimit,
										}),
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
				resMessageHex: (receipt) => receipt.resMessageHex,
				contractAddress: (receipt) => receipt.contractAddress,
				energyUsage: (receipt) => receipt.energyUsage,
				originEnergyUsage: (receipt) => receipt.originEnergyUsage,
				energyUsageTotal: (receipt) => receipt.energyUsageTotal,
				energyFeeSun: (receipt) => receipt.energyFeeSun,
				energyPenaltyTotal: (receipt) => receipt.energyPenaltyTotal,
				netUsage: (receipt) => receipt.netUsage,
				netFeeSun: (receipt) => receipt.netFeeSun,
				logCount: (receipt) => receipt.logCount,
				internalTransactionCount: (receipt) => receipt.internalTransactionCount,
				contractResultHex: (receipt) => receipt.contractResultHex,
			}),

		defineResolver({
			entityType: EntityType.TronWitness,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const {
							getNowBlock,
							listWitnesses,
						} = await import('$/sources/TronGrid/Rest/queries.ts')
						const witnesses = await listWitnesses()
						const block = await getNowBlock()
						const coordinate = observationCoordinate(block)
						const witness = witnesses.witnesses
							.find((tronAccount) => tronAccount.address === address)
						if (witness == null) throw new Error(`TronGrid_Rest: witness not found for ${address}`)
						if (witness.latestBlockNum != null && BigInt(witness.latestBlockNum) > coordinate.height)
							throw new Error('TronGrid_Rest: witness latest block exceeds observed head')
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$witness: {
											$network,
											address,
										},
										timestampMs: coordinate.timestampMs,
										source: Source.TronGrid_Rest,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(witnessFields(witness)).flatMap(([fieldName, value]) => (
											value == null ?
												[]
											:
												[[
													entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], fieldName),
													value,
												]]
										))
									),
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
			entityType: EntityType.Network,
			resolve: tronNetworkResolverSelectors(
				async (network) => {
					assertTronMainnet(network)
					const {
						getChainParameters,
						getNodeInfo,
						getNowBlock,
						listWitnesses,
					} = await import('$/sources/TronGrid/Rest/queries.ts')
					const [
						witnesses,
						chainParameters,
						nodeInfo,
					] = await Promise.all([
						listWitnesses(),
						getChainParameters(),
						getNodeInfo(),
					])
					const block = await getNowBlock()
					const coordinate = observationCoordinate(block)
					const nodeBlockHeight = heightFromNodeInfoBlock(nodeInfo.block)
					const solidityBlockHeight = heightFromNodeInfoBlock(nodeInfo.solidityBlock)
					const maintenanceIntervalMs = chainParameterValue(chainParameters.chainParameter, 'getMaintenanceTimeInterval')
					const transactionFeeSun = chainParameterValue(chainParameters.chainParameter, 'getTransactionFee')
					const createAccountFeeSun = chainParameterValue(chainParameters.chainParameter, 'getCreateAccountFee')
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: coordinate.timestampMs,
								source: Source.TronGrid_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockHeight')]: coordinate.height,
								...(block.blockID != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockHash')]: block.blockID,
								}),
								[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockTimeMs')]: coordinate.timestampMs,
								[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockTransactionCount')]: block.transactions?.length ?? 0,
								[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'witnessCount')]: witnesses.witnesses.length,
								[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'activeWitnessCount')]: witnesses.witnesses.filter((witness) => witness.isJobs).length,
								...(nodeBlockHeight != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'nodeBlockHeight')]: nodeBlockHeight,
								}),
								...(solidityBlockHeight != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'solidityBlockHeight')]: solidityBlockHeight,
								}),
								...(nodeInfo.currentConnectCount != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'currentPeerCount')]: nodeInfo.currentConnectCount,
								}),
								...(maintenanceIntervalMs != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'maintenanceIntervalMs')]: Number(maintenanceIntervalMs),
								}),
								...(transactionFeeSun != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'transactionFeeSun')]: transactionFeeSun,
								}),
								...(createAccountFeeSun != null && {
									[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'createAccountFeeSun')]: createAccountFeeSun,
								}),
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
				async (network, context) => {
					assertTronMainnet(network)
					const {
						getNowBlock,
						listWitnesses,
					} = await import('$/sources/TronGrid/Rest/queries.ts')
					const offset = context.pagination.offset ?? 0
					const witnesses = await listWitnesses()
					const block = await getNowBlock()
					return witnessRows(
						network,
						witnesses.witnesses
							.slice(offset, offset + resolverContextRowLimit(context)),
						observationCoordinate(block)
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
					if (
						context.providerContinuationToken != null
						&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
					)
						throw new Error(`${Source.TronGrid_Rest}: invalid blocks continuation`)

					const { getNowBlock } = await import('$/sources/TronGrid/Rest/queries.ts')
					const block = await getNowBlock()
					const headBlockHeight = BigInt(block.block_header?.raw_data?.number ?? 0)
					const firstBlockHeight = context.providerContinuationToken == null ?
						headBlockHeight - BigInt(context.pagination.offset ?? 0)
					:
						BigInt(context.providerContinuationToken)
					if (firstBlockHeight > headBlockHeight)
						throw new Error(`${Source.TronGrid_Rest}: blocks continuation exceeds head`)

					return {
						blocks: Array.from({
							length: Math.min(
								Math.max(Number(firstBlockHeight + 1n), 0),
								resolverContextRowLimit(context)
							),
						}, (_value, blockOffset) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								height: firstBlockHeight - BigInt(blockOffset),
								...(firstBlockHeight === headBlockHeight && blockOffset === 0 && {
									hash: block.blockID,
								}),
							},
						})),
					}
				}
			),
		})({
				Tron: {
					$$blocks: {
						select: (snapshot) => snapshot.blocks,
						continuation: (snapshot) => {
							const lastBlockHeight = snapshot.blocks.at(-1)?.[EntityMetaKey.Selector].height
							return {
								operation: 'network-blocks',
								terminal: lastBlockHeight == null || lastBlockHeight === 0n,
								...(lastBlockHeight != null && lastBlockHeight > 0n && {
									token: String(lastBlockHeight - 1n),
								}),
							}
						},
					},
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
										[EntityMetaKey.Fields]: Object.fromEntries(
											Object.entries(transactionFields(
												$network,
												transaction,
												{
													...(transaction.blockNumber != null && {
														blockNumber: transaction.blockNumber,
													}),
													...(transaction.block_timestamp != null && {
														blockTimeStamp: transaction.block_timestamp,
													}),
												}
											)).map(([fieldName, value]) => [
												entityFieldAddressKey(EntityType.TronTransaction, [], fieldName),
												value,
											])
										),
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
