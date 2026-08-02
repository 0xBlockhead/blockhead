import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
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
} from '$/sources/TronGrid/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertTronMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.tron.slug)
		throw new Error('TronFullNode_Rest: unsupported network')
}

const bigintFromNumberOrString = (value: number | string | undefined): bigint | undefined => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const firstContractValue = (transaction: TronNodeTransaction): TronNodeContractValue | undefined => (
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
		...(transaction.signature != null && {
			signatures: transaction.signature,
		}),
	}
}

const receiptFields = (info: TronNodeTransactionInfo) => ({
	feeSun: bigintFromNumberOrString(info.fee),
	result: info.receipt?.result,
	energyUsageTotal: bigintFromNumberOrString(info.receipt?.energy_usage_total),
	netUsage: bigintFromNumberOrString(info.receipt?.net_usage),
	contractResultHex: info.contractResult ?? [],
})

const blockFields = (
	network: NetworkId,
	block: TronNodeBlock
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null)
		throw new Error('TronFullNode_Rest: block is missing height')
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

export default {
	source: Source.TronFullNode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, height }) => {
						assertTronMainnet($network)
						const { getBlockByNumber } = await import('$/sources/TronFullNode/Rest/queries.ts')
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
				hash: (block) => {
					if (block.hash == null) throw new Error('TronFullNode_Rest: block missing hash')
					return block.hash
				},
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
					resolve: async ({ $network, transactionId }) => {
						assertTronMainnet($network)
						const {
							getTransactionById,
							getTransactionInfoById,
						} = await import('$/sources/TronFullNode/Rest/queries.ts')
						const transaction = await getTransactionById({
							transactionId: transactionId,
						})
						if (transaction.txID == null) throw new Error(`TronFullNode_Rest: transaction not found for ${transactionId}`)
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
				signatures: (transaction) => transaction.signatures ?? [],
			}),

		defineResolver({
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getAccount } = await import('$/sources/TronFullNode/Rest/queries.ts')
						const account = await getAccount({
							address: address,
						})
						return {
							name: account.account_name,
						}
					},
				}
			},
		})({
				name: (account) => account.name,
			}),

		defineResolver({
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$account: entitySelector,
								timestampMs: Date.now(),
								source: Source.TronFullNode_Rest,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account }) => {
						assertTronMainnet($account.$network)
						const { getAccount } = await import('$/sources/TronFullNode/Rest/queries.ts')
						const account = await getAccount({
							address: $account.address,
						})
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
					resolve: async ({ $transaction }) => {
						assertTronMainnet($transaction.$network)
						const { getTransactionInfoById } = await import('$/sources/TronFullNode/Rest/queries.ts')
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
	],
} satisfies RegisteredSourceResolverModule
