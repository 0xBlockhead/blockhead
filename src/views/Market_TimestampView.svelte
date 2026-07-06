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
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Market_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_Timestamp>>
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
	const marketTimestamp = $derived(selection({
		fields: {
			price: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.feedKey ?? prefetched.feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp')
	const viewDomId = $derived('market-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$market !== undefined && pendingEntity.$market.$marketVenue !== undefined && pendingEntity.$market.$marketVenue.marketVenueId !== undefined && pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.kind !== undefined && (pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.kind !== undefined && (pendingEntity.$market.$base.kind === 'Coin' ? pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$coin !== undefined && pendingEntity.$market.$base.$coin.coinId !== undefined : pendingEntity.$market.$base.kind === 'CoinInstance' ? pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$coinInstance !== undefined && pendingEntity.$market.$base.$coinInstance.type !== undefined : pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$currency !== undefined && pendingEntity.$market.$base.$currency.iso4217 !== undefined)) && pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.kind !== undefined && (pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.kind !== undefined && (pendingEntity.$market.$quote.kind === 'Coin' ? pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$coin !== undefined && pendingEntity.$market.$quote.$coin.coinId !== undefined : pendingEntity.$market.$quote.kind === 'CoinInstance' ? pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$coinInstance !== undefined && pendingEntity.$market.$quote.$coinInstance.type !== undefined : pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$currency !== undefined && pendingEntity.$market.$quote.$currency.iso4217 !== undefined)) && pendingEntity.$market !== undefined && pendingEntity.$market.marketKind !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.feedKey !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
			marketVenue: String(pendingEntity.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$market.$base.kind)] ?? ''),
			base: String((pendingEntity.$market.$base.kind === 'Coin' ? pendingEntity.$market.$base.$coin.coinId : pendingEntity.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$market.$base.$coinInstance.type)] : pendingEntity.$market.$base.$currency.iso4217)),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$market.$quote.kind)] ?? ''),
			quote: String((pendingEntity.$market.$quote.kind === 'Coin' ? pendingEntity.$market.$quote.$coin.coinId : pendingEntity.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$market.$quote.$coinInstance.type)] : pendingEntity.$market.$quote.$currency.iso4217)),
			marketKind: String(pendingEntity.$market.marketKind ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			feedKey: String(pendingEntity.feedKey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.feedKey ?? prefetched.feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketTimestamp}>
			{#snippet Pending()}
				{@const price0 = prefetched.price}
				{#if price0 !== undefined && price0 !== null}
					<NumberValue
						value={Number(price0) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const price0 = resolvedEntity.price}
				{#if price0 !== undefined && price0 !== null}
					<NumberValue
						value={Number(price0) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A point-in-time market quote or metric observation.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Price</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									price: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const price = prefetched.price}
							{#if price !== undefined && price !== null}
								<NumberValue
									value={Number(price) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const price = resolvedEntity.price}
							{#if price !== undefined && price !== null}
								<NumberValue
									value={Number(price) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feedKey = selection.entitySelector.feedKey ?? prefetched.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedKey = resolvedEntity.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transport = prefetched.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transport = resolvedEntity.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerAssetId = prefetched.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerAssetId = resolvedEntity.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const caip19 = prefetched.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip19 = resolvedEntity.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							(selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.kind !== undefined && (selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.kind !== undefined && (selection.entitySelector.$market.$base.kind === 'Coin' ? selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$coin !== undefined && selection.entitySelector.$market.$base.$coin.coinId !== undefined : selection.entitySelector.$market.$base.kind === 'CoinInstance' ? selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$coinInstance !== undefined && selection.entitySelector.$market.$base.$coinInstance.type !== undefined : selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$currency !== undefined && selection.entitySelector.$market.$base.$currency.iso4217 !== undefined)) && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.kind !== undefined && (selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.kind !== undefined && (selection.entitySelector.$market.$quote.kind === 'Coin' ? selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$coin !== undefined && selection.entitySelector.$market.$quote.$coin.coinId !== undefined : selection.entitySelector.$market.$quote.kind === 'CoinInstance' ? selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$coinInstance !== undefined && selection.entitySelector.$market.$quote.$coinInstance.type !== undefined : selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$currency !== undefined && selection.entitySelector.$market.$quote.$currency.iso4217 !== undefined)) && selection.entitySelector.$market.marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								base: String((selection.entitySelector.$market.$base.kind === 'Coin' ? selection.entitySelector.$market.$base.$coin.coinId : selection.entitySelector.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(selection.entitySelector.$market.$base.$coinInstance.type)] : selection.entitySelector.$market.$base.$currency.iso4217)),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
								quote: String((selection.entitySelector.$market.$quote.kind === 'Coin' ? selection.entitySelector.$market.$quote.$coin.coinId : selection.entitySelector.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(selection.entitySelector.$market.$quote.$coinInstance.type)] : selection.entitySelector.$market.$quote.$currency.iso4217)),
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
