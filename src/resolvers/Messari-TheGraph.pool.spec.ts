// Native closure gate: run only against actual generated output composed with the two G2 mappings.
// No mock EntityType/schema or test-only route declarations are allowed.
import { expect, it, vi } from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'
import { schema, schemaMeta, entityDefinitionByType } from '$/schema/index.ts'
import { EntityMetaKey, entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { materializeResolverOutput, ResolverOutputMaterialization } from '$/collections/assertLoadedCollectionRows.ts'
import { Source } from '$/sources/Source.ts'
import { messariGraphqlProfiles } from '$/sources/TheGraph/Messari/direct.ts'
const { getPool } = vi.hoisted(()=>({getPool:vi.fn()}))
vi.mock('$/sources/TheGraph/Messari/pool.ts', async importOriginal => ({ ...await importOriginal<object>(), getPool }))
import messariResolvers from './Messari-TheGraph.ts'
const [, , poolResolver, poolObservationResolver, poolAssetResolver] = messariResolvers.resolvers
const poolResolvers = [poolResolver, poolObservationResolver, poolAssetResolver] as const
const $network = { caip2: { namespace:'eip155',reference:'42161' } } as const
const $pool = { $network,id:`0x${'ab'.repeat(20)}` as const }
const $block = { $network,hash:`0x${'12'.repeat(32)}` as const }
const profile = messariGraphqlProfiles['uniswap-v3-arbitrum']
const exact = { $pool,$block,sourceRevision:`thegraph:${profile.deployment}` } as const
const response = {
 profile,requestedPoolId:$pool.id,block:{number:123,hash:$block.hash,timestamp:null},sourceRevision:exact.sourceRevision,
 pool:{id:$pool.id,name:null,symbol:'fixture',isSingleSided:false,createdTimestamp:'1',createdBlockNumber:'1',
 protocol:{id:profile.protocolId,network:profile.network,schemaVersion:profile.schemaVersion,subgraphVersion:profile.subgraphVersion,methodologyVersion:profile.methodologyVersion},
 inputTokens:[{id:`0x${'ef'.repeat(20)}` as const},{id:`0x${'cd'.repeat(20)}` as const}],inputTokenBalances:['90071992547409931234','0'],inputTokenBalancesUSD:['1.000000000000000001','0'],inputTokenWeights:['50.25','49.75'],
 totalValueLockedUSD:'1.000000000000000001',cumulativeVolumeUSD:'2',cumulativeSupplySideRevenueUSD:'3',cumulativeProtocolSideRevenueUSD:'4',cumulativeTotalRevenueUSD:'7'},
}
it('requires actual generated pool owners, materializes exact scalar and ordered child rows, and reloads each child exactly',async()=>{
 expect(EntityType.LiquidityPool_Amm_EvmBlock).toBe('LiquidityPool_Amm_EvmBlock')
 expect(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset).toBe('LiquidityPool_Amm_EvmBlock_InputAsset')
 const [,observation,asset] = poolResolvers
 getPool.mockResolvedValue(response)
 const result = await observation.resolve.PoolBlockRevision.resolve(exact)
 expect(observation.projections.totalValueLockedUSD(result)).toBe('1.000000000000000001')
 const refs = observation.projections.$$inputAssets(result)
 const definition = entityDefinitionByType[EntityType.LiquidityPool_Amm_EvmBlock]
 const fieldDefinition = definition.fields.find(f=>f.name==='$$inputAssets')!
 const rows = materializeResolverOutput({kind:ResolverOutputMaterialization.Field,schema,schemaIndex:schemaMeta,entityDefinition:definition,parentSelector:exact,parentSelectorKey:entitySelectorKey(schema,definition,exact),source:Source.TheGraph_Graphql,fieldDefinition,value:refs})
 expect(rows.length).toBeGreaterThan(0)
 expect(refs[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset,[],'rawBalance')]).toBe(90071992547409931234n)
 const child = await asset.resolve.ObservationOrdinal.resolve(refs[0][EntityMetaKey.Selector])
 expect(asset.projections.rawBalance(child)).toBe(90071992547409931234n)
 expect(getPool.mock.calls.at(-1)?.[0].blockHash).toBe($block.hash)
 await expect(asset.resolve.ObservationOrdinal.resolve({$observation:exact,ordinal:2})).rejects.toThrow(/ordinal/)
})
it('rejects height-only forks, network conflicts and unavailable revisions before source calls',async()=>{
 getPool.mockClear()
 for(const invalid of [
  {...exact,$block:{$network,blockNumber:123n}},
  {...exact,$block:{...$block,$network:{caip2:{namespace:'eip155',reference:'1'}}}},
  {...exact,sourceRevision:'thegraph:foreign'},
 ] as const) await expect(poolResolvers[1].resolve.PoolBlockRevision.resolve(invalid)).rejects.toThrow()
 expect(getPool).not.toHaveBeenCalled()
})
it('does not emit immutable history for unknown hash and does not map source participant roles to transaction fields',()=>{
 expect(()=>poolResolvers[0].projections.$$ammObservations({...response,$pool,block:{...response.block,hash:null}})).toThrow(/null block hash/)
})
