<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			fields: {
				timestampMs: true,
				status: true,
				isError: true,
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpToolCallTimestamp })}
		{@const mcpToolCallTimestampSelector = mcpToolCallTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpToolCall_Timestamp}
			entitySelector={mcpToolCallTimestampSelector}
		>
			{#snippet Title()}
				{String(mcpToolCallTimestampSelector.timestampMs) || 'mcp tool call timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(mcpToolCallTimestamp.status ?? ''), String(mcpToolCallTimestamp.isError ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(mcpToolCallTimestamp.error ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
