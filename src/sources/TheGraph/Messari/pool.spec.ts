import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { buildClientSchema, parse, print, validate } from 'graphql'
import { expect, it, vi } from 'vitest'
const { queryTheGraph } = vi.hoisted(() => ({ queryTheGraph: vi.fn() }))
vi.mock('$/sources/TheGraph/Graphql/client.ts', () => ({ queryTheGraph }))
import { poolDocument, parsePool, getPool } from './pool.ts'
import { createMessariObservationSession } from './observation-session.ts'
import { poolDeploymentByRevision, poolDeploymentsByNetwork } from './pool.ts'
import { messariGraphqlProfiles } from './direct.ts'
const evidenceDir = fileURLToPath(new URL('./fixtures/', import.meta.url))
const captured = (which: 'uniswap' | 'sushiswap', query = false) => {
 const suffix = query ? '.json.query.json' : '.json.gz.base64'
 const encoded = readFileSync(`${evidenceDir}/live-${which}-arbitrum-introspection${suffix}`, 'utf8')
 return JSON.parse(query ? encoded : gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'))
}
const id = `0x${'ab'.repeat(20)}`
const tokenA = `0x${'cd'.repeat(20)}`, tokenB = `0x${'ef'.repeat(20)}`
const fixture = (which: 'uniswap' | 'sushiswap') => {
 const capture = captured(which, true)
 const data = JSON.parse(capture.response.result.content.find((c: {type:string})=>c.type==='text').text).data
 return { _meta: data._meta, liquidityPool: {
  id, name: null, symbol: 'fixture', isSingleSided: false, createdTimestamp: '1', createdBlockNumber: '1', protocol: data.dexAmmProtocols[0],
  inputTokens: [{id:tokenB},{id:tokenA}], inputTokenBalances: ['900719925474099312345','0'], inputTokenBalancesUSD: ['1.000000000000000001','0'], inputTokenWeights: ['50.25','49.75'],
  fees: [], totalValueLockedUSD: '1.000000000000000001', totalLiquidityUSD: '2.000000000000000002', activeLiquidityUSD: '1.500000000000000001', uncollectedProtocolSideValuesUSD: ['0.1', '0.2'], uncollectedSupplySideValuesUSD: ['0.3', '0.4'], cumulativeVolumeUSD: '9.123456789123456789', cumulativeSupplySideRevenueUSD:'1', cumulativeProtocolSideRevenueUSD:'2', cumulativeTotalRevenueUSD:'3', stakedOutputTokenAmount: null, rewardTokenEmissionsAmount: ['10', '20'], rewardTokenEmissionsUSD: ['0.5', '0.6'], cumulativeDepositCount: 7, cumulativeWithdrawCount: 8, cumulativeSwapCount: 9, positionCount: 10, openPositionCount: 4, closedPositionCount: 6, lastSnapshotDayID: 20000, lastSnapshotHourID: 480000, lastUpdateTimestamp: '1700000000', lastUpdateBlockNumber: '19000000',
 } }
}
it('indexes exact upstream deployment authority without inferring unsupported networks or aliasing revisions', () => {
 for (const [network, deployments] of poolDeploymentsByNetwork) {
  for (const deployment of deployments) {
   const profile = messariGraphqlProfiles[deployment]
   expect(network).toBe(`${profile.caip2.namespace}:${profile.caip2.reference}`)
   expect(poolDeploymentByRevision.get(`${network}/thegraph:${profile.deployment}`)).toBe(deployment)
  }
 }
 expect(poolDeploymentByRevision.size).toBe(Object.keys(messariGraphqlProfiles).length)
 expect(poolDeploymentsByNetwork.get('eip155:1')).toBeUndefined()
 expect(poolDeploymentByRevision.get('eip155:42161/thegraph:foreign')).toBeUndefined()
})
it.each(['uniswap','sushiswap'] as const)('%s: validates the actual pool query against captured executable introspection', which => {
 const capture = captured(which)
 const introspection = JSON.parse(capture.response.result.content.find((c:{type:string})=>c.type==='text').text).data
 expect(validate(buildClientSchema(introspection),parse(print(poolDocument)))).toEqual([])
})
it.each(['uniswap','sushiswap'] as const)('%s: source-faithful synthetic pool preserves exact decimals, source order and observed version', which => {
 const deployment = which === 'uniswap' ? 'uniswap-v3-arbitrum' : 'sushiswap-v3-arbitrum'
 const input = fixture(which), copy = structuredClone(input)
 const result = parsePool(input,deployment,id,input._meta.block.hash)
 expect(result.pool?.inputTokenBalances[0]).toBe('900719925474099312345')
 expect(result.pool?.inputTokens.map(t=>t.id)).toEqual([tokenB,tokenA])
 expect(result.pool?.name).toBeNull()
 expect(result.pool?.protocol.schemaVersion).toBe(which==='uniswap'?'4.0.1':'4.0.0')
 expect(input).toEqual(copy)
})
it('distinguishes unavailable pool from failures and never substitutes query time for null upstream clock', () => {
 const input = fixture('uniswap')
 expect(parsePool({...input,liquidityPool:null},'uniswap-v3-arbitrum',id).pool).toBeNull()
 expect(parsePool({...input,_meta:{...input._meta,block:{...input._meta.block,timestamp:null,hash:null}}},'uniswap-v3-arbitrum',id).block.timestamp).toBeNull()
 for (const bad of [
  {...input,_meta:{...input._meta,hasIndexingErrors:true}},
  {...input,_meta:{...input._meta,deployment:'foreign'}},
  {...input,liquidityPool:{...input.liquidityPool,id:tokenA}},
  {...input,liquidityPool:{...input.liquidityPool,inputTokenBalances:['1']}},
  {...input,liquidityPool:{...input.liquidityPool,createdBlockNumber:'999999999999999999999999'}},
  {...input,liquidityPool:{...input.liquidityPool,protocol:{...input.liquidityPool.protocol,methodologyVersion:'other'}}},
 ]) expect(()=>parsePool(bad,'uniswap-v3-arbitrum',id)).toThrow()
 expect(()=>parsePool({...input,_meta:{...input._meta,block:{...input._meta.block,hash:null}}},'uniswap-v3-arbitrum',id,input._meta.block.hash)).toThrow(/hash/)
})
it('exact network request uses one block on pool and meta; no latest retry on failure', async () => {
 const input = fixture('uniswap')
 queryTheGraph.mockResolvedValueOnce(input)
 await getPool({deployment:'uniswap-v3-arbitrum',id,blockHash:input._meta.block.hash})
 expect(queryTheGraph.mock.calls.at(-1)?.[0].variables).toEqual({id,block:{hash:input._meta.block.hash}})
 expect(print(poolDocument)).toContain('_meta(block: $block)')
 expect(print(poolDocument)).toContain('liquidityPool(id: $id, block: $block)')
 queryTheGraph.mockClear().mockRejectedValueOnce(new Error('HTTP 503'))
 await expect(getPool({deployment:'uniswap-v3-arbitrum',id,blockHash:input._meta.block.hash})).rejects.toThrow('HTTP 503')
 expect(queryTheGraph).toHaveBeenCalledTimes(1)
})
it('actual pool adapter rejects contradictions but permits unknown-to-known clock refinement', async () => {
 const observationSession = createMessariObservationSession()
 const input = fixture('uniswap')
 const read = () => getPool({deployment:'uniswap-v3-arbitrum',id,observationSession})
 try {
  queryTheGraph.mockResolvedValueOnce({...input,_meta:{...input._meta,block:{...input._meta.block,timestamp:null}}})
  await read()
  queryTheGraph.mockResolvedValueOnce(input)
  await read()
  queryTheGraph.mockResolvedValueOnce({...input,liquidityPool:{...input.liquidityPool,totalValueLockedUSD:'2'}})
  await expect(read()).rejects.toThrow(/measurement conflict/)
  queryTheGraph.mockResolvedValueOnce({...input,_meta:{...input._meta,block:{...input._meta.block,timestamp:input._meta.block.timestamp+1}}})
  await expect(read()).rejects.toThrow(/metadata conflict/)
  queryTheGraph.mockResolvedValueOnce(input)
  await read() // Failed contradiction did not overwrite accepted measurement/clock.
  queryTheGraph.mockResolvedValueOnce({...input,_meta:{...input._meta,block:{...input._meta.block,hash:`0x${'12'.repeat(32)}`}}})
  await read()
  expect(observationSession.size).toBe(2)
 } finally { observationSession.dispose() }
})
it('capacity affects only the explicit comparison window, never unrelated default pool reads', async () => {
 const observationSession = createMessariObservationSession({capacity:1})
 const input = fixture('uniswap')
 queryTheGraph.mockResolvedValue(input)
 await getPool({deployment:'uniswap-v3-arbitrum',id,observationSession})
 queryTheGraph.mockResolvedValue({...input,_meta:{...input._meta,block:{...input._meta.block,hash:`0x${'34'.repeat(32)}`}}})
 await expect(getPool({deployment:'uniswap-v3-arbitrum',id,observationSession})).rejects.toThrow(/capacity/)
 await getPool({deployment:'uniswap-v3-arbitrum',id})
 observationSession.reset()
 await getPool({deployment:'uniswap-v3-arbitrum',id,observationSession})
 observationSession.dispose()
 expect(observationSession.size).toBe(0)
})
it.each(['reset','dispose'] as const)('rejects a pending pool read after session %s', async action => {
 const observationSession = createMessariObservationSession()
 const input = fixture('uniswap')
 let deliver!: (value:typeof input)=>void
 queryTheGraph.mockImplementationOnce(()=>new Promise(resolve=>{deliver=resolve}))
 const pending = getPool({deployment:'uniswap-v3-arbitrum',id,observationSession})
 observationSession[action]()
 deliver(input)
 await expect(pending).rejects.toThrow(/session (reset|disposed)/)
 observationSession.dispose()
})
