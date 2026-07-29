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
	}: EntityListViewProps<EntityType.MagnetLink> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MagnetLink}
	bind:open
	resource={
		selection({
			fields: {
				displayName: true,
				infoHash: true,
				magnetUri: true,
			},
		})
	}
>
	{#snippet Item({ item: magnetLink })}
		{@const magnetLinkSelector = magnetLink[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MagnetLink}
			entitySelector={magnetLinkSelector}
		>
			{#snippet Title()}
				{(magnetLink.displayName ?? '') || magnetLinkSelector.magnetUri || 'magnet link'}
			{/snippet}

			{#snippet Value()}
				{magnetLink.infoHash ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
