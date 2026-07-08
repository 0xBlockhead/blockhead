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
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			$market: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.address ?? prefetched.address) ?? '')].filter(Boolean).join(' ') || 'oracle feed')
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
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.address ?? prefetched.address) ?? '')].filter(Boolean).join(' ') || 'oracle feed'}
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
				{@const feedKind0 = prefetched.feedKind}
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
									(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
										marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
										baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
										base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
										quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
										marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
									(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
										marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
										baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
										base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
										quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
										marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
							{@const address = selection.entitySelector.address ?? prefetched.address}
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
				{#snippet children(market)}
					{#if market != null && market[EntityMetaKey.Selector] != null}
						<div>
							<dt>market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
					{@const feedKind = prefetched.feedKind}
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
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='OracleFeed_TimestampsView-timestamps'
			/>

			<OracleFeed_RoundsView
				selection={selection.$$rounds}
				title='rounds'
				emptyText='No rounds found.'
				id='OracleFeed_RoundsView-rounds'
			/>
		{/if}
	{/snippet}
</EntityView>
