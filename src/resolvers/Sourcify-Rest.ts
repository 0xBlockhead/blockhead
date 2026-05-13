import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	SourcifyContractLookupWire,
	SourcifyContractSourceMetadata,
} from '$/sources/Sourcify/Rest/types.ts'

const abiJsonStringFromSourcifyLookup = (
	wire: SourcifyContractLookupWire,
) => (
	Array.isArray(wire.abi) ?
		JSON.stringify(wire.abi)
	:	undefined
)

export default {
	source: Source.Sourcify_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmContract,
			resolve: async (entityId) => {
				const {
					getSourcifyContractLookup,
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract not verified')
				const abi = abiJsonStringFromSourcifyLookup(contractLookup)
				const deployer = contractLookup.deployment?.deployer
				return {
					...(abi != null ? { abi } : {}),
					...(deployer != null && deployer.startsWith('0x') ?
						{
							$deployer: {
								[EntityMetaKey.Id]: {
									address: deployer.toLowerCase() as `0x${string}`,
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
				} = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract sources not verified')
				const compiler = (
					contractLookup.metadata?.compiler?.version
					?? contractLookup.compilation?.compilerVersion
					?? contractLookup.compilation?.compiler
				)
				const language = contractLookup.metadata?.language ?? contractLookup.compilation?.language
				const sources = contractLookup.metadata?.sources ?? contractLookup.sources
				const fullyQualifiedName = (
					contractLookup.metadata?.fullyQualifiedName
					?? contractLookup.compilation?.fullyQualifiedName
				)
				const metadata: SourcifyContractSourceMetadata = {
					...(compiler != null && compiler !== '' ? { compiler } : {}),
					...(language != null && language !== '' ? { language } : {}),
					...(sources != null ? { sources } : {}),
					...(fullyQualifiedName != null && fullyQualifiedName !== '' ?
						{ fullyQualifiedName }
					:	{}),
				}
				const files = (
					Object.fromEntries(
						Object.entries(contractLookup.sources ?? contractLookup.metadata?.sources ?? {})
							.flatMap(([path, source]) => (
								typeof source?.content === 'string' && source.content.length > 0 ?
									[[path, source.content]]
								:
									[]
							)),
					)
				)
				return {
					metadata,
					files,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId) => {
				const { getSourcifyContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
				const contractLookup = await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				})
				if (contractLookup == null) return undefined
				return abiJsonStringFromSourcifyLookup(contractLookup)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$verifiedSource',
			resolve: async (entityId) => {
				const { getSourcifyContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
				if (await singleFlight(getSourcifyContractLookup)({
					chainId: entityId.$network.chainId,
					address: entityId.address,
				}) == null) return undefined
				return {
					[EntityMetaKey.Id]: entityId,
				}
			},
		}),
	],
}
