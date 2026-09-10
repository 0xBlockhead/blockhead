<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP tool calls',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpToolCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpToolCall}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				callId: true,
				$tool: true,
				startedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpToolCall })}
		{@const mcpToolCallSelector = mcpToolCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpToolCall}
			entitySelector={mcpToolCallSelector}
			href={
				resolve(
					'/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]',
					{
						serverKey: mcpToolCallSelector.$server.serverKey,
						callId: mcpToolCallSelector.callId,
					}
				)
			}
		>
			{#snippet Title()}
				{mcpToolCallSelector.callId || 'mcp tool call'}
			{/snippet}

			{#snippet Value()}
				{mcpToolCall.$tool == null ? '' : (mcpToolCall.$tool.title ?? '') || mcpToolCall.$tool.name || 'mcp tool'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpToolCall.startedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
