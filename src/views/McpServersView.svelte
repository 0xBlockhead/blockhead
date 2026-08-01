<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP servers',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpServer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpServer}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				serverKey: true,
				transportKind: true,
				endpointUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpServer })}
		{@const mcpServerSelector = mcpServer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpServer}
			entitySelector={mcpServerSelector}
		>
			{#snippet Title()}
				{mcpServerSelector.serverKey || 'mcp server'}
			{/snippet}

			{#snippet Value()}
				{mcpServer.transportKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpServer.endpointUrl ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
