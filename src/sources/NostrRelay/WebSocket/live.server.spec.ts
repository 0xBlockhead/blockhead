import { afterEach, expect, it, vi } from 'vitest'
import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { iterateNostrRead } from './live.server.ts'

vi.mock('$/sources/index.server.ts', async () => {
	const { default: bindings } = await import('$/sources/NostrRelay/bindings.ts')
	return { remoteLiveBindings: bindings.NostrRelay_WebSocket }
})
vi.mock('$/sources/$sourceServerCredentials.server.ts', () => ({ default: new Map() }))

const binding = bindings[Source.NostrRelay_WebSocket][0]
const request = {
	bindingId: sourceBindingId(binding),
	targetKey: binding.target.key,
	subscriptionId: 'read',
	filters: [{ kinds: [1], '#p': ['recipient'] }],
}
const sockets: Relay[] = []
class Relay extends EventTarget {
	sent: string[] = []
	closed = false
	binaryType = 'blob'
	constructor(readonly url: string) { super(); sockets.push(this) }
	send(message: string) { this.sent.push(message) }
	close() { this.closed = true }
}
afterEach(() => { sockets.length = 0; vi.unstubAllGlobals() })

it('binding-gated server owns REQ, data delivery and upstream cancellation', async () => {
	vi.stubGlobal('WebSocket', Relay)
	const controller = new AbortController()
	const frames = iterateNostrRead(request, controller.signal)
	const connected = frames.next()
	await vi.waitFor(() => expect(sockets).toHaveLength(1))
	expect(sockets[0].url).toBe('wss://nos.lol/')
	expect(sockets[0].sent).toEqual([])
	sockets[0].dispatchEvent(new Event('open'))
	expect((await connected).value?.type).toBe('connected')
	expect(sockets[0].sent).toEqual([JSON.stringify(['REQ', 'read', ...request.filters])])
	const payload = JSON.stringify(['EOSE', 'read'])
	sockets[0].dispatchEvent(new MessageEvent('message', { data: payload }))
	expect((await frames.next()).value).toMatchObject({ type: 'message', payload })
	const pending = frames.next()
	controller.abort()
	expect((await pending).done).toBe(true)
	expect(sockets[0].closed).toBe(true)
})

it.each([
	['unknown binding', { bindingId: 'unknown' }, 'no enabled RemoteLive binding'],
	['mismatched target', { targetKey: 'wss://127.0.0.1' }, 'does not match binding'],
	['unenrolled search', { filters: [{ search: 'term' }] }, 'does not match binding'],
])('rejects %s before upstream construction', async (_label, override, diagnostic) => {
	vi.stubGlobal('WebSocket', Relay)
	await expect(iterateNostrRead({ ...request, ...override }).next()).rejects.toThrow(diagnostic)
	expect(sockets).toHaveLength(0)
})

it('enrolls search only on a search-capable binding', async () => {
	vi.stubGlobal('WebSocket', Relay)
	const searchBinding = bindings[Source.NostrRelay_WebSocket][2]
	const frames = iterateNostrRead({ ...request, bindingId: sourceBindingId(searchBinding), targetKey: searchBinding.target.key, filters: [{ search: 'term' }] })
	const connected = frames.next()
	await vi.waitFor(() => expect(sockets).toHaveLength(1))
	sockets[0].dispatchEvent(new Event('open'))
	await connected
	expect(sockets[0].sent).toEqual([JSON.stringify(['REQ', 'read', { search: 'term' }])])
	await frames.return(undefined)
	expect(sockets[0].closed).toBe(true)
})

it('upstream failure rejects live delivery and closes the socket', async () => {
	vi.stubGlobal('WebSocket', Relay)
	const frames = iterateNostrRead(request)
	const connected = frames.next()
	await vi.waitFor(() => expect(sockets).toHaveLength(1))
	sockets[0].dispatchEvent(new Event('open'))
	await connected
	const pending = frames.next()
	const failure = new Event('error')
	sockets[0].dispatchEvent(failure)
	await expect(pending).rejects.toBe(failure)
	expect(sockets[0].closed).toBe(true)
})
