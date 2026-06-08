import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { nearMainnetRpcEndpoints } from '$/constants/NearNetwork.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NearRpcAccessKey,
	NearRpcAction,
	NearRpcBlock,
	NearRpcExecutionOutcome,
	NearRpcGasPrice,
	NearRpcReceipt,
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
		(
			action.CreateAccount != null ?
				'CreateAccount'
			: action.DeployContract != null ?
				'DeployContract'
			: action.FunctionCall != null ?
				'FunctionCall'
			: action.Transfer != null ?
				'Transfer'
			: action.Stake != null ?
				'Stake'
			: action.AddKey != null ?
				'AddKey'
			: action.DeleteKey != null ?
				'DeleteKey'
			: action.DeleteAccount != null ?
				'DeleteAccount'
			: action.Delegate != null ?
				'Delegate'
			:
				'Unknown'
		)
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
		(
			executionOutcome.outcome.status.SuccessValue != null ?
				'SuccessValue'
			: executionOutcome.outcome.status.SuccessReceiptId != null ?
				'SuccessReceiptId'
			: executionOutcome.outcome.status.Failure != null ?
				'Failure'
			:
				'Unknown'
		)
	),
	gasBurnt: BigInt(executionOutcome.outcome.gas_burnt),
	$$receipts: executionOutcome.outcome.receipt_ids.map((receiptId) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			receiptId,
		},
	})),
})

const nearReceiptFields = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	receipt: NearRpcReceipt,
) => ({
	$predecessor: {
		[EntityMetaKey.Id]: {
			$network: network,
			accountId: receipt.predecessor_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Id]: {
			$network: network,
			accountId: receipt.receiver_id,
		},
	},
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

	resolvers: [
		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertNearMainnet(entityId)
				return {}
			}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				epochId: (block) => block.epochId,
				timestampMs: (block) => block.timestampMs,
				$$chunks: (block) => block.$$chunks,
			},
		}),

		defineResolver({
			entityType: EntityType.NearChunk,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getChunk } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const wireChunk = await getChunk({
					rpcUrl: nearMainnetRpcUrl,
					chunkHash: entityId.chunkHash,
				})
				return {
					shardId: BigInt(wireChunk.header.shard_id),
					gasUsed: BigInt(wireChunk.header.gas_used),
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
			}
			},
			fields: {
				shardId: (chunk) => chunk.shardId,
				gasUsed: (chunk) => chunk.gasUsed,
				$$transactions: (chunk) => chunk.$$transactions,
			},
		}),

		defineResolver({
			entityType: EntityType.NearTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
				nearTransactionFields(
					entityId.$network,
					await getNearTransactionStatus(entityId),
				)
			)
			},
			fields: {
				$signer: (transaction) => transaction.$signer,
				$receiver: (transaction) => transaction.$receiver,
				nonce: (transaction) => transaction.nonce,
				$$actions: (transaction) => transaction.$$actions,
				$$executionOutcomes: (transaction) => transaction.$$executionOutcomes,
			},
		}),

		defineResolver({
			entityType: EntityType.NearAction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const transactionStatus = await getNearTransactionStatus(entityId.$transaction)
				const action = transactionStatus.transaction.actions.at(entityId.actionIndex)
				if (action == null) {
					throw new Error(`NearRpc_JsonRpc: action ${entityId.actionIndex.toString()} not found for ${entityId.$transaction.hash}`)
				}
				return nearActionFields(action)
			}
			},
			fields: {
				actionKind: (action) => action.actionKind,
				methodName: (action) => action.methodName,
				depositYoctoNear: (action) => action.depositYoctoNear,
			},
		}),

		defineResolver({
			entityType: EntityType.NearExecutionOutcome,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				status: (outcome) => outcome.status,
				gasBurnt: (outcome) => outcome.gasBurnt,
				$$receipts: (outcome) => outcome.$$receipts,
			},
		}),

		defineResolver({
			entityType: EntityType.NearReceipt,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getReceipt } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				try {
					return nearReceiptFields(
					entityId.$network,
						await getReceipt({
							rpcUrl: nearMainnetRpcUrl,
							receiptId: entityId.receiptId,
						}),
				)
				}
				catch (cause) {
					throw new Error(`NearRpc_JsonRpc: failed to resolve receipt ${entityId.receiptId}`, { cause })
				}
			}
			},
			fields: {
				$predecessor: (receipt) => receipt.$predecessor,
				$receiver: (receipt) => receipt.$receiver,
			},
		}),

		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				amountYoctoNear: (account) => account.amountYoctoNear,
				storageUsageBytes: (account) => account.storageUsageBytes,
				$contract: (account) => account.$contract,
			},
		}),

		defineResolver({
			entityType: EntityType.NearContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				codeHash: (contract) => contract.codeHash,
			},
		}),

		defineResolver({
			entityType: EntityType.NearAccessKey,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertNearMainnet(entityId.$account.$network)
				const { viewAccessKey } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				return nearAccessKeyFields(await viewAccessKey({
					rpcUrl: nearMainnetRpcUrl,
					accountId: entityId.$account.accountId,
					publicKey: entityId.publicKey,
				}))
			}
			},
			fields: {
				nonce: (accessKey) => accessKey.nonce,
				permission: (accessKey) => accessKey.permission,
			},
		}),

		defineResolver({
			entityType: EntityType.NearValidator,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertNearMainnet(entityId.$network)
				const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				const validator = (await getValidators({
					rpcUrl: nearMainnetRpcUrl,
				})).current_validators.find((nearValidator) => nearValidator.account_id === entityId.accountId)
				if (validator == null) throw new Error(`NearRpc_JsonRpc: validator ${entityId.accountId} not found`)
				return nearValidatorFields(validator)
			}
			},
			fields: {
				publicKey: (validator) => validator.publicKey,
				stakeYoctoNear: (validator) => validator.stakeYoctoNear,
				isSlashed: (validator) => validator.isSlashed,
				expectedBlocks: (validator) => validator.expectedBlocks,
				producedBlocks: (validator) => validator.producedBlocks,
				expectedChunks: (validator) => validator.expectedChunks,
				producedChunks: (validator) => validator.producedChunks,
			},
		}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
						headHeight: BigInt(headBlock.header.height),
						headHash: headBlock.header.hash,
						epochId: headBlock.header.epoch_id,
						epochHeight: BigInt(validatorSet.epoch_height),
						epochStartHeight: BigInt(validatorSet.epoch_start_height),
						chunkCount: headBlock.chunks.length,
						gasPriceYoctoNear: BigInt(currentGasPrice.gas_price),
						currentValidatorCount: validatorSet.current_validators.length,
						nextValidatorCount: validatorSet.next_validators.length,
						currentProposalCount: validatorSet.current_proposals.length,
						protocolVersion: nodeStatus.protocol_version,
						latestProtocolVersion: nodeStatus.latest_protocol_version,
						nodeVersion: nodeStatus.version.version,
						syncing: nodeStatus.sync_info.syncing,
					},
				]
			}
			},
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
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
						resolverContextRowLimit(context),
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
			}
			},
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				assertNearMainnet(entityId)
				const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
				return (await getValidators({
					rpcUrl: nearMainnetRpcUrl,
				})).current_validators
					.slice(0, resolverContextRowLimit(context))
					.map((validator) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							accountId: validator.account_id,
						},
						...nearValidatorFields(validator),
					}))
			}
			},
			fields: {
				$$validators: (validators) => validators,
			},
		}),

		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
				$$accessKeys: (accessKeys) => accessKeys,
			},
		}),
	],
}
