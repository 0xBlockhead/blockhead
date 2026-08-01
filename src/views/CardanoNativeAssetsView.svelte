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
	}: EntityListViewProps<EntityType.CardanoNativeAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoNativeAsset}
	bind:open
	resource={
		selection({
			fields: {
				assetName: true,
				fingerprint: true,
				policyId: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoNativeAsset })}
		{@const cardanoNativeAssetSelector = cardanoNativeAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoNativeAsset}
			entitySelector={cardanoNativeAssetSelector}
		>
			{#snippet Title()}
				{cardanoNativeAssetSelector.assetName || cardanoNativeAssetSelector.policyId || 'Cardano native asset'}
			{/snippet}

			{#snippet Value()}
				{cardanoNativeAsset.fingerprint ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
