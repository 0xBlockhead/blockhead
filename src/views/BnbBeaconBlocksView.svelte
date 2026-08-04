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
		<EntityView
			entityType={EntityType.BnbBeaconBlock}
			entitySelector={bnbBeaconBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bnbBeaconBlock.height}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
