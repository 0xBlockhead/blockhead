import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Sourcify_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmContract,
			resolve: async (entityId) => {
				const {
					getSourcifyContractLookup,
					sourcifyContractAbiString,
					sourcifyContractDeployer,
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract not verified')
				const abi = sourcifyContractAbiString(contractLookup)
				const deployer = sourcifyContractDeployer(contractLookup)
				return {
					...(abi != null ? { abi } : {}),
					...(deployer != null && deployer.startsWith('0x') ?
						{
							$deployer: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address: deployer,
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
			resolve: async (entityId) => {
				const {
					getSourcifyContractLookup,
					sourcifyContractSourceFiles,
					sourcifyContractSourceMetadata,
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract sources not verified')
				return {
					metadata: sourcifyContractSourceMetadata(contractLookup),
					files: sourcifyContractSourceFiles(contractLookup),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId) => {
				const { getSourcifyContractLookup, sourcifyContractAbiString } = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) return undefined
				return sourcifyContractAbiString(contractLookup)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$verifiedSource',
			resolve: async (entityId) => {
				const { getSourcifyContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) return undefined
				return {
					[EntityMetaKey.Id]: entityId,
				}
			},
		}),
	],
}
