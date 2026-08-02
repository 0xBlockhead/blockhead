import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Octez/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/Octez/Rest/queries.ts')

const binding = bindings[Source.OctezNode][0]
const blockHash = `B${'1'.repeat(50)}`

describe('Octez mainnet shell RPC operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('registers the official browser-readable Octez mainnet shell endpoint', () => {
		expect(binding).toMatchObject({
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'tezos:NetXdQprcVkpaWU',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://tezos-mainnet.octez.io',
				corsEnabled: true,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.TezosNodeRpc,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [],
			artifacts: [
				{
					kind: SourceArtifactKind.GenerationManifest,
					path: 'src/sources/Octez/OpenApi/schema-source.ts',
				},
				{
					kind: SourceArtifactKind.OpenApiSpec,
					path: 'src/sources/Octez/OpenApi/openapi.json',
					generated: true,
				},
				{
					kind: SourceArtifactKind.OpenApiTypes,
					path: 'src/sources/Octez/OpenApi/openapi.d.ts',
					generated: true,
				},
			],
		})
	})

	it('pins the configured node to the Tezos mainnet chain', async () => {
		getJson.mockResolvedValueOnce('NetXdQprcVkpaWU')

		await expect(queries.getChainId()).resolves.toBe('NetXdQprcVkpaWU')
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/chains/main/chain_id'
		)

		getJson.mockResolvedValueOnce('NetXnHfVqm9iesp')
		await expect(queries.getChainId()).rejects.toThrow('foreign chain')
	})

	it('reads the single current head hash from the shell block listing', async () => {
		getJson.mockResolvedValueOnce([[blockHash]])

		await expect(queries.getHeadHash()).resolves.toBe(blockHash)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/chains/main/blocks?length=1'
		)
	})

	it.each([
		{ response: [] },
		{ response: [[]] },
		{ response: [[blockHash, blockHash]] },
		{ response: [['not-a-block-hash']] },
	])('rejects malformed head block response %#', async ({ response }) => {
		getJson.mockResolvedValueOnce(response)

		await expect(queries.getHeadHash()).rejects.toThrow()
	})

	it('preserves the documented bootstrap state enum', async () => {
		getJson.mockResolvedValueOnce({
			bootstrapped: true,
			sync_state: 'synced',
		})

		await expect(queries.getBootstrapState()).resolves.toEqual({
			bootstrapped: true,
			sync_state: 'synced',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/chains/main/is_bootstrapped'
		)

		getJson.mockResolvedValueOnce({
			bootstrapped: false,
			sync_state: 'unknown',
		})
		await expect(queries.getBootstrapState()).rejects.toThrow()
	})

	it('exports only named shell RPC operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getBootstrapState',
			'getChainId',
			'getHeadHash',
		])
	})
})
