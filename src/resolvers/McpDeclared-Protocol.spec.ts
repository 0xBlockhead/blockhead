import { afterEach, expect, it } from 'vitest'

import bindings from '$/sources/Mcp/bindings.ts'
import { configureMcpLocalRuntime } from '$/sources/Mcp/Protocol/runtime.ts'
import type { McpJsonRpcRequest, McpJsonRpcResponse, McpJsonRpcTransport } from '$/sources/Mcp/Protocol/types.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const context = {
	filters: [], sorts: [], pagination: {}, selectorKeys: [], parentSelectorKeys: [], sources: [], publicEnv: {},
	sourceBinding: bindings[Source.McpDeclared_Protocol][0],
}

const transportFor = (serverKey: string): McpJsonRpcTransport => ({
	request: async (request: McpJsonRpcRequest): Promise<McpJsonRpcResponse> => {
		const results: Record<string, unknown> = {
			initialize: { protocolVersion: '2025-06-18', capabilities: { tools: {}, prompts: {}, resources: {} }, serverInfo: { name: serverKey, version: '1.0.0' } },
			'tools/list': { tools: [{ name: 'sum', title: 'Sum', description: 'Adds values', inputSchema: { type: 'object' }, outputSchema: { type: 'number' }, annotations: { readOnlyHint: true } }] },
			'prompts/list': { prompts: [{ name: 'welcome', title: 'Welcome', description: 'Greets the user', arguments: { type: 'object' } }] },
			'resources/list': { resources: [{ uri: 'https://fake.test/readme', name: 'README', title: 'Read me', description: 'A document', mimeType: 'text/plain', annotations: { audience: ['user'] } }] },
			'resources/templates/list': { resourceTemplates: [{ uriTemplate: 'https://fake.test/{name}', name: 'named', title: 'Named', description: 'A named document', mimeType: 'text/plain', annotations: { audience: ['assistant'] } }] },
		}
		return { jsonrpc: '2.0', id: request.id, result: results[request.method] }
	},
})

const modulePromise = import('./McpDeclared-Protocol.ts')

afterEach(() => configureMcpLocalRuntime(undefined))

it('materializes server references and complete capability metadata through the resolver module', async () => {
	configureMcpLocalRuntime({ serverKey: 'alpha', transport: transportFor('alpha') })
	const module = await modulePromise
	const serverResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpServer)
	const toolResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpTool)
	const promptResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpPrompt)
	const resourceResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpResource)
	const templateResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpResourceTemplate)
	if (serverResolver == null || toolResolver == null || promptResolver == null || resourceResolver == null || templateResolver == null)
		throw new Error('McpDeclared_Protocol resolver contract is incomplete')

	const server = await serverResolver.resolve.ServerKey.resolve({ serverKey: 'alpha' }, context)
	expect(serverResolver.projections.$$tools(server)).toEqual([{ [EntityMetaKey.Selector]: { $server: { serverKey: 'alpha' }, name: 'sum' } }])
	expect(serverResolver.projections.$$prompts(server)).toEqual([{ [EntityMetaKey.Selector]: { $server: { serverKey: 'alpha' }, name: 'welcome' } }])
	expect(serverResolver.projections.$$resources(server)).toEqual([{ [EntityMetaKey.Selector]: { $server: { serverKey: 'alpha' }, uri: 'https://fake.test/readme' } }])
	expect(serverResolver.projections.$$resourceTemplates(server)).toEqual([{ [EntityMetaKey.Selector]: { $server: { serverKey: 'alpha' }, uriTemplate: 'https://fake.test/{name}' } }])
	const tool = await toolResolver.resolve.ServerName.resolve({ $server: { serverKey: 'alpha' }, name: 'sum' }, context)
	const prompt = await promptResolver.resolve.ServerName.resolve({ $server: { serverKey: 'alpha' }, name: 'welcome' }, context)
	const resource = await resourceResolver.resolve.ServerUri.resolve({ $server: { serverKey: 'alpha' }, uri: 'https://fake.test/readme' }, context)
	const template = await templateResolver.resolve.ServerUriTemplate.resolve({ $server: { serverKey: 'alpha' }, uriTemplate: 'https://fake.test/{name}' }, context)
	expect(Object.fromEntries(Object.entries(toolResolver.projections).map(([field, project]) => [field, project(tool)]))).toMatchObject({ title: 'Sum', description: 'Adds values', inputSchema: { type: 'object' }, outputSchema: { type: 'number' }, annotations: { readOnlyHint: true } })
	expect(Object.fromEntries(Object.entries(promptResolver.projections).map(([field, project]) => [field, project(prompt)]))).toMatchObject({ title: 'Welcome', description: 'Greets the user', argumentsSchema: { type: 'object' } })
	expect(Object.fromEntries(Object.entries(resourceResolver.projections).map(([field, project]) => [field, project(resource)]))).toMatchObject({ title: 'Read me', description: 'A document', mimeType: 'text/plain', annotations: { audience: ['user'] } })
	expect(Object.fromEntries(Object.entries(templateResolver.projections).map(([field, project]) => [field, project(template)]))).toMatchObject({ title: 'Named', description: 'A named document', mimeType: 'text/plain', annotations: { audience: ['assistant'] } })
})

it('does not resolve a capability absent from the configured server', async () => {
	configureMcpLocalRuntime({ serverKey: 'beta', transport: transportFor('beta') })
	const module = await modulePromise
	const toolResolver = module.default.resolvers.find((resolver) => resolver.entityType === EntityType.McpTool)
	if (toolResolver == null) throw new Error('McpTool resolver is missing')
	await expect(toolResolver.resolve.ServerName.resolve({ $server: { serverKey: 'beta' }, name: 'missing' }, context)).rejects.toThrow('tool missing not declared by beta')
})
