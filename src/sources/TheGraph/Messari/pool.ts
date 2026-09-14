import { type } from 'arktype'
import { initGraphQLTada } from 'gql.tada'
import type { introspection } from './graphql-env.d.ts'
import { getMessariGraphqlBinding, messariGraphqlProfiles, type MessariGraphqlDeployment } from './direct.ts'
import { queryTheGraph } from '$/sources/TheGraph/Graphql/client.ts'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'
import { graphBytesId, messariLiquidityPoolFee } from './types.ts'
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
   fees(first: 1000) { id feePercentage feeType }
   inputTokenBalances inputTokenBalancesUSD inputTokenWeights
   totalValueLockedUSD totalLiquidityUSD activeLiquidityUSD
   uncollectedProtocolSideValuesUSD uncollectedSupplySideValuesUSD
   cumulativeVolumeUSD cumulativeSupplySideRevenueUSD
   cumulativeProtocolSideRevenueUSD cumulativeTotalRevenueUSD
   stakedOutputTokenAmount rewardTokenEmissionsAmount rewardTokenEmissionsUSD
   cumulativeDepositCount cumulativeWithdrawCount cumulativeSwapCount
   positionCount openPositionCount closedPositionCount
   lastSnapshotDayID lastSnapshotHourID lastUpdateTimestamp lastUpdateBlockNumber
  }
 }
`)

const uint = type('string').matching(/^(0|[1-9][0-9]*)$/)
const decimal = type('string').matching(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)
const protocolWire = type({ id: EvmAddress, network: 'string', schemaVersion: 'string', subgraphVersion: 'string', methodologyVersion: 'string' })
export const poolWire = type({
 _meta: { deployment: 'string', hasIndexingErrors: 'boolean', block: { number: 'number.integer >= 0', hash: 'string | null', timestamp: 'number.integer | null' } },
 liquidityPool: type({
  id: graphBytesId, name: 'string | null', symbol: 'string | null', isSingleSided: 'boolean',
  createdTimestamp: uint, createdBlockNumber: uint, protocol: protocolWire,
  inputTokens: type({ id: EvmAddress }).array(), inputTokenBalances: uint.array(), inputTokenBalancesUSD: decimal.array(), inputTokenWeights: decimal.array(),
  fees: messariLiquidityPoolFee.array(),
  totalValueLockedUSD: decimal, totalLiquidityUSD: decimal, activeLiquidityUSD: decimal,
  uncollectedProtocolSideValuesUSD: decimal.array(), uncollectedSupplySideValuesUSD: decimal.array(),
  cumulativeVolumeUSD: decimal, cumulativeSupplySideRevenueUSD: decimal, cumulativeProtocolSideRevenueUSD: decimal, cumulativeTotalRevenueUSD: decimal,
  stakedOutputTokenAmount: uint.or('null'), rewardTokenEmissionsAmount: uint.array().or('null'), rewardTokenEmissionsUSD: decimal.array().or('null'),
  cumulativeDepositCount: 'number.integer >= 0', cumulativeWithdrawCount: 'number.integer >= 0', cumulativeSwapCount: 'number.integer >= 0',
  positionCount: 'number.integer >= 0', openPositionCount: 'number.integer >= 0', closedPositionCount: 'number.integer >= 0',
  lastSnapshotDayID: 'number.integer >= 0', lastSnapshotHourID: 'number.integer >= 0', lastUpdateTimestamp: uint, lastUpdateBlockNumber: uint,
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
  if (pool.id !== id) throw new Error('Pool identity mismatch')
  const protocol = pool.protocol
  if (protocol.id.toLowerCase() !== profile.protocolId || protocol.network !== profile.network || protocol.schemaVersion !== profile.schemaVersion || protocol.subgraphVersion !== profile.subgraphVersion || protocol.methodologyVersion !== profile.methodologyVersion) throw new Error('Pool protocol capability mismatch')
  const size = pool.inputTokens.length
  // A full 1000-row nested page could be truncated. Do not claim complete composition.
  if (size >= 1000 || size !== pool.inputTokenBalances.length || size !== pool.inputTokenBalancesUSD.length || size !== pool.inputTokenWeights.length) throw new Error('Pool composition incomplete or unaligned')
  if (pool.uncollectedProtocolSideValuesUSD.length !== size || pool.uncollectedSupplySideValuesUSD.length !== size) throw new Error('Pool uncollected values incomplete or unaligned')
  if (BigInt(pool.createdBlockNumber) > BigInt(data._meta.block.number)) throw new Error('Pool creation block after observation')
  if (data._meta.block.timestamp != null && BigInt(pool.createdTimestamp) > BigInt(data._meta.block.timestamp)) throw new Error('Pool creation time after observation')
  const seenFeeTypes = new Set<string>()
  if (pool.fees.length >= 1000) throw new Error('Pool fee relationship page is truncated')
  for (const fee of pool.fees) {
   if (seenFeeTypes.has(fee.feeType)) throw new Error('Pool fee type is duplicated')
   seenFeeTypes.add(fee.feeType)
   const expectedId = `${fee.feeType}-${pool.id}`
   if (fee.id !== expectedId) throw new Error('Pool fee identity mismatch')
   const dynamic = fee.feeType.startsWith('DYNAMIC_') || fee.feeType === 'TIERED_TRADING_FEE'
   if (dynamic) {
    if (fee.feePercentage != null && fee.feePercentage !== '0') throw new Error('Dynamic or tiered pool fee must use the zero sentinel')
   }
  }
 }
 return { profile, requestedPoolId: id.toLowerCase(), block: data._meta.block, pool, sourceRevision: `thegraph:${data._meta.deployment}` }
}

/** Without an explicit caller-owned session this read makes no cross-read consistency guarantee. */
export async function getPool({ deployment, id, blockHash, signal, observationSession }: { deployment: MessariGraphqlDeployment; id: string; blockHash?: string; signal?: AbortSignal; observationSession?: MessariObservationSession }) {
 graphBytesId.assert(id)
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
