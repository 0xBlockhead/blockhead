import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/RadicleNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({ getJson: vi.fn() }))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({ getJson }))

const { query } = await import('$/sources/RadicleNode/Rest/queries.ts')
const binding = bindings[Source.RadicleNode_Control].find(
	({ target }) => target.key === 'radicle-node'
)

if (binding == null)
	throw new Error('Radicle node control binding is missing')

describe('Radicle node control transport', () => {
	it('uses the Radicle node target for the exact control path', async () => {
		getJson.mockResolvedValue([])

		await expect(query('/api/v1/repos')).resolves.toEqual([])
		expect(getJson).toHaveBeenCalledWith(binding, '/api/v1/repos')
	})

	it('propagates transport failures', async () => {
		getJson.mockRejectedValue(new Error('Radicle node unavailable'))

		await expect(query('/api/v1/repos')).rejects.toThrow('Radicle node unavailable')
	})
})
