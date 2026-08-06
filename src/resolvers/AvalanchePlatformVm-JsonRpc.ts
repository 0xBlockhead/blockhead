import { networkBySlug } from '$/constants/Network.ts'
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
	AvalanchePlatformVmValidator,
} from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'

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

const jsonBlock = (block: string | AvalanchePlatformVmJsonBlock): AvalanchePlatformVmJsonBlock => {
	if (typeof block === 'string')
		throw new Error('AvalanchePlatformVm_JsonRpc: expected json-encoded block')
	return block
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
	if (
		block.tx != null
		&& typeof block.tx === 'object'
		&& 'unsignedTx' in block.tx
		&& block.tx.unsignedTx != null
		&& typeof block.tx.unsignedTx === 'object'
		&& 'time' in block.tx.unsignedTx
	)
		return millisFromUnixSeconds(
			block.tx.unsignedTx.time as string | number,
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
			if (
				transaction == null
				|| typeof transaction !== 'object'
				|| !('id' in transaction)
				|| typeof transaction.id !== 'string'
			)
				return []
			return [{
				[EntityMetaKey.Selector]: {
					$network,
					txId: transaction.id,
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
							getSubnets,
						} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const subnet = (await getSubnets({
							ids: [subnetId],
						})).subnets.find((row) => row.id === subnetId)
						if (subnet == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: subnet ${subnetId} not found`)
						const [
							blockchains,
							validators,
						] = await Promise.all([
							getBlockchains(),
							getCurrentValidators({
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
							$$validators: validators.validators.map((validator) => {
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
							$$delegators: validators.validators.flatMap((validator) => (
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
			$$blockchains: (subnet) => subnet.$$blockchains,
			$$validators: (subnet) => subnet.$$validators,
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
						const { getCurrentValidators } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const validator = (await getCurrentValidators({
							subnetID: subnetId,
							nodeIDs: [nodeId],
						})).validators.find((row) => (
							row.nodeID === nodeId
							&& millisFromUnixSeconds(row.startTime, 'validator startTime') === startTimeMs
						))
						if (validator == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: validator ${nodeId} not found on subnet ${subnetId}`)
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
		}),

		defineResolver({
			entityType: EntityType.AvalancheValidator_Timestamp,
			resolve: {
				ValidatorTimestampMsSource: {
					resolve: async ({ $validator, source }) => {
						if (source !== Source.AvalanchePlatformVm_JsonRpc)
							throw new Error('AvalanchePlatformVm_JsonRpc: observation source mismatch')
						const { getCurrentValidators } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const validator = (await getCurrentValidators({
							subnetID: $validator.subnetId,
							nodeIDs: [$validator.nodeId],
						})).validators.find((row) => (
							row.nodeID === $validator.nodeId
							&& millisFromUnixSeconds(row.startTime, 'validator startTime') === $validator.startTimeMs
						))
						if (validator == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: validator ${$validator.nodeId} not found`)
						return {
							timestampMs: Date.now(),
							source: Source.AvalanchePlatformVm_JsonRpc,
							...(validator.connected != null && { connected: validator.connected }),
							...(validator.uptime != null && {
								uptimePercent: Number(validator.uptime),
							}),
							validatorSetKind: 'current',
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
						const { getCurrentValidators } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const validator = (await getCurrentValidators({
							subnetID: $validator.subnetId,
							nodeIDs: [$validator.nodeId],
						})).validators.find((row) => (
							row.nodeID === $validator.nodeId
							&& millisFromUnixSeconds(row.startTime, 'validator startTime') === $validator.startTimeMs
						))
						if (validator == null)
							throw new Error(`AvalanchePlatformVm_JsonRpc: validator ${$validator.nodeId} not found`)
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
						return pChainBlockFields($network, jsonBlock(response.block), response.encoding)
					},
				},
				NetworkBlockId: {
					resolve: async ({ $network, blockId }) => {
						assertAvalanchePChain($network)
						const { getBlock } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						const response = await getBlock(blockId, 'json')
						return pChainBlockFields($network, jsonBlock(response.block), response.encoding)
					},
				},
			},
		})({
			parentBlockId: (block) => block.parentBlockId,
			timestampMs: (block) => block.timestampMs,
			encoding: (block) => block.encoding,
			txCount: (block) => block.txCount,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.AvalanchePChainTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async ({ $network, txId }) => {
						assertAvalanchePChain($network)
						const { getTxStatus } = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')
						await getTxStatus(txId)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							txId,
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
					},
				},
			},
		})({
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
	] as const,
} satisfies RegisteredSourceResolverModule
