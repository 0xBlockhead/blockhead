import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NearRpcAccessKey,
	NearRpcAction,
	NearRpcExecutionOutcome,
	NearRpcTransactionStatus,
} from '$/sources/NearRpc/JsonRpc/types.ts'

const nearMainnetRpcUrl = 'https://rpc.mainnet.near.org'

const assertNearMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Near || network.reference !== 'mainnet') {
		throw new Error(`NearRpc_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const nearActionFields = (action: NearRpcAction) => ({
	actionKind: (
		action.CreateAccount != null ? 'CreateAccount'
		: action.DeployContract != null ? 'DeployContract'
		: action.FunctionCall != null ? 'FunctionCall'
		: action.Transfer != null ? 'Transfer'
		: action.Stake != null ? 'Stake'
		: action.AddKey != null ? 'AddKey'
		: action.DeleteKey != null ? 'DeleteKey'
		: action.DeleteAccount != null ? 'DeleteAccount'
		: action.Delegate != null ? 'Delegate'
		: 'Unknown'
	),
	...(action.FunctionCall != null && {
		methodName: action.FunctionCall.method_name,
		depositYoctoNear: BigInt(action.FunctionCall.deposit),
	}),
	...(action.Transfer != null && {
		depositYoctoNear: BigInt(action.Transfer.deposit),
	}),
	...(action.Stake != null && {
		depositYoctoNear: BigInt(action.Stake.stake),
	}),
})

const nearAccessKeyFields = (accessKey: NearRpcAccessKey) => ({
	nonce: BigInt(accessKey.nonce),
	permission: accessKey.permission === 'FullAccess' ? 'FullAccess' : 'FunctionCall',
})

const nearExecutionOutcomeFields = (
	network: {
		namespace: string
		reference: string
	},
	executionOutcome: NearRpcExecutionOutcome,
) => ({
	status: (
		executionOutcome.outcome.status.SuccessValue != null ? 'SuccessValue'
		: executionOutcome.outcome.status.SuccessReceiptId != null ? 'SuccessReceiptId'
		: executionOutcome.outcome.status.Failure != null ? 'Failure'
		: 'Unknown'
	),
	gasBurnt: BigInt(executionOutcome.outcome.gas_burnt),
	$$receipts: executionOutcome.outcome.receipt_ids.map((receiptId) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			receiptId,
		},
	})),
})

const nearTransactionFields = (
	network: {
		namespace: string
		reference: string
	},
	transactionStatus: NearRpcTransactionStatus,
) => ({
	$signer: {
		[EntityMetaKey.Id]: {
			$network: network,
			accountId: transactionStatus.transaction.signer_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Id]: {
			$network: network,
			accountId: transactionStatus.transaction.receiver_id,
		},
	},
	nonce: BigInt(transactionStatus.transaction.nonce),
	$$actions: transactionStatus.transaction.actions.map((action, actionIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: {
				$network: network,
				hash: transactionStatus.transaction.hash,
				signerAccountId: transactionStatus.transaction.signer_id,
			},
			actionIndex,
		},
		...nearActionFields(action),
	})),
	$$executionOutcomes: [
		transactionStatus.transaction_outcome,
		...transactionStatus.receipts_outcome,
	].map((executionOutcome) => ({
		[EntityMetaKey.Id]: {
			$transaction: {
				$network: network,
				hash: transactionStatus.transaction.hash,
				signerAccountId: transactionStatus.transaction.signer_id,
			},
			outcomeId: executionOutcome.id,
		},
		...nearExecutionOutcomeFields(
			network,
			executionOutcome,
		),
	})),
})

const getNearTransactionStatus = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	hash: string
	signerAccountId?: string
}) => {
	assertNearMainnet(entityId.$network)
	if (entityId.signerAccountId == null) {
		throw new Error(`NearRpc_JsonRpc: transaction ${entityId.hash} requires signerAccountId`)
	}
	const { txStatus } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
	return txStatus({
		rpcUrl: nearMainnetRpcUrl,
		txHash: entityId.hash,
		senderAccountId: entityId.signerAccountId,
	})
}

export default {
	source: Source.NearRpc_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NearBlock,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { block } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const row = await block({
					rpcUrl: nearMainnetRpcUrl,
					blockId: entityId.hash ?? entityId.height,
				})
				return {
					hash: row.header.hash,
					...(row.header.height > 0 && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.header.height - 1),
								hash: row.header.prev_hash,
							},
						},
					}),
					epochId: row.header.epoch_id,
					timestampMs: Number(BigInt(row.header.timestamp_nanosec) / 1_000_000n),
					$$chunks: row.chunks.map((chunk) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							chunkHash: chunk.chunk_hash,
						},
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.header.height),
								hash: row.header.hash,
							},
						},
						shardId: BigInt(chunk.shard_id),
						gasUsed: BigInt(chunk.gas_used),
					})),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearChunk,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { chunk } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const row = await chunk({
					rpcUrl: nearMainnetRpcUrl,
					chunkHash: entityId.chunkHash,
				})
				return {
					shardId: BigInt(row.header.shard_id),
					gasUsed: BigInt(row.header.gas_used),
					$$transactions: row.transactions.map((transaction) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							hash: transaction.hash,
							signerAccountId: transaction.signer_id,
						},
						$signer: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: transaction.signer_id,
							},
						},
						$receiver: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: transaction.receiver_id,
							},
						},
						nonce: BigInt(transaction.nonce),
						$$actions: transaction.actions.map((action, actionIndex) => ({
							[EntityMetaKey.Id]: {
								$transaction: {
									$network: entityId.$network,
									hash: transaction.hash,
									signerAccountId: transaction.signer_id,
								},
								actionIndex,
							},
							...nearActionFields(action),
						})),
					})),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearTransaction,
			resolve: async (entityId) => (
				nearTransactionFields(
					entityId.$network,
					await getNearTransactionStatus(entityId),
				)
			),
		}),

		defineEntityResolver({
			entityType: EntityType.NearAction,
			resolve: async (entityId) => {
				const transactionStatus = await getNearTransactionStatus(entityId.$transaction)
				const action = transactionStatus.transaction.actions[entityId.actionIndex]
				if (action == null) {
					throw new Error(`NearRpc_JsonRpc: action ${entityId.actionIndex.toString()} not found for ${entityId.$transaction.hash}`)
				}
				return nearActionFields(action)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearExecutionOutcome,
			resolve: async (entityId) => {
				const transactionStatus = await getNearTransactionStatus(entityId.$transaction)
				const executionOutcome = [
					transactionStatus.transaction_outcome,
					...transactionStatus.receipts_outcome,
				].find((outcome) => outcome.id === entityId.outcomeId)
				if (executionOutcome == null) {
					throw new Error(`NearRpc_JsonRpc: execution outcome ${entityId.outcomeId} not found for ${entityId.$transaction.hash}`)
				}
				return nearExecutionOutcomeFields(
					entityId.$transaction.$network,
					executionOutcome,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearAccount,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const account = await viewAccount({
					rpcUrl: nearMainnetRpcUrl,
					accountId: entityId.accountId,
				})
				return {
					amountYoctoNear: BigInt(account.amount),
					storageUsageBytes: BigInt(account.storage_usage),
					...(account.code_hash !== '11111111111111111111111111111111' && {
						$contract: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								accountId: entityId.accountId,
							},
						},
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearContract,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const account = await viewAccount({
					rpcUrl: nearMainnetRpcUrl,
					accountId: entityId.accountId,
				})
				if (account.code_hash === '11111111111111111111111111111111') {
					throw new Error(`NearRpc_JsonRpc: account ${entityId.accountId} has no deployed contract code`)
				}
				return {
					codeHash: account.code_hash,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearAccessKey,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$account.$network)
				const { viewAccessKey } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				return nearAccessKeyFields(await viewAccessKey({
					rpcUrl: nearMainnetRpcUrl,
					accountId: entityId.$account.accountId,
					publicKey: entityId.publicKey,
				}))
			},
		}),
	],

	entityFieldResolvers: [






		defineEntityFieldResolver({
			entityType: EntityType.NearAccount,
			fieldName: '$$accessKeys',
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { viewAccessKeyList } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				return (await viewAccessKeyList({
					rpcUrl: nearMainnetRpcUrl,
					accountId: entityId.accountId,
				})).keys.map((key) => ({
					[EntityMetaKey.Id]: {
						$account: entityId,
						publicKey: key.public_key,
					},
					...nearAccessKeyFields(key.access_key),
				}))
			},
		}),
	],
}
