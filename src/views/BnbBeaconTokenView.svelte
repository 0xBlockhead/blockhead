<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BnbBeaconToken>
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
	const bnbBeaconToken = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			tokenName: true,
			tokenType: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			tokenName: true,
			tokenType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || 'bnb beacon token')
	const viewDomId = $derived('bnb-beacon-token-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'tokenName') && Object.hasOwn(prefetched, 'tokenType')}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'tokenName') && Object.hasOwn(prefetched, 'tokenType')}
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
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-bnb-beacon-token-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'bnb-beacon-token-transfers',
						label: 'Transfers',
						ownsSection: true,
					},
					{
						id: 'bnb-beacon-token-migrations',
						label: 'Migrations',
						ownsSection: true,
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

			{#snippet MarkerBnbBeaconTokenTransfers(_context, Content)}
				{@const bnbBeaconTokenActivityBnbBeaconTokenTransfersResource = selection.$$transfers}
				<ResourceBoundary
					resource={bnbBeaconTokenActivityBnbBeaconTokenTransfersResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBnbBeaconTokenTransfers({ id, label, open, active })}
				{@const bnbBeaconTokenActivityBnbBeaconTokenTransfersResource = selection.$$transfers}
				<ResourceBoundary
					resource={bnbBeaconTokenActivityBnbBeaconTokenTransfersResource}
				>
					{#snippet children(bnbBeaconTokenTransfer)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BnbBeaconTokenTransfersView
								selection={bnbBeaconTokenActivityBnbBeaconTokenTransfersResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No transfers.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerBnbBeaconTokenMigrations(_context, Content)}
				{@const bnbBeaconTokenActivityBnbBeaconTokenMigrationsResource = selection.$$migrations}
				<ResourceBoundary
					resource={bnbBeaconTokenActivityBnbBeaconTokenMigrationsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBnbBeaconTokenMigrations({ id, label, open, active })}
				{@const bnbBeaconTokenActivityBnbBeaconTokenMigrationsResource = selection.$$migrations}
				<ResourceBoundary
					resource={bnbBeaconTokenActivityBnbBeaconTokenMigrationsResource}
				>
					{#snippet children(bnbBeaconTokenMigration)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BnbBeaconTokenMigrationsView
								selection={bnbBeaconTokenActivityBnbBeaconTokenMigrationsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No migrations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
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

			{#snippet MarkerBnbBeaconTokenTimestamps(_context, Content)}
				{@const bnbBeaconTokenObservationsBnbBeaconTokenTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={bnbBeaconTokenObservationsBnbBeaconTokenTimestampsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionBnbBeaconTokenTimestamps({ id, label, open, active })}
				{@const bnbBeaconTokenObservationsBnbBeaconTokenTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={bnbBeaconTokenObservationsBnbBeaconTokenTimestampsResource}
				>
					{#snippet children(bnbBeaconTokenTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<BnbBeaconToken_TimestampsView
								selection={bnbBeaconTokenObservationsBnbBeaconTokenTimestampsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No timestamps.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
