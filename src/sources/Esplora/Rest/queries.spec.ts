import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Esplora/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getBlock,
} = await import('$/sources/Esplora/Rest/queries.ts')

const bitcoinBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Caip2Network
))
const liquidBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.NetworkSlug
))
if (bitcoinBinding == null || liquidBinding == null)
	throw new Error('Esplora spec requires Bitcoin and Liquid bindings')

describe('Esplora REST binding selection', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetJson.mockResolvedValue({})
	})

	it('selects the exact target binding and preserves its API prefix', async () => {
		await getBlock({
			blockHash: 'bitcoin-block',
			target: bitcoinBinding.target.key,
		})
		await getBlock({
			blockHash: 'liquid-block',
			target: liquidBinding.target.key,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://blockstream.info/api/block/bitcoin-block',
			],
			[
				liquidBinding,
				'https://blockstream.info/liquid/api/block/liquid-block',
			],
		])
	})
})
