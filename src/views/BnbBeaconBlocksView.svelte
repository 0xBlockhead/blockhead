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
	}: EntityListViewProps<EntityType.BnbBeaconBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconBlock}
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
	{#snippet Item({ item: bnbBeaconBlock })}
		{@const bnbBeaconBlockSelector = bnbBeaconBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconBlock}
			entitySelector={bnbBeaconBlockSelector}
		>
			{#snippet Title()}
				{bnbBeaconBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
