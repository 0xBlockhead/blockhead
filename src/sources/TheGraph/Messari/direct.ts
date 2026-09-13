import { initGraphQLTada } from 'gql.tada'

import type { introspection } from './graphql-env.d.ts'
import { graphInt, protocolFinancialsWire } from './types.ts'
import type { MessariObservationSession } from './observation-session.ts'

import { Source } from '$/sources/Source.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import bindings from '$/sources/TheGraph/bindings.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'

/**
 * Narrow, deployment-pinned first capability profile. This is source wire
 * applicability only; native protocol/entity ownership remains elsewhere.
 */
export const messariGraphqlProfiles = {
	'uniswap-v3-arbitrum': {
		protocolKey: 'uniswap-v3',
		caip2: { namespace: 'eip155', reference: '42161' },
		expectedManifestSchemaVersion: '4.0.1',
		subgraphId: 'FQ6JYszEKApsBpAmiHesRsd9Ygc6mzmpNRANeVQFYoVX',
		deployment: 'QmXMJ2Hnhhoz6bGFNtTBjnf7kAk9CNCQG7r4R5b7fyVjD7',
		schemaVersion: '4.0.1',
		subgraphVersion: '1.5.3',
		methodologyVersion: '1.0.0',
		protocolId: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
		network: 'ARBITRUM_ONE',
	},
	'sushiswap-v3-arbitrum': {
		protocolKey: 'sushiswap-v3',
		caip2: { namespace: 'eip155', reference: '42161' },
		expectedManifestSchemaVersion: '4.0.1',
		subgraphId: '3oHCddbQGTi42kPZBwyGzD2JzZR33zK2MwXtxAerNJy2',
		deployment: 'QmYiokPYizrLNEpQrNgU7LnKeMKpx6zsViJ9ve8RxgDyPM',
		schemaVersion: '4.0.0',
		subgraphVersion: '1.1.3',
		methodologyVersion: '1.0.0',
		protocolId: '0x1af415a1eba07a4986a52b6f2e7de7003d82231e',
		network: 'ARBITRUM_ONE',
	},
} as const

export type MessariGraphqlDeployment = keyof typeof messariGraphqlProfiles

const isDeployment = (key: string): key is MessariGraphqlDeployment =>
	Object.hasOwn(messariGraphqlProfiles, key)

const protocolNetworkKey = (protocolKey: string, caip2: { namespace: string; reference: string }) =>
	JSON.stringify([caip2.namespace, caip2.reference, protocolKey])

const profilesByProtocolNetwork = new Map(
	Object.keys(messariGraphqlProfiles).filter(isDeployment).map(deployment => {
		const profile = messariGraphqlProfiles[deployment]
		return [protocolNetworkKey(profile.protocolKey, profile.caip2), { deployment, profile }] as const
	})
)

/** Consume the native Network.Caip2 selector's caip2 value, not a provider entity. */
export const getMessariAmmProfile = ({ protocolKey, caip2 }: {
	protocolKey: string
	caip2: { namespace: string; reference: string }
}) => {
	const selected = profilesByProtocolNetwork.get(protocolNetworkKey(protocolKey, caip2))
	if (!selected)
		throw new Error('Messari AMM profile does not support this protocol/network')
	return selected
}

const graphqlBindingsByTarget = new Map<string, SourceBinding>(
	bindings[Source.TheGraph_Graphql].map(binding => [binding.target.key, binding])
)

/** Canonical bindings are indexed once, never scanned in the resolver hot path. */
export const getMessariGraphqlBinding = (deployment: MessariGraphqlDeployment): SourceBinding => {
	const profile = messariGraphqlProfiles[deployment]
	const binding = graphqlBindingsByTarget.get(`messari-subgraph:${profile.subgraphId}`)
	if (!binding)
		throw new Error(`Messari canonical GraphQL binding is not enrolled: ${deployment}`)
	profileForBinding(binding, deployment)
	return binding
}

const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: { Bytes: string; BigDecimal: string; BigInt: string; Int8: string }
}>()

const latestDocument = graphql(`
	query MessariAmmFinancialsLatest($protocolId: Bytes!) {
		_meta {
			deployment
			hasIndexingErrors
			block { number hash timestamp }
		}
		dexAmmProtocols(
			where: { id: $protocolId }
			first: 2
			orderBy: id
			orderDirection: asc
		) {
			id name network schemaVersion subgraphVersion methodologyVersion
			totalValueLockedUSD cumulativeVolumeUSD
			cumulativeSupplySideRevenueUSD cumulativeProtocolSideRevenueUSD
			cumulativeTotalRevenueUSD totalPoolCount
		}
	}
`)

const exactDocument = graphql(`
	query MessariAmmFinancialsAtBlockHash($protocolId: Bytes!, $block: Block_height!) {
		_meta(block: $block) {
			deployment
			hasIndexingErrors
			block { number hash timestamp }
		}
		dexAmmProtocols(
			where: { id: $protocolId }
			first: 2
			orderBy: id
			orderDirection: asc
			block: $block
		) {
			id name network schemaVersion subgraphVersion methodologyVersion
			totalValueLockedUSD cumulativeVolumeUSD
			cumulativeSupplySideRevenueUSD cumulativeProtocolSideRevenueUSD
			cumulativeTotalRevenueUSD totalPoolCount
		}
	}
`)

const profileForBinding = (
	binding: SourceBinding,
	deployment: MessariGraphqlDeployment
) => {
	const profile = messariGraphqlProfiles[deployment]
	if (binding.source !== Source.TheGraph_Graphql
		|| binding.target.kind !== SourceTargetKind.Global
		|| binding.target.key !== `messari-subgraph:${profile.subgraphId}`
		|| binding.wireProtocol !== WireProtocol.Graphql
		|| binding.apiFamily !== ApiFamily.GraphqlHttp
		|| binding.delivery !== SourceDelivery.HttpProxy
	) {
		throw new Error('Messari query binding does not identify the pinned subgraph route')
	}
	return profile
}

const parseFinancials = (
	input: unknown,
	profile: typeof messariGraphqlProfiles[MessariGraphqlDeployment]
) => {
	const data = protocolFinancialsWire.assert(input)
	if (data._meta.deployment !== profile.deployment)
		throw new Error('Messari response deployment identity mismatch')
	if (data._meta.hasIndexingErrors)
		throw new Error('Messari deployment reports indexing errors')
	if (data.dexAmmProtocols.length !== 1)
		throw new Error(`Messari response expected one pinned protocol row, received ${data.dexAmmProtocols.length}`)
	const [protocol] = data.dexAmmProtocols
	if (protocol.id.toLowerCase() !== profile.protocolId.toLowerCase())
		throw new Error('Messari response protocol identity mismatch')
	if (protocol.network !== profile.network
		|| protocol.schemaVersion !== profile.schemaVersion
		|| protocol.subgraphVersion !== profile.subgraphVersion
		|| protocol.methodologyVersion !== profile.methodologyVersion
	) {
		throw new Error('Messari response capability/version identity mismatch')
	}
	return {
		profile,
		deployment: data._meta.deployment,
		block: data._meta.block,
		protocol,
	}
}

export const getMessariAmmFinancialsLatest = async ({
	binding,
	deployment,
	signal,
	observationSession,
}: {
	binding: SourceBinding
	deployment: MessariGraphqlDeployment
	signal?: AbortSignal
	observationSession?: MessariObservationSession
}) => {
	const profile = profileForBinding(binding, deployment)
	const observe = observationSession?.openRead()
	const data = await queryTheGraph({
		binding,
		signal,
		document: latestDocument,
		variables: { protocolId: profile.protocolId },
	})
	const result = parseFinancials(data, profile)
	observe?.(financialObservation(result))
	return result
}

export const getMessariAmmFinancialsAtBlockHash = async ({
	binding,
	deployment,
	blockHash,
	blockNumber,
	signal,
	observationSession,
}: {
	binding: SourceBinding
	deployment: MessariGraphqlDeployment
	blockHash: string
	blockNumber?: number
	signal?: AbortSignal
	observationSession?: MessariObservationSession
}) => {
	if (!Hash32.allows(blockHash))
		throw new Error('Messari exact historical query requires a 32-byte block hash')
	if (blockNumber != null)
		graphInt.assert(blockNumber)
	const profile = profileForBinding(binding, deployment)
	const observe = observationSession?.openRead()
	const data = await queryTheGraph({
		binding,
		signal,
		document: exactDocument,
		variables: {
			protocolId: profile.protocolId,
			block: { hash: blockHash },
		},
	})
	const result = parseFinancials(data, profile)
	const hash = result.block.hash
	if (hash == null
		|| hash.toLowerCase() !== blockHash.toLowerCase()
	) {
		throw new Error('Messari exact historical response block hash mismatch or unavailable')
	}
	if (blockNumber != null && result.block.number !== blockNumber)
		throw new Error('Messari exact historical response block number mismatch')
	observe?.(financialObservation(result))
	return {
		...result,
		block: {
			...result.block,
			hash,
		},
	}
}

const financialObservation = (result: ReturnType<typeof parseFinancials>) => ({
	coordinate: {
		caip2: result.profile.caip2,
		entityKind: 'protocol',
		entityId: result.protocol.id,
		sourceRevision: `thegraph:${result.deployment}`,
		blockHash: result.block.hash,
	},
	measurement: { ...result.protocol, id: result.protocol.id.toLowerCase() },
	metadata: { blockNumber: result.block.number, timestamp: result.block.timestamp },
})
