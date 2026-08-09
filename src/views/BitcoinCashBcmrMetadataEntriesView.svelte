<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			...{
				fields: {
					name: true,
					symbol: true,
					categoryId: true,
					decimals: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashBcmrMetadata })}
		{@const bitcoinCashBcmrMetadataSelector = bitcoinCashBcmrMetadata[EntityMetaKey.Selector]}
		{@const network = bitcoinCashBcmrMetadataSelector.$network}
		<EntityView
			entityType={EntityType.BitcoinCashBcmrMetadata}
			entitySelector={bitcoinCashBcmrMetadataSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bitcoin-cash/metadata/[categoryId=stringSegment]/[registryUrl=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						categoryId: bitcoinCashBcmrMetadataSelector.categoryId,
						registryUrl: bitcoinCashBcmrMetadataSelector.registryUrl,
					}
				)
			}
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
