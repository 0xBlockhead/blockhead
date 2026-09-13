import { readFile } from 'node:fs/promises'
import { beforeEach, expect, it, vi } from 'vitest'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))
vi.mock('$/lib/http.ts', async (original) => ({ ...await original(), corsFetch }))
const { default: module } = await import('$/resolvers/Messari-TheGraph.ts')
const { messariGraphqlProfiles } = await import('$/sources/TheGraph/Messari/direct.ts')
const [protocolResolver, observationResolver] = module.resolvers
const blockResolver = module.resolvers[5]
const cases = [
	['uniswap-v3-arbitrum', 'live-uniswap-arbitrum-introspection.json.query.json'],
	['sushiswap-v3-arbitrum', 'live-sushiswap-arbitrum-introspection.json.query.json'],
] as const

beforeEach(() => vi.clearAllMocks())

it('limits the Graph block producer to its explicit indexed network', () => {
	expect(blockResolver.resolve.EvmNetworkBlockHash.appliesTo).toEqual([{
		$network: { caip2: { namespace: 'eip155', reference: '42161' } },
	}])
})

for (const [deployment, file] of cases) {
	const capture = JSON.parse(await readFile(new URL(`../sources/TheGraph/Messari/fixtures/${file}`, import.meta.url), 'utf8'))
	const payload = JSON.parse(capture.response.result.content.find((item: { type: string; text: string }) => item.type === 'text').text)
	const profile = messariGraphqlProfiles[deployment]
	const $network = { caip2: profile.caip2 }
	const $protocol = { $network, protocolKey: profile.protocolKey }
	const $block = { $network, hash: payload.data._meta.block.hash }
	const selector = { $protocol, $block, sourceRevision: `thegraph:${profile.deployment}` }
	const reply = (body = payload) => corsFetch.mockImplementation(async () => new Response(JSON.stringify(body), { status: 200 }))

	it(`${deployment}: native latest link reloads exact captured values through actual Graph transport`, async () => {
		reply()
		const latest = await protocolResolver.resolve.NetworkProtocolKey.resolve($protocol)
		expect(protocolResolver.projections.name(latest)).toBe(payload.data.dexAmmProtocols[0].name)
		const [reference] = protocolResolver.projections.$$ammBlocks(latest)
		expect(reference[EntityMetaKey.Selector]).toEqual(selector)
		const result = await observationResolver.resolve.ProtocolBlockRevision.resolve(reference[EntityMetaKey.Selector])
		const projections = observationResolver.projections
		for (const field of ['totalValueLockedUSD', 'cumulativeVolumeUSD', 'cumulativeSupplySideRevenueUSD', 'cumulativeProtocolSideRevenueUSD', 'cumulativeTotalRevenueUSD'] as const)
			expect(projections[field](result)).toBe(payload.data.dexAmmProtocols[0][field])
		expect(projections.totalPoolCount(result)).toBe(BigInt(payload.data.dexAmmProtocols[0].totalPoolCount))
		expect(projections.expectedManifestSchemaVersion(result)).toBe(profile.expectedManifestSchemaVersion)
		expect(projections.reportedSchemaVersion(result)).toBe(profile.schemaVersion)
		if (deployment === 'sushiswap-v3-arbitrum')
			expect(projections.expectedManifestSchemaVersion(result)).not.toBe(projections.reportedSchemaVersion(result))
		const blockFields = projections.$block(result)[EntityMetaKey.Fields]
		expect(blockFields[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]).toBe(BigInt(payload.data._meta.block.number))
		expect(blockFields[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]).toBe(payload.data._meta.block.timestamp * 1000)
		const call = corsFetch.mock.lastCall
		if (call == null)
			throw new Error('Exact reload did not reach source delivery')
		const body = JSON.parse(call[1].init.body)
		expect(body.variables.block).toEqual({ hash: $block.hash })
		expect(body.query).toContain('_meta(block: $block)')
	})

	it(`${deployment}: nested native block selection resolves height and time from the exact Graph coordinate`, async () => {
		const blockPayload = {
			data: {
				_meta: {
					...payload.data._meta,
					deployment: messariGraphqlProfiles['uniswap-v3-arbitrum'].deployment,
					block: { ...payload.data._meta.block },
				},
			},
		}
		reply(blockPayload)
		const result = await blockResolver.resolve.EvmNetworkBlockHash.resolve($block)
		expect(blockResolver.projections.hash(result)).toBe($block.hash)
		expect(blockResolver.projections.blockNumber(result)).toBe(BigInt(payload.data._meta.block.number))
		expect(blockResolver.projections.timestamp(result)).toBe(payload.data._meta.block.timestamp * 1000)
		const call = corsFetch.mock.lastCall
		if (call == null)
			throw new Error('Exact block resolution did not reach source delivery')
		const body = JSON.parse(call[1].init.body)
		expect(body.variables.block).toEqual({ hash: $block.hash })
		expect(body.query).toContain('_meta(block: $block)')
		expect(body.query).not.toContain('dexAmmProtocols')
	})

	it(`${deployment}: rejects non-exact selectors before transport`, async () => {
		for (const invalid of [
			{ ...selector, sourceRevision: 'thegraph:unavailable' },
			{ ...selector, $block: { $network, blockNumber: 1n } },
			{ ...selector, $block: { ...$block, $network: { caip2: { namespace: 'eip155', reference: '1' } } } },
		]) await expect(observationResolver.resolve.ProtocolBlockRevision.resolve(invalid)).rejects.toThrow()
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it(`${deployment}: exact failure never retries latest`, async () => {
		corsFetch.mockResolvedValue(new Response('unavailable', { status: 503 }))
		await expect(observationResolver.resolve.ProtocolBlockRevision.resolve(selector)).rejects.toThrow(/503/)
		expect(corsFetch).toHaveBeenCalledTimes(1)
	})

	it(`${deployment}: nested block hash mismatch fails instead of substituting latest`, async () => {
		const mismatch = {
			data: {
				_meta: {
					...payload.data._meta,
					deployment: messariGraphqlProfiles['uniswap-v3-arbitrum'].deployment,
					block: { ...payload.data._meta.block },
				},
			},
		}
		mismatch.data._meta.block.hash = '0x' + '00'.repeat(32)
		reply(mismatch)
		await expect(blockResolver.resolve.EvmNetworkBlockHash.resolve($block)).rejects.toThrow(/hash mismatch/)
		expect(corsFetch).toHaveBeenCalledTimes(1)
	})

	it(`${deployment}: unknown fork cannot become an observation link`, async () => {
		const unknown = structuredClone(payload)
		unknown.data._meta.block.hash = null
		reply(unknown)
		const latest = await protocolResolver.resolve.NetworkProtocolKey.resolve($protocol)
		expect(() => protocolResolver.projections.$$ammBlocks(latest)).toThrow(/immutable block hash/)
		await expect(observationResolver.resolve.ProtocolBlockRevision.resolve(selector)).rejects.toThrow(/hash mismatch or unavailable/)
	})
}
