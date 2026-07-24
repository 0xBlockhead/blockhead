import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
}))

const { getBlockByNumber } = await import('$/sources/TronFullNode/Rest/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.TronFullNode_Rest
		&& candidate.target.kind === SourceTargetKind.LocalDevice
		&& candidate.target.key === 'tron-full-node'
	))

if (binding == null)
	throw new Error('TronFullNode_Rest spec missing canonical binding')

describe('TRON local FullNode transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			blockID: 'block',
		}), {
			status: 200,
		}))
	})

	it('uses the exact generated binding for endpoint and delivery authority', async () => {
		await getBlockByNumber({
			binding,
			height: 7n,
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'http://127.0.0.1:8090/wallet/getblockbynum',
			expect.objectContaining({
				method: 'POST',
			})
		)
	})
})
