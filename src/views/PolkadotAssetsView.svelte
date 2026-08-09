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
		title = 'Assets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAsset}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					assetId: true,
					assetKind: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotAsset })}
		{@const polkadotAssetSelector = polkadotAsset[EntityMetaKey.Selector]}
		{@const network = polkadotAssetSelector.$network}
		<EntityView
			entityType={EntityType.PolkadotAsset}
			entitySelector={polkadotAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/asset/[assetKind=stringSegment]:[assetId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						assetKind: polkadotAssetSelector.assetKind,
						assetId: polkadotAssetSelector.assetId,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotAssetSelector.assetId || 'Polkadot asset'}
			{/snippet}

			{#snippet Value()}
				{polkadotAssetSelector.assetKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAsset.$network.name || (polkadotAsset.$network.caip2 == null ? '' : `${polkadotAsset.$network.caip2.namespace}:${polkadotAsset.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
