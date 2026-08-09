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
		title = 'MCP tool call observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpToolCall_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpToolCall_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					isError: true,
					error: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: mcpToolCallTimestamp })}
		{@const mcpToolCallTimestampSelector = mcpToolCallTimestamp[EntityMetaKey.Selector]}
		{@const toolCall = mcpToolCallTimestampSelector.$toolCall}
		<EntityView
			entityType={EntityType.McpToolCall_Timestamp}
			entitySelector={mcpToolCallTimestampSelector}
			href={
				resolve(
					'/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]/(mcpToolCall)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						serverKey: toolCall.$server.serverKey,
						callId: toolCall.callId,
						timestampMs: String(mcpToolCallTimestampSelector.timestampMs),
						source: mcpToolCallTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{mcpToolCallTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(mcpToolCallTimestamp.status ?? ''), String(mcpToolCallTimestamp.isError ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpToolCallTimestamp.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
