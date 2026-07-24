import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import type {
	TronNodeBlock,
	TronNodeContractValue,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'
import { TronBlockSelector } from '$/schema/TronBlock.ts'
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { TronAccountSelector } from '$/schema/TronAccount.ts'
import { TronAccount_TimestampSelector } from '$/schema/TronAccount_Timestamp.ts'
import { TronTransactionReceiptSelector } from '$/schema/TronTransactionReceipt.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const tronSolidityNodeBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.TronSolidityNode_Rest
		&& binding.target.kind === SourceTargetKind.LocalDevice
		&& binding.target.key === 'tron-solidity-node'
	))

if (tronSolidityNodeBindings.length !== 1)
	throw new Error('TronSolidityNode_Rest: canonical local SolidityNode source binding is missing or ambiguous')

const tronSolidityNodeBinding = tronSolidityNodeBindings[0]

const assertTronMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.tron.slug)
		throw new Error('TronSolidityNode_Rest: unsupported network')
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

const blockFields = (
	network: NetworkId,
	block: TronNodeBlock
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null)
		throw new Error('TronSolidityNode_Rest: block is missing height')
	if (block.blockID == null)
		throw new Error('TronSolidityNode_Rest: block is missing hash')
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
		$$transactions: (block.transactions ?? []).flatMap((transaction) => {
			if (transaction.txID == null) return []

			const fields = transactionFields(
				network,
				transaction,
				{
					blockNumber: rawBlock.number,
					blockTimeStamp: rawBlock.timestamp,
				}
			)
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					transactionId: transaction.txID,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: fields.blockHeight,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'timestampMs')]: fields.timestampMs,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'expirationTimestampMs')]: fields.expirationTimestampMs,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'contractType')]: fields.contractType,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'result')]: fields.result,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'feeSun')]: fields.feeSun,
					[entityFieldAddressKey(EntityType.TronTransaction, [], '$receipt')]: fields.$receipt,
					[entityFieldAddressKey(EntityType.TronTransaction, [], '$owner')]: fields.$owner,
					[entityFieldAddressKey(EntityType.TronTransaction, [], '$to')]: fields.$to,
					[entityFieldAddressKey(EntityType.TronTransaction, [], '$contract')]: fields.$contract,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'amountSun')]: fields.amountSun,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'assetName')]: fields.assetName,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'rawDataHex')]: fields.rawDataHex,
					[entityFieldAddressKey(EntityType.TronTransaction, [], 'signatures')]: fields.signatures,
				},
			}]
		}),
	}
}

export default {
	source: Source.TronSolidityNode_Rest,

	resolvers: [
		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[TronBlockSelector.NetworkHeightHash]: {
					resolve: async ({ $network, height }) => {
						assertTronMainnet($network)
						const { getBlockByNumber } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
						return blockFields(
							$network,
							await getBlockByNumber({
								binding: tronSolidityNodeBinding,
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

		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: {
					resolve: async ({ $network, transactionId }) => {
						assertTronMainnet($network)
						const {
							getTransactionById,
							getTransactionInfoById,
						} = await import('$/sources/TronSolidityNode/Rest/queries.ts')
						const transaction = await getTransactionById({
							binding: tronSolidityNodeBinding,
							transactionId: transactionId,
						})
						if (transaction.txID == null) throw new Error(`TronSolidityNode_Rest: transaction not found for ${transactionId}`)
						return transactionFields(
							$network,
							transaction,
							await getTransactionInfoById({
								binding: tronSolidityNodeBinding,
								transactionId: transactionId,
							})
						)
					},
				}
			},
		})({
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

		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: {
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getAccount } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
						const account = await getAccount({
							binding: tronSolidityNodeBinding,
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

		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: {
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$account: entitySelector,
								timestampMs: Date.now(),
								source: Source.TronSolidityNode_Rest,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				[TronAccount_TimestampSelector.AccountTimestampMsSource]: {
					resolve: async ({ $account }) => {
						assertTronMainnet($account.$network)
						const { getAccount } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
						const account = await getAccount({
							binding: tronSolidityNodeBinding,
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

		defineResolver(Source.TronSolidityNode_Rest, {
			entityType: EntityType.TronTransactionReceipt,
			resolve: {
				[TronTransactionReceiptSelector.Transaction]: {
					resolve: async ({ $transaction }) => {
						assertTronMainnet($transaction.$network)
						const { getTransactionInfoById } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
						return receiptFields(await getTransactionInfoById({
							binding: tronSolidityNodeBinding,
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
}
