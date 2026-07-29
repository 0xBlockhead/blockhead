<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpServerPackage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpServerPackage}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				registryServerName: true,
				repositoryUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpServerPackage })}
		{@const mcpServerPackageSelector = mcpServerPackage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.McpServerPackage}
			entitySelector={mcpServerPackageSelector}
		>
			{#snippet Title()}
				{(mcpServerPackage.label ?? '') || [(mcpServerPackageSelector.registryServerName ?? ''), (mcpServerPackageSelector.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
