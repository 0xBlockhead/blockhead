import { defineResolver } from '$/resolvers/defineResolver.ts'
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
import type { tronNodeRest } from '$/sources/_shared/interfaces/TronNodeRest/queries.ts'
import type {
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
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

const assertTronMainnet = (
	source: Source.TronFullNode_Rest | Source.TronSolidityNode_Rest,
	network: NetworkId
) => {
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

	throw new Error(`${source}: unsupported network`)
}

const bigintFromNumberOrString = (value: number | string | undefined) => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const firstContractValue = (transaction: TronNodeTransaction) => (
	transaction.raw_data?.contract?.[0]?.parameter?.value
)

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

const blockFields = (
	source: Source.TronFullNode_Rest | Source.TronSolidityNode_Rest,
	network: NetworkId,
	height: bigint,
	hash: string,
	block: TronNodeBlock
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null)
		throw new Error(`${source}: block is missing height`)

	if (block.blockID == null)
		throw new Error(`${source}: block is missing hash`)

	if (BigInt(rawBlock.number) !== height)
		throw new Error(`${source}: block height does not match ${height}`)

	if (block.blockID !== hash)
		throw new Error(`${source}: block hash does not match ${hash}`)

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
				[{
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
				}]
		)),
	}
}

export const tronNodeRestResolvers = <
	_Source extends
		| Source.TronFullNode_Rest
		| Source.TronSolidityNode_Rest
>(
	source: _Source,
	loadQueries: () => Promise<ReturnType<typeof tronNodeRest>>
) => {
	const tronAccountTimestampApplicability = [
		{
			$account: tronNetworkReferenceApplicability[0],
			source,
		},
		{
			$account: tronNetworkReferenceApplicability[1],
			source,
		},
	] as const

	return {
		source,

		resolvers: [
			defineResolver({
				entityType: EntityType.TronBlock,
				resolve: {
					NetworkHeightHash: {
						appliesTo: tronNetworkReferenceApplicability,
						resolve: async ({ $network, height, hash }) => {
							assertTronMainnet(source, $network)
							const { getBlockById } = await loadQueries()
							return blockFields(
								source,
								$network,
								height,
								hash,
								await getBlockById({ hash })
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
							assertTronMainnet(source, $network)
							const {
								getTransactionById,
								getTransactionInfoById,
							} = await loadQueries()
							const transaction = await getTransactionById({ transactionId })
							if (transaction.txID == null)
								throw new Error(`${source}: transaction not found for ${transactionId}`)

							return transactionFields(
								$network,
								transaction,
								await getTransactionInfoById({ transactionId })
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
							assertTronMainnet(source, $network)
							const { getAccount } = await loadQueries()
							const account = await getAccount({ address })
							return {
								name: account.account_name,
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										timestampMs: account.latest_opration_time ?? account.create_time ?? Date.now(),
										source,
									},
								}],
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
							assertTronMainnet(source, $account.$network)
							const { getAccount } = await loadQueries()
							const account = await getAccount({ address: $account.address })
							return {
								...(account.balance != null && {
									balanceSun: BigInt(account.balance),
								}),
								createdTimestampMs: account.create_time,
								latestOperationTimestampMs: account.latest_opration_time,
							}
						},
					}
				},
			})({
				balanceSun: (account) => account.balanceSun,
				createdTimestampMs: (account) => account.createdTimestampMs,
				latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
			}),

			defineResolver({
				entityType: EntityType.TronTransactionReceipt,
				resolve: {
					Transaction: {
						appliesTo: tronTransactionReferenceApplicability,
						resolve: async ({ $transaction }) => {
							assertTronMainnet(source, $transaction.$network)
							const { getTransactionInfoById } = await loadQueries()
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
		],
	}
}
