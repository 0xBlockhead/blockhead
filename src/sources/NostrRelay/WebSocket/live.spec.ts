import { afterEach, expect, it, vi } from 'vitest'
import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { listRelayEvents, openRelaySubscription, openNostrRelaySubscription } from './queries.ts'

const { readRelay } = vi.hoisted(() => ({ readRelay: vi.fn() }))
vi.mock('./live.remote.ts', () => ({ readRelay }))
const binding = bindings[Source.NostrRelay_WebSocket][0]
afterEach(() => { readRelay.mockReset(); vi.unstubAllGlobals() })

it('default snapshot enrolls filters through same-origin delivery and closes on EOSE', async () => {
	const returned = vi.fn()
	readRelay.mockImplementation(async function* () {
		try {
			yield { type: 'message', payload: JSON.stringify(['EVENT', 'blockhead-snapshot', { id: 'a', created_at: 1 }]) }
			yield { type: 'message', payload: JSON.stringify(['EOSE', 'blockhead-snapshot']) }
		} finally { returned() }
	})
	const direct = vi.fn(function () { throw new Error('browser upstream socket forbidden') })
	Object.assign(direct, { OPEN: 1 })
	vi.stubGlobal('WebSocket', direct)
	expect(await listRelayEvents({ binding, filters: [{ kinds: [1], '#p': ['recipient'] }] })).toEqual([{ id: 'a', created_at: 1 }])
	await vi.waitFor(() => expect(returned).toHaveBeenCalled())
	expect(direct).not.toHaveBeenCalled()
	expect(readRelay).toHaveBeenCalledWith({ bindingId: sourceBindingId(binding), targetKey: binding.target.key, subscriptionId: 'blockhead-snapshot', filters: [{ kinds: [1], '#p': ['recipient'] }] })
})

it('delivery failure rejects snapshot instead of empty success', async () => {
	readRelay.mockImplementation(async function* () { throw new Error('upstream denied') })
	await expect(listRelayEvents({ binding, filters: [{}] })).rejects.toThrow('upstream denied')
})

it('cancellation returns pending delivery and ignores a stale event', async () => {
	let deliver: (value: IteratorResult<{ type: string; payload: string }>) => void = () => {}
	const returned = vi.fn(async () => ({ done: true as const, value: undefined }))
	readRelay.mockReturnValue({ [Symbol.asyncIterator]: () => ({
		next: () => new Promise<IteratorResult<{ type: string; payload: string }>>((resolve) => { deliver = resolve }),
		return: returned,
	}) })
	const onEvent = vi.fn()
	const subscription = openRelaySubscription({ binding, subscriptionId: 'live', filters: [{}], onEvent })
	await vi.waitFor(() => expect(readRelay).toHaveBeenCalledOnce())
	subscription.close()
	expect(returned).toHaveBeenCalled()
	deliver({ done: false, value: { type: 'message', payload: JSON.stringify(['EVENT', 'live', { id: 'late', created_at: 2 }]) } })
	await Promise.resolve()
	expect(onEvent).not.toHaveBeenCalled()
	expect(returned).toHaveBeenCalledOnce()
})

it('invalid filters fail the snapshot without starting a remote subscription', async () => {
	await expect(listRelayEvents({ binding, filters: [{ limit: -1 }] })).rejects.toThrow()
	expect(readRelay).not.toHaveBeenCalled()
})

it('pre-aborted subscriptions never enroll a remote read', async () => {
	const onEvent = vi.fn()
	openRelaySubscription({ binding, subscriptionId: 'cancelled', filters: [{}], signal: AbortSignal.abort(), onEvent })
	await Promise.resolve()
	expect(readRelay).not.toHaveBeenCalled()
	expect(onEvent).not.toHaveBeenCalled()
})

it('normalizes a known relay to its canonical binding rather than inventing an override', async () => {
	readRelay.mockImplementation(async function* () {
		yield { type: 'message', payload: JSON.stringify(['CLOSED', 'canonical', 'done']) }
	})
	openNostrRelaySubscription({ relayUrl: 'wss://nos.lol/', subscriptionId: 'canonical', filters: [{}], onEvent: vi.fn() })
	await vi.waitFor(() => expect(readRelay).toHaveBeenCalledWith(expect.objectContaining({ bindingId: sourceBindingId(binding), targetKey: binding.target.key })))
	expect(() => openNostrRelaySubscription({ relayUrl: 'wss://unknown.example', subscriptionId: 'unknown', filters: [{}], onEvent: vi.fn() })).toThrow('no enrolled RemoteLive read binding')
})
