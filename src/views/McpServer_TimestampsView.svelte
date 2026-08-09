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
		title = 'MCP server observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpServer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpServer_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					health: true,
					error: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: mcpServerTimestamp })}
		{@const mcpServerTimestampSelector = mcpServerTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpServer_Timestamp}
			entitySelector={mcpServerTimestampSelector}
			href={
				resolve(
					'/mcp/server/[serverKey=stringSegment]/(mcpServer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						serverKey: mcpServerTimestampSelector.$server.serverKey,
						timestampMs: String(mcpServerTimestampSelector.timestampMs),
						source: mcpServerTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{mcpServerTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{mcpServerTimestamp.health ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpServerTimestamp.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
