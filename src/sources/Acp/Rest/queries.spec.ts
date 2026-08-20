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

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

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

	it('assert-closes a valid registry envelope', async () => {
		sourceGetJson.mockResolvedValueOnce(registry)

		await expect(fetchRegistry()).resolves.toEqual(registry)
		expect(sourceGetJson).toHaveBeenCalledWith(
			registryBinding,
			'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
		)
	})

	it.each([
		['missing agents', { version: '1.0.0' }],
		['empty distribution target', {
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
		}],
	])('rejects invalid registry envelopes: %s', async (_case, envelope) => {
		sourceGetJson.mockResolvedValueOnce(envelope)
		await expect(fetchRegistry()).rejects.toThrow('invalid registry response envelope')
	})
})
