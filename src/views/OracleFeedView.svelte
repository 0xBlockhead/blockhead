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
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.OracleFeed>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.OracleFeed>
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
	const oracleFeed = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			feedKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			feedKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'oracle feed')
	const viewDomId = $derived('oracle-feed-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OracleFeed_TimestampsView from '$/views/OracleFeed_TimestampsView.svelte'
	import OracleFeed_RoundsView from '$/views/OracleFeed_RoundsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.OracleFeed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={oracleFeed}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeed}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const feedKind0 = resolvedEntity.feedKind}
				{#if feedKind0 !== undefined && feedKind0 !== null}
					{String((feedKind0) ?? '')}
				{/if}

				<ResourceBoundary
					resource={selection.$market}
				>
					{#snippet children(market)}
						{#if market != null && market[EntityMetaKey.Selector] != null}
							<MarketView
								selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
								prefetched={market}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet children(market)}
					{#if market != null && market[EntityMetaKey.Selector] != null}
						<div>
							<dt>market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(
											market[EntityMetaKey.Selector] != null && 'marketKind' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].marketKind != null
											&& market[EntityMetaKey.Selector] != null && '$base' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$base != null && 'assetKey' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$quote' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$quote != null && 'assetKey' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$marketVenue' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$marketVenue != null && 'marketVenueId' in market[EntityMetaKey.Selector].$marketVenue
											&& market[EntityMetaKey.Selector].$marketVenue.marketVenueId != null
											&& market[EntityMetaKey.Selector].$base != null && 'kind' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.kind != null
											&& market[EntityMetaKey.Selector].$quote != null && 'kind' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.kind != null ?
												resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							feedKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feedKind = resolvedEntity.feedKind}
					{#if feedKind !== undefined && feedKind !== null}
						<div>
							<dt>feed kind</dt>
							<dd>
								{String((feedKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const oracleFeedOracleFeedTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={oracleFeedOracleFeedTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<OracleFeed_TimestampsView
					selection={oracleFeedOracleFeedTimestampsViewTimestampsResource}
					countResource={oracleFeedOracleFeedTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='OracleFeed_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const oracleFeedOracleFeedRoundsViewRoundsResource = selection.$$rounds}
		<ResourceBoundary
			resource={oracleFeedOracleFeedRoundsViewRoundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<OracleFeed_RoundsView
					selection={oracleFeedOracleFeedRoundsViewRoundsResource}
					countResource={oracleFeedOracleFeedRoundsViewRoundsResource.count}
					title='rounds'
					id='OracleFeed_RoundsView-rounds'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
