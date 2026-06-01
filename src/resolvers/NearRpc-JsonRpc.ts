import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { nearMainnetRpcEndpoints } from '$/constants/NearNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NearRpcAccessKey,
	NearRpcAction,
	NearRpcBlock,
	NearRpcExecutionOutcome,
	NearRpcGasPrice,
	NearRpcStatus,
	NearRpcTransactionStatus,
	NearRpcValidator,
	NearRpcValidators,
} from '$/sources/NearRpc/JsonRpc/types.ts'

const nearMainnetRpcUrl = nearMainnetRpcEndpoints[0].url

const assertNearMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug.near.slug) {
		throw new Error('NearRpc_JsonRpc: unsupported network')
	}
}

const nearActionFields = (action: NearRpcAction) => ({
	actionKind: (
		action.CreateAccount != null ? 'CreateAccount'
		:
			action.DeployContract != null ? 'DeployContract'
		:
			action.FunctionCall != null ? 'FunctionCall'
		:
			action.Transfer != null ? 'Transfer'
		:
			action.Stake != null ? 'Stake'
		:
			action.AddKey != null ? 'AddKey'
		:
			action.DeleteKey != null ? 'DeleteKey'
		:
			action.DeleteAccount != null ? 'DeleteAccount'
		:
			action.Delegate != null ? 'Delegate'
		:
			'Unknown'
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
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	executionOutcome: NearRpcExecutionOutcome,
) => ({
	status: (
		executionOutcome.outcome.status.SuccessValue != null ? 'SuccessValue'
		:
			executionOutcome.outcome.status.SuccessReceiptId != null ? 'SuccessReceiptId'
		:
			executionOutcome.outcome.status.Failure != null ? 'Failure'
		:
			'Unknown'
	),
	gasBurnt: BigInt(executionOutcome.outcome.gas_burnt),
	$$receipts: executionOutcome.outcome.receipt_ids.map((receiptId) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			receiptId,
		},
	})),
})

const nearNetworkTimestampFields = ({
	block,
	gasPrice,
	status,
	validators,
}: {
	block: NearRpcBlock
	gasPrice: NearRpcGasPrice
	status: NearRpcStatus
	validators: NearRpcValidators
}) => ({
	headHeight: BigInt(block.header.height),
	headHash: block.header.hash,
	epochId: block.header.epoch_id,
	epochHeight: BigInt(validators.epoch_height),
	epochStartHeight: BigInt(validators.epoch_start_height),
	chunkCount: block.chunks.length,
	gasPriceYoctoNear: BigInt(gasPrice.gas_price),
	currentValidatorCount: validators.current_validators.length,
	nextValidatorCount: validators.next_validators.length,
	currentProposalCount: validators.current_proposals.length,
	protocolVersion: status.protocol_version,
	latestProtocolVersion: status.latest_protocol_version,
	nodeVersion: status.version.version,
	syncing: status.sync_info.syncing,
})

const nearValidatorFields = (validator: NearRpcValidator) => ({
	publicKey: validator.public_key,
	stakeYoctoNear: BigInt(validator.stake),
	isSlashed: validator.is_slashed,
	...(validator.num_expected_blocks != null && {
		expectedBlocks: validator.num_expected_blocks,
	}),
	...(validator.num_produced_blocks != null && {
		producedBlocks: validator.num_produced_blocks,
	}),
	...(validator.num_expected_chunks != null && {
		expectedChunks: validator.num_expected_chunks,
	}),
	...(validator.num_produced_chunks != null && {
		producedChunks: validator.num_produced_chunks,
	}),
})

const nearTransactionFields = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
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
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	hash: string
	signerAccountId?: string
}) => {
	assertNearMainnet(entityId.$network)
	if (entityId.signerAccountId == null) {
		throw new Error(`NearRpc_JsonRpc: transaction ${entityId.hash} requires signerAccountId`)
	}
	const { getTxStatus } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
	return getTxStatus({
		rpcUrl: nearMainnetRpcUrl,
		txHash: entityId.hash,
		senderAccountId: entityId.signerAccountId,
	})
}

export default {
	source: Source.NearRpc_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NearNetwork,
			resolve: async (entityId) => {
				assertNearMainnet(entityId)
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearBlock,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getBlock } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const wireBlock = await getBlock({
					rpcUrl: nearMainnetRpcUrl,
					blockId: entityId.hash ?? entityId.height,
				})
				return {
					hash: wireBlock.header.hash,
					...(wireBlock.header.height > 0 && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(wireBlock.header.height - 1),
								hash: wireBlock.header.prev_hash,
							},
						},
					}),
					epochId: wireBlock.header.epoch_id,
					timestampMs: Number(BigInt(wireBlock.header.timestamp_nanosec) / 1_000_000n),
					$$chunks: wireBlock.chunks.map((chunk) => ({
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							chunkHash: chunk.chunk_hash,
						},
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(wireBlock.header.height),
								hash: wireBlock.header.hash,
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
				const { getChunk } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const wireChunk = await getChunk({
					rpcUrl: nearMainnetRpcUrl,
					chunkHash: entityId.chunkHash,
				})
				return {
					shardId: BigInt(wireBlock.header.shard_id),
					gasUsed: BigInt(wireBlock.header.gas_used),
					$$transactions: wireChunk.transactions.map((transaction) => ({
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

		defineEntityResolver({
			entityType: EntityType.NearValidator,
			resolve: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const validator = (await getValidators({
					rpcUrl: nearMainnetRpcUrl,
				})).current_validators.find((nearValidator) => nearValidator.account_id === entityId.accountId)
				if (validator == null) throw new Error(`NearRpc_JsonRpc: validator ${entityId.accountId} not found`)
				return nearValidatorFields(validator)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.NearNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				assertNearMainnet(entityId)
				const {
				getBlock,
				getGasPrice,
				getStatus,
				getValidators,
			} = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const [
					headBlock,
					currentGasPrice,
					nodeStatus,
					validatorSet,
				] = await Promise.all([
					getBlock({
						rpcUrl: nearMainnetRpcUrl,
						blockId: 'final',
					}),
					getGasPrice({
						rpcUrl: nearMainnetRpcUrl,
					}),
					getStatus({
						rpcUrl: nearMainnetRpcUrl,
					}),
					getValidators({
						rpcUrl: nearMainnetRpcUrl,
					}),
				])
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Number(BigInt(headBlock.header.timestamp_nanosec) / 1_000_000n),
						},
						...nearNetworkTimestampFields({
							block: headBlock,
							gasPrice: currentGasPrice,
							status: nodeStatus,
							validators: validatorSet,
						}),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NearNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				assertNearMainnet(entityId)
				const { getBlock } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const headBlock = await getBlock({
					rpcUrl: nearMainnetRpcUrl,
					blockId: 'final',
				})
				const headBlockHeight = BigInt(headBlock.header.height)
				return Array.from({
					length: Math.min(
						Number(headBlockHeight + 1n),
						resolverLoadSubsetRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: headBlockHeight - BigInt(blockOffset),
						...(blockOffset === 0 && {
							hash: headBlock.header.hash,
						}),
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NearNetwork,
			fieldName: '$$validators',
			resolve: async (entityId, context) => {
				assertNearMainnet(entityId)
				const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				return (await getValidators({
					rpcUrl: nearMainnetRpcUrl,
				})).current_validators
					.slice(0, resolverLoadSubsetRowLimit(context))
					.map((validator) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							accountId: validator.account_id,
						},
						...nearValidatorFields(validator),
					}))
			},
		}),

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
