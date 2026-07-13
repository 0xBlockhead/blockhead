<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.MarketAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MarketAsset>>
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
	const marketAsset = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.assetKey) ?? '')].filter(Boolean).join(' ') || 'Market asset')
	const viewDomId = $derived('market-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketAsset}>
			{#snippet Pending()}
				{[String((pendingEntity.assetKey) ?? '')].filter(Boolean).join(' ') || title || 'Market asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.assetKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketAsset}>
			{#snippet Pending()}
				{@const kind0 = pendingEntity.kind}
				{#if kind0 !== undefined && kind0 !== null}
					<span data-text="muted">
						{String((kind0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									kind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const kind = pendingEntity.kind}
							{#if kind !== undefined && kind !== null}
								{String((kind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									assetKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetKey = pendingEntity.assetKey}
							{#if assetKey !== undefined && assetKey !== null}
								{String((assetKey) ?? '')}
							{/if}
						{/snippet}

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
									projection.$coin({
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
												(coin[EntityMetaKey.Selector].coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
													coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
												}) : undefined)
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
												(evmCoinInstance[EntityMetaKey.Selector].type !== undefined && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
													coinInstanceSlug: String('native' ?? ''),
												}) : evmCoinInstance[EntityMetaKey.Selector].type !== undefined && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
												}) : undefined)
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
									projection.$currency({
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
												(currency[EntityMetaKey.Selector].iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]', {
													iso4217: String(currency[EntityMetaKey.Selector].iso4217 ?? ''),
												}) : undefined)
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
