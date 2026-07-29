import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Blockscout/bindings.ts'
import { getBlockscoutJson } from '$/sources/Blockscout/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'

describe('Blockscout REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses the registered REST-v2 binding and its HTTP proxy identity', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ items: [] }), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		const binding = bindings[Source.Blockscout_Rest]
			.find((candidate) => candidate.target.key === '1')
		if (binding == null)
			throw new Error('Ethereum Blockscout REST-v2 proxy binding is not registered')

		await expect(getBlockscoutJson({
			binding,
			path: '/transactions/0x1234/logs',
		})).resolves.toEqual({ items: [] })

		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(fetchMock).toHaveBeenCalledOnce()
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(sourceBindingId(binding))}/0/${encodeURIComponent('https://eth.blockscout.com/api/v2/transactions/0x1234/logs')}`,
			expect.objectContaining({
				headers: {
					accept: 'application/json',
				},
				signal: expect.any(AbortSignal),
			})
		)
	})
})
