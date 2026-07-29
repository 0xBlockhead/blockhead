<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP tools',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpTool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpTool}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				$server: {
					fields: {
						transportKind: true,
						endpointUrl: true,
					},
				},
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpTool })}
		{@const mcpToolSelector = mcpTool[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpTool}
			entitySelector={mcpToolSelector}
		>
			{#snippet Title()}
				{(mcpTool.title ?? '') || mcpToolSelector.name || 'mcp tool'}
			{/snippet}

			{#snippet Value()}
				{mcpToolSelector.$server.serverKey || 'mcp server'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
