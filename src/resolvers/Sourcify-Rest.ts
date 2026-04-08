import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmContract,
			source: Source.Sourcify,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					getSourcifyContractLookup,
					sourcifyContractAbiString,
					sourcifyContractDeployer,
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const wire = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (wire == null) return {}
				const abi = sourcifyContractAbiString(wire)
				const deployer = sourcifyContractDeployer(wire)
				return {
					...(abi != null ? { abi } : {}),
					...(deployer != null ?
						{
							$deployer: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: deployer as `0x${string}`,
								},
							},
						}
					:	{}),
					$verifiedSource: {
						[EntityMetaKey.Id]: entityId,
					},
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.EvmContractSource,
			source: Source.Sourcify,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					getSourcifyContractLookup,
					sourcifyContractSourceFiles,
					sourcifyContractSourceMetadata,
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const wire = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (wire == null) return {}
				return {
					metadata: sourcifyContractSourceMetadata(wire),
					files: sourcifyContractSourceFiles(wire),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			source: Source.Sourcify,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getSourcifyContractLookup, sourcifyContractAbiString } = await import(
					'$/sources/Sourcify/Rest/queries.ts',
				)
				const wire = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (wire == null) return undefined
				return sourcifyContractAbiString(wire)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$verifiedSource',
			source: Source.Sourcify,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getSourcifyContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
				const wire = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (wire == null) return undefined
				return {
					[EntityMetaKey.Id]: entityId,
				}
			},
		}),
	],
}
