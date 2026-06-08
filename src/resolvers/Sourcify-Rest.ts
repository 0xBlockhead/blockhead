import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { evmAbiFromJsonValue } from '$/lib/evmAbi.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcifyContractLookup } from '$/sources/Sourcify/Rest/types.ts'

const sourcifyFirstStorageLayoutRecord = (
	root: unknown,
): Record<string, unknown> | undefined => {
	const visited = new WeakSet<object>()
	const walk = (node: unknown): Record<string, unknown> | undefined => {
		if (node === null || typeof node !== 'object') return undefined
		if (visited.has(node)) return undefined
		visited.add(node)
		if (Array.isArray(node)) {
			for (const child of node) {
				const found = walk(child)
				if (found !== undefined) return found
			}
			return undefined
		}
		const metadataNode = node as Record<string, unknown>
		const direct = metadataNode.storageLayout
		if (direct !== null && typeof direct === 'object' && !Array.isArray(direct)) {
			return direct as Record<string, unknown>
		}
		for (const child of Object.values(metadataNode)) {
			const found = walk(child)
			if (found !== undefined) return found
		}
		return undefined
	}
	return walk(root)
}

const sourcifyStorageLayoutJsonFromLookup = (
	wire: SourcifyContractLookup,
) => {
	const layoutObject = (
		sourcifyFirstStorageLayoutRecord(wire.storageLayout)
		?? sourcifyFirstStorageLayoutRecord(wire.metadata)
		?? sourcifyFirstStorageLayoutRecord(wire.compilation)
		?? sourcifyFirstStorageLayoutRecord(wire)
	)
	return layoutObject == null ? undefined : JSON.stringify(layoutObject)
}

const sourcifySourceFilesFromLookup = (
	wire: SourcifyContractLookup,
) => (
	Object.fromEntries(
		Object.entries(wire.sources ?? wire.metadata?.sources ?? {})
			.flatMap(([path, source]) => (
				source.content != null && source.content.length > 0 ?
					[[path, source.content]]
				:
					[]
			)),
	)
)

const getSourcifyContractLookupForEntityId = async (entityId: {
	$network: { caip2: { namespace: 'eip155', reference: string } }
	address: `0x${string}`
}) => {
	const { getContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
	return singleFlight(getContractLookup)({
		chainId: Number(entityId.$network.caip2.reference),
		address: entityId.address,
	})
}

export default {
	source: Source.Sourcify_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmContractVerification,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract not verified')
				return {
					...(contractLookup.match != null && contractLookup.match !== '' && { match: contractLookup.match }),
					...(contractLookup.creationMatch != null
						&& contractLookup.creationMatch !== ''
						&& { creationMatch: contractLookup.creationMatch }),
					...(contractLookup.runtimeMatch != null
						&& contractLookup.runtimeMatch !== ''
						&& { runtimeMatch: contractLookup.runtimeMatch }),
					...((verifiedAtMs) => (
						Number.isFinite(verifiedAtMs) && verifiedAtMs >= 0 ?
							{ verifiedAtMs }
						:
							{}
					))(Date.parse(contractLookup.verifiedAt ?? '')),
					...(contractLookup.matchId != null && contractLookup.matchId !== '' && { matchId: String(contractLookup.matchId) }),
					$compilation: {
						[EntityMetaKey.Id]: entityId,
					},
					$sourceBundle: {
						[EntityMetaKey.Id]: entityId,
					},
				}
			}
			},
			fields: {
			match: (verification) => verification.match,
			creationMatch: (verification) => verification.creationMatch,
			runtimeMatch: (verification) => verification.runtimeMatch,
			verifiedAtMs: (verification) => verification.verifiedAtMs,
			matchId: (verification) => verification.matchId,
			$compilation: (verification) => verification.$compilation,
			$sourceBundle: (verification) => verification.$sourceBundle,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContractCompilation,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: compilation not verified')
				const language = contractLookup.metadata?.language ?? contractLookup.compilation?.language
				const compiler = (
					contractLookup.metadata?.compiler?.version
					?? contractLookup.compilation?.compilerVersion
					?? contractLookup.compilation?.compiler
				)
				const fullyQualifiedName = (
					contractLookup.metadata?.fullyQualifiedName
					?? contractLookup.compilation?.fullyQualifiedName
				)
				return {
					...(language != null && language !== '' && { language }),
					...(compiler != null && compiler !== '' && { compiler }),
					...(contractLookup.compilation?.compilerVersion != null
						&& contractLookup.compilation.compilerVersion !== ''
						&& { compilerVersion: contractLookup.compilation.compilerVersion }),
					...(contractLookup.compilation?.name != null
						&& contractLookup.compilation.name !== ''
						&& { name: contractLookup.compilation.name }),
					...(fullyQualifiedName != null && fullyQualifiedName !== '' && { fullyQualifiedName }),
					...(contractLookup.compilation?.compilerSettings != null && {
						compilerSettingsJson: JSON.stringify(contractLookup.compilation.compilerSettings),
					}),
					...((storageLayoutJson) => (
						storageLayoutJson != null ?
							{ storageLayoutJson }
						:
							{}
					))(sourcifyStorageLayoutJsonFromLookup(contractLookup)),
				}
			}
			},
			fields: {
			language: (compilation) => compilation.language,
			compiler: (compilation) => compilation.compiler,
			compilerVersion: (compilation) => compilation.compilerVersion,
			name: (compilation) => compilation.name,
			fullyQualifiedName: (compilation) => compilation.fullyQualifiedName,
			compilerSettingsJson: (compilation) => compilation.compilerSettingsJson,
			storageLayoutJson: (compilation) => compilation.storageLayoutJson,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContractSourceBundle,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: source bundle not verified')
				return {
					files: sourcifySourceFilesFromLookup(contractLookup),
				}
			}
			},
			fields: {
			files: (sourceBundle) => sourceBundle.files,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) return undefined
				return (
					Array.isArray(contractLookup.abi) ?
						evmAbiFromJsonValue(contractLookup.abi)
					:
						undefined
				)
			}
			},
			fields: {
			abi: (abi) => abi,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (await getSourcifyContractLookupForEntityId(entityId) == null) return undefined
				return {
					[EntityMetaKey.Id]: entityId,
				}
			}
			},
			fields: {
			$verification: (verification) => verification,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				const deployer = contractLookup?.deployment?.deployer
				if (deployer == null || !deployer.startsWith('0x')) return undefined
				return {
					[EntityMetaKey.Id]: {
						address: deployer.toLowerCase() as `0x${string}`,
					},
				}
			}
			},
			fields: {
			$deployer: (deployer) => deployer,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				const txHash = contractLookup?.deployment?.transactionHash
				if (txHash == null) return undefined
				const normalized = (
					await import('$/lib/hexLowerOfByteSize.ts')
				).hexLowerOfByteSize(txHash, 32)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash: normalized,
					},
				}
			}
			},
			fields: {
			$creationTransaction: (creationTransaction) => creationTransaction,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				const implementationAddress = contractLookup?.proxyResolution?.implementations?.[0]?.address
				if (implementationAddress == null || !implementationAddress.startsWith('0x')) return undefined
				const normalized = (
					await import('$/lib/hexLowerOfByteSize.ts')
				).hexLowerOfByteSize(implementationAddress, 20)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						address: normalized,
					},
				}
			}
			},
			fields: {
			$implementation: (implementation) => implementation,
		}
		}),
	],
}
