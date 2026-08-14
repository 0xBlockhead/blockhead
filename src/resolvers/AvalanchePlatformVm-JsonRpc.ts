import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	AvalanchePlatformVmDelegator,
	AvalanchePlatformVmJsonBlock,
	AvalanchePlatformVmJsonTx,
	AvalanchePlatformVmJsonTxUnsigned,
	AvalanchePlatformVmValidator,
} from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'
import { avalanchePrimaryNetworkSubnetId } from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertAvalanchePChain = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug['avalanche-p-chain'].slug)
		throw new Error('AvalanchePlatformVm_JsonRpc: unsupported network')
}

const bigintFromWire = (
	value: string,
	fieldName: string
) => {
	try {
		return BigInt(value)
	} catch {
		throw new Error(`AvalanchePlatformVm_JsonRpc: malformed ${fieldName}`)
	}
}

const millisFromUnixSeconds = (
	value: string | number,
	fieldName: string
) => {
	const seconds = typeof value === 'number' ? value : Number(value)
	if (!Number.isFinite(seconds))
		throw new Error(`AvalanchePlatformVm_JsonRpc: malformed ${fieldName}`)
	const timestampMs = Math.trunc(seconds * 1000)
	if (!Number.isSafeInteger(timestampMs))
		throw new Error(`AvalanchePlatformVm_JsonRpc: unsafe ${fieldName}`)
	return timestampMs
}

const getValidatorWithSetKind = async ({
	nodeId,
	startTimeMs,
	subnetId,
}: {
	nodeId: string
	startTimeMs: number
	subnetId: string
}) => {
	const {
		getCurrentValidators,
		getPendingValidators,
	} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
	const [
		current,
		pending,
	] = await Promise.all([
		getCurrentValidators({
			subnetID: subnetId,
			nodeIDs: [nodeId],
		}),
		getPendingValidators({
			subnetID: subnetId,
			nodeIDs: [nodeId],
		}),
	])
	for (const [
		validatorSetKind,
		validators,
	] of [
		['current', current.validators],
		['pending', pending.validators],
	] as const) {
		const validator = validators.find((row) => (
			row.nodeID === nodeId
			&& millisFromUnixSeconds(row.startTime, 'validator startTime') === startTimeMs
		))
		if (validator != null)
			return {
				validator,
				validatorSetKind,
			}
	}
	throw new Error(`AvalanchePlatformVm_JsonRpc: validator ${nodeId} not found on subnet ${subnetId}`)
}

const jsonBlock = (block: string | AvalanchePlatformVmJsonBlock): AvalanchePlatformVmJsonBlock => {
	if (typeof block === 'string')
		throw new Error('AvalanchePlatformVm_JsonRpc: expected json-encoded block')
	return block
}

const jsonTx = (tx: string | AvalanchePlatformVmJsonTx): AvalanchePlatformVmJsonTx => {
	if (typeof tx === 'string')
		throw new Error('AvalanchePlatformVm_JsonRpc: expected json-encoded transaction')
	return tx
}

const pChainTxType = (unsignedTx: AvalanchePlatformVmJsonTxUnsigned) => {
	if (unsignedTx.destinationChain != null)
		return 'ExportTx'
	if (unsignedTx.sourceChain != null)
		return 'ImportTx'
	if (unsignedTx.subnetOwners != null)
		return 'CreateSubnetTx'
	if (unsignedTx.chainName != null || unsignedTx.vmID != null || unsignedTx.genesisData != null)
		return 'CreateChainTx'
	if (unsignedTx.validator != null && unsignedTx.subnetID != null && unsignedTx.stake == null)
		return 'AddSubnetValidatorTx'
	if (unsignedTx.validator != null && unsignedTx.stake != null && unsignedTx.shares != null)
		return 'AddValidatorTx'
	if (unsignedTx.validator != null && unsignedTx.stake != null)
		return 'AddDelegatorTx'
	if (unsignedTx.validator != null)
		return 'AddSubnetValidatorTx'
	if (unsignedTx.time != null)
		return 'AdvanceTimeTx'
}

const memoFromWire = (memo: string | undefined) => {
	if (memo == null || memo === '' || memo === '0x' || memo === '0x00')
		return
	return memo
}

const pChainTransactionFields = (
	$network: NetworkId,
	txId: string,
	tx: AvalanchePlatformVmJsonTx,
	$block?: {
		$network: NetworkId
		height: bigint
		blockId: string
	}
) => {
	const unsignedTx = tx.unsignedTx
	const txType = pChainTxType(unsignedTx)
	const stakeWeight = unsignedTx.validator?.weight
	const memo = memoFromWire(unsignedTx.memo)
	return {
		$network: {
			[EntityMetaKey.Selector]: $network,
		},
		txId,
		...($block != null && {
			$block: {
				[EntityMetaKey.Selector]: $block,
			},
		}),
		...(txType != null && { txType }),
		...(unsignedTx.blockchainID != null && {
			blockchainId: unsignedTx.blockchainID,
		}),
		...(unsignedTx.subnetID != null ?
			{
				subnetId: unsignedTx.subnetID,
			}
		: unsignedTx.validator != null ?
			{
				subnetId: avalanchePrimaryNetworkSubnetId,
			}
		:
			{}
		),
		...(unsignedTx.validator != null && {
			nodeId: unsignedTx.validator.nodeID,
			startTimeMs: millisFromUnixSeconds(unsignedTx.validator.start, 'validator start'),
			endTimeMs: millisFromUnixSeconds(unsignedTx.validator.end, 'validator end'),
		}),
		...(stakeWeight != null && {
			stakeAmountNavax: bigintFromWire(String(stakeWeight), 'validator weight'),
		}),
		...(memo != null && { memo }),
		...(unsignedTx.sourceChain != null && {
			sourceChain: unsignedTx.sourceChain,
		}),
		...(unsignedTx.destinationChain != null && {
			destinationChain: unsignedTx.destinationChain,
		}),
		payload: unsignedTx,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txId,
				},
				timestampMs: Date.now(),
				source: Source.AvalanchePlatformVm_JsonRpc,
			},
		}],
	}
}

const blockTxCount = (block: AvalanchePlatformVmJsonBlock) => (
	block.txs != null ?
		block.txs.length
	: block.tx != null ?
		1
	:
		0
)

const blockTimestampMs = (block: AvalanchePlatformVmJsonBlock) => {
	if (block.timestamp != null)
		return millisFromUnixSeconds(block.timestamp, 'block timestamp')
	if (block.tx?.unsignedTx.time != null)
		return millisFromUnixSeconds(
			block.tx.unsignedTx.time,
			'block transaction time'
		)
}

const validatorFields = (
	validator: AvalanchePlatformVmValidator,
	subnetId: string
) => {
	const startTimeMs = millisFromUnixSeconds(validator.startTime, 'validator startTime')
	return {
		nodeId: validator.nodeID,
		subnetId,
		startTimeMs,
		...(validator.endTime != null && {
			endTimeMs: millisFromUnixSeconds(validator.endTime, 'validator endTime'),
		}),
		stakeAmountNavax: bigintFromWire(validator.weight, 'validator weight'),
		...(validator.txID != null && {
			txId: validator.txID,
		}),
		rewardOwnerAddresses: (
			validator.validationRewardOwner?.addresses
			?? validator.delegationRewardOwner?.addresses
			?? []
		),
		...(validator.potentialReward != null && {
			potentialRewardNavax: bigintFromWire(validator.potentialReward, 'validator potentialReward'),
		}),
		...(validator.delegationFee != null && {
			delegationFeePercent: Number(validator.delegationFee),
		}),
		$subnet: {
			[EntityMetaKey.Selector]: {
				subnetId,
			},
		},
		$network: {
			[EntityMetaKey.Selector]: {
				slug: networkBySlug['avalanche-p-chain'].slug,
			},
		},
		$$delegators: (validator.delegators ?? []).map((delegator) => {
			const fields = delegatorFields(delegator, validator, subnetId)
			return {
				[EntityMetaKey.Selector]: {
					$validator: validatorSelector(validator, subnetId),
					txId: delegator.txID,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'delegatorAddress')]: fields.delegatorAddress,
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'stakeAmountNavax')]: fields.stakeAmountNavax,
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'startTimeMs')]: fields.startTimeMs,
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'endTimeMs')]: fields.endTimeMs,
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'rewardOwnerAddresses')]: fields.rewardOwnerAddresses,
					[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'potentialRewardNavax')]: fields.potentialRewardNavax,
				},
			}
		}),
	}
}

const validatorSelector = (
	validator: AvalanchePlatformVmValidator,
	subnetId: string
) => ({
	nodeId: validator.nodeID,
	subnetId,
	startTimeMs: millisFromUnixSeconds(validator.startTime, 'validator startTime'),
})

const delegatorFields = (
	delegator: AvalanchePlatformVmDelegator,
	validator: AvalanchePlatformVmValidator,
	subnetId: string
) => ({
	$validator: {
		[EntityMetaKey.Selector]: validatorSelector(validator, subnetId),
	},
	txId: delegator.txID,
	delegatorAddress: delegator.rewardOwner.addresses[0],
	stakeAmountNavax: bigintFromWire(delegator.weight, 'delegator weight'),
	startTimeMs: millisFromUnixSeconds(delegator.startTime, 'delegator startTime'),
	endTimeMs: millisFromUnixSeconds(delegator.endTime, 'delegator endTime'),
	rewardOwnerAddresses: delegator.rewardOwner.addresses,
	potentialRewardNavax: bigintFromWire(delegator.potentialReward, 'delegator potentialReward'),
})

const pChainBlockFields = (
	$network: NetworkId,
	block: AvalanchePlatformVmJsonBlock,
	encoding: string
) => {
	const height = BigInt(block.height)
	const timestampMs = blockTimestampMs(block)
	const transactions = (
		block.txs != null ?
			block.txs
		: block.tx != null ?
			[block.tx]
		:
			[]
	)
	return {
		$network: {
			[EntityMetaKey.Selector]: $network,
		},
		height,
		blockId: block.id,
		parentBlockId: block.parentID,
		...(timestampMs != null && { timestampMs }),
		encoding,
		txCount: blockTxCount(block),
		$$transactions: transactions.flatMap((transaction) => {
			if (transaction.id == null)
				return []
			const fields = pChainTransactionFields(
				$network,
				transaction.id,
				transaction,
				{
					$network,
					height,
					blockId: block.id,
				}
			)
			return [{
				[EntityMetaKey.Selector]: {
					$network,
					txId: transaction.id,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], '$block')]: fields.$block,
					...(fields.txType != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'txType')]: fields.txType,
					}),
					...(fields.subnetId != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'subnetId')]: fields.subnetId,
					}),
					...(fields.blockchainId != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'blockchainId')]: fields.blockchainId,
					}),
					...(fields.nodeId != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'nodeId')]: fields.nodeId,
					}),
					...(fields.startTimeMs != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'startTimeMs')]: fields.startTimeMs,
					}),
					...(fields.endTimeMs != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'endTimeMs')]: fields.endTimeMs,
					}),
					...(fields.stakeAmountNavax != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'stakeAmountNavax')]: fields.stakeAmountNavax,
					}),
					...(fields.memo != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'memo')]: fields.memo,
					}),
					...(fields.sourceChain != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'sourceChain')]: fields.sourceChain,
					}),
					...(fields.destinationChain != null && {
						[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'destinationChain')]: fields.destinationChain,
					}),
					[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'payload')]: fields.payload,
				},
			}]
		}),
	}
}

export default {
	source: Source.AvalanchePlatformVm_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.AvalancheBlockchain,
			resolve: {
				BlockchainId: {
					resolve: async ({ blockchainId }) => {
						const { getBlockchains } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const blockchain = (await getBlockchains()).blockchains.find((row) => row.id === blockchainId)
						if (blockchain == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: blockchain ${blockchainId} not found`)
						return {
							blockchainId: blockchain.id,
							$subnet: {
								[EntityMetaKey.Selector]: {
									subnetId: blockchain.subnetID,
								},
							},
							vmId: blockchain.vmID,
							chainName: blockchain.name,
							$network: {
								[EntityMetaKey.Selector]: {
									slug: networkBySlug['avalanche-p-chain'].slug,
								},
							},
						}
					},
				},
			},
		})({
			$subnet: (blockchain) => blockchain.$subnet,
			vmId: (blockchain) => blockchain.vmId,
			chainName: (blockchain) => blockchain.chainName,
			$network: (blockchain) => blockchain.$network,
		}),

		defineResolver({
			entityType: EntityType.AvalancheSubnet,
			resolve: {
				SubnetId: {
					resolve: async ({ subnetId }) => {
						const {
							getBlockchains,
							getCurrentValidators,
							getPendingValidators,
							getSubnets,
						} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const subnet = (await getSubnets({
							ids: [subnetId],
						})).subnets.find((row) => row.id === subnetId)
						if (subnet == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: subnet ${subnetId} not found`)
						const [
							blockchains,
							currentValidators,
							pendingValidators,
						] = await Promise.all([
							getBlockchains(),
							getCurrentValidators({
								subnetID: subnetId,
							}),
							getPendingValidators({
								subnetID: subnetId,
							}),
						])
						const subnetBlockchains = blockchains.blockchains.filter((row) => row.subnetID === subnetId)
						const threshold = Number(subnet.threshold)
						return {
							subnetId: subnet.id,
							controlKeys: subnet.controlKeys,
							ownerAddresses: subnet.controlKeys,
							...(Number.isFinite(threshold) && { threshold }),
							$$blockchains: subnetBlockchains.map((blockchain) => ({
								[EntityMetaKey.Selector]: {
									blockchainId: blockchain.id,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AvalancheBlockchain, [], 'vmId')]: blockchain.vmID,
									[entityFieldAddressKey(EntityType.AvalancheBlockchain, [], 'chainName')]: blockchain.name,
								},
							})),
							$$validators: [
								...currentValidators.validators,
								...pendingValidators.validators,
							].map((validator) => {
								const fields = validatorFields(validator, subnetId)
								return {
									[EntityMetaKey.Selector]: validatorSelector(validator, subnetId),
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.AvalancheValidator, [], 'stakeAmountNavax')]: fields.stakeAmountNavax,
										...(fields.txId != null && {
											[entityFieldAddressKey(EntityType.AvalancheValidator, [], 'txId')]: fields.txId,
										}),
									},
								}
							}),
							$$delegators: [
								...currentValidators.validators,
								...pendingValidators.validators,
							].flatMap((validator) => (
								(validator.delegators ?? []).map((delegator) => {
									const fields = delegatorFields(delegator, validator, subnetId)
									return {
										[EntityMetaKey.Selector]: {
											$validator: validatorSelector(validator, subnetId),
											txId: delegator.txID,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'stakeAmountNavax')]: fields.stakeAmountNavax,
											[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'delegatorAddress')]: fields.delegatorAddress,
										},
									}
								})
							)),
						}
					},
				},
			},
		})({
			label: () => undefined,
			ownerAddresses: (subnet) => subnet.ownerAddresses,
			threshold: (subnet) => subnet.threshold,
			controlKeys: (subnet) => subnet.controlKeys,
			$$blockchains: {
				select: (subnet) => subnet.$$blockchains,
				resolveCount: (subnet) => subnet.$$blockchains.length,
			},
			$$validators: {
				select: (subnet) => subnet.$$validators,
				resolveCount: (subnet) => subnet.$$validators.length,
			},
			$$delegators: (subnet) => subnet.$$delegators,
		}),

		defineResolver({
			entityType: EntityType.AvalancheSubnet_Timestamp,
			resolve: {
				SubnetTimestampMsSource: {
					resolve: async ({ $subnet, source }) => {
						if (source !== Source.AvalanchePlatformVm_JsonRpc)
							throw new Error('AvalanchePlatformVm_JsonRpc: observation source mismatch')
						const {
							getBlockchains,
							getCurrentValidators,
							getPendingValidators,
						} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const [
							validators,
							pending,
							blockchains,
						] = await Promise.all([
							getCurrentValidators({
								subnetID: $subnet.subnetId,
							}),
							getPendingValidators({
								subnetID: $subnet.subnetId,
							}),
							getBlockchains(),
						])
						const totalStakeNavax = validators.validators.reduce(
							(sum, validator) => sum + bigintFromWire(validator.weight, 'validator weight'),
							0n
						)
						const delegatorCount = validators.validators.reduce(
							(sum, validator) => (
								sum
								+ (
									validator.delegators?.length
									?? (
										validator.delegatorCount != null ?
											Number(validator.delegatorCount)
										:
											0
									)
								)
							),
							0
						)
						return {
							timestampMs: Date.now(),
							source: Source.AvalanchePlatformVm_JsonRpc,
							validatorCount: validators.validators.length,
							delegatorCount,
							totalStakeNavax,
							chainCount: blockchains.blockchains.filter((row) => row.subnetID === $subnet.subnetId).length,
							pendingValidatorCount: pending.validators.length,
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			validatorCount: (observation) => observation.validatorCount,
			delegatorCount: (observation) => observation.delegatorCount,
			totalStakeNavax: (observation) => observation.totalStakeNavax,
			chainCount: (observation) => observation.chainCount,
			pendingValidatorCount: (observation) => observation.pendingValidatorCount,
		}),

		defineResolver({
			entityType: EntityType.AvalancheValidator,
			resolve: {
				NodeIdSubnetIdStartTimeMs: {
					resolve: async ({ nodeId, subnetId, startTimeMs }) => {
						const { validator } = await getValidatorWithSetKind({
							nodeId,
							startTimeMs,
							subnetId,
						})
						return validatorFields(validator, subnetId)
					},
				},
			},
		})({
			endTimeMs: (validator) => validator.endTimeMs,
			stakeAmountNavax: (validator) => validator.stakeAmountNavax,
			txId: (validator) => validator.txId,
			rewardOwnerAddresses: (validator) => validator.rewardOwnerAddresses,
			potentialRewardNavax: (validator) => validator.potentialRewardNavax,
			delegationFeePercent: (validator) => validator.delegationFeePercent,
			$subnet: (validator) => validator.$subnet,
			$network: (validator) => validator.$network,
			$$delegators: (validator) => validator.$$delegators,
		}),

		defineResolver({
			entityType: EntityType.AvalancheValidator_Timestamp,
			resolve: {
				ValidatorTimestampMsSource: {
					resolve: async ({ $validator, source }) => {
						if (source !== Source.AvalanchePlatformVm_JsonRpc)
							throw new Error('AvalanchePlatformVm_JsonRpc: observation source mismatch')
						const {
							validator,
							validatorSetKind,
						} = await getValidatorWithSetKind({
							nodeId: $validator.nodeId,
							startTimeMs: $validator.startTimeMs,
							subnetId: $validator.subnetId,
						})
						return {
							timestampMs: Date.now(),
							source: Source.AvalanchePlatformVm_JsonRpc,
							...(validator.connected != null && { connected: validator.connected }),
							...(validator.uptime != null && {
								uptimePercent: Number(validator.uptime),
							}),
							validatorSetKind,
							observedStakeNavax: bigintFromWire(validator.weight, 'validator weight'),
							observedDelegatorCount: (
								validator.delegators?.length
								?? (
									validator.delegatorCount != null ?
										Number(validator.delegatorCount)
									:
										0
								)
							),
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			connected: (observation) => observation.connected,
			uptimePercent: (observation) => observation.uptimePercent,
			validatorSetKind: (observation) => observation.validatorSetKind,
			observedStakeNavax: (observation) => observation.observedStakeNavax,
			observedDelegatorCount: (observation) => observation.observedDelegatorCount,
		}),

		defineResolver({
			entityType: EntityType.AvalancheDelegator,
			resolve: {
				ValidatorTxId: {
					resolve: async ({ $validator, txId }) => {
						const { validator } = await getValidatorWithSetKind({
							nodeId: $validator.nodeId,
							startTimeMs: $validator.startTimeMs,
							subnetId: $validator.subnetId,
						})
						const delegator = (validator.delegators ?? []).find((row) => row.txID === txId)
						if (delegator == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: delegator ${txId} not found`)
						return delegatorFields(delegator, validator, $validator.subnetId)
					},
				},
			},
		})({
			delegatorAddress: (delegator) => delegator.delegatorAddress,
			stakeAmountNavax: (delegator) => delegator.stakeAmountNavax,
			startTimeMs: (delegator) => delegator.startTimeMs,
			endTimeMs: (delegator) => delegator.endTimeMs,
			rewardOwnerAddresses: (delegator) => delegator.rewardOwnerAddresses,
			potentialRewardNavax: (delegator) => delegator.potentialRewardNavax,
		}),

		defineResolver({
			entityType: EntityType.AvalanchePChainBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertAvalanchePChain($network)
						const { getBlockByHeight } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const response = await getBlockByHeight(height, 'json')
						const block = jsonBlock(response.block)
						if (BigInt(block.height) !== height)
							throw new Error(`AvalanchePlatformVm_JsonRpc: block height ${block.height} does not match selector ${height}`)
						return pChainBlockFields($network, block, response.encoding)
					},
				},
				NetworkBlockId: {
					resolve: async ({ $network, blockId }) => {
						assertAvalanchePChain($network)
						const { getBlock } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const response = await getBlock(blockId, 'json')
						const block = jsonBlock(response.block)
						if (block.id !== blockId)
							throw new Error(`AvalanchePlatformVm_JsonRpc: block id ${block.id} does not match selector ${blockId}`)
						return pChainBlockFields($network, block, response.encoding)
					},
				},
			},
		})({
			parentBlockId: (block) => block.parentBlockId,
			timestampMs: (block) => block.timestampMs,
			encoding: (block) => block.encoding,
			txCount: (block) => block.txCount,
			$$transactions: {
				select: (block) => block.$$transactions,
				resolveCount: (block) => block.$$transactions.length,
			},
		}),

		defineResolver({
			entityType: EntityType.AvalanchePChainTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async ({ $network, txId }) => {
						assertAvalanchePChain($network)
						const { getTx } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const response = await getTx(txId, 'json')
						const transaction = jsonTx(response.tx)
						if (transaction.id != null && transaction.id !== txId)
							throw new Error(`AvalanchePlatformVm_JsonRpc: transaction id ${transaction.id} does not match selector ${txId}`)
						return pChainTransactionFields($network, txId, transaction)
					},
				},
			},
		})({
			txType: (transaction) => transaction.txType,
			$block: (transaction) => transaction.$block,
			subnetId: (transaction) => transaction.subnetId,
			blockchainId: (transaction) => transaction.blockchainId,
			nodeId: (transaction) => transaction.nodeId,
			startTimeMs: (transaction) => transaction.startTimeMs,
			endTimeMs: (transaction) => transaction.endTimeMs,
			stakeAmountNavax: (transaction) => transaction.stakeAmountNavax,
			feeNavax: () => undefined,
			memo: (transaction) => transaction.memo,
			sourceChain: (transaction) => transaction.sourceChain,
			destinationChain: (transaction) => transaction.destinationChain,
			payload: (transaction) => transaction.payload,
			$$timestamps: (transaction) => transaction.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.AvalanchePChainTransaction_Timestamp,
			resolve: {
				TransactionTimestampMsSource: {
					resolve: async ({ $transaction, source }) => {
						assertAvalanchePChain($transaction.$network)
						if (source !== Source.AvalanchePlatformVm_JsonRpc)
							throw new Error('AvalanchePlatformVm_JsonRpc: observation source mismatch')
						const {
							getHeight,
							getTxStatus,
						} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const [
							status,
							height,
						] = await Promise.all([
							getTxStatus($transaction.txId),
							getHeight(),
						])
						return {
							timestampMs: Date.now(),
							source: Source.AvalanchePlatformVm_JsonRpc,
							status: status.status,
							...(status.status === 'Committed' && {
								blockHeight: bigintFromWire(height.height, 'height'),
							}),
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			blockHeight: (observation) => observation.blockHeight,
			blockId: () => undefined,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertAvalanchePChain(network)
						const limit = resolverContextRowLimit(context)
						const { getHeight } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const tipHeight = bigintFromWire((await getHeight()).height, 'height')
						const blockCount = tipHeight + 1n
						const offset = BigInt(context.pagination.offset ?? 0)
						return {
							blockCount,
							blocks: Array.from({
								length: Math.min(
									Number(blockCount > offset ? blockCount - offset : 0n),
									limit
								),
							}, (_value, blockOffset) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									height: tipHeight - offset - BigInt(blockOffset),
								},
							})),
						}
					},
				},
			},
		})({
			Avalanche: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertAvalanchePChain(network)
						const { getSubnets } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const wireSubnets = (await getSubnets()).subnets
						const offset = context.pagination.offset ?? 0
						return {
							subnetCount: BigInt(wireSubnets.length),
							subnets: wireSubnets
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((subnet) => {
									const threshold = Number(subnet.threshold)
									return {
										[EntityMetaKey.Selector]: {
											subnetId: subnet.id,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'controlKeys')]: subnet.controlKeys,
											[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'ownerAddresses')]: subnet.controlKeys,
											...(Number.isFinite(threshold) && {
												[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'threshold')]: threshold,
											}),
										},
									}
								}),
						}
					},
				},
			},
		})({
			Avalanche: {
				$$subnets: {
					select: (snapshot) => snapshot.subnets,
					resolveCount: (snapshot) => snapshot.subnetCount,
				},
			},
		}),
	] as const,
} satisfies RegisteredSourceResolverModule
