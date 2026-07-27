<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		title = 'MCP resources',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpResource}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				mimeType: true,
				name: true,
				uri: true,
				subscribed: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpResource })}
		{@const mcpResourceSelector = mcpResource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpResource}
			entitySelector={mcpResourceSelector}
		>
			{#snippet Title()}
				{(mcpResource.title ?? '') || [(mcpResource.name ?? ''), String(mcpResourceSelector.uri)].filter(Boolean).join(' ') || 'mcp resource'}
			{/snippet}

			{#snippet Value()}
				{(mcpResource.mimeType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(mcpResource.subscribed ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
