import { parse } from 'graphql'
import { beforeEach, expect, it, vi } from 'vitest'
import bindings from '$/sources/TheGraph/bindings.ts'
import { queryTheGraph } from './client.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))
vi.mock('$/lib/http.ts', async (original) => ({ ...await original(), corsFetch }))

const request = {
	binding: bindings.TheGraph_Graphql[0],
	document: parse('query Identity { __typename }'),
}
const data = { __typename: 'Query' }
const response = () => new Response(JSON.stringify({ data }))

beforeEach(() => corsFetch.mockReset())

it('preserves GraphQL data and forwards the caller signal through source delivery', async () => {
	const controller = new AbortController()
	corsFetch.mockResolvedValue(response())
	await expect(queryTheGraph({ ...request, signal: controller.signal })).resolves.toEqual(data)
	expect(corsFetch.mock.calls[0][1].init.signal).toBe(controller.signal)
})

it('rejects an already-aborted request without starting source delivery', async () => {
	const reason = new Error('cancelled before dispatch')
	corsFetch.mockResolvedValue(response())
	await expect(queryTheGraph({ ...request, signal: AbortSignal.abort(reason) })).rejects.toBe(reason)
	expect(corsFetch).not.toHaveBeenCalled()
})

it('rejects stale fetch completion when the transport ignores cancellation', async () => {
	const controller = new AbortController()
	const reason = new Error('cancelled during fetch')
	corsFetch.mockImplementation(async () => {
		controller.abort(reason)
		return response()
	})
	await expect(queryTheGraph({ ...request, signal: controller.signal })).rejects.toBe(reason)
	expect(corsFetch).toHaveBeenCalledTimes(1)
})

it('rejects cancellation while an already-received response body is settling', async () => {
	const controller = new AbortController()
	const reason = new Error('cancelled during body')
	const stream = new TransformStream()
	const received = new Response(stream.readable)
	corsFetch.mockResolvedValue(received)
	const result = queryTheGraph({ ...request, signal: controller.signal })
	const rejected = expect(result).rejects.toBe(reason)
	await vi.waitFor(() => expect(received.bodyUsed).toBe(true))
	controller.abort(reason)
	const writer = stream.writable.getWriter()
	await writer.write(new TextEncoder().encode(JSON.stringify({ data })))
	await writer.close()
	await rejected
	expect(corsFetch).toHaveBeenCalledTimes(1)
})
