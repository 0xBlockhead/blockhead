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
	}: EntityListViewProps<EntityType.ElementsAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsAsset_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					issuedAmount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: elementsAssetTimestamp })}
		{@const elementsAssetTimestampSelector = elementsAssetTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsAsset_Timestamp}
			entitySelector={elementsAssetTimestampSelector}
		>
			{#snippet Title()}
				{elementsAssetTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{elementsAssetTimestamp.issuedAmount ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
