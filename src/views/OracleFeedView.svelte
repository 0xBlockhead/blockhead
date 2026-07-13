<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.OracleFeed>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.OracleFeed>>
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
	const oracleFeed = $derived(selection({
		fields: {
			label: true,
			feedKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'oracle feed')
	const viewDomId = $derived('oracle-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'oracle feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeed}>
			{#snippet Pending()}
				{@const feedKind0 = pendingEntity.feedKind}
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
								href={
									(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
										marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
										base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
										quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
										marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
										baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
										quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
								href={
									(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
										marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
										base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
										quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
										marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
										baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
										quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
									}) : undefined)
								}
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(market)}
					{#if market != null && market[EntityMetaKey.Selector] != null}
						<div>
							<dt>market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
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
						fields: {
							feedKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feedKind = pendingEntity.feedKind}
					{#if feedKind !== undefined && feedKind !== null}
						<div>
							<dt>feed kind</dt>
							<dd>
								{String((feedKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<OracleFeed_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='OracleFeed_TimestampsView-timestamps'
			/>

			<OracleFeed_RoundsView
				selection={
						selection.$$rounds({
							count: true,
						})
					}
				title='rounds'
				emptyText='No rounds found.'
				id='OracleFeed_RoundsView-rounds'
			/>
		{/if}
	{/snippet}
</EntityView>
