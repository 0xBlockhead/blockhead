<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.CelestiaNamespace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNamespace}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				namespaceVersion: true,
				namespaceId: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaNamespace })}
		{@const celestiaNamespaceSelector = celestiaNamespace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNamespace}
			entitySelector={celestiaNamespaceSelector}
		>
			{#snippet Title()}
				{(celestiaNamespace.label ?? '') || celestiaNamespaceSelector.namespaceId || 'celestia namespace'}
			{/snippet}

			{#snippet Value()}
				{celestiaNamespace.namespaceVersion ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
