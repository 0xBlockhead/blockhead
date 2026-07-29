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
	}: EntityListViewProps<EntityType.CelestiaBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaBlock })}
		{@const celestiaBlockSelector = celestiaBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaBlock}
			entitySelector={celestiaBlockSelector}
		>
			{#snippet Title()}
				{celestiaBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{celestiaBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
