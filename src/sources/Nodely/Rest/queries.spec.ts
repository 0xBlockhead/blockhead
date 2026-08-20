import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/Nodely/Rest/queries.ts')
const nodelyBindings = bindings[Source.Nodely]

describe('Nodely REST operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('uses the documented browser-direct mainnet endpoints', () => {
		expect(nodelyBindings.map((binding) => ({
			target: binding.target,
			apiFamily: binding.apiFamily,
			endpoint: binding.endpoints[0],
			delivery: binding.delivery,
			credentials: binding.credentials,
		}))).toEqual([
			{
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				apiFamily: ApiFamily.AlgodRestApi,
				endpoint: {
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://mainnet-api.4160.nodely.dev',
					corsEnabled: true,
				},
				delivery: SourceDelivery.BrowserDirect,
				credentials: [],
			},
			{
				target: {
					kind: SourceTargetKind.NetworkSlug,
					key: 'algorand',
				},
				apiFamily: ApiFamily.AlgorandIndexerRestApi,
				endpoint: {
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://mainnet-idx.4160.nodely.dev',
					corsEnabled: true,
				},
				delivery: SourceDelivery.BrowserDirect,
				credentials: [],
			},
		])
	})

	it('uses the Algod binding for node status', async () => {
		getJson.mockResolvedValue({})

		await queries.getAlgodStatus()

		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/status'
		)
	})

	it('uses the Indexer binding for indexer health', async () => {
		getJson.mockResolvedValue({})

		await queries.getIndexerHealth()

		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgorandIndexerRestApi,
			}),
			'/health'
		)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAlgodStatus',
			'getIndexerHealth',
		])
	})
})
