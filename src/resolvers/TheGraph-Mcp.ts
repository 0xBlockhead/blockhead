import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/TheGraph/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { McpTool } from '$/sources/Mcp/Protocol/types.ts'


const binding = bindings[Source.TheGraph_Mcp][0]
const serverKey = `${binding.source}:${binding.target.key}`

const resolveServer = async ({ serverKey: requestedKey }: { serverKey: string }): Promise<{ serverKey: string, tools: readonly McpTool[] }> => {
	if (requestedKey !== serverKey)
		throw new Error('TheGraph_Mcp: unsupported server identity')
	const { discover } = await import('$/sources/TheGraph/Mcp/queries.remote.ts')
	return { serverKey, tools: (await discover()).tools }
}

const resolveTool = async ({ $server, name }: { $server: { serverKey: string }, name: string }): Promise<McpTool & { $server: { serverKey: string } }> => {
	const tool = (await resolveServer($server)).tools.find((tool) => tool.name === name)
	if (!tool)
		throw new Error(`TheGraph_Mcp: tool ${name} not declared by server`)
	return { $server, ...tool }
}

const resolvers = [
	defineResolver({
		entityType: EntityType.McpServer,
		resolve: {
			ServerKey: {
				appliesTo: [{ serverKey }],
				resolve: resolveServer,
			},
		},
	})({
		serverKey: (server) => server.serverKey,
		endpointUrl: () => binding.endpoints[0].locator,
		transportKind: () => 'sse',
		$$tools: (server) => server.tools.map(({ name }) => ({
			[EntityMetaKey.Selector]: { $server: { serverKey: server.serverKey }, name },
		})),
	}),
	defineResolver({
		entityType: EntityType.McpTool,
		resolve: {
			ServerName: {
				appliesTo: [{ $server: { serverKey } }],
				resolve: resolveTool,
			},
		},
	})({
		$server: (tool) => ({ [EntityMetaKey.Selector]: tool.$server }),
		name: (tool) => tool.name,
		title: (tool) => tool.title,
		description: (tool) => tool.description,
		inputSchema: (tool) => tool.inputSchema,
		outputSchema: (tool) => tool.outputSchema,
		annotations: (tool) => tool.annotations,
	}),
]

export default {
	source: Source.TheGraph_Mcp,
	resolvers,
} satisfies RegisteredSourceResolverModule
