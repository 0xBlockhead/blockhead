<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP prompts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpPrompt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpPrompt}
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
	{#snippet Item({ item: mcpPrompt })}
		{@const mcpPromptSelector = mcpPrompt[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpPrompt}
			entitySelector={mcpPromptSelector}
		>
			{#snippet Title()}
				{(mcpPrompt.title ?? '') || mcpPromptSelector.name || 'mcp prompt'}
			{/snippet}

			{#snippet Value()}
				{mcpPromptSelector.$server.serverKey || 'mcp server'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
