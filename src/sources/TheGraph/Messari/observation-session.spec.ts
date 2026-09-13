import { readFile } from 'node:fs/promises'
import { beforeEach, expect, it, vi } from 'vitest'
import { createMessariObservationSession, type MessariObservation } from './observation-session.ts'
import { getMessariAmmFinancialsAtBlockHash, getMessariAmmFinancialsLatest, getMessariGraphqlBinding } from './direct.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))
vi.mock('$/lib/http.ts', async (original) => ({ ...await original(), corsFetch }))
beforeEach(() => corsFetch.mockReset())

const item = (): MessariObservation => ({
	coordinate: { caip2: { namespace: 'eip155', reference: '42161' }, entityKind: 'pool', entityId: '0xAb', sourceRevision: 'thegraph:revision', blockHash: '0x' + 'ab'.repeat(32) },
	measurement: { amount: '1000000000000000000000.001', slots: ['a', 'b'] },
	metadata: { timestamp: null, blockNumber: 1 },
})
it('refines unknown metadata, retains known values and rejects contradictory known facts atomically', () => {
	const session = createMessariObservationSession()
	const observe = session.openRead()
	observe(item())
	observe({ ...item(), metadata: { timestamp: 12 } })
	observe(item())
	expect(() => observe({ ...item(), metadata: { blockNumber: 2, timestamp: 13 } })).toThrow(/conflict/)
	observe({ ...item(), metadata: { timestamp: 12 } })
	expect(session.size).toBe(1)
	session.dispose()
})
it('normalizes hex keys, separates kind/network/revision/hash and preserves array order', () => {
	const session = createMessariObservationSession()
	const observe = session.openRead(), original = item()
	observe(original)
	observe({ ...original, coordinate: { ...original.coordinate, entityId: '0xab', blockHash: '0x' + 'AB'.repeat(32) } })
	expect(session.size).toBe(1)
	for (const coordinate of [
		{ ...original.coordinate, entityKind: 'protocol' },
		{ ...original.coordinate, sourceRevision: 'thegraph:other' },
		{ ...original.coordinate, caip2: { namespace: 'eip155', reference: '1' } },
		{ ...original.coordinate, blockHash: '0x' + 'cd'.repeat(32) },
	]) observe({ ...original, coordinate })
	expect(session.size).toBe(5)
	expect(() => observe({ ...original, measurement: { amount: '1000000000000000000000.001', slots: ['b', 'a'] } })).toThrow(/measurement conflict/)
	session.dispose()
})
it('has caller-local capacity, explicit reset/disposal and invalidates in-flight read generations', () => {
	const session = createMessariObservationSession({ capacity: 1 })
	const oldRead = session.openRead()
	oldRead(item())
	const another = { ...item(), coordinate: { ...item().coordinate, entityId: 'another' } }
	expect(() => oldRead(another)).toThrow(/capacity/)
	const independent = createMessariObservationSession({ capacity: 1 })
	independent.openRead()(another)
	session.reset()
	expect(session.size).toBe(0)
	expect(() => oldRead(item())).toThrow(/reset during read/)
	session.openRead()(another)
	const pending = session.openRead()
	session.dispose()
	expect(session.size).toBe(0)
	expect(() => pending(another)).toThrow(/disposed/)
	expect(() => session.openRead()).toThrow(/disposed/)
	expect(() => session.reset()).toThrow(/disposed/)
	independent.dispose()
})
it('tracks null payload absence but never asserts immutable identity for unknown hashes', () => {
	const session = createMessariObservationSession()
	const observe = session.openRead()
	observe({ ...item(), coordinate: { ...item().coordinate, blockHash: null } })
	expect(session.size).toBe(0)
	observe({ ...item(), measurement: null })
	expect(() => observe(item())).toThrow(/conflict/)
	session.dispose()
})
it('bounds invalid capacities and accepts equivalent object-key ordering', () => {
	for (const capacity of [0, -1, 1.5, Infinity]) expect(() => createMessariObservationSession({ capacity })).toThrow()
	const session = createMessariObservationSession()
	session.openRead()({ ...item(), measurement: { a: 1n, b: 2 } })
	session.openRead()({ ...item(), measurement: { b: 2, a: 1n } })
	session.dispose()
})
const setup = async () => {
	const capture = JSON.parse(await readFile(new URL('./fixtures/live-sushiswap-arbitrum-introspection.json.query.json', import.meta.url), 'utf8'))
	const payload = JSON.parse(capture.response.result.content.find((x: { type: string }) => x.type === 'text').text)
	const observationSession = createMessariObservationSession()
	const input = { deployment: 'sushiswap-v3-arbitrum' as const, binding: getMessariGraphqlBinding('sushiswap-v3-arbitrum'), blockHash: payload.data._meta.block.hash, observationSession }
	const reply = (body = payload) => corsFetch.mockImplementation(async () => new Response(JSON.stringify(body)))
	return { payload, input, reply, observationSession }
}
it('protocol adapter rejects exact financial and clock conflicts without poisoning the session', async () => {
	const s = await setup(); s.reply()
	await getMessariAmmFinancialsAtBlockHash(s.input)
	for (const kind of ['financial', 'clock']) {
		const changed = structuredClone(s.payload)
		if (kind === 'financial') changed.data.dexAmmProtocols[0].totalValueLockedUSD = '99999999'
		else changed.data._meta.block.timestamp += 1
		s.reply(changed)
		await expect(getMessariAmmFinancialsAtBlockHash(s.input)).rejects.toThrow(/conflict/)
	}
	s.reply()
	await getMessariAmmFinancialsAtBlockHash(s.input)
	s.observationSession.dispose()
})
it('shares latest/exact comparisons and accepts unknown-to-known clock refinement', async () => {
	const s = await setup()
	const unknown = structuredClone(s.payload); unknown.data._meta.block.timestamp = null
	s.reply(unknown)
	await getMessariAmmFinancialsLatest(s.input)
	s.reply()
	const exact = await getMessariAmmFinancialsAtBlockHash(s.input)
	expect(exact.profile.expectedManifestSchemaVersion).toBe('4.0.1')
	expect(exact.protocol.schemaVersion).toBe('4.0.0')
	const changed = structuredClone(s.payload); changed.data.dexAmmProtocols[0].totalPoolCount += 1
	s.reply(changed)
	await expect(getMessariAmmFinancialsLatest(s.input)).rejects.toThrow(/conflict/)
	s.observationSession.dispose()
})
it('does not record cancelled, reset-in-flight, unavailable-hash or mismatched-coordinate responses', async () => {
	const s = await setup()
	const controller = new AbortController(); controller.abort()
	await expect(getMessariAmmFinancialsAtBlockHash({ ...s.input, signal: controller.signal })).rejects.toThrow()
	expect(corsFetch).not.toHaveBeenCalled()
	let release: (value: Response) => void = () => { throw new Error('not started') }
	corsFetch.mockImplementation(() => new Promise<Response>(resolve => { release = resolve }))
	const pending = getMessariAmmFinancialsAtBlockHash(s.input)
	await vi.waitFor(() => expect(corsFetch).toHaveBeenCalledTimes(1))
	s.observationSession.reset()
	release(new Response(JSON.stringify(s.payload)))
	await expect(pending).rejects.toThrow(/reset during read/)
	const unknown = structuredClone(s.payload); unknown.data._meta.block.hash = null
	s.reply(unknown)
	await expect(getMessariAmmFinancialsAtBlockHash(s.input)).rejects.toThrow(/hash mismatch or unavailable/)
	await getMessariAmmFinancialsLatest(s.input)
	expect(s.observationSession.size).toBe(0)
	s.observationSession.dispose()
})
it('later retrieval wall clocks do not enter protocol measurements', async () => {
	const s = await setup(); s.reply()
	const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
	try {
		const first = await getMessariAmmFinancialsAtBlockHash(s.input)
		clock.mockReturnValue(5000)
		expect(await getMessariAmmFinancialsAtBlockHash(s.input)).toEqual(first)
	} finally { clock.mockRestore(); s.observationSession.dispose() }
})
