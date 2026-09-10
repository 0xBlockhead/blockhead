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
		title = 'MCP resource content observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpResourceContent_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpResourceContent_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				contentKind: true,
				mimeType: true,
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpResourceContentTimestamp })}
		{@const mcpResourceContentTimestampSelector = mcpResourceContentTimestamp[EntityMetaKey.Selector]}
		{@const resource = mcpResourceContentTimestampSelector.$resource}
		<EntityView
			entityType={EntityType.McpResourceContent_Timestamp}
			entitySelector={mcpResourceContentTimestampSelector}
			href={
				resolve(
					'/mcp/server/[serverKey=stringSegment]/(mcpServer)/resource/[uri=absoluteUrl]/(mcpResource)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						serverKey: resource.$server.serverKey,
						uri: encodeURIComponent(resource.uri),
						timestampMs: String(mcpResourceContentTimestampSelector.timestampMs),
						source: mcpResourceContentTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{mcpResourceContentTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(mcpResourceContentTimestamp.contentKind ?? ''), (mcpResourceContentTimestamp.mimeType ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpResourceContentTimestamp.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
