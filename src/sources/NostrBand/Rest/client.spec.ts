import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/NostrBand/bindings.ts'
import { listTopProfiles } from '$/sources/NostrBand/Rest/queries.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

describe('NostrBand REST client delivery', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses its registered HTTP proxy binding in the browser', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			profiles: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		const binding = bindings[Source.NostrBand_Rest]

		await expect(listTopProfiles(20)).resolves.toEqual({ profiles: [] })

		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'api',
		})
		expect(binding.operationGroups).toContain(SourceOperationGroup.GenericRead)
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints).toHaveLength(1)
		expect(binding.endpoints[0].endpointKind).toBe(SourceEndpointKind.HttpUrl)
		expect(fetchMock).toHaveBeenCalledWith(
			`/api-proxy/${encodeURIComponent(binding.proxyId)}/0/${encodeURIComponent('https://api.nostr.band/v0/stats/profile/list?limit=20')}`,
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})
})
