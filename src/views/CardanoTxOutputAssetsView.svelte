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
	}: EntityListViewProps<EntityType.CardanoTxOutputAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoTxOutputAsset}
	bind:open
	resource={
		selection({
			fields: {
				$asset: {
					fields: {
						fingerprint: true,
					},
				},
				quantity: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoTxOutputAsset })}
		{@const cardanoTxOutputAssetSelector = cardanoTxOutputAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoTxOutputAsset}
			entitySelector={cardanoTxOutputAssetSelector}
		>
			{#snippet Title()}
				{cardanoTxOutputAssetSelector.$asset.assetName || cardanoTxOutputAssetSelector.$asset.policyId || 'Cardano native asset'}
			{/snippet}

			{#snippet Value()}
				{cardanoTxOutputAsset.quantity}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
