import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Mcp/bindings.ts'
import {
	getRegistryServer,
	getRegistryServers,
	getRegistryServerVersions,
} from '$/sources/Mcp/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const binding = bindings[Source.McpPackageRegistry_Rest][0]

const server = {
	name: 'io.example/server',
	description: 'Example MCP server',
	version: '1.0.0',
}

describe('MCP registry REST queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('accepts a valid registry list envelope and query options', async () => {
		sourceGetJson.mockResolvedValueOnce({
			servers: [{ server }],
			metadata: {
				nextCursor: null,
				count: 1,
			},
		})

		await expect(getRegistryServers(binding, {
			limit: 10,
			search: 'example',
			updatedSince: '2026-08-01T00:00:00Z',
			includeDeleted: false,
		})).resolves.toEqual({
			servers: [{ server }],
			metadata: {
				nextCursor: null,
				count: 1,
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '?limit=10&search=example&updated_since=2026-08-01T00%3A00%3A00Z&include_deleted=false')
		)
	})

	it('rejects malformed list and detail envelopes instead of returning soft empties', async () => {
		sourceGetJson.mockResolvedValueOnce({
			servers: [{ server: { name: 'missing fields' } }],
		})
		await expect(getRegistryServers(binding)).rejects.toThrow(
			'McpPackageRegistry_Rest: invalid server list response envelope'
		)

		sourceGetJson.mockResolvedValueOnce({ name: 'missing fields' })
		await expect(getRegistryServer(binding, 'io.example/server')).rejects.toThrow(
			'McpPackageRegistry_Rest: invalid server detail response envelope'
		)
	})

	it('rejects empty selectors and invalid pagination before making a request', async () => {
		expect(() => getRegistryServerVersions(binding, '  ')).toThrow(
			'McpPackageRegistry_Rest: server name must not be empty'
		)
		expect(() => getRegistryServer(binding, 'io.example/server', '')).toThrow(
			'McpPackageRegistry_Rest: server version must not be empty'
		)
		expect(() => getRegistryServers(binding, { limit: 0 })).toThrow(
			'McpPackageRegistry_Rest: limit must be a positive safe integer'
		)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('uses the registry version-list and detail paths', async () => {
		sourceGetJson
			.mockResolvedValueOnce({ versions: ['1.0.0'] })
			.mockResolvedValueOnce(server)

		await expect(getRegistryServerVersions(binding, 'io.example/server', {
			cursor: 'next',
		})).resolves.toEqual({ versions: ['1.0.0'] })
		await getRegistryServer(binding, 'io.example/server', '1.0.0')

		expect(sourceGetJson).toHaveBeenNthCalledWith(
		1,
		binding,
			httpUrl(binding, '/io.example%2Fserver/versions?cursor=next')
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
		2,
		binding,
		httpUrl(binding, '/io.example%2Fserver/versions/1.0.0')
		)
	})
})
