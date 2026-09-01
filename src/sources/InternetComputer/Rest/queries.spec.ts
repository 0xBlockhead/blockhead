import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/InternetComputer/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({ getJson: vi.fn() }))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({ getJson }))

const { query } = await import('$/sources/InternetComputer/Rest/queries.ts')
const binding = bindings[Source.InternetComputer_Http][0]

describe('Internet Computer HTTP gateway transport', () => {
	it('queries the supplied boundary binding and preserves valid empty JSON', async () => {
		getJson.mockResolvedValue([])

		await expect(query(binding, '/api/v2/status')).resolves.toEqual([])
		expect(getJson).toHaveBeenCalledWith(binding, '/api/v2/status')
	})

	it('propagates transport failures', async () => {
		getJson.mockRejectedValue(new Error('boundary unavailable'))

		await expect(query(binding, '/api/v2/status')).rejects.toThrow('boundary unavailable')
	})
})
