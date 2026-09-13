import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import { writeLocalMcpToolCall, type LocalMutationContext } from '$/collections/localMutations.ts'
import { normalizeBoundaryError } from '$/lib/errors.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/TheGraph/bindings.ts'


export const invokeTool = async (
	context: LocalMutationContext,
	tool: EntitySelector<typeof schema, EntityType.McpTool>,
	argumentsJson: string
) => {
	const binding = bindings[Source.TheGraph_Mcp][0]
	if (tool.$server.serverKey !== `${binding.source}:${binding.target.key}`)
		throw new Error('No invocation authority configured for this MCP server')
	const params = CallToolRequestSchema.shape.params.parse({ name: tool.name, arguments: JSON.parse(argumentsJson) })
	const selector = { $server: tool.$server, callId: crypto.randomUUID() }
	const input = {
		tool,
		startedAt: Date.now(),
		inputHash: Hash32.assert(Hash.sha256(Hex.fromString(JSON.stringify(params)))),
	}
	await writeLocalMcpToolCall(context, selector, input)
	const { invoke } = await import('$/sources/TheGraph/Mcp/queries.remote.ts')
	let response: Awaited<ReturnType<typeof invoke>>
	try {
		response = await invoke(params)
	} catch (cause) {
		const error = normalizeBoundaryError(cause).message
		const completedAt = Date.now()
		await writeLocalMcpToolCall(context, selector, {
			...input,
			completedAt,
			observation: {
				timestampMs: completedAt,
				status: 'transport-error',
				latencyMs: completedAt - input.startedAt,
				error,
			},
		})
		return { selector, error }
	}
	await writeLocalMcpToolCall(context, selector, {
		...input,
		completedAt: response.completedAt,
		observation: {
			timestampMs: response.completedAt,
			status: 'completed',
			latencyMs: response.completedAt - response.startedAt,
			isError: response.result.isError === true,
			payload: response.result,
		},
	})
	return { selector, error: response.result.isError === true ? 'The provider reported a tool error. Inspect the recorded response.' : undefined }
}
