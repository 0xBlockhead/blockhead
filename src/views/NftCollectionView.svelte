<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.NftCollection>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NftCollection>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const nftCollection = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'NFT collection'
	const viewDomId = $derived('nft-collection-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NftTokensView from '$/views/NftTokensView.svelte'
	import RoyaltyRight_TimestampsView from '$/views/RoyaltyRight_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={nftCollection}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						href={
							(
								selection.entitySelector.$assetInstance != null && 'kind' in selection.entitySelector.$assetInstance
								&& selection.entitySelector.$assetInstance.kind != null
								&& selection.entitySelector.$assetInstance != null && 'assetKey' in selection.entitySelector.$assetInstance
								&& selection.entitySelector.$assetInstance.assetKey != null
								&& selection.entitySelector.$assetInstance != null && '$network' in selection.entitySelector.$assetInstance ?
									selection.entitySelector.$assetInstance.$network != null && 'caip2' in selection.entitySelector.$assetInstance.$network
									&& selection.entitySelector.$assetInstance.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
									kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
									assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$assetInstance.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$assetInstance.$network != null && 'slug' in selection.entitySelector.$assetInstance.$network
										&& selection.entitySelector.$assetInstance.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
										kind: String(selection.entitySelector.$assetInstance.kind ?? ''),
										assetKey: String(selection.entitySelector.$assetInstance.assetKey ?? ''),
										network: String(selection.entitySelector.$assetInstance.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const nftCollectionNftTokensViewTokensResource = selection.$$tokens}
		<ResourceBoundary
			resource={nftCollectionNftTokensViewTokensResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<NftTokensView
					selection={nftCollectionNftTokensViewTokensResource}
					countResource={nftCollectionNftTokensViewTokensResource.count}
					title='tokens'
					id='NftTokensView-tokens'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const nftCollectionRoyaltyRightTimestampsViewRoyaltyTimestampsResource = selection.$$royaltyTimestamps}
		<ResourceBoundary
			resource={nftCollectionRoyaltyRightTimestampsViewRoyaltyTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<RoyaltyRight_TimestampsView
					selection={nftCollectionRoyaltyRightTimestampsViewRoyaltyTimestampsResource}
					countResource={nftCollectionRoyaltyRightTimestampsViewRoyaltyTimestampsResource.count}
					title='royalty timestamps'
					id='RoyaltyRight_TimestampsView-royalty-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
