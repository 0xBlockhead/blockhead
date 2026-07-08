import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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
import { NearNetworkSelector } from '$/schema/NearNetwork.ts'
import { NearBlockSelector } from '$/schema/NearBlock.ts'
import { NearChunkSelector } from '$/schema/NearChunk.ts'
import { NearTransactionSelector } from '$/schema/NearTransaction.ts'
import { NearActionSelector } from '$/schema/NearAction.ts'
import { NearExecutionOutcomeSelector } from '$/schema/NearExecutionOutcome.ts'
import { NearReceiptSelector } from '$/schema/NearReceipt.ts'
import { NearAccountSelector } from '$/schema/NearAccount.ts'
import { NearContractSelector } from '$/schema/NearContract.ts'
import { NearAccessKeySelector } from '$/schema/NearAccessKey.ts'
import { NearValidatorSelector } from '$/schema/NearValidator.ts'
import { NearAccount_TimestampSelector } from '$/schema/NearAccount_Timestamp.ts'
import { NearContract_TimestampSelector } from '$/schema/NearContract_Timestamp.ts'
import { NearAccessKey_TimestampSelector } from '$/schema/NearAccessKey_Timestamp.ts'
import { NearNetwork_TimestampSelector } from '$/schema/NearNetwork_Timestamp.ts'
import { NearValidator_TimestampSelector } from '$/schema/NearValidator_Timestamp.ts'
import { NetworkSelector } from '$/schema/Network.ts'

const nearMainnetRpcUrl = async () =>
	(await import('$/sources/NearRpc/JsonRpc/queries.ts')).nearMainnetRpcEndpoints[0].url

const assertNearMainnet = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (!('slug' in network) || network.slug !== networkBySlug.near.slug)
		throw new Error('NearRpc_JsonRpc: unsupported network')
}

const nearActionFields = (action: NearRpcAction) => ({
	actionKind: (
		(
			action.CreateAccount != null ?
				'CreateAccount'
			:
				action.DeployContract != null ?
					'DeployContract'
				:
					action.FunctionCall != null ?
						'FunctionCall'
					:
						action.Transfer != null ?
						'Transfer'
					:
						action.Stake != null ?
						'Stake'
					:
						action.AddKey != null ?
						'AddKey'
					:
						action.DeleteKey != null ?
						'DeleteKey'
					:
						action.DeleteAccount != null ?
						'DeleteAccount'
					:
						action.Delegate != null ?
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
	...(accessKey.permission !== 'FullAccess' && {
		...(accessKey.permission.FunctionCall.allowance != null && {
			allowanceYoctoNear: BigInt(accessKey.permission.FunctionCall.allowance),
		}),
		receiverId: accessKey.permission.FunctionCall.receiver_id,
		methodNames: accessKey.permission.FunctionCall.method_names,
	}),
})

const nearExecutionOutcomeFields = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	executionOutcome: NearRpcExecutionOutcome
) => ({
	status: (
		(
			executionOutcome.outcome.status.SuccessValue != null ?
				'SuccessValue'
			:
				executionOutcome.outcome.status.SuccessReceiptId != null ?
					'SuccessReceiptId'
				:
					executionOutcome.outcome.status.Failure != null ?
						'Failure'
					:
						'Unknown'
		)
	),
	gasBurnt: BigInt(executionOutcome.outcome.gas_burnt),
	$$receipts: executionOutcome.outcome.receipt_ids.map((receiptId) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			receiptId,
		},
	})),
})

const nearReceiptFields = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	receipt: NearRpcReceipt
) => ({
	$predecessor: {
		[EntityMetaKey.Selector]: {
			$network: network,
			accountId: receipt.predecessor_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Selector]: {
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
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	transactionStatus: NearRpcTransactionStatus
) => ({
	$signer: {
		[EntityMetaKey.Selector]: {
			$network: network,
			accountId: transactionStatus.transaction.signer_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Selector]: {
			$network: network,
			accountId: transactionStatus.transaction.receiver_id,
		},
	},
	nonce: BigInt(transactionStatus.transaction.nonce),
	$$actions: transactionStatus.transaction.actions.map((action, actionIndex) => ({
		[EntityMetaKey.Selector]: {
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
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network: network,
				hash: transactionStatus.transaction.hash,
				signerAccountId: transactionStatus.transaction.signer_id,
			},
			outcomeId: executionOutcome.id,
		},
		...nearExecutionOutcomeFields(
				network,
				executionOutcome
		),
	})),
})

const getNearTransactionStatus = async ({ $network, hash, signerAccountId }: {
	$network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string }
	hash: string
	signerAccountId?: string
}) => {
	assertNearMainnet($network)
	if (signerAccountId == null)
		throw new Error(`NearRpc_JsonRpc: transaction ${hash} requires signerAccountId`)
	const { getTxStatus } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
	return getTxStatus({
		rpcUrl: await nearMainnetRpcUrl(),
		txHash: hash,
		senderAccountId: signerAccountId,
	})
}

const nearNetworkTimestampFields = ({
	headBlock,
	currentGasPrice,
	nodeStatus,
	validatorSet,
}: {
	headBlock: NearRpcBlock
	currentGasPrice: NearRpcGasPrice
	nodeStatus: NearRpcStatus
	validatorSet: NearRpcValidators
}) => ({
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
})

const nearNetworkTimestampFieldResolvers = {
	headHeight: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.headHeight,
	headHash: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.headHash,
	epochId: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.epochId,
	epochHeight: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.epochHeight,
	epochStartHeight: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.epochStartHeight,
	chunkCount: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.chunkCount,
	gasPriceYoctoNear: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.gasPriceYoctoNear,
	currentValidatorCount: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.currentValidatorCount,
	nextValidatorCount: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.nextValidatorCount,
	currentProposalCount: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.currentProposalCount,
	protocolVersion: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.protocolVersion,
	latestProtocolVersion: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.latestProtocolVersion,
	nodeVersion: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.nodeVersion,
	syncing: (timestamp: ReturnType<typeof nearNetworkTimestampFields>) => timestamp.syncing,
}

const getNearNetworkTimestampFields = async () => {
	const {
		getBlock,
		getGasPrice,
		getStatus,
		getValidators,
	} = await import('$/sources/NearRpc/JsonRpc/queries.ts')
	const rpcUrl = await nearMainnetRpcUrl()
	const [
		headBlock,
		currentGasPrice,
		nodeStatus,
		validatorSet,
	] = await Promise.all([
		getBlock({
			rpcUrl,
			blockId: 'final',
		}),
		getGasPrice({
			rpcUrl,
		}),
		getStatus({
			rpcUrl,
		}),
		getValidators({
			rpcUrl,
		}),
	])
	return {
		timestampMs: Number(BigInt(headBlock.header.timestamp_nanosec) / 1_000_000n),
		...nearNetworkTimestampFields({
			headBlock,
			currentGasPrice,
			nodeStatus,
			validatorSet,
		}),
	}
}

export default {
	source: Source.NearRpc_JsonRpc,

	resolvers: [
		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearBlock,
			resolve: {
				[NearBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					assertNearMainnet($network)
					const { getBlock } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const wireBlock = await getBlock({
						rpcUrl: await nearMainnetRpcUrl(),
						blockId: hash,
					})
					return {
						hash: wireBlock.header.hash,
						...(wireBlock.header.height > 0 && {
							$parent: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									height: BigInt(wireBlock.header.height - 1),
									hash: wireBlock.header.prev_hash,
								},
							},
						}),
						epochId: wireBlock.header.epoch_id,
						timestampMs: Number(BigInt(wireBlock.header.timestamp_nanosec) / 1_000_000n),
						$$chunks: wireBlock.chunks.map((chunk) => ({
							[EntityMetaKey.Selector]: {
								$network,
								chunkHash: chunk.chunk_hash,
							},
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
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
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				epochId: (block) => block.epochId,
				timestampMs: (block) => block.timestampMs,
				$$chunks: (block) => block.$$chunks,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearChunk,
			resolve: {
				[NearChunkSelector.NetworkChunkHash]: async ({ $network, chunkHash }) => {
					assertNearMainnet($network)
					const { getChunk } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const wireChunk = await getChunk({
						rpcUrl: await nearMainnetRpcUrl(),
						chunkHash: chunkHash,
					})
					return {
						shardId: BigInt(wireChunk.header.shard_id),
						gasUsed: BigInt(wireChunk.header.gas_used),
						$$transactions: wireChunk.transactions.map((transaction) => ({
							[EntityMetaKey.Selector]: {
								$network,
								hash: transaction.hash,
								signerAccountId: transaction.signer_id,
							},
							$signer: {
								[EntityMetaKey.Selector]: {
									$network,
									accountId: transaction.signer_id,
								},
							},
							$receiver: {
								[EntityMetaKey.Selector]: {
									$network,
									accountId: transaction.receiver_id,
								},
							},
							nonce: BigInt(transaction.nonce),
							$$actions: transaction.actions.map((action, actionIndex) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
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
		})({
				shardId: (chunk) => chunk.shardId,
				gasUsed: (chunk) => chunk.gasUsed,
				$$transactions: (chunk) => chunk.$$transactions,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearTransaction,
			resolve: {
				[NearTransactionSelector.NetworkHashSignerAccountId]: async (entitySelector) => (
					nearTransactionFields(
						entitySelector.$network,
						await getNearTransactionStatus(entitySelector)
					)
				)
			},
		})({
				$signer: (transaction) => transaction.$signer,
				$receiver: (transaction) => transaction.$receiver,
				nonce: (transaction) => transaction.nonce,
				$$actions: (transaction) => transaction.$$actions,
				$$executionOutcomes: (transaction) => transaction.$$executionOutcomes,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAction,
			resolve: {
				[NearActionSelector.NearTransactionActionIndex]: async ({ $transaction, actionIndex }) => {
					const transactionStatus = await getNearTransactionStatus($transaction)
					const action = transactionStatus.transaction.actions.at(actionIndex)
					if (action == null)
						throw new Error(`NearRpc_JsonRpc: action ${actionIndex.toString()} not found for ${$transaction.hash}`)
					return nearActionFields(action)
				}
			},
		})({
				actionKind: (action) => action.actionKind,
				methodName: (action) => action.methodName,
				depositYoctoNear: (action) => action.depositYoctoNear,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearExecutionOutcome,
			resolve: {
				[NearExecutionOutcomeSelector.NearTransactionOutcomeId]: async ({ $transaction, outcomeId }) => {
					const transactionStatus = await getNearTransactionStatus($transaction)
					const executionOutcome = [
						transactionStatus.transaction_outcome,
						...transactionStatus.receipts_outcome,
					].find((outcome) => outcome.id === outcomeId)
					if (executionOutcome == null)
						throw new Error(`NearRpc_JsonRpc: execution outcome ${outcomeId} not found for ${$transaction.hash}`)
					return nearExecutionOutcomeFields(
						$transaction.$network,
						executionOutcome
					)
				}
			},
		})({
				status: (outcome) => outcome.status,
				gasBurnt: (outcome) => outcome.gasBurnt,
				$$receipts: (outcome) => outcome.$$receipts,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearReceipt,
			resolve: {
				[NearReceiptSelector.NetworkReceiptId]: async ({ $network, receiptId }) => {
					assertNearMainnet($network)
					const { getReceipt } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					try {
						return nearReceiptFields(
							$network,
							await getReceipt({
								rpcUrl: await nearMainnetRpcUrl(),
								receiptId: receiptId,
							})
					)
					}
					catch (cause) {
						throw new Error(`NearRpc_JsonRpc: failed to resolve receipt ${receiptId}`, { cause })
					}
				}
			},
		})({
				$predecessor: (receipt) => receipt.$predecessor,
				$receiver: (receipt) => receipt.$receiver,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAccount,
			resolve: {
				[NearAccountSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertNearMainnet($network)
					const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const account = await viewAccount({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: accountId,
					})
					return {
						amountYoctoNear: BigInt(account.amount),
						storageUsageBytes: BigInt(account.storage_usage),
						...(account.code_hash !== '11111111111111111111111111111111' && {
							$contract: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									accountId: accountId,
								},
							},
						}),
					}
				}
			},
		})({
				amountYoctoNear: (account) => account.amountYoctoNear,
				storageUsageBytes: (account) => account.storageUsageBytes,
				$contract: (account) => account.$contract,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearContract,
			resolve: {
				[NearContractSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertNearMainnet($network)
					const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const account = await viewAccount({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: accountId,
					})
					if (account.code_hash === '11111111111111111111111111111111')
						throw new Error(`NearRpc_JsonRpc: account ${accountId} has no deployed contract code`)
					return {
						codeHash: account.code_hash,
					}
				}
			},
		})({
				codeHash: (contract) => contract.codeHash,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAccount_Timestamp,
			resolve: {
				[NearAccount_TimestampSelector.AccountTimestampMsSource]: async ({ $account }) => {
					assertNearMainnet($account.$network)
					const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const account = await viewAccount({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: $account.accountId,
					})
					return {
						amountYoctoNear: BigInt(account.amount),
						storageUsageBytes: BigInt(account.storage_usage),
						codeHash: account.code_hash,
					}
				}
			},
		})({
				amountYoctoNear: (timestamp) => timestamp.amountYoctoNear,
				storageUsageBytes: (timestamp) => timestamp.storageUsageBytes,
				codeHash: (timestamp) => timestamp.codeHash,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearContract_Timestamp,
			resolve: {
				[NearContract_TimestampSelector.ContractTimestampMsSource]: async ({ $contract }) => {
					assertNearMainnet($contract.$network)
					const { viewAccount } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const account = await viewAccount({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: $contract.accountId,
					})
					if (account.code_hash === '11111111111111111111111111111111')
						throw new Error(`NearRpc_JsonRpc: account ${$contract.accountId} has no deployed contract code`)
					return {
						codeHash: account.code_hash,
					}
				}
			},
		})({
				codeHash: (timestamp) => timestamp.codeHash,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAccessKey,
			resolve: {
				[NearAccessKeySelector.NearAccountPublicKey]: async ({ $account, publicKey }) => {
					assertNearMainnet($account.$network)
					const { viewAccessKey } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					return nearAccessKeyFields(await viewAccessKey({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: $account.accountId,
						publicKey: publicKey,
					}))
				}
			},
		})({
				nonce: (accessKey) => accessKey.nonce,
				permission: (accessKey) => accessKey.permission,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAccessKey_Timestamp,
			resolve: {
				[NearAccessKey_TimestampSelector.AccessKeyTimestampMsSource]: async ({ $accessKey }) => {
					assertNearMainnet($accessKey.$account.$network)
					const { viewAccessKey } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					return nearAccessKeyFields(await viewAccessKey({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: $accessKey.$account.accountId,
						publicKey: $accessKey.publicKey,
					}))
				}
			},
		})({
				nonce: (timestamp) => timestamp.nonce,
				permission: (timestamp) => timestamp.permission,
				allowanceYoctoNear: (timestamp) => timestamp.allowanceYoctoNear,
				receiverId: (timestamp) => timestamp.receiverId,
				methodNames: (timestamp) => timestamp.methodNames ?? [],
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearValidator,
			resolve: {
				[NearValidatorSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertNearMainnet($network)
					const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const validator = (await getValidators({
						rpcUrl: await nearMainnetRpcUrl(),
					})).current_validators.find((nearValidator) => nearValidator.account_id === accountId)
					if (validator == null) throw new Error(`NearRpc_JsonRpc: validator ${accountId} not found`)
					return nearValidatorFields(validator)
				}
			},
		})({
				publicKey: (validator) => validator.publicKey,
				stakeYoctoNear: (validator) => validator.stakeYoctoNear,
				isSlashed: (validator) => validator.isSlashed,
				expectedBlocks: (validator) => validator.expectedBlocks,
				producedBlocks: (validator) => validator.producedBlocks,
				expectedChunks: (validator) => validator.expectedChunks,
				producedChunks: (validator) => validator.producedChunks,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearValidator_Timestamp,
			resolve: {
				[NearValidator_TimestampSelector.ValidatorEpochIdSource]: async ({ $validator }) => {
					assertNearMainnet($validator.$network)
					const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const validatorSet = await getValidators({
						rpcUrl: await nearMainnetRpcUrl(),
					})
					const validator = validatorSet.current_validators.find((nearValidator) => (
						nearValidator.account_id === $validator.accountId
					))
					if (validator == null) throw new Error(`NearRpc_JsonRpc: validator ${$validator.accountId} not found`)
					return {
						epochHeight: BigInt(validatorSet.epoch_height),
						epochStartHeight: BigInt(validatorSet.epoch_start_height),
						validatorSetRole: 'current',
						...nearValidatorFields(validator),
					}
				}
			},
		})({
				epochHeight: (timestamp) => timestamp.epochHeight,
				epochStartHeight: (timestamp) => timestamp.epochStartHeight,
				validatorSetRole: (timestamp) => timestamp.validatorSetRole,
				publicKey: (timestamp) => timestamp.publicKey,
				stakeYoctoNear: (timestamp) => timestamp.stakeYoctoNear,
				isSlashed: (timestamp) => timestamp.isSlashed,
				expectedBlocks: (timestamp) => timestamp.expectedBlocks,
				producedBlocks: (timestamp) => timestamp.producedBlocks,
				expectedChunks: (timestamp) => timestamp.expectedChunks,
				producedChunks: (timestamp) => timestamp.producedChunks,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearNetwork,
			resolve: {
				[NearNetworkSelector.Slug]: async (entitySelector) => {
					assertNearMainnet(entitySelector)
					const timestamp = await getNearNetworkTimestampFields()
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								timestampMs: timestamp.timestampMs,
								source: Source.NearRpc_JsonRpc,
							},
							...timestamp,
						},
					]
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertNearMainnet(network)
					const timestamp = await getNearNetworkTimestampFields()
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: timestamp.timestampMs,
								source: Source.NearRpc_JsonRpc,
							},
							...timestamp,
						},
					]
				}
			},
		})({
				Near: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearNetwork_Timestamp,
			resolve: {
				[NearNetwork_TimestampSelector.NetworkTimestampMsSource]: async ({ $network }) => {
					assertNearMainnet($network)
					return getNearNetworkTimestampFields()
				}
			},
		})(nearNetworkTimestampFieldResolvers),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearNetwork,
			resolve: {
				[NearNetworkSelector.Slug]: async (entitySelector, context) => {
					assertNearMainnet(entitySelector)
					const { getBlock } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const headBlock = await getBlock({
						rpcUrl: await nearMainnetRpcUrl(),
						blockId: 'final',
					})
					const headBlockHeight = BigInt(headBlock.header.height)
					return Array.from({
						length: Math.min(
							Number(headBlockHeight + 1n),
							resolverContextRowLimit(context)
					),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							height: headBlockHeight - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: headBlock.header.hash,
							}),
						},
					}))
				}
			},
		})({
				$$blocks: (blocks) => blocks,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertNearMainnet(network)
					const { getBlock } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					const headBlock = await getBlock({
						rpcUrl: await nearMainnetRpcUrl(),
						blockId: 'final',
					})
					const headBlockHeight = BigInt(headBlock.header.height)
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
								hash: headBlock.header.hash,
							}),
						},
					}))
				}
			},
		})({
				Near: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearNetwork,
			resolve: {
				[NearNetworkSelector.Slug]: async (entitySelector, context) => {
					assertNearMainnet(entitySelector)
					const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					return (await getValidators({
						rpcUrl: await nearMainnetRpcUrl(),
					})).current_validators
						.slice(0, resolverContextRowLimit(context))
						.map((validator) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								accountId: validator.account_id,
							},
							...nearValidatorFields(validator),
						}))
				}
			},
		})({
				$$validators: (validators) => validators,
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertNearMainnet(network)
					const { getValidators } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					return (await getValidators({
						rpcUrl: await nearMainnetRpcUrl(),
					})).current_validators
						.slice(0, resolverContextRowLimit(context))
						.map((validator) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								accountId: validator.account_id,
							},
							...nearValidatorFields(validator),
						}))
				}
			},
		})({
				Near: {
					$$validators: (validators) => validators,
				},
			}),

		defineResolver(Source.NearRpc_JsonRpc, {
			entityType: EntityType.NearAccount,
			resolve: {
				[NearAccountSelector.NetworkAccountId]: async ({ $network, accountId }) => {
					assertNearMainnet($network)
					const { viewAccessKeyList } = await import('$/sources/NearRpc/JsonRpc/queries.ts')
					return (await viewAccessKeyList({
						rpcUrl: await nearMainnetRpcUrl(),
						accountId: accountId,
					})).keys.map((key) => ({
						[EntityMetaKey.Selector]: {
							$account: {
								$network,
								accountId,
							},
							publicKey: key.public_key,
						},
						...nearAccessKeyFields(key.access_key),
					}))
				}
			},
		})({
				$$accessKeys: (accessKeys) => accessKeys,
			}),
	],
}
