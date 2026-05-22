import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import {
	evmContractBytecodeHashFromGetCodeHex,
	evmContractRuntimeCodeFromGetCodeHex,
	evmContractStorageSlotReadsFromEthGetStorageAt,
} from '$/resolvers/_evmContractRpc.ts'
import {
	gweiFromDecimalString,
	networkGasEstimateTimestampFieldsFromObservation,
} from '$/resolvers/_networkGasEstimateTimestamp.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const throwIfEtherscanRestUnsupportedChainId = async (chainId: number) => {
	const { isEtherscanRestSupportedChainId } = await import('$/sources/Etherscan/Rest/client.ts')
	if (!isEtherscanRestSupportedChainId(chainId)) {
		throw new Error(`Etherscan_Rest: unsupported chain ${String(chainId)}`)
	}
}


export default {
	source: Source.Etherscan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network_GasEstimate_Timestamp,
			resolve: async (entityId, context) => {
				const { gastrackerGasOracle } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const oracle = await singleFlight(gastrackerGasOracle)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
				})
				if (oracle == null) {
					throw new Error('Etherscan_Rest: gasoracle returned no result')
				}
				const slowGwei = gweiFromDecimalString(oracle.SafeGasPrice)
				const averageGwei = gweiFromDecimalString(oracle.ProposeGasPrice)
				const fastGwei = gweiFromDecimalString(oracle.FastGasPrice)
				if (slowGwei == null && averageGwei == null && fastGwei == null) {
					throw new Error('Etherscan_Rest: gasoracle missing tier prices')
				}
				return networkGasEstimateTimestampFieldsFromObservation({
					timestampMs: entityId.timestampMs,
					...(slowGwei != null && { slowGwei }),
					...(averageGwei != null && { averageGwei }),
					...(fastGwei != null && { fastGwei }),
					transport: 'etherscan-gasoracle',
				})
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId, context) => {
				const { getContractAbiJsonString } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const abi = await singleFlight(getContractAbiJsonString)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				return abi ?? undefined
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$deployer',
			resolve: async (entityId, context) => {
				const { getContractCreationRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractCreationRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const creator = row?.contractCreator
				if (creator == null) return undefined
				const creatorAddress = hexLowerOfByteSize(creator, 20)
				if (creatorAddress == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						address: creatorAddress,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$creationTransaction',
			resolve: async (entityId, context) => {
				const { getContractCreationRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractCreationRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const txHash = row?.txHash
				if (txHash == null) return undefined
				const normalized = hexLowerOfByteSize(txHash, 32)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$implementation',
			resolve: async (entityId, context) => {
				const { getContractSourceCodeRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractSourceCodeRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const implementation = row?.Implementation
				if (implementation == null || implementation.trim() === '') return undefined
				const normalized = hexLowerOfByteSize(implementation, 20)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						address: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'code',
			resolve: async (entityId, context) => {
				const { proxyEthGetCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(proxyEthGetCode)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				if (codeHex == null) return undefined
				return evmContractRuntimeCodeFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'bytecodeHash',
			resolve: async (entityId, context) => {
				const { proxyEthGetCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(proxyEthGetCode)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				if (codeHex == null) return undefined
				return evmContractBytecodeHashFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'storageSlotReads',
			resolve: async (entityId, context) => {
				const { proxyEthGetStorageAt } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address: entityId.address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						singleFlight(proxyEthGetStorageAt)({
							publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
							chainId,
							address: entityId.address,
							slotQuantityHex,
						}).then((valueHex) => {
							if (valueHex == null) throw new Error('Etherscan_Rest: eth_getStorageAt returned no result')
							return valueHex
						})
					),
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				await throwIfEtherscanRestUnsupportedChainId(entityId.chainId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),
	],
}
