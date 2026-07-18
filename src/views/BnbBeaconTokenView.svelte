<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BnbBeaconToken>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BnbBeaconToken>>
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
	const bnbBeaconToken = $derived(selection({
		sources: selection.sources,
		fields: {
			tokenName: true,
			tokenType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token')
	const viewDomId = $derived('bnb-beacon-token-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
	import BnbBeaconTokenTransfersView from '$/views/BnbBeaconTokenTransfersView.svelte'
	import BnbBeaconTokenMigrationsView from '$/views/BnbBeaconTokenMigrationsView.svelte'
	import BnbBeaconToken_TimestampsView from '$/views/BnbBeaconToken_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconToken}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={bnbBeaconToken}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.tokenName) ?? ''), String((pendingEntity.tokenType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={bnbBeaconToken}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.tokenName) ?? ''), String((resolvedEntity.tokenType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const symbol = resolvedEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							originalSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const originalSymbol = resolvedEntity.originalSymbol}
					{#if originalSymbol !== undefined && originalSymbol !== null}
						<div>
							<dt>original symbol</dt>
							<dd>
								{String((originalSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenName = resolvedEntity.tokenName}
					{#if tokenName !== undefined && tokenName !== null}
						<div>
							<dt>token name</dt>
							<dd>
								{String((tokenName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenType = resolvedEntity.tokenType}
					{#if tokenType !== undefined && tokenType !== null}
						<div>
							<dt>token type</dt>
							<dd>
								{String((tokenType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							ownerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerAddress = resolvedEntity.ownerAddress}
					{#if ownerAddress !== undefined && ownerAddress !== null}
						<div>
							<dt>owner address</dt>
							<dd>
								<TruncatedValue value={String((ownerAddress) ?? '')} />
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
				id={viewDomId + '-carousel-bnb-beacon-token-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bnb-beacon-token-transfers',
							label: 'Transfers',
						},
						{
							id: 'bnb-beacon-token-migrations',
							label: 'Migrations',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBnbBeaconTokenTransfers({ id, label, open })}
					<BnbBeaconTokenTransfersView
						selection={selection.$$transfers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No transfers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionBnbBeaconTokenMigrations({ id, label, open })}
					<BnbBeaconTokenMigrationsView
						selection={selection.$$migrations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No migrations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-bnb-beacon-token-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'bnb-beacon-token-timestamps',
							label: 'Timestamps',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionBnbBeaconTokenTimestamps({ id, label, open })}
					<BnbBeaconToken_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
