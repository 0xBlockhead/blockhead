<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.MarketAsset>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.MarketAsset>
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
	const marketAsset = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.assetKey) ?? '')].filter(Boolean).join(' ') || 'Market asset')
	const viewDomId = $derived('market-asset-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'kind' in selection.entitySelector
			&& selection.entitySelector.kind != null
			&& selection.entitySelector != null && 'assetKey' in selection.entitySelector
			&& selection.entitySelector.assetKey != null ?
				resolve('/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', {
			kind: String(selection.entitySelector.kind ?? ''),
			assetKey: String(selection.entitySelector.assetKey ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.assetKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={marketAsset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.assetKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails}
			{@const kind0 = pendingEntity.kind}
			{#if kind0 !== undefined && kind0 !== null}
				<span data-text="muted">
					{String((kind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketAsset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const kind0 = resolvedEntity.kind}
					{#if kind0 !== undefined && kind0 !== null}
						<span data-text="muted">
							{String((kind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const kind = resolvedEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									assetKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetKey = resolvedEntity.assetKey}
							{#if assetKey !== undefined && assetKey !== null}
								{String((assetKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Coin}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Coin</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection
										.$coin({
											sources: [
												Source.Constants_Internal,
											],
										})
								}
							>
								{#snippet children(coin)}
									{#if coin != null && coin[EntityMetaKey.Selector] != null}
										<CoinView
											selection={select(EntityType.Coin, coin[EntityMetaKey.Selector])}
											prefetched={coin}
											href={
												(
													coin[EntityMetaKey.Selector] != null && 'coinId' in coin[EntityMetaKey.Selector]
													&& coin[EntityMetaKey.Selector].coinId != null ?
														resolve('/coin/[coinId=stringSegment]', {
													coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
												})
												:
														undefined
												)
											}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.CoinInstance}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Coin instance</dt>
						<dd>
							<ResourceBoundary
								resource={projection.$coinInstance}
							>
								{#snippet children(evmCoinInstance)}
									{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
										<EvmCoinInstanceView
											selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
											prefetched={evmCoinInstance}
											href={
												(
													evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
													&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
													&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
													&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
													&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
														resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
													coinInstanceSlug: String('native'),
												})
												:
														evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
														&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
														&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
														&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
														&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
														&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
														&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
														&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
															resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
														coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
														chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
													})
													:
														undefined
												)
											}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Currency}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Currency</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection
										.$currency({
											sources: [
												Source.Constants_Internal,
											],
										})
								}
							>
								{#snippet children(currency)}
									{#if currency != null && currency[EntityMetaKey.Selector] != null}
										<CurrencyView
											selection={select(EntityType.Currency, currency[EntityMetaKey.Selector])}
											prefetched={currency}
											href={
												(
													currency[EntityMetaKey.Selector] != null && 'iso4217' in currency[EntityMetaKey.Selector]
													&& currency[EntityMetaKey.Selector].iso4217 != null ?
														resolve('/currency/[iso4217=iso4217]', {
													iso4217: String(currency[EntityMetaKey.Selector].iso4217 ?? ''),
												})
												:
														undefined
												)
											}
											layout={EntityLayout.Value}
											open={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}
</EntityView>
