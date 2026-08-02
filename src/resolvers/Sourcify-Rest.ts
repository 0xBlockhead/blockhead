import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { evmAbiFromJsonValue } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcifyContractLookup } from '$/sources/Sourcify/Rest/types.ts'
import {
	isJsonArray,
	isJsonObject,
	type JsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

const sourcifyFirstStorageLayoutRecord = (
	root: JsonValue | undefined
): JsonObject | undefined => {
	const visited = new WeakSet<JsonObject | readonly JsonValue[]>()
	const walk = (node: JsonValue | undefined): JsonObject | undefined => {
		if (node == null) return undefined
		if (isJsonArray(node)) {
			if (visited.has(node)) return undefined
			visited.add(node)
			for (const child of node) {
				const found = walk(child)
				if (found !== undefined) return found
			}
			return undefined
		}
		if (!isJsonObject(node)) return undefined
		if (visited.has(node)) return undefined
		visited.add(node)
		if (isJsonObject(node.storageLayout)) return node.storageLayout
		for (const child of Object.values(node)) {
			const found = walk(child)
			if (found !== undefined) return found
		}
		return undefined
	}
	return walk(root)
}

const sourcifyStorageLayoutJsonFromLookup = (
	wire: SourcifyContractLookup
) => {
	const layoutObject = (
		sourcifyFirstStorageLayoutRecord(wire.storageLayout)
		?? sourcifyFirstStorageLayoutRecord(wire.metadata?.storageLayout)
		?? sourcifyFirstStorageLayoutRecord(wire.compilation?.storageLayout)
		?? sourcifyFirstStorageLayoutRecord(wire.compilation?.compilerSettings)
	)
	return layoutObject == null ? undefined : JSON.stringify(layoutObject)
}

const sourcifySourceFilesFromLookup = (
	wire: SourcifyContractLookup
) => (
	Object.fromEntries(
		Object.entries(wire.sources ?? wire.metadata?.sources ?? {})
			.flatMap(([path, source]) => (
				source.content != null && source.content.length > 0 ?
					[[path, source.content]]
				:
					[]
			))
	)
)

const getSourcifyContractLookupForEntitySelector = async ({
	$network,
	address,
}: EntitySelector<typeof schema, EntityType.EvmContract>) => {
	const { getContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
	return getContractLookup({
		chainId: Number($network.caip2.reference),
		address: address,
	})
}

export default {
	source: Source.Sourcify_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmContractVerification,
			resolve: {
				EvmContract: {
					resolve: async (entitySelector) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector(entitySelector.$contract)
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
								[EntityMetaKey.Selector]: entitySelector,
							},
							$sourceBundle: {
								[EntityMetaKey.Selector]: entitySelector,
							},
						}
					},
				},
			},
		})({
				match: (verification) => verification.match,
				creationMatch: (verification) => verification.creationMatch,
				runtimeMatch: (verification) => verification.runtimeMatch,
				verifiedAtMs: (verification) => verification.verifiedAtMs,
				matchId: (verification) => verification.matchId,
				$compilation: (verification) => verification.$compilation,
				$sourceBundle: (verification) => verification.$sourceBundle,
			}),

		defineResolver({
			entityType: EntityType.EvmContractCompilation,
			resolve: {
				EvmContract: {
					resolve: async ({ $contract }) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector($contract)
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
					},
				},
			},
		})({
				language: (compilation) => compilation.language,
				compiler: (compilation) => compilation.compiler,
				compilerVersion: (compilation) => compilation.compilerVersion,
				name: (compilation) => compilation.name,
				fullyQualifiedName: (compilation) => compilation.fullyQualifiedName,
				compilerSettingsJson: (compilation) => compilation.compilerSettingsJson,
				storageLayoutJson: (compilation) => compilation.storageLayoutJson,
			}),

		defineResolver({
			entityType: EntityType.EvmContractSourceBundle,
			resolve: {
				EvmContract: {
					resolve: async ({ $contract }) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector($contract)
						if (contractLookup == null) throw new Error('Sourcify_Rest: source bundle not verified')
						return {
							files: sourcifySourceFilesFromLookup(contractLookup),
						}
					},
				},
			},
		})({
				files: (sourceBundle) => sourceBundle.files,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector(entitySelector)
						if (contractLookup == null) return undefined
						return (
							Array.isArray(contractLookup.abi) ?
								evmAbiFromJsonValue(contractLookup.abi)
							:
								undefined
						)
					},
				},
			},
		})({
				abi: (abi) => abi,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						if (await getSourcifyContractLookupForEntitySelector(entitySelector) == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								$contract: entitySelector,
							},
						}
					},
				},
			},
		})({
				$verification: (verification) => verification,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector(entitySelector)
						const deployer = contractLookup?.deployment?.deployer
						if (deployer == null) return undefined
						const normalized = hexLowerOfByteSize(deployer, 20)
						if (normalized == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								address: normalized,
							},
						}
					},
				},
			},
		})({
				$deployer: (deployer) => deployer,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector(entitySelector)
						const txHash = contractLookup?.deployment?.transactionHash
						if (txHash == null) return undefined
						const normalized = hexLowerOfByteSize(txHash, 32)
						if (normalized == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								txHash: normalized,
							},
						}
					},
				},
			},
		})({
				$creationTransaction: (creationTransaction) => creationTransaction,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const contractLookup = await getSourcifyContractLookupForEntitySelector(entitySelector)
						const implementationAddress = contractLookup?.proxyResolution?.implementations?.[0]?.address
						if (implementationAddress == null || !implementationAddress.startsWith('0x')) return undefined
						const normalized = hexLowerOfByteSize(implementationAddress, 20)
						if (normalized == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								address: normalized,
							},
						}
					},
				},
			},
		})({
				$implementation: (implementation) => implementation,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.Sourcify_Rest>
