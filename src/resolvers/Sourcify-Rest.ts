import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
		const record = node as Record<string, unknown>
		const direct = record.storageLayout
		if (direct !== null && typeof direct === 'object' && !Array.isArray(direct)) {
			return direct as Record<string, unknown>
		}
		for (const child of Object.values(record)) {
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
				source?.content != null && source.content.length > 0 ?
					[[path, source.content]]
				:
					[]
			)),
	)
)

const sourcifyCompilationFieldsFromLookup = (
	wire: SourcifyContractLookup,
) => {
	const compiler = (
		wire.metadata?.compiler?.version
		?? wire.compilation?.compilerVersion
		?? wire.compilation?.compiler
	)
	const language = wire.metadata?.language ?? wire.compilation?.language
	const name = wire.compilation?.name
	const fullyQualifiedName = (
		wire.metadata?.fullyQualifiedName
		?? wire.compilation?.fullyQualifiedName
	)
	const compilerSettingsJson = (
		wire.compilation?.compilerSettings != null ?
			JSON.stringify(wire.compilation.compilerSettings)
		:	undefined
	)
	const storageLayoutJson = sourcifyStorageLayoutJsonFromLookup(wire)
	return {
		...(language != null && language !== '' && { language }),
		...(compiler != null && compiler !== '' && { compiler }),
		...(wire.compilation?.compilerVersion != null
			&& wire.compilation.compilerVersion !== ''
			&& { compilerVersion: wire.compilation.compilerVersion }),
		...(name != null && name !== '' && { name }),
		...(fullyQualifiedName != null && fullyQualifiedName !== '' && { fullyQualifiedName }),
		...(compilerSettingsJson != null && { compilerSettingsJson }),
		...(storageLayoutJson != null && { storageLayoutJson }),
	}
}

const sourcifyVerificationFieldsFromLookup = (
	wire: SourcifyContractLookup,
	entityId: {
		$network: { caip2: { namespace: 'eip155', reference: string } }
		address: `0x${string}`
	},
) => ({
	...(wire.match != null && wire.match !== '' && { match: wire.match }),
	...(wire.creationMatch != null
		&& wire.creationMatch !== ''
		&& { creationMatch: wire.creationMatch }),
	...(wire.runtimeMatch != null
		&& wire.runtimeMatch !== ''
		&& { runtimeMatch: wire.runtimeMatch }),
	...(wire.verifiedAt != null && wire.verifiedAt !== '' && ((parsed) => (
		Number.isFinite(parsed) && parsed >= 0 ?
			{ verifiedAtMs: parsed }
		:
			{}
	))(Date.parse(wire.verifiedAt))),
	...(wire.matchId != null && wire.matchId !== '' && { matchId: String(wire.matchId) }),
	$compilation: {
		[EntityMetaKey.Id]: entityId,
	},
	$sourceBundle: {
		[EntityMetaKey.Id]: entityId,
	},
})

const getSourcifyContractLookupForEntityId = async (entityId: {
	$network: { caip2: { namespace: 'eip155', reference: string } }
	address: `0x${string}`
}) => {
	const { getSourcifyContractLookup } = await import('$/sources/Sourcify/Rest/queries.ts')
	return singleFlight(getSourcifyContractLookup)({
		chainId: Number(entityId.$network.caip2.reference),
		address: entityId.address,
	})
}

export default {
	source: Source.Sourcify_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmContractVerification,
			resolve: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: contract not verified')
				return sourcifyVerificationFieldsFromLookup(contractLookup, entityId)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmContractCompilation,
			resolve: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: compilation not verified')
				return sourcifyCompilationFieldsFromLookup(contractLookup)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmContractSourceBundle,
			resolve: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) throw new Error('Sourcify_Rest: source bundle not verified')
				return {
					files: sourcifySourceFilesFromLookup(contractLookup),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				if (contractLookup == null) return undefined
				return (
					Array.isArray(contractLookup.abi) ?
						JSON.stringify(contractLookup.abi)
					:	undefined
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$verification',
			resolve: async (entityId) => {
				if (await getSourcifyContractLookupForEntityId(entityId) == null) return undefined
				return {
					[EntityMetaKey.Id]: entityId,
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$deployer',
			resolve: async (entityId) => {
				const contractLookup = await getSourcifyContractLookupForEntityId(entityId)
				const deployer = contractLookup?.deployment?.deployer
				if (deployer == null || !deployer.startsWith('0x')) return undefined
				return {
					[EntityMetaKey.Id]: {
						address: deployer.toLowerCase() as `0x${string}`,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$creationTransaction',
			resolve: async (entityId) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$implementation',
			resolve: async (entityId) => {
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
			},
		}),
	],
}
