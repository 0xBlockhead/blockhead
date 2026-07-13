<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAsset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarAsset>>
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
	const stellarAsset = $derived(selection({}))
	const titleFallback = $derived('stellar asset')
	const viewDomId = $derived('stellar-asset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
	import StellarClaimableBalancesView from '$/views/StellarClaimableBalancesView.svelte'
	import StellarLiquidityPoolsView from '$/views/StellarLiquidityPoolsView.svelte'
	import StellarTrustlinesView from '$/views/StellarTrustlinesView.svelte'
	import StellarOffersView from '$/views/StellarOffersView.svelte'
	import StellarTradesView from '$/views/StellarTradesView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarAsset}>
			{#snippet Pending()}
				{title || 'stellar asset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>asset key</dt>
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

			<div>
				<dt>asset kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetKind = pendingEntity.assetKind}
							{#if assetKind !== undefined && assetKind !== null}
								{String((assetKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetKind = resolvedEntity.assetKind}
							{#if assetKind !== undefined && assetKind !== null}
								{String((assetKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetCode = pendingEntity.assetCode}
					{#if assetCode !== undefined && assetCode !== null}
						<div>
							<dt>asset code</dt>
							<dd>
								{String((assetCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetCode = resolvedEntity.assetCode}
					{#if assetCode !== undefined && assetCode !== null}
						<div>
							<dt>asset code</dt>
							<dd>
								{String((assetCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const issuer = pendingEntity.issuer}
					{#if issuer !== undefined && issuer !== null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={String((issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuer = resolvedEntity.issuer}
					{#if issuer !== undefined && issuer !== null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={String((issuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$issuerAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(stellarAccount)}
					{#if stellarAccount != null && stellarAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>issuer account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, stellarAccount[EntityMetaKey.Selector])}
									prefetched={stellarAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-asset-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-asset-claimable-balances',
							label: 'Claimable Balances',
						},
						{
							id: 'stellar-asset-liquidity-pools',
							label: 'Liquidity Pools',
						},
						{
							id: 'stellar-asset-trustlines',
							label: 'Trustlines',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarAssetClaimableBalances({ id, label, open })}
					<StellarClaimableBalancesView
						selection={
							selection.$$claimableBalances({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No claimable balances.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarAssetLiquidityPools({ id, label, open })}
					<StellarLiquidityPoolsView
						selection={
							selection.$$liquidityPools({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No liquidity pools.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarAssetTrustlines({ id, label, open })}
					<StellarTrustlinesView
						selection={
							selection.$$trustlines({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No trustlines.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-asset-related'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-asset-offers',
							label: 'Offers',
						},
						{
							id: 'stellar-asset-trades',
							label: 'Trades',
						},
					]
				}
				data-card
				class='network-view-collapsible-related'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarAssetOffers({ id, label, open })}
					<StellarOffersView
						selection={
							selection.$$offers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No offers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarAssetTrades({ id, label, open })}
					<StellarTradesView
						selection={
							selection.$$trades({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No trades.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
