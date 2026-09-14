import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

const protocolResolver = defineResolver({
			entityType: EntityType.FinancialProtocol,
			resolve: {
				NetworkProtocolKey: {
					resolve: async ({ $network, protocolKey }, context) => {
						if ($network.caip2 == null)
							throw new Error('TheGraph_Graphql: Messari requires a canonical CAIP-2 network')

						const { getMessariAmmProfile, getMessariGraphqlBinding, getMessariAmmFinancialsLatest } = await import('$/sources/TheGraph/Messari/direct.ts')
						const { deployment } = getMessariAmmProfile({ protocolKey, caip2: $network.caip2 })
						const result = await getMessariAmmFinancialsLatest({
							deployment,
							binding: getMessariGraphqlBinding(deployment),
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							offset: context.pagination.offset ?? 0,
						})
						return { $network, protocolKey, result }
					},
				},
			},
		})({
			name: ({ result }) => result.protocol.name,
			$$liquidityPools: ({ $network, result }) => result.liquidityPools.map(({ id }) => ({
				[EntityMetaKey.Selector]: { $network, id: id.toLowerCase() },
			})),
			$$ammBlocks: ({ $network, protocolKey, result }) => {
				if (result.block.hash == null)
					throw new Error('TheGraph_Graphql: latest Messari observation has no immutable block hash')

				return [{
					[EntityMetaKey.Selector]: {
						$protocol: { $network, protocolKey },
						$block: { $network, hash: result.block.hash },
						sourceRevision: `thegraph:${result.deployment}`,
					},
				}]
			},
		})

const observationResolver = defineResolver({
			entityType: EntityType.FinancialProtocol_Amm_EvmBlock,
			resolve: {
				ProtocolBlockRevision: {
					resolve: async ({ $protocol, $block, sourceRevision }) => {
						if ($protocol.$network.caip2 == null || $block.$network.caip2 == null)
							throw new Error('TheGraph_Graphql: Messari requires canonical CAIP-2 networks')

						if ($protocol.$network.caip2.namespace !== $block.$network.caip2.namespace
							|| $protocol.$network.caip2.reference !== $block.$network.caip2.reference)
							throw new Error('TheGraph_Graphql: protocol and block networks differ')

						if ($block.hash == null)
							throw new Error('TheGraph_Graphql: exact Messari reload requires a block hash, not a height')

						const { getMessariAmmProfile, getMessariGraphqlBinding, getMessariAmmFinancialsAtBlockHash } = await import('$/sources/TheGraph/Messari/direct.ts')
						const { deployment, profile } = getMessariAmmProfile({ protocolKey: $protocol.protocolKey, caip2: $protocol.$network.caip2 })
						if (sourceRevision !== `thegraph:${profile.deployment}`)
							throw new Error('TheGraph_Graphql: exact Messari source revision is unavailable')

						const result = await getMessariAmmFinancialsAtBlockHash({ deployment, binding: getMessariGraphqlBinding(deployment), blockHash: $block.hash })
						return {
							...result.protocol,
							expectedManifestSchemaVersion: profile.expectedManifestSchemaVersion,
							$block: {
								[EntityMetaKey.Selector]: $block,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: BigInt(result.block.number),
									...(result.block.timestamp != null && {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: result.block.timestamp * 1000,
									}),
								},
							},
						}
					},
				},
			},
		})({
			$block: (snapshot) => snapshot.$block,
			sourceEntityId: (snapshot) => snapshot.id,
			expectedManifestSchemaVersion: (snapshot) => snapshot.expectedManifestSchemaVersion,
			reportedSchemaVersion: (snapshot) => snapshot.schemaVersion,
			implementationVersion: (snapshot) => snapshot.subgraphVersion,
			methodologyVersion: (snapshot) => snapshot.methodologyVersion,
			totalValueLockedUSD: (snapshot) => snapshot.totalValueLockedUSD,
			protocolControlledValueUSD: (snapshot) => snapshot.protocolControlledValueUSD,
			cumulativeVolumeUSD: (snapshot) => snapshot.cumulativeVolumeUSD,
			cumulativeSupplySideRevenueUSD: (snapshot) => snapshot.cumulativeSupplySideRevenueUSD,
			cumulativeProtocolSideRevenueUSD: (snapshot) => snapshot.cumulativeProtocolSideRevenueUSD,
			cumulativeTotalRevenueUSD: (snapshot) => snapshot.cumulativeTotalRevenueUSD,
			totalPoolCount: (snapshot) => BigInt(snapshot.totalPoolCount),
			cumulativeUniqueUsers: (snapshot) => BigInt(snapshot.cumulativeUniqueUsers),
		})

const milliseconds = (seconds: string) => {
 const value = BigInt(seconds) * 1000n
 if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Pool lifecycle clock cannot be represented exactly')
 return Number(value)
}

/** Append these resolvers to the parent's existing TheGraph_Graphql module on publication. */
const poolResolver = defineResolver({
  entityType: EntityType.LiquidityPool,
  resolve: { EvmNetworkId: { resolve: async ({ $network, id }) => {
   const caip2 = $network.caip2
   if (caip2 == null) throw new Error('Pool capability requires CAIP-2 network')
   const { getPool, poolDeploymentsByNetwork } = await import('$/sources/TheGraph/Messari/pool.ts')
   const candidates = poolDeploymentsByNetwork.get(`${caip2.namespace}:${caip2.reference}`) ?? []
   if (!candidates.length) throw new Error('Pool network unsupported')
   // Absence is not failure; failures are never ignored in order to pick another profile.
   const results = await Promise.all(candidates.map(deployment => getPool({ deployment, id })))
   const found = results.filter(result => result.pool != null)
   if (found.length !== 1) throw new Error(`Pool profile unavailable or ambiguous: ${found.length}`)
   return { ...found[0], $pool: { $network, id } }
  } } },
 })({
  $financialProtocol: result => ({ [EntityMetaKey.Selector]: { $network: result.$pool.$network, protocolKey: result.profile.protocolKey } }),
  name: result => result.pool!.name,
  symbol: result => result.pool!.symbol,
  isSingleSided: result => result.pool!.isSingleSided,
  createdTimestampMs: result => milliseconds(result.pool!.createdTimestamp),
  createdBlockNumber: result => BigInt(result.pool!.createdBlockNumber),
  $$ammObservations: result => {
   if (result.block.hash == null) throw new Error('Pool immutable observation unavailable: null block hash')
   const hash = Hash32.assert(result.block.hash.toLowerCase())
   return [{ [EntityMetaKey.Selector]: { $pool: result.$pool, $block: { $network: result.$pool.$network, hash }, sourceRevision: result.sourceRevision } }]
  },
  $$feeSchedules: result => result.pool!.fees.map(fee => ({
   [EntityMetaKey.Selector]: { $pool: result.$pool, feeType: fee.feeType },
  })),
 })

const feePercentage = (fee: { feeType: string; feePercentage: string | null }) => (
 fee.feeType.startsWith('DYNAMIC_') || fee.feeType === 'TIERED_TRADING_FEE' ? undefined : fee.feePercentage
)

const feeScheduleResolver = defineResolver({
 entityType: EntityType.LiquidityPoolFeeSchedule,
 resolve: { PoolFeeType: { resolve: async ({ $pool, feeType }) => {
  const caip2 = $pool.$network.caip2
  if (caip2 == null) throw new Error('Pool fee capability requires CAIP-2 network')
  const { getPool, poolDeploymentsByNetwork } = await import('$/sources/TheGraph/Messari/pool.ts')
  const candidates = poolDeploymentsByNetwork.get(`${caip2.namespace}:${caip2.reference}`) ?? []
  const results = await Promise.all(candidates.map(deployment => getPool({ deployment, id: $pool.id })))
  const found = results.filter(result => result.pool != null)
  if (found.length !== 1) throw new Error(`Pool fee profile unavailable or ambiguous: ${found.length}`)
  const fee = found[0].pool!.fees.find(candidate => candidate.feeType === feeType)
  if (fee == null) throw new Error('Pool fee type unavailable')
  return { ...found[0], $pool, fee }
 } } },
})({
 $pool: result => ({ [EntityMetaKey.Selector]: result.$pool }),
 feeType: result => result.fee.feeType,
 feePercentage: result => feePercentage(result.fee),
 $$observations: result => {
  if (result.block.hash == null) throw new Error('Pool fee immutable observation unavailable: null block hash')
  return [{ [EntityMetaKey.Selector]: {
   $feeSchedule: { $pool: result.$pool, feeType: result.fee.feeType },
   $block: { $network: result.$pool.$network, hash: Hash32.assert(result.block.hash.toLowerCase()) },
   sourceRevision: result.sourceRevision,
  } }]
 },
})

const feeObservationResolver = defineResolver({
 entityType: EntityType.LiquidityPoolFeeSchedule_EvmBlock,
 resolve: { ScheduleBlockRevision: { resolve: async ({ $feeSchedule, $block, sourceRevision }) => {
  const poolCaip2 = $feeSchedule.$pool.$network.caip2
  const blockCaip2 = $block.$network.caip2
  if (poolCaip2 == null || blockCaip2 == null || !('hash' in $block)) throw new Error('Pool fee exact reload requires network and block hash')
  if (poolCaip2.namespace !== blockCaip2.namespace || poolCaip2.reference !== blockCaip2.reference) throw new Error('Pool fee/block network conflict')
  const hash = Hash32.assert($block.hash)
  const { getPool, poolDeploymentByRevision } = await import('$/sources/TheGraph/Messari/pool.ts')
  const deployment = poolDeploymentByRevision.get(`${poolCaip2.namespace}:${poolCaip2.reference}/${sourceRevision}`)
  if (deployment == null) throw new Error('Pool fee source revision unavailable')
  const result = await getPool({ deployment, id: $feeSchedule.$pool.id, blockHash: hash })
  if (result.pool == null) throw new Error('Pool unavailable at exact fee coordinate')
  const fee = result.pool.fees.find(candidate => candidate.feeType === $feeSchedule.feeType)
  if (fee == null) throw new Error('Pool fee unavailable at exact coordinate')
  return { ...result, fee, selector: { $feeSchedule, $block: { $network: $block.$network, hash }, sourceRevision } }
 } } },
})({
 $feeSchedule: result => ({ [EntityMetaKey.Selector]: result.selector.$feeSchedule }),
 $block: result => ({ [EntityMetaKey.Selector]: result.selector.$block, [EntityMetaKey.Fields]: {
  [entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: BigInt(result.block.number),
  ...(result.block.timestamp == null ? {} : { [entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: result.block.timestamp * 1000 }),
 } }),
 sourceRevision: result => result.selector.sourceRevision,
 feePercentage: result => feePercentage(result.fee),
})
const poolObservationResolver = defineResolver({
  entityType: EntityType.LiquidityPool_Amm_EvmBlock,
  resolve: { PoolBlockRevision: { resolve: async ({ $pool, $block, sourceRevision }) => {
   const poolCaip2 = $pool.$network.caip2
   const blockCaip2 = $block.$network.caip2
   if (poolCaip2 == null || blockCaip2 == null || !('hash' in $block)) throw new Error('Pool exact reload requires network and block hash')
   if (poolCaip2.namespace !== blockCaip2.namespace || poolCaip2.reference !== blockCaip2.reference) throw new Error('Pool/block network conflict')
   const hash = Hash32.assert($block.hash)
   const { getPool, poolDeploymentByRevision } = await import('$/sources/TheGraph/Messari/pool.ts')
  const deployment = poolDeploymentByRevision.get(`${poolCaip2.namespace}:${poolCaip2.reference}/${sourceRevision}`)
   if (deployment == null) throw new Error('Pool source revision unavailable')
   const result = await getPool({ deployment, id: $pool.id, blockHash: hash })
   if (result.pool == null) throw new Error('Pool unavailable at exact coordinate')
   return { ...result, pool: result.pool, selector: { $pool, $block: { $network: $block.$network, hash }, sourceRevision } }
  } } },
 })({
  $block: result => ({ [EntityMetaKey.Selector]: result.selector.$block, [EntityMetaKey.Fields]: {
   [entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: BigInt(result.block.number),
   ...(result.block.timestamp == null ? {} : { [entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: result.block.timestamp * 1000 }),
  } }),
  totalValueLockedUSD: result => result.pool.totalValueLockedUSD,
  cumulativeVolumeUSD: result => result.pool.cumulativeVolumeUSD,
  cumulativeSupplySideRevenueUSD: result => result.pool.cumulativeSupplySideRevenueUSD,
  cumulativeProtocolSideRevenueUSD: result => result.pool.cumulativeProtocolSideRevenueUSD,
  cumulativeTotalRevenueUSD: result => result.pool.cumulativeTotalRevenueUSD,
  $$inputAssets: result => result.pool.inputTokens.map((token, ordinal) => ({
   [EntityMetaKey.Selector]: { $observation: result.selector, ordinal },
   [EntityMetaKey.Fields]: {
    [entityFieldAddressKey(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset, [], '$tokenContract')]: { [EntityMetaKey.Selector]: { $network: result.selector.$pool.$network, address: EvmAddress.assert(token.id.toLowerCase()) } },
    [entityFieldAddressKey(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset, [], 'rawBalance')]: BigInt(result.pool.inputTokenBalances[ordinal]),
    [entityFieldAddressKey(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset, [], 'balanceUSD')]: result.pool.inputTokenBalancesUSD[ordinal],
    [entityFieldAddressKey(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset, [], 'weightPercent')]: result.pool.inputTokenWeights[ordinal],
   },
  })),
 })

const assetResolver = defineResolver({
 entityType: EntityType.LiquidityPool_Amm_EvmBlock_InputAsset,
 resolve: { ObservationOrdinal: { resolve: async ({ $observation, ordinal }) => {
  const { $pool, $block, sourceRevision } = $observation
  const poolCaip2 = $pool.$network.caip2
  const blockCaip2 = $block.$network.caip2
  if (poolCaip2 == null || blockCaip2 == null || !('hash' in $block)) throw new Error('Pool exact reload requires network and block hash')
  if (poolCaip2.namespace !== blockCaip2.namespace || poolCaip2.reference !== blockCaip2.reference) throw new Error('Pool/block network conflict')
  const hash = Hash32.assert($block.hash)
  const { getPool, poolDeploymentByRevision } = await import('$/sources/TheGraph/Messari/pool.ts')
  const deployment = poolDeploymentByRevision.get(`${poolCaip2.namespace}:${poolCaip2.reference}/${sourceRevision}`)
  if (deployment == null) throw new Error('Pool source revision unavailable')
  const result = await getPool({ deployment, id: $pool.id, blockHash: hash })
  if (result.pool == null) throw new Error('Pool unavailable at exact coordinate')
  if (!Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal >= result.pool.inputTokens.length) throw new Error('Pool observation asset ordinal unavailable')
  return { ...result, pool: result.pool, selector: { $pool, $block: { $network: $block.$network, hash }, sourceRevision }, ordinal }
 } } },
})({
 $tokenContract: result => ({ [EntityMetaKey.Selector]: { $network: result.selector.$pool.$network, address: EvmAddress.assert(result.pool.inputTokens[result.ordinal].id.toLowerCase()) } }),
 rawBalance: result => BigInt(result.pool.inputTokenBalances[result.ordinal]),
 balanceUSD: result => result.pool.inputTokenBalancesUSD[result.ordinal],
 weightPercent: result => result.pool.inputTokenWeights[result.ordinal],
})

const blockResolver = defineResolver({
	entityType: EntityType.EvmBlock,
	resolve: {
		EvmNetworkBlockHash: {
			appliesTo: [{
				$network: { caip2: { namespace: 'eip155', reference: '42161' } },
			}],
			resolve: async ({ $network, hash }) => {
				if ($network.caip2 == null)
					throw new Error('TheGraph_Graphql: Messari block metadata requires a canonical CAIP-2 network')
				const {
					getMessariBlockDeployment,
					getMessariEvmBlockAtHash,
					getMessariGraphqlBinding,
				} = await import('$/sources/TheGraph/Messari/direct.ts')
				const deployment = getMessariBlockDeployment($network.caip2)
				const block = await getMessariEvmBlockAtHash({
					binding: getMessariGraphqlBinding(deployment),
					deployment,
					blockHash: hash,
				})
				return { ...block, hash: Hash32.assert(block.hash.toLowerCase()) }
			},
		},
	},
})({
	blockNumber: block => BigInt(block.number),
	hash: block => block.hash,
	timestamp: block => block.timestamp * 1000,
})

export default {
	source: Source.TheGraph_Graphql,
	resolvers: [protocolResolver, observationResolver, poolResolver, poolObservationResolver, assetResolver, feeScheduleResolver, feeObservationResolver, blockResolver] as const,
} satisfies RegisteredSourceResolverModule
