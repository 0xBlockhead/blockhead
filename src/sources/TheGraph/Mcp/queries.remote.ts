import { command, query } from '$app/server'
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { type } from 'arktype'
import type { McpTool } from '$/sources/Mcp/Protocol/types.ts'

import { connectSubgraphMcp } from './client.server.ts'


const json = type('object.json')

export const discover = query(async () => {
	const client = await connectSubgraphMcp()
	try {
		return {
			server: client.server,
			capabilities: client.capabilities,
			tools: (await client.listTools()).map(({ name, title, description, inputSchema, outputSchema, annotations }): McpTool => ({
				name,
				title,
				description,
				inputSchema: json.assert(inputSchema),
				outputSchema: outputSchema === undefined ? undefined : json.assert(outputSchema),
				annotations: annotations === undefined ? undefined : json.assert(annotations),
			})),
		}
	} finally {
		await client.close()
	}
})

export const invoke = command(CallToolRequestSchema.shape.params, async (params) => {
	// These hosted Subgraph MCP tools only read indexed data. Newly advertised tools
	// require review before they inherit the application's gateway authority.
	if (![
		'get_deployment_30day_query_counts',
		'search_subgraphs_by_keyword',
		'get_schema_by_subgraph_id',
		'get_schema_by_ipfs_hash',
		'get_schema_by_deployment_id',
		'execute_query_by_deployment_id',
		'execute_query_by_ipfs_hash',
		'execute_query_by_subgraph_id',
		'get_top_subgraph_deployments',
	].includes(params.name))
		throw new Error('TheGraph_Mcp: tool is not authorized for gateway invocation')

	const client = await connectSubgraphMcp()
	try {
		return await client.callTool(params)
	} finally {
		await client.close()
	}
})
