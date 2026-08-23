import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const discover = async (serverKey: string, context: ResolverContext) => {
	const { discoverMcpServer } = await import('$/sources/Mcp/Protocol/queries.ts')
	const { getMcpLocalRuntime } = await import('$/sources/Mcp/Protocol/runtime.ts')
	const runtime = getMcpLocalRuntime()
	if (runtime.serverKey !== serverKey)
		throw new Error(`McpDeclared_Protocol: configured server identity unavailable for ${serverKey}`)
	const snapshot = await discoverMcpServer(context.sourceBinding, serverKey, runtime.transport)
	if (snapshot.status !== 'connected' || snapshot.catalog == null || snapshot.capabilities == null)
		throw new Error(snapshot.error ?? 'McpDeclared_Protocol: discovery unavailable')
	return snapshot
}

export default {
	source: Source.McpDeclared_Protocol,
	resolvers: [
		defineResolver({
			entityType: EntityType.McpServer,
			resolve: {
				ServerKey: {
					resolve: async ({ serverKey }, context) => {
						const snapshot = await discover(serverKey, context)
						return {
							serverKey,
							transportKind: 'local-process',
							catalog: snapshot.catalog,
						}
					},
				},
			},
		})({
			serverKey: (server) => server.serverKey,
			transportKind: (server) => server.transportKind,
			$$tools: (server) => server.catalog.tools.map((tool) => ({ [EntityMetaKey.Selector]: { $server: { serverKey: server.serverKey }, name: tool.name } })),
			$$prompts: (server) => server.catalog.prompts.map((prompt) => ({ [EntityMetaKey.Selector]: { $server: { serverKey: server.serverKey }, name: prompt.name } })),
			$$resources: (server) => server.catalog.resources.map((resource) => ({ [EntityMetaKey.Selector]: { $server: { serverKey: server.serverKey }, uri: resource.uri } })),
			$$resourceTemplates: (server) => server.catalog.resourceTemplates.map((template) => ({ [EntityMetaKey.Selector]: { $server: { serverKey: server.serverKey }, uriTemplate: template.uriTemplate } })),
		}),

		defineResolver({ entityType: EntityType.McpTool, resolve: { ServerName: { resolve: async ({ $server, name }, context) => {
			const tool = (await discover($server.serverKey, context)).catalog.tools.find((candidate) => candidate.name === name)
			if (tool == null) throw new Error(`McpDeclared_Protocol: tool ${name} not declared by ${$server.serverKey}`)
			return { $server, ...tool }
		} } } })({
			$server: (tool) => tool.$server,
			name: (tool) => tool.name,
			title: (tool) => tool.title,
			description: (tool) => tool.description,
			inputSchema: (tool) => tool.inputSchema,
			outputSchema: (tool) => tool.outputSchema,
			annotations: (tool) => tool.annotations,
		}),
		defineResolver({ entityType: EntityType.McpPrompt, resolve: { ServerName: { resolve: async ({ $server, name }, context) => {
			const prompt = (await discover($server.serverKey, context)).catalog.prompts.find((candidate) => candidate.name === name)
			if (prompt == null) throw new Error(`McpDeclared_Protocol: prompt ${name} not declared by ${$server.serverKey}`)
			return { $server, ...prompt }
		} } } })({
			$server: (prompt) => prompt.$server,
			name: (prompt) => prompt.name,
			title: (prompt) => prompt.title,
			description: (prompt) => prompt.description,
			argumentsSchema: (prompt) => prompt.argumentsSchema,
		}),
		defineResolver({ entityType: EntityType.McpResource, resolve: { ServerUri: { resolve: async ({ $server, uri }, context) => {
			const resource = (await discover($server.serverKey, context)).catalog.resources.find((candidate) => candidate.uri === uri)
			if (resource == null) throw new Error(`McpDeclared_Protocol: resource ${uri} not declared by ${$server.serverKey}`)
			return { $server, ...resource }
		} } } })({
			$server: (resource) => resource.$server,
			uri: (resource) => resource.uri,
			name: (resource) => resource.name,
			title: (resource) => resource.title,
			description: (resource) => resource.description,
			mimeType: (resource) => resource.mimeType,
			annotations: (resource) => resource.annotations,
		}),
		defineResolver({ entityType: EntityType.McpResourceTemplate, resolve: { ServerUriTemplate: { resolve: async ({ $server, uriTemplate }, context) => {
			const template = (await discover($server.serverKey, context)).catalog.resourceTemplates.find((candidate) => candidate.uriTemplate === uriTemplate)
			if (template == null) throw new Error(`McpDeclared_Protocol: resource template ${uriTemplate} not declared by ${$server.serverKey}`)
			return { $server, ...template }
		} } } })({
			$server: (template) => template.$server,
			uriTemplate: (template) => template.uriTemplate,
			name: (template) => template.name,
			title: (template) => template.title,
			description: (template) => template.description,
			mimeType: (template) => template.mimeType,
			annotations: (template) => template.annotations,
		}),
	],
} satisfies RegisteredSourceResolverModule
