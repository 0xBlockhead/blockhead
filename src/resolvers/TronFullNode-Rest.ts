import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { tronFullNodeDefaultLocalRestUrl } from '$/constants/TronNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TronNodeBlock,
	TronNodeContractValue,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertTronMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.tron.slug) {
		throw new Error('TronFullNode_Rest: unsupported network')
	}
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
	info?: TronNodeTransactionInfo,
) => {
	const contract = transaction.raw_data?.contract?.[0]
	const value = firstContractValue(transaction)
	const amountSun = bigintFromNumberOrString(value?.amount)
	return {
		...(info?.blockNumber != null && {
			$block: {
				[EntityMetaKey.Id]: {
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
				[EntityMetaKey.Id]: {
					$network: network,
					address: value.owner_address,
				},
			},
		}),
		...(value?.to_address != null && {
			$to: {
				[EntityMetaKey.Id]: {
					$network: network,
					address: value.to_address,
				},
			},
		}),
		...(value?.contract_address != null && {
			$contract: {
				[EntityMetaKey.Id]: {
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

const blockFields = (
	network: NetworkId,
	block: TronNodeBlock,
) => {
	const rawBlock = block.block_header?.raw_data
	if (rawBlock?.number == null) {
		throw new Error('TronFullNode_Rest: block is missing height')
	}
	return {
		hash: block.blockID,
		...(rawBlock.number > 0 && rawBlock.parentHash != null && {
			$parent: {
				[EntityMetaKey.Id]: {
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
				[EntityMetaKey.Id]: {
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
					[EntityMetaKey.Id]: {
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
				}]
		)),
	}
}

export default {
	source: Source.TronFullNode_Rest,

	resolvers: [
		defineResolver(Source.TronFullNode_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/TronFullNode/Rest/queries.ts')
				return blockFields(
					entityId.$network,
					await getBlockByNumber({
						restBaseUrl: tronFullNodeDefaultLocalRestUrl,
						height: entityId.height,
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

		defineResolver(Source.TronFullNode_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const {
					getTransactionById,
					getTransactionInfoById,
				} = await import('$/sources/TronFullNode/Rest/queries.ts')
				const transaction = await getTransactionById({
					restBaseUrl: tronFullNodeDefaultLocalRestUrl,
					transactionId: entityId.transactionId,
				})
				if (transaction.txID == null) throw new Error(`TronFullNode_Rest: transaction not found for ${entityId.transactionId}`)
				return transactionFields(
					entityId.$network,
					transaction,
					await getTransactionInfoById({
						restBaseUrl: tronFullNodeDefaultLocalRestUrl,
						transactionId: entityId.transactionId,
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

		defineResolver(Source.TronFullNode_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const { getAccount } = await import('$/sources/TronFullNode/Rest/queries.ts')
				const account = await getAccount({
					restBaseUrl: tronFullNodeDefaultLocalRestUrl,
					address: entityId.address,
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
	],
}
