import { networkBySlug } from '$/constants/Network.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { OgmiosProtocolParameters } from '$/sources/Ogmios/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCardanoMainnet = (
	network: NetworkId
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.cardano.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cardano.caip2.namespace
			&& network.caip2.reference === networkBySlug.cardano.caip2.reference
		)
	)
		throw new Error('Ogmios_JsonRpc: unsupported network')
}

const cardanoNetworkSelectors = <const _Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Slug: { resolve },
	Caip2: { resolve },
})

const tipObservation = async () => {
	const {
		getEpoch,
		getLedgerTip,
		getNetworkBlockHeight,
	} = await import('$/sources/Ogmios/JsonRpc/queries.ts')
	const [
		tip,
		blockHeight,
		epoch,
	] = await Promise.all([
		getLedgerTip(),
		getNetworkBlockHeight(),
		getEpoch(),
	])

	return {
		timestampMs: Date.now(),
		latestSlot: BigInt(tip.slot),
		latestBlockHash: tip.id,
		latestBlockNo: BigInt(blockHeight),
		epoch,
	}
}

const protocolParameterSnapshot = (
	parameters: OgmiosProtocolParameters
) => ({
	minFeeA: BigInt(parameters.minFeeCoefficient),
	minFeeB: BigInt(parameters.minFeeConstant.ada.lovelace),
	maxBlockBodySize: parameters.maxBlockBodySize.bytes,
	...(parameters.maxTransactionSize != null && {
		maxTxSize: parameters.maxTransactionSize.bytes,
	}),
	maxBlockHeaderSize: parameters.maxBlockHeaderSize.bytes,
	keyDeposit: BigInt(parameters.stakeCredentialDeposit.ada.lovelace),
	poolDeposit: BigInt(parameters.stakePoolDeposit.ada.lovelace),
	maxEpoch: parameters.stakePoolRetirementEpochBound,
	nOpt: parameters.desiredNumberOfStakePools,
	rho: parameters.monetaryExpansion,
	tau: parameters.treasuryExpansion,
	...(parameters.federatedBlockProductionRatio != null && {
		decentralisation: parameters.federatedBlockProductionRatio,
	}),
	protocolMajor: parameters.version.major,
	protocolMinor: parameters.version.minor,
	minPoolCost: BigInt(parameters.minStakePoolCost.ada.lovelace),
	coinsPerUtxoByte: BigInt(parameters.minUtxoDepositCoefficient),
	...(parameters.plutusCostModels != null && {
		costModels: parameters.plutusCostModels,
	}),
	...(parameters.scriptExecutionPrices != null && {
		executionPrices: {
			memory: parameters.scriptExecutionPrices.memory,
			steps: parameters.scriptExecutionPrices.cpu,
		},
	}),
	...(parameters.maxExecutionUnitsPerTransaction != null && {
		maxTxExUnits: {
			memory: parameters.maxExecutionUnitsPerTransaction.memory,
			steps: parameters.maxExecutionUnitsPerTransaction.cpu,
		},
	}),
	...(parameters.maxExecutionUnitsPerBlock != null && {
		maxBlockExUnits: {
			memory: parameters.maxExecutionUnitsPerBlock.memory,
			steps: parameters.maxExecutionUnitsPerBlock.cpu,
		},
	}),
	...(parameters.maxValueSize != null && {
		maxValueSize: parameters.maxValueSize.bytes,
	}),
	...(parameters.collateralPercentage != null && {
		collateralPercentage: parameters.collateralPercentage,
	}),
	...(parameters.maxCollateralInputs != null && {
		maxCollateralInputs: parameters.maxCollateralInputs,
	}),
})

const protocolParameterFields = (
	parameters: OgmiosProtocolParameters
) => {
	const snapshot = protocolParameterSnapshot(parameters)
	return {
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: snapshot.minFeeA,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeB')]: snapshot.minFeeB,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockBodySize')]: snapshot.maxBlockBodySize,
		...('maxTxSize' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxSize')]: snapshot.maxTxSize,
		}),
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockHeaderSize')]: snapshot.maxBlockHeaderSize,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'keyDeposit')]: snapshot.keyDeposit,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'poolDeposit')]: snapshot.poolDeposit,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxEpoch')]: snapshot.maxEpoch,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'nOpt')]: snapshot.nOpt,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'rho')]: snapshot.rho,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'tau')]: snapshot.tau,
		...('decentralisation' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'decentralisation')]: snapshot.decentralisation,
		}),
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMajor')]: snapshot.protocolMajor,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMinor')]: snapshot.protocolMinor,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minPoolCost')]: snapshot.minPoolCost,
		[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: snapshot.coinsPerUtxoByte,
		...('costModels' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: snapshot.costModels,
		}),
		...('executionPrices' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'executionPrices')]: snapshot.executionPrices,
		}),
		...('maxTxExUnits' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxExUnits')]: snapshot.maxTxExUnits,
		}),
		...('maxBlockExUnits' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockExUnits')]: snapshot.maxBlockExUnits,
		}),
		...('maxValueSize' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: snapshot.maxValueSize,
		}),
		...('collateralPercentage' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'collateralPercentage')]: snapshot.collateralPercentage,
		}),
		...('maxCollateralInputs' in snapshot && {
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxCollateralInputs')]: snapshot.maxCollateralInputs,
		}),
	}
}
export default {
	source: Source.Ogmios_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const observation = await tipObservation()

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: observation.timestampMs,
							source: Source.Ogmios_JsonRpc,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: observation.latestSlot,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: observation.latestBlockNo,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: observation.latestBlockHash,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: observation.epoch,
						},
					}]
				}
			),
		})({
			Cardano: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					if (resolverContextRowLimit(context) === 0)
						return []

					const observation = await tipObservation()
					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							hash: observation.latestBlockHash,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: observation.latestSlot,
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: observation.latestBlockNo,
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: observation.epoch,
						},
					}]
				}
			),
		})({
			Cardano: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const {
						getEpoch,
						getProtocolParameters,
					} = await import('$/sources/Ogmios/JsonRpc/queries.ts')
					const [
						epoch,
						parameters,
					] = await Promise.all([
						getEpoch(),
						getProtocolParameters(),
					])

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							epoch,
							source: Source.Ogmios_JsonRpc,
						},
						[EntityMetaKey.Fields]: protocolParameterFields(parameters),
					}]
				}
			),
		})({
			Cardano: {
				$$protocolParameterEpochs: (parameterEpochs) => parameterEpochs,
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						source,
					}) => {
						assertCardanoMainnet($network)
						if (source !== Source.Ogmios_JsonRpc)
							throw new Error('Ogmios_JsonRpc: observation source mismatch')

						return tipObservation()
					},
				},
			},
		})({
			latestSlot: (observation) => observation.latestSlot,
			latestBlockNo: (observation) => observation.latestBlockNo,
			latestBlockHash: (observation) => observation.latestBlockHash,
			epoch: (observation) => observation.epoch,
		}),

		defineResolver({
			entityType: EntityType.CardanoProtocolParameters_Epoch,
			resolve: {
				NetworkEpochSource: {
					resolve: async ({
						$network,
						epoch,
						source,
					}) => {
						assertCardanoMainnet($network)
						if (source !== Source.Ogmios_JsonRpc)
							throw new Error('Ogmios_JsonRpc: observation source mismatch')

						const {
							getEpoch,
							getProtocolParameters,
						} = await import('$/sources/Ogmios/JsonRpc/queries.ts')
						const [
							currentEpoch,
							parameters,
						] = await Promise.all([
							getEpoch(),
							getProtocolParameters(),
						])
						if (currentEpoch !== epoch)
							throw new Error('Ogmios_JsonRpc: historical protocol parameters epoch is unavailable')

						return protocolParameterSnapshot(parameters)
					},
				},
			},
		})({
			minFeeA: (snapshot) => snapshot.minFeeA,
			minFeeB: (snapshot) => snapshot.minFeeB,
			maxBlockBodySize: (snapshot) => snapshot.maxBlockBodySize,
			maxTxSize: (snapshot) => snapshot.maxTxSize,
			maxBlockHeaderSize: (snapshot) => snapshot.maxBlockHeaderSize,
			keyDeposit: (snapshot) => snapshot.keyDeposit,
			poolDeposit: (snapshot) => snapshot.poolDeposit,
			maxEpoch: (snapshot) => snapshot.maxEpoch,
			nOpt: (snapshot) => snapshot.nOpt,
			rho: (snapshot) => snapshot.rho,
			tau: (snapshot) => snapshot.tau,
			decentralisation: (snapshot) => snapshot.decentralisation,
			protocolMajor: (snapshot) => snapshot.protocolMajor,
			protocolMinor: (snapshot) => snapshot.protocolMinor,
			minPoolCost: (snapshot) => snapshot.minPoolCost,
			coinsPerUtxoByte: (snapshot) => snapshot.coinsPerUtxoByte,
			costModels: (snapshot) => snapshot.costModels,
			executionPrices: (snapshot) => snapshot.executionPrices,
			maxTxExUnits: (snapshot) => snapshot.maxTxExUnits,
			maxBlockExUnits: (snapshot) => snapshot.maxBlockExUnits,
			maxValueSize: (snapshot) => snapshot.maxValueSize,
			collateralPercentage: (snapshot) => snapshot.collateralPercentage,
			maxCollateralInputs: (snapshot) => snapshot.maxCollateralInputs,
		}),

		defineResolver({
			entityType: EntityType.CardanoBlock,
			resolve: {
				NetworkHash: {
					resolve: async ({
						$network,
						hash,
					}) => {
						assertCardanoMainnet($network)
						const observation = await tipObservation()
						if (observation.latestBlockHash !== hash)
							throw new Error('Ogmios_JsonRpc: historical block by hash is unavailable')

						return observation
					},
				},
				NetworkSlot: {
					resolve: async ({
						$network,
						slot,
					}) => {
						assertCardanoMainnet($network)
						const observation = await tipObservation()
						if (observation.latestSlot !== slot)
							throw new Error('Ogmios_JsonRpc: historical block by slot is unavailable')

						return observation
					},
				},
				NetworkBlockNo: {
					resolve: async ({
						$network,
						blockNo,
					}) => {
						assertCardanoMainnet($network)
						const observation = await tipObservation()
						if (observation.latestBlockNo !== blockNo)
							throw new Error('Ogmios_JsonRpc: historical block by height is unavailable')

						return observation
					},
				},
			},
		})({
			slot: (observation) => observation.latestSlot,
			blockNo: (observation) => observation.latestBlockNo,
			hash: (observation) => observation.latestBlockHash,
			epoch: (observation) => observation.epoch,
		}),
	],
} satisfies RegisteredSourceResolverModule
