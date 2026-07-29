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
		id = 'BitcoinCashBcmrMetadataEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BitcoinCashBcmrMetadata> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashBcmrMetadata}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				categoryId: true,
				decimals: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashBcmrMetadata })}
		{@const bitcoinCashBcmrMetadataSelector = bitcoinCashBcmrMetadata[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitcoinCashBcmrMetadata}
			entitySelector={bitcoinCashBcmrMetadataSelector}
		>
			{#snippet Title()}
				{(bitcoinCashBcmrMetadata.name ?? '') || bitcoinCashBcmrMetadataSelector.categoryId || 'Bitcoin cash bcmr metadata'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashBcmrMetadata.symbol ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bitcoinCashBcmrMetadata.decimals ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
