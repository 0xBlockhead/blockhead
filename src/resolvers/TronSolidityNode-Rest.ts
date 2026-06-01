import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { tronSolidityNodeDefaultLocalRestUrl } from '$/constants/TronNetwork.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	TronNodeBlock,
	TronNodeContractValue,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/TronGrid/Rest/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertTronMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.tron.slug) {
		throw new Error('TronSolidityNode_Rest: unsupported network')
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
		throw new Error('TronSolidityNode_Rest: block is missing height')
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
		witnessAddress: rawBlock.witness_address,
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
	source: Source.TronSolidityNode_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.TronBlock,
			resolve: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
				return blockFields(
					entityId.$network,
					await getBlockByNumber({
						restBaseUrl: tronSolidityNodeDefaultLocalRestUrl,
						height: entityId.height,
					}),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.TronTransaction,
			resolve: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const {
					getTransactionById,
					getTransactionInfoById,
				} = await import('$/sources/TronSolidityNode/Rest/queries.ts')
				const transaction = await getTransactionById({
					restBaseUrl: tronSolidityNodeDefaultLocalRestUrl,
					transactionId: entityId.transactionId,
				})
				if (transaction.txID == null) throw new Error(`TronSolidityNode_Rest: transaction not found for ${entityId.transactionId}`)
				return transactionFields(
					entityId.$network,
					transaction,
					await getTransactionInfoById({
						restBaseUrl: tronSolidityNodeDefaultLocalRestUrl,
						transactionId: entityId.transactionId,
					}),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.TronAccount,
			resolve: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const { getAccount } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
				const account = await getAccount({
					restBaseUrl: tronSolidityNodeDefaultLocalRestUrl,
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
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.TronBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertTronMainnet(entityId.$network)
				const { getBlockByNumber } = await import('$/sources/TronSolidityNode/Rest/queries.ts')
				return blockFields(
					entityId.$network,
					await getBlockByNumber({
						restBaseUrl: tronSolidityNodeDefaultLocalRestUrl,
						height: entityId.height,
					}),
				).$$transactions
			},
		}),
	],
}
