import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/HyperliquidDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getText } = vi.hoisted(() => ({ getText: vi.fn() }))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({ getText }))

const { getPageText } = await import('$/sources/HyperliquidDocs/RawHttp/queries.ts')
const binding = bindings[Source.HyperliquidDocs_Rest][0]

describe('Hyperliquid documentation transport', () => {
	it('reads the exact page path and propagates the raw text result', async () => {
		getText.mockResolvedValue('')

		await expect(getPageText(binding, '/docs/trading')).resolves.toBe('')
		expect(getText).toHaveBeenCalledWith(binding, '/docs/trading')
	})

	it('propagates transport failures', async () => {
		getText.mockRejectedValue(new Error('documentation unavailable'))

		await expect(getPageText(binding, '/docs/trading')).rejects.toThrow('documentation unavailable')
	})
})
