import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getBlock,
	getTx,
} = await import('$/sources/CometBft/Rest/queries.ts')

const binding = bindings[Source.CometBft_Rest]

describe('CometBFT REST queries', () => {
	it('uses the registered binding for block and transaction paths', async () => {
		getJson.mockResolvedValue({})

		await getBlock({
			binding,
			height: 7n,
		})
		await getTx({
			binding,
			txHash: '0xABCD',
		})

		expect(getJson.mock.calls).toEqual([
			[
				binding,
				'/block?height=7',
			],
			[
				binding,
				'/tx?hash=0xABCD',
			],
		])
	})
})
