<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP prompt results',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpPromptResult> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpPromptResult}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				$prompt: {
					fields: {
						title: true,
						$server: {
							fields: {
								transportKind: true,
								endpointUrl: true,
							},
						},
					},
				},
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpPromptResult })}
		{@const mcpPromptResultSelector = mcpPromptResult[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpPromptResult}
			entitySelector={mcpPromptResultSelector}
		>
			{#snippet Title()}
				{mcpPromptResultSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{(mcpPromptResult.$prompt.title ?? '') || mcpPromptResultSelector.$prompt.name || 'mcp prompt'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpPromptResult.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
