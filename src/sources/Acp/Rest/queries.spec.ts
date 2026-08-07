import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Acp/bindings.ts'
import { fetchRegistry } from '$/sources/Acp/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const registryBinding = bindings[Source.AcpRegistry_Rest][0]

const registry = {
	version: '1.0.0',
	agents: [{
		id: 'acme-agent',
		name: 'Acme agent',
		version: '2.0.0',
		description: 'An ACP agent',
		repository: 'https://github.com/acme/agent',
		website: 'https://acme.example',
		authors: [
			'Acme',
		],
		license: 'MIT',
		icon: 'https://cdn.example/acme.svg',
		distribution: {
			npx: {
				package: '@acme/agent@2.0.0',
				args: [
					'--acp',
				],
			},
		},
	}],
} as const

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('AcpRegistry REST queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('binds the public registry over RemoteQuery HTTP', () => {
		expect(registryBinding.apiFamily).toBe(ApiFamily.RestJson)
		expect(registryBinding.delivery).toBe(SourceDelivery.RemoteQuery)
		expect(registryBinding.endpoints[0]?.locator).toBe('https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json')
		expect(registryBinding.endpoints[0]?.corsEnabled).toBe(false)
	})

	it('assert-closes a valid registry envelope', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse(registry))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchRegistry()).resolves.toEqual(registry)
		expect(fetchMock).toHaveBeenCalledWith(
			'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
			expect.anything()
		)
	})

	it('rejects envelopes missing agents', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			version: '1.0.0',
		})))

		await expect(fetchRegistry()).rejects.toThrow('invalid registry response envelope')
	})

	it('rejects agents with empty distribution targets', async () => {
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			version: '1.0.0',
			agents: [{
				id: 'broken',
				name: 'Broken',
				version: '1',
				description: '',
				distribution: {
					binary: {
						'darwin-aarch64': {
							archive: '',
							cmd: './broken',
						},
					},
				},
			}],
		})))

		await expect(fetchRegistry()).rejects.toThrow('invalid registry response envelope')
	})
})
