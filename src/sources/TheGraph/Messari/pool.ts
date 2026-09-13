import { type } from 'arktype'
import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './graphql-env.d.ts'
import { getMessariGraphqlBinding, messariGraphqlProfiles, type MessariGraphqlDeployment } from './direct.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'
import type { MessariObservationSession } from './observation-session.ts'

// Index the pinned source profiles once; resolvers consume these applicability maps.
export const poolDeploymentsByNetwork = new Map<string, MessariGraphqlDeployment[]>()
export const poolDeploymentByRevision = new Map<string, MessariGraphqlDeployment>()
for (const deployment of Object.keys(messariGraphqlProfiles) as MessariGraphqlDeployment[]) {
 const profile = messariGraphqlProfiles[deployment]
 const network = `${profile.caip2.namespace}:${profile.caip2.reference}`
 const revision = `${network}/thegraph:${profile.deployment}`
 if (poolDeploymentByRevision.has(revision)) throw new Error('TheGraph_Graphql: ambiguous pool deployment revision')
 poolDeploymentByRevision.set(revision, deployment)
 poolDeploymentsByNetwork.set(network, [...(poolDeploymentsByNetwork.get(network) ?? []), deployment])
}

const graphql = initGraphQLTada<{ introspection: introspection; scalars: { Bytes: string; BigDecimal: string; BigInt: string; Int8: string } }>()
export const poolDocument = graphql(`
 query MessariPool($id: ID!, $block: Block_height) {
  _meta(block: $block) { deployment hasIndexingErrors block { number hash timestamp } }
  liquidityPool(id: $id, block: $block) {
   id name symbol isSingleSided createdTimestamp createdBlockNumber
   protocol { id network schemaVersion subgraphVersion methodologyVersion }
   inputTokens(first: 1000) { id }
   inputTokenBalances inputTokenBalancesUSD inputTokenWeights
   totalValueLockedUSD cumulativeVolumeUSD cumulativeSupplySideRevenueUSD
   cumulativeProtocolSideRevenueUSD cumulativeTotalRevenueUSD
  }
 }
`)

const uint = type('string').matching(/^(0|[1-9][0-9]*)$/)
const decimal = type('string').matching(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)
const protocolWire = type({ id: EvmAddress, network: 'string', schemaVersion: 'string', subgraphVersion: 'string', methodologyVersion: 'string' })
export const poolWire = type({
 _meta: { deployment: 'string', hasIndexingErrors: 'boolean', block: { number: 'number.integer >= 0', hash: 'string | null', timestamp: 'number.integer | null' } },
 liquidityPool: type({
  id: EvmAddress, name: 'string | null', symbol: 'string | null', isSingleSided: 'boolean',
  createdTimestamp: uint, createdBlockNumber: uint, protocol: protocolWire,
  inputTokens: type({ id: EvmAddress }).array(), inputTokenBalances: uint.array(), inputTokenBalancesUSD: decimal.array(), inputTokenWeights: decimal.array(),
  totalValueLockedUSD: decimal, cumulativeVolumeUSD: decimal, cumulativeSupplySideRevenueUSD: decimal, cumulativeProtocolSideRevenueUSD: decimal, cumulativeTotalRevenueUSD: decimal,
 }).or('null'),
})

/** Parsed once at the source boundary. Query time is not a measurement field. */
export function parsePool(input: unknown, deployment: MessariGraphqlDeployment, id: string, exactHash?: string) {
 const profile = messariGraphqlProfiles[deployment]
 const data = poolWire.assert(input)
 if (!Number.isSafeInteger(data._meta.block.number)) throw new Error('Pool block number exceeds safe Graph integer range')
 if (data._meta.hasIndexingErrors) throw new Error('Pool indexing failure')
 if (data._meta.deployment !== profile.deployment) throw new Error('Pool deployment revision mismatch')
 const hash = data._meta.block.hash
 if (exactHash && (hash == null || hash.toLowerCase() !== exactHash.toLowerCase())) throw new Error('Pool exact block hash unavailable/mismatch')
 if (hash != null) Hash32.assert(hash)
 if (data._meta.block.timestamp != null && (!Number.isSafeInteger(data._meta.block.timestamp) || !Number.isSafeInteger(data._meta.block.timestamp * 1000))) throw new Error('Pool upstream clock cannot be represented exactly')
 const pool = data.liquidityPool
 if (pool != null) {
  if (pool.id.toLowerCase() !== id.toLowerCase()) throw new Error('Pool identity mismatch')
  const protocol = pool.protocol
  if (protocol.id.toLowerCase() !== profile.protocolId || protocol.network !== profile.network || protocol.schemaVersion !== profile.schemaVersion || protocol.subgraphVersion !== profile.subgraphVersion || protocol.methodologyVersion !== profile.methodologyVersion) throw new Error('Pool protocol capability mismatch')
  const size = pool.inputTokens.length
  // A full 1000-row nested page could be truncated. Do not claim complete composition.
  if (size >= 1000 || size !== pool.inputTokenBalances.length || size !== pool.inputTokenBalancesUSD.length || size !== pool.inputTokenWeights.length) throw new Error('Pool composition incomplete or unaligned')
  if (BigInt(pool.createdBlockNumber) > BigInt(data._meta.block.number)) throw new Error('Pool creation block after observation')
  if (data._meta.block.timestamp != null && BigInt(pool.createdTimestamp) > BigInt(data._meta.block.timestamp)) throw new Error('Pool creation time after observation')
 }
 return { profile, requestedPoolId: id.toLowerCase(), block: data._meta.block, pool, sourceRevision: `thegraph:${data._meta.deployment}` }
}

/** Without an explicit caller-owned session this read makes no cross-read consistency guarantee. */
export async function getPool({ deployment, id, blockHash, signal, observationSession }: { deployment: MessariGraphqlDeployment; id: string; blockHash?: string; signal?: AbortSignal; observationSession?: MessariObservationSession }) {
 EvmAddress.assert(id)
 if (blockHash != null) Hash32.assert(blockHash)
 const observe = observationSession?.openRead()
 const data = await queryTheGraph({ binding: getMessariGraphqlBinding(deployment), document: poolDocument, variables: { id: id.toLowerCase(), ...(blockHash == null ? {} : { block: { hash: blockHash } }) }, signal })
 const result = parsePool(data, deployment, id, blockHash)
 observe?.({
  coordinate: { caip2: result.profile.caip2, entityKind: 'pool', entityId: result.requestedPoolId, sourceRevision: result.sourceRevision, blockHash: result.block.hash },
  measurement: result.pool == null ? null : {
   ...result.pool,
   id: result.pool.id.toLowerCase(),
   protocol: { ...result.pool.protocol, id: result.pool.protocol.id.toLowerCase() },
   inputTokens: result.pool.inputTokens.map(token => ({ id: token.id.toLowerCase() })),
  },
  metadata: { blockNumber: result.block.number, timestamp: result.block.timestamp },
 })
 return result
}
