import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0].locator,
	sourceFetch,
}))

const { substrateJsonRpc } = await import('$/sources/Substrate/JsonRpc/client.ts')
const bittensorBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Bittensor_JsonRpc
		&& binding.target.kind === SourceTargetKind.NetworkSlug
		&& binding.target.key === 'bittensor'
	))

if (bittensorBindings.length !== 1)
	throw new Error('Substrate JSON-RPC spec missing canonical Bittensor binding')

const bittensorBinding = bittensorBindings[0]

describe('Substrate JSON-RPC binding transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('carries the selected binding through proxy-aware source transport', async () => {
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			result: '0x1234',
		})))

		await expect(substrateJsonRpc<string>({
			binding: bittensorBinding,
			label: 'Bittensor',
			method: 'chain_getFinalizedHead',
		})).resolves.toBe('0x1234')
		expect(sourceFetch).toHaveBeenCalledWith(
			bittensorBinding,
			'https://entrypoint-finney.opentensor.ai',
			expect.objectContaining({
				method: 'POST',
			})
		)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'chain_getFinalizedHead',
			params: [],
		})
	})
})
