import { query } from '$app/server'
import { type } from 'arktype'
import { connectSubgraphMcp } from '../Mcp/client.server.ts'
import { parseProtocolFinancials } from './financials.ts'

const json = type('object.json')

export const getProtocolFinancials = query(type({ subgraphId: 'string > 0' }), async ({ subgraphId }) => {
	const client = await connectSubgraphMcp()
	try {
		const call = await client.callTool({
			name: 'execute_query_by_subgraph_id',
			arguments: {
				subgraph_id: subgraphId,
				query: `query ProtocolFinancials {
  _meta { deployment hasIndexingErrors block { number hash timestamp } }
  dexAmmProtocols(first: 10) {
    id name schemaVersion subgraphVersion methodologyVersion network
    totalValueLockedUSD cumulativeVolumeUSD cumulativeSupplySideRevenueUSD
    cumulativeProtocolSideRevenueUSD cumulativeTotalRevenueUSD totalPoolCount
  }
}`,
			},
		})
		if (call.result.isError)
			throw new Error('Messari financial query tool failed')

		const content = call.result.content.find((block) => block.type === 'text')
		if (content?.type !== 'text')
			throw new Error('Messari financial query returned no JSON content')

		return {
			subgraphId,
			startedAt: call.startedAt,
			completedAt: call.completedAt,
			data: parseProtocolFinancials(json.assert(JSON.parse(content.text))),
		}
	} finally {
		await client.close()
	}
})
