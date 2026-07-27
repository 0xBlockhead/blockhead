<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP resource templates',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpResourceTemplate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpResourceTemplate}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				mimeType: true,
				name: true,
				uriTemplate: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpResourceTemplate })}
		{@const mcpResourceTemplateSelector = mcpResourceTemplate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpResourceTemplate}
			entitySelector={mcpResourceTemplateSelector}
		>
			{#snippet Title()}
				{(mcpResourceTemplate.title ?? '') || [(mcpResourceTemplate.name ?? ''), mcpResourceTemplateSelector.uriTemplate].filter(Boolean).join(' ') || 'mcp resource template'}
			{/snippet}

			{#snippet Value()}
				{(mcpResourceTemplate.mimeType ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
