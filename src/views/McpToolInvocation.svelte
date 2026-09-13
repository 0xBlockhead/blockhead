<script lang="ts">
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import bindings from '$/sources/TheGraph/bindings.ts'
	import { normalizeBoundaryError } from '$/lib/errors.ts'
	import { invokeTool } from '$/state/mcp/invokeTool.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import McpToolCallView from '$/views/McpToolCallView.svelte'


	let {
		tool,
	}: { tool: EntitySelector<typeof schema, EntityType.McpTool> } = $props()
	let argumentsJson = $state('{}')
	let pending = $state(false)
	let error = $state<string>()
	let call = $state<EntitySelector<typeof schema, EntityType.McpToolCall>>()
	const binding = bindings[Source.TheGraph_Mcp][0]


	const submit = async () => {
		if (pending)
			return
		pending = true
		error = undefined
		try {
			const result = await invokeTool(getAppClient(), tool, argumentsJson)
			call = result.selector
			error = result.error
		} catch (cause) {
			error = normalizeBoundaryError(cause).message
		} finally {
			pending = false
		}
	}
</script>


{#if tool.$server.serverKey === `${binding.source}:${binding.target.key}`}
	<form onsubmit={(event) => { event.preventDefault(); void submit() }}>
		<label>
			Arguments (JSON object)
			<textarea bind:value={argumentsJson} rows={6} disabled={pending} required></textarea>
		</label>

		<p>This uses the server's Graph gateway credential. Calls and responses are retained locally in this browser.</p>

		<button type="submit" disabled={pending}>
			{pending ? 'Calling tool…' : 'Call tool'}
		</button>
	</form>

	{#if error}
		<p role="alert">{error}</p>
	{/if}

	{#if call}
		<McpToolCallView
			selection={getAppClient().select(EntityType.McpToolCall, call)({ sources: [Source.Local_Internal] })}
		/>
	{/if}
{/if}
