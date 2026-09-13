import { readFile, writeFile } from 'node:fs/promises'
import { getIntrospectionQuery } from 'graphql'
import bindings from '../../src/sources/TheGraph/bindings.ts'
import { Source } from '../../src/sources/Source.ts'
import { connectRemoteMcpClient } from '../../src/sources/Mcp/Protocol/client.server.ts'

const binding = bindings[Source.TheGraph_Mcp][0]
const apiKey = process.env[process.argv[2] ?? binding.credentials[0].keys[0]]?.trim()
if (!apiKey) {
	console.error('The Graph gateway credential is unavailable; no request was made.')
	process.exitCode = 1
} else {
	const client = await connectRemoteMcpClient({
		url: new URL(binding.endpoints[0].locator),
		transportKind: 'sse',
		headers: { Authorization: `Bearer ${apiKey}` },
	})
	try {
		const tools = await client.listTools()
		console.log(JSON.stringify({
			observedAt: new Date().toISOString(),
			server: client.server,
			tools,
		}, null, 2))
		const keyword = process.argv[3]
		if (keyword !== undefined)
			console.log(JSON.stringify(await client.callTool({
				name: 'search_subgraphs_by_keyword',
				arguments: { keyword },
			}), null, 2))
		const subgraphId = process.argv[4]
		if (subgraphId !== undefined)
			console.log(JSON.stringify(await client.callTool({
				name: 'get_schema_by_subgraph_id',
				arguments: { subgraph_id: subgraphId },
			}), null, 2))
		const introspectionOutput = process.argv[5]
		if (subgraphId !== undefined && introspectionOutput !== undefined) {
			const response = await client.callTool({
				name: 'execute_query_by_subgraph_id',
				arguments: { subgraph_id: subgraphId, query: getIntrospectionQuery() },
			})
			await writeFile(introspectionOutput, `${JSON.stringify({
				observedAt: new Date().toISOString(),
				subgraphId,
				response,
			}, null, 2)}\n`)
		}
		const queryPath = process.argv[6]
		if (subgraphId !== undefined && introspectionOutput !== undefined && queryPath !== undefined) {
			const query = await readFile(queryPath, 'utf8')
			const response = await client.callTool({
				name: 'execute_query_by_subgraph_id',
				arguments: { subgraph_id: subgraphId, query },
			})
			await writeFile(`${introspectionOutput}.query.json`, JSON.stringify({
				observedAt: new Date().toISOString(),
				subgraphId,
				query,
				response,
			}, null, 2) + '\n')
		}
	} finally {
		await client.close()
	}
}
