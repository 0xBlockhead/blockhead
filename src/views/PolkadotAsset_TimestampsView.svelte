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
		title = 'Asset observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAsset_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					symbol: true,
					name: true,
					status: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotAssetTimestamp })}
		{@const polkadotAssetTimestampSelector = polkadotAssetTimestamp[EntityMetaKey.Selector]}
		{@const asset = polkadotAssetTimestampSelector.$asset}
		<EntityView
			entityType={EntityType.PolkadotAsset_Timestamp}
			entitySelector={polkadotAssetTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/asset/[assetKind=stringSegment]:[assetId=stringSegment]/(polkadotAsset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in asset.$network ?
								caip2StringFromValue(asset.$network.caip2)
							:
								asset.$network.slug
						),
						assetKind: asset.assetKind,
						assetId: asset.assetId,
						timestampMs: String(polkadotAssetTimestampSelector.timestampMs),
						source: polkadotAssetTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(polkadotAssetTimestamp.symbol ?? ''), (polkadotAssetTimestamp.name ?? '')].filter(Boolean).join(' ') || 'Polkadot asset timestamp'}
			{/snippet}

			{#snippet Value()}
				{polkadotAssetTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAssetTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
