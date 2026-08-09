import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/NearRpc/bindings.ts'
import { nearRpc } from '$/sources/NearRpc/JsonRpc/queries.ts'
import type {
	NearRpcAccessKey,
	NearRpcAccessKeyBody,
	NearRpcAccount,
	NearRpcAction,
	NearRpcBlock,
	NearRpcCurrentValidator,
	NearRpcExecutionOutcome,
	NearRpcGasPrice,
	NearRpcReceipt,
	NearRpcStatus,
	NearRpcTransaction,
	NearRpcTransactionStatus,
	NearRpcValidators,
} from '$/sources/NearRpc/JsonRpc/types.ts'

const {
	endpoints: nearRpcEndpoints,
	getBlock,
	getChunk,
	getGasPrice,
	getReceipt,
	getStatus,
	getTxStatus,
	getValidators,
	viewAccessKey,
	viewAccessKeyList,
	viewAccount,
	viewState,
} = nearRpc(bindings[Source.NearRpc_JsonRpc][0])
type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type NearBlockSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.NearBlock,
	'NetworkHeight' | 'NetworkHeightHash'
>
const assertNearMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.near.slug)
		throw new Error('NearRpc_JsonRpc: unsupported network')
}
const assertSafeNearBlockHeight = (height: bigint) => {
	const numericBlockHeight = Number(height)
	if (!Number.isSafeInteger(numericBlockHeight))
		throw new Error(`NearRpc_JsonRpc: unsafe block height ${height}`)
	return numericBlockHeight
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
const nearActionReference = (
	transaction: {
		$network: NetworkId
		hash: string
		signerAccountId: string
	},
	action: NearRpcAction,
	actionIndex: number
) => {
	const fields = nearActionFields(action)
	return {
		[EntityMetaKey.Selector]: {
			$transaction: transaction,
			actionIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NearAction, [], 'actionKind')]: fields.actionKind,
			[entityFieldAddressKey(EntityType.NearAction, [], 'methodName')]: fields.methodName,
			[entityFieldAddressKey(EntityType.NearAction, [], 'depositYoctoNear')]: fields.depositYoctoNear,
		},
	}
}
const nearAccessKeyBodyFields = (accessKey: NearRpcAccessKeyBody) => ({
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
const nearAccessKeyFields = (accessKey: NearRpcAccessKey) => ({
	...nearAccessKeyBodyFields(accessKey),
	blockHeight: BigInt(accessKey.block_height),
	blockHash: accessKey.block_hash,
})
const nearAccountFields = (account: NearRpcAccount) => ({
	amountYoctoNear: BigInt(account.amount),
	lockedYoctoNear: BigInt(account.locked),
	storageUsageBytes: BigInt(account.storage_usage),
	codeHash: account.code_hash,
	blockHeight: BigInt(account.block_height),
	blockHash: account.block_hash,
})
const nearExecutionOutcomeFields = (
	network: NetworkId,
	executionOutcome: NearRpcExecutionOutcome,
	receiptsById?: Map<string, NearRpcReceipt>
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
	$$receipts: executionOutcome.outcome.receipt_ids.map((receiptId) => {
		const receipt = receiptsById?.get(receiptId)
		return {
			[EntityMetaKey.Selector]: {
				$network: network,
				receiptId,
			},
			...(receipt != null && {
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.NearReceipt, [], '$predecessor')]: nearReceiptFields(network, receipt).$predecessor,
					[entityFieldAddressKey(EntityType.NearReceipt, [], '$receiver')]: nearReceiptFields(network, receipt).$receiver,
				},
			}),
		}
	}),
})
const nearReceiptsById = (transactionStatus: NearRpcTransactionStatus) => (
	new Map(
		(transactionStatus.receipts ?? []).map((receipt) => [
			receipt.receipt_id,
			receipt,
		])
	)
)
const nearReceiptFields = (
	network: NetworkId,
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
const nearValidatorFields = (validator: NearRpcCurrentValidator) => ({
	publicKey: validator.public_key,
	stakeYoctoNear: BigInt(validator.stake),
	isSlashed: validator.is_slashed,
	expectedBlocks: validator.num_expected_blocks,
	producedBlocks: validator.num_produced_blocks,
	shards: validator.shards,
	...(validator.num_expected_chunks != null && {
		expectedChunks: validator.num_expected_chunks,
	}),
	...(validator.num_produced_chunks != null && {
		producedChunks: validator.num_produced_chunks,
	}),
})
const nearTransactionFields = (
	network: NetworkId,
	transaction: NearRpcTransaction
) => ({
	signerAccountId: transaction.signer_id,
	$signer: {
		[EntityMetaKey.Selector]: {
			$network: network,
			accountId: transaction.signer_id,
		},
	},
	$receiver: {
		[EntityMetaKey.Selector]: {
			$network: network,
			accountId: transaction.receiver_id,
		},
	},
	nonce: BigInt(transaction.nonce),
	$$actions: transaction.actions.map((action, actionIndex) => (
		nearActionReference({
			$network: network,
			hash: transaction.hash,
			signerAccountId: transaction.signer_id,
		}, action, actionIndex)
	)),
})
const getNearTransactionStatus = async ({ $network, hash, signerAccountId }: {
	$network: NetworkId
	hash: string
	signerAccountId?: string
}) => {
	assertNearMainnet($network)
	if (signerAccountId == null)
		throw new Error(`NearRpc_JsonRpc: transaction ${hash} requires signerAccountId`)
	return getTxStatus({
		txHash: hash,
		senderAccountId: signerAccountId,
	})
}
const getNearAccount = async (
	network: NetworkId,
	accountId: string
) => {
	assertNearMainnet(network)
	return viewAccount({
		accountId,
	})
}
const getNearAccessKey = async (
	network: NetworkId,
	accountId: string,
	publicKey: string
) => {
	assertNearMainnet(network)
	return viewAccessKey({
		accountId,
		publicKey,
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
const nearNetworkTimestampReference = (
	network: NetworkId,
	timestamp: ReturnType<typeof nearNetworkTimestampFields> & { timestampMs: number }
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		timestampMs: timestamp.timestampMs,
		source: Source.NearRpc_JsonRpc,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'source')]: Source.NearRpc_JsonRpc,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'headHeight')]: timestamp.headHeight,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'headHash')]: timestamp.headHash,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'epochId')]: timestamp.epochId,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'epochHeight')]: timestamp.epochHeight,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'epochStartHeight')]: timestamp.epochStartHeight,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'chunkCount')]: timestamp.chunkCount,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'gasPriceYoctoNear')]: timestamp.gasPriceYoctoNear,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'currentValidatorCount')]: timestamp.currentValidatorCount,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'nextValidatorCount')]: timestamp.nextValidatorCount,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'currentProposalCount')]: timestamp.currentProposalCount,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'protocolVersion')]: timestamp.protocolVersion,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'latestProtocolVersion')]: timestamp.latestProtocolVersion,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'nodeVersion')]: timestamp.nodeVersion,
		[entityFieldAddressKey(EntityType.NearNetwork_Timestamp, [], 'syncing')]: timestamp.syncing,
	},
})
const nearBlockReference = (
	network: NetworkId,
	wireBlock: NearRpcBlock
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		height: BigInt(wireBlock.header.height),
		hash: wireBlock.header.hash,
	},
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(nearBlockFields(network, wireBlock))
			.map(([fieldName, fieldValue]) => [
				entityFieldAddressKey(EntityType.NearBlock, [], fieldName),
				fieldValue,
			])
	),
})
const getNearNetworkTimestampFields = async () => {
	const [
		headBlock,
		currentGasPrice,
		nodeStatus,
		validatorSet,
	] = await Promise.all([
		getBlock({
			blockId: 'final',
		}),
		getGasPrice(),
		getStatus(),
		getValidators(),
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
const nearBlockFields = (
	network: NetworkId,
	wireBlock: NearRpcBlock
) => ({
	hash: wireBlock.header.hash,
	...(wireBlock.header.height > 0 && {
		$parent: {
			[EntityMetaKey.Selector]: {
				$network: network,
				height: BigInt(wireBlock.header.height - 1),
				hash: wireBlock.header.prev_hash,
			},
		},
	}),
	epochId: wireBlock.header.epoch_id,
	timestampMs: Number(BigInt(wireBlock.header.timestamp_nanosec) / 1_000_000n),
	$$chunks: wireBlock.chunks.map((chunk) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			chunkHash: chunk.chunk_hash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NearChunk, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(wireBlock.header.height),
					hash: wireBlock.header.hash,
				},
			},
			[entityFieldAddressKey(EntityType.NearChunk, [], 'shardId')]: BigInt(chunk.shard_id),
			[entityFieldAddressKey(EntityType.NearChunk, [], 'gasUsed')]: BigInt(chunk.gas_used),
		},
	})),
})
const resolveNearBlock = async (entitySelector: NearBlockSelector) => {
	assertNearMainnet(entitySelector.$network)
	if (!('hash' in entitySelector))
		assertSafeNearBlockHeight(entitySelector.height)
	const wireBlock = await getBlock({
		blockId: (
			'hash' in entitySelector ?
				entitySelector.hash
			:
				entitySelector.height
		),
	})
	if (BigInt(wireBlock.header.height) !== entitySelector.height)
		throw new Error('NearRpc_JsonRpc: block height does not match the requested selector')
	if (
		'hash' in entitySelector
		&& wireBlock.header.hash !== entitySelector.hash
	)
		throw new Error('NearRpc_JsonRpc: block hash does not match the requested selector')
	return nearBlockFields(entitySelector.$network, wireBlock)
}
const getNearBlockReferences = async (
	network: NetworkId,
	limit: number
) => {
	assertNearMainnet(network)
	const headBlock = await getBlock({
		blockId: 'final',
	})
	const headBlockHeight = BigInt(headBlock.header.height)
	return Array.from({
		length: Math.min(
			Number(headBlockHeight + 1n),
			limit
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			height: headBlockHeight - BigInt(blockOffset),
		},
	}))
}
const getNearValidatorReferences = async (
	network: NetworkId,
	limit: number
) => {
	assertNearMainnet(network)
	return (await getValidators()).current_validators
		.slice(0, limit)
		.map((validator) => {
			const fields = nearValidatorFields(validator)
			return {
				[EntityMetaKey.Selector]: {
					$network: network,
					accountId: validator.account_id,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.NearValidator, [], 'publicKey')]: fields.publicKey,
					[entityFieldAddressKey(EntityType.NearValidator, [], 'stakeYoctoNear')]: fields.stakeYoctoNear,
					[entityFieldAddressKey(EntityType.NearValidator, [], 'isSlashed')]: fields.isSlashed,
					...(fields.expectedBlocks != null && {
						[entityFieldAddressKey(EntityType.NearValidator, [], 'expectedBlocks')]: fields.expectedBlocks,
					}),
					...(fields.producedBlocks != null && {
						[entityFieldAddressKey(EntityType.NearValidator, [], 'producedBlocks')]: fields.producedBlocks,
					}),
					...(fields.expectedChunks != null && {
						[entityFieldAddressKey(EntityType.NearValidator, [], 'expectedChunks')]: fields.expectedChunks,
					}),
					...(fields.producedChunks != null && {
						[entityFieldAddressKey(EntityType.NearValidator, [], 'producedChunks')]: fields.producedChunks,
					}),
				},
			}
		})
}
const getNearCurrentValidator = async (
	network: NetworkId,
	accountId: string
) => {
	assertNearMainnet(network)
	const validatorSet = await getValidators()
	const validator = validatorSet.current_validators.find((candidate) => (
		candidate.account_id === accountId
	))
	if (validator == null)
		throw new Error(`NearRpc_JsonRpc: validator ${accountId} not found`)
	return {
		validator,
		validatorSet,
	}
}
export default {
	source: Source.NearRpc_JsonRpc,
	resolvers: [
		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertNearMainnet(network)
						return nearRpcEndpoints
					},
				}
			},
		})({
			rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
		}),
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertNearMainnet(network)
						return nearRpcEndpoints
					},
				}
			},
		})({
			Near: {
				rpcEndpoints: (rpcEndpoints) => rpcEndpoints,
			},
		}),
		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				NetworkHeight: {
					resolve: resolveNearBlock,
				},
				NetworkHeightHash: {
					resolve: resolveNearBlock,
				},
			},
		})({
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			epochId: (block) => block.epochId,
			timestampMs: (block) => block.timestampMs,
			$$chunks: (block) => block.$$chunks,
		}),
		defineResolver({
			entityType: EntityType.NearChunk,
			resolve: {
				NetworkChunkHash: {
					resolve: async ({ $network, chunkHash }) => {
						assertNearMainnet($network)
						const wireChunk = await getChunk({
							chunkHash: chunkHash,
						})
						return {
							shardId: BigInt(wireChunk.header.shard_id),
							gasUsed: BigInt(wireChunk.header.gas_used),
							$$transactions: wireChunk.transactions.map((transaction) => {
								const fields = nearTransactionFields($network, transaction)
								return {
									[EntityMetaKey.Selector]: {
										$network,
										hash: transaction.hash,
										signerAccountId: transaction.signer_id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.NearTransaction, [], 'signerAccountId')]: fields.signerAccountId,
										[entityFieldAddressKey(EntityType.NearTransaction, [], '$signer')]: fields.$signer,
										[entityFieldAddressKey(EntityType.NearTransaction, [], '$receiver')]: fields.$receiver,
										[entityFieldAddressKey(EntityType.NearTransaction, [], 'nonce')]: fields.nonce,
										[entityFieldAddressKey(EntityType.NearTransaction, [], '$$actions')]: fields.$$actions,
									},
								}
							}),
						}
					},
				}
			},
		})({
			shardId: (chunk) => chunk.shardId,
			gasUsed: (chunk) => chunk.gasUsed,
			$$transactions: (chunk) => chunk.$$transactions,
		}),
		defineResolver({
			entityType: EntityType.NearTransaction,
			resolve: {
				NetworkHashSignerAccountId: {
					resolve: async (entitySelector) => {
						const transactionStatus = await getNearTransactionStatus(entitySelector)
						return {
							...nearTransactionFields(
							entitySelector.$network,
								transactionStatus.transaction
							),
							$$executionOutcomes: [
								transactionStatus.transaction_outcome,
								...transactionStatus.receipts_outcome,
							].map((executionOutcome) => {
								const fields = nearExecutionOutcomeFields(
									entitySelector.$network,
									executionOutcome,
									nearReceiptsById(transactionStatus)
								)
								return {
									[EntityMetaKey.Selector]: {
										$transaction: entitySelector,
										outcomeId: executionOutcome.id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'status')]: fields.status,
										[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'gasBurnt')]: fields.gasBurnt,
										[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], '$$receipts')]: fields.$$receipts,
									},
								}
							}),
						}
					},
				}
			},
		})({
			signerAccountId: (transaction) => transaction.signerAccountId,
			$signer: (transaction) => transaction.$signer,
			$receiver: (transaction) => transaction.$receiver,
			nonce: (transaction) => transaction.nonce,
			$$actions: (transaction) => transaction.$$actions,
			$$executionOutcomes: (transaction) => transaction.$$executionOutcomes,
		}),
		defineResolver({
			entityType: EntityType.NearAction,
			resolve: {
				NearTransactionActionIndex: {
					resolve: async ({ $transaction, actionIndex }) => {
						const transactionStatus = await getNearTransactionStatus($transaction)
						const action = transactionStatus.transaction.actions.at(actionIndex)
						if (action == null)
							throw new Error(`NearRpc_JsonRpc: action ${actionIndex.toString()} not found for ${$transaction.hash}`)
						return nearActionFields(action)
					},
				}
			},
		})({
			actionKind: (action) => action.actionKind,
			methodName: (action) => action.methodName,
			depositYoctoNear: (action) => action.depositYoctoNear,
		}),
		defineResolver({
			entityType: EntityType.NearExecutionOutcome,
			resolve: {
				NearTransactionOutcomeId: {
					resolve: async ({ $transaction, outcomeId }) => {
						const transactionStatus = await getNearTransactionStatus($transaction)
						const executionOutcome = [
							transactionStatus.transaction_outcome,
							...transactionStatus.receipts_outcome,
						].find((outcome) => outcome.id === outcomeId)
						if (executionOutcome == null)
							throw new Error(`NearRpc_JsonRpc: execution outcome ${outcomeId} not found for ${$transaction.hash}`)
						return nearExecutionOutcomeFields(
							$transaction.$network,
							executionOutcome,
							nearReceiptsById(transactionStatus)
						)
					},
				}
			},
		})({
			status: (outcome) => outcome.status,
			gasBurnt: (outcome) => outcome.gasBurnt,
			$$receipts: (outcome) => outcome.$$receipts,
		}),
		defineResolver({
			entityType: EntityType.NearReceipt,
			resolve: {
				NetworkReceiptId: {
					resolve: async ({ $network, receiptId }) => {
						assertNearMainnet($network)
						try {
							return nearReceiptFields(
								$network,
								await getReceipt({
									receiptId: receiptId,
								})
						)
						}
						catch (cause) {
							throw new Error(`NearRpc_JsonRpc: failed to resolve receipt ${receiptId}`, { cause })
						}
					},
				}
			},
		})({
			$predecessor: (receipt) => receipt.$predecessor,
			$receiver: (receipt) => receipt.$receiver,
		}),
		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						const account = await getNearAccount($network, accountId)
						return {
							...nearAccountFields(account),
							...(account.code_hash !== '11111111111111111111111111111111' && {
								$contract: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										accountId: accountId,
									},
								},
							}),
						}
					},
				}
			},
		})({
			amountYoctoNear: (account) => account.amountYoctoNear,
			storageUsageBytes: (account) => account.storageUsageBytes,
			$contract: (account) => account.$contract,
		}),
		defineResolver({
			entityType: EntityType.NearContract,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						const account = await getNearAccount($network, accountId)
						if (account.code_hash === '11111111111111111111111111111111')
							throw new Error(`NearRpc_JsonRpc: account ${accountId} has no deployed contract code`)
						return nearAccountFields(account)
					},
				}
			},
		})({
			codeHash: (contract) => contract.codeHash,
		}),
		defineResolver({
			entityType: EntityType.NearContractStorageEntry,
			resolve: {
				ContractKeyBlockHeightSource: {
					resolve: async ({
						$contract,
						keyBase64,
						blockHeight,
						source,
					}) => {
						assertNearMainnet($contract.$network)
						if (source !== Source.NearRpc_JsonRpc)
							throw new Error(`NearRpc_JsonRpc: unsupported source ${source}`)
						const numericBlockHeight = Number(blockHeight)
						if (!Number.isSafeInteger(numericBlockHeight))
							throw new Error(`NearRpc_JsonRpc: unsafe block height ${blockHeight}`)
						const state = await viewState({
							accountId: $contract.accountId,
							prefixBase64: keyBase64,
							blockHeight: numericBlockHeight,
						})
						if (BigInt(state.block_height) !== blockHeight)
							throw new Error(`NearRpc_JsonRpc: response block height ${state.block_height} does not match ${blockHeight}`)
						const value = state.values.find((entry) => entry.key === keyBase64)
						if (value == null)
							throw new Error(`NearRpc_JsonRpc: storage key ${keyBase64} not found at block ${blockHeight}`)
						return {
							blockHash: state.block_hash,
							valueBase64: value.value,
							prefixBase64: keyBase64,
						}
					},
				}
			},
		})({
			blockHash: (entry) => entry.blockHash,
			valueBase64: (entry) => entry.valueBase64,
			prefixBase64: (entry) => entry.prefixBase64,
		}),
		defineResolver({
			entityType: EntityType.NearAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account }) => {
						return nearAccountFields(await getNearAccount(
							$account.$network,
							$account.accountId
						))
					},
				}
			},
		})({
			amountYoctoNear: (timestamp) => timestamp.amountYoctoNear,
			lockedYoctoNear: (timestamp) => timestamp.lockedYoctoNear,
			storageUsageBytes: (timestamp) => timestamp.storageUsageBytes,
			codeHash: (timestamp) => timestamp.codeHash,
			blockHeight: (timestamp) => timestamp.blockHeight,
			blockHash: (timestamp) => timestamp.blockHash,
		}),
		defineResolver({
			entityType: EntityType.NearContract_Timestamp,
			resolve: {
				ContractTimestampMsSource: {
					resolve: async ({ $contract }) => {
						const account = await getNearAccount(
							$contract.$network,
							$contract.accountId
						)
						if (account.code_hash === '11111111111111111111111111111111')
							throw new Error(`NearRpc_JsonRpc: account ${$contract.accountId} has no deployed contract code`)
						return nearAccountFields(account)
					},
				}
			},
		})({
			codeHash: (timestamp) => timestamp.codeHash,
			blockHeight: (timestamp) => timestamp.blockHeight,
			blockHash: (timestamp) => timestamp.blockHash,
		}),
		defineResolver({
			entityType: EntityType.NearAccessKey,
			resolve: {
				NearAccountPublicKey: {
					resolve: async ({ $account, publicKey }) => {
						return nearAccessKeyFields(await getNearAccessKey(
							$account.$network,
							$account.accountId,
							publicKey
						))
					},
				}
			},
		})({
			nonce: (accessKey) => accessKey.nonce,
			permission: (accessKey) => accessKey.permission,
		}),
		defineResolver({
			entityType: EntityType.NearAccessKey_Timestamp,
			resolve: {
				AccessKeyTimestampMsSource: {
					resolve: async ({ $accessKey }) => {
						return nearAccessKeyFields(await getNearAccessKey(
							$accessKey.$account.$network,
							$accessKey.$account.accountId,
							$accessKey.publicKey
						))
					},
				}
			},
		})({
			nonce: (timestamp) => timestamp.nonce,
			permission: (timestamp) => timestamp.permission,
			allowanceYoctoNear: (timestamp) => timestamp.allowanceYoctoNear,
			receiverId: (timestamp) => timestamp.receiverId,
			methodNames: (timestamp) => timestamp.methodNames ?? [],
			blockHeight: (timestamp) => timestamp.blockHeight,
			blockHash: (timestamp) => timestamp.blockHash,
		}),
		defineResolver({
			entityType: EntityType.NearValidator,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						return nearValidatorFields((
							await getNearCurrentValidator($network, accountId)
						).validator)
					},
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
		defineResolver({
			entityType: EntityType.NearValidator_Timestamp,
			resolve: {
				ValidatorEpochIdSource: {
					resolve: async ({ $validator }) => {
						const {
							validator,
							validatorSet,
						} = await getNearCurrentValidator(
							$validator.$network,
							$validator.accountId
						)
						const kickout = validatorSet.prev_epoch_kickout.find((candidate) => (
							candidate.account_id === $validator.accountId
						))
						return {
							epochHeight: BigInt(validatorSet.epoch_height),
							epochStartHeight: BigInt(validatorSet.epoch_start_height),
							validatorSetRole: 'current',
							...nearValidatorFields(validator),
							...(kickout != null && {
								kickoutReason: kickout.reason,
							}),
						}
					},
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
			shards: (timestamp) => timestamp.shards,
			kickoutReason: (timestamp) => timestamp.kickoutReason,
		}),
		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async (entitySelector) => {
						assertNearMainnet(entitySelector)
						const timestamp = await getNearNetworkTimestampFields()
						return [nearNetworkTimestampReference(entitySelector, timestamp)]
					},
				}
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertNearMainnet(network)
						const timestamp = await getNearNetworkTimestampFields()
						return [nearNetworkTimestampReference(network, timestamp)]
					},
				}
			},
			resolveLive: {
				finalHead: {
					facetPath: [
						'Near',
					],
					publishes: {
						'$$timestamps': true,
						'$$blocks': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertNearMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const timestamp = await getNearNetworkTimestampFields()
							if (signal.aborted)
								return
							const headBlock = await getBlock({ blockId: timestamp.headHash })
							if (signal.aborted)
								return
							fields.$$timestamps.replaceRows([{
								source: Source.NearRpc_JsonRpc,
								value: [nearNetworkTimestampReference(parentEntitySelector, timestamp)],
							}])
							fields.$$blocks.replaceRows([{
								source: Source.NearRpc_JsonRpc,
								value: [nearBlockReference(parentEntitySelector, headBlock)],
							}])
							timeout = setTimeout(() => { void poll() }, 1_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
			Near: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),
		defineResolver({
			entityType: EntityType.NearNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network }) => {
						assertNearMainnet($network)
						return getNearNetworkTimestampFields()
					},
				}
			},
		})(nearNetworkTimestampFieldResolvers),
		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async (entitySelector, context) => {
						return getNearBlockReferences(
							entitySelector,
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
			$$blocks: (blocks) => blocks,
		}),
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						return getNearBlockReferences(
							network,
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
			Near: {
				$$blocks: (blocks) => blocks,
			},
		}),
		defineResolver({
			entityType: EntityType.NearNetwork,
			resolve: {
				Slug: {
					resolve: async (entitySelector, context) => {
						return getNearValidatorReferences(
							entitySelector,
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
			$$validators: (validators) => validators,
		}),
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						return getNearValidatorReferences(
							network,
							resolverContextRowLimit(context)
						)
					},
				}
			},
		})({
			Near: {
				$$validators: (validators) => validators,
			},
		}),
		defineResolver({
			entityType: EntityType.NearAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async ({ $network, accountId }) => {
						assertNearMainnet($network)
						return (await viewAccessKeyList({
							accountId: accountId,
						})).keys.map((key) => ({
							[EntityMetaKey.Selector]: {
								$account: {
									$network,
									accountId,
								},
								publicKey: key.public_key,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.NearAccessKey, [], 'nonce')]: BigInt(key.access_key.nonce),
								[entityFieldAddressKey(EntityType.NearAccessKey, [], 'permission')]: key.access_key.permission === 'FullAccess' ? 'FullAccess' : 'FunctionCall',
							},
						}))
					},
				}
			},
		})({
			$$accessKeys: (accessKeys) => accessKeys,
		}),
	],
} satisfies RegisteredSourceResolverModule
