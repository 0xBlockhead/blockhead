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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StellarAccount>>
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
	const stellarAccount = $derived(selection({}))
	const titleFallback = $derived('stellar account')
	const viewDomId = $derived('stellar-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarTrustlinesView from '$/views/StellarTrustlinesView.svelte'
	import StellarOffersView from '$/views/StellarOffersView.svelte'
	import StellarTradesView from '$/views/StellarTradesView.svelte'
	import StellarTransactionsView from '$/views/StellarTransactionsView.svelte'
	import StellarAccountSignersView from '$/views/StellarAccountSignersView.svelte'
	import StellarAccount_TimestampsView from '$/views/StellarAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarAccount}>
			{#snippet Pending()}
				{title || 'stellar account'}
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
				<dt>account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountId = pendingEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountId = resolvedEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-account-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-account-trustlines',
							label: 'Trustlines',
						},
						{
							id: 'stellar-account-offers',
							label: 'Offers',
						},
						{
							id: 'stellar-account-trades',
							label: 'Trades',
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

				{#snippet SectionStellarAccountTrustlines({ id, label, open })}
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

				{#snippet SectionStellarAccountOffers({ id, label, open })}
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

				{#snippet SectionStellarAccountTrades({ id, label, open })}
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

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-account-related'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-account-transactions',
							label: 'Transactions',
						},
						{
							id: 'stellar-account-signers',
							label: 'Signers',
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

				{#snippet SectionStellarAccountTransactions({ id, label, open })}
					<StellarTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarAccountSigners({ id, label, open })}
					<StellarAccountSignersView
						selection={
							selection.$$signers({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No signers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-account-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-account-timestamps',
							label: 'Timestamps',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarAccountTimestamps({ id, label, open })}
					<StellarAccount_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
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
