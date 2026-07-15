<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AlgorandNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AlgorandNetwork>>
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
	const algorandNetwork = $derived(selection({}))
	const titleFallback = $derived('algorand network')
	const viewDomId = $derived('algorand-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AlgorandNetwork_TimestampsView from '$/views/AlgorandNetwork_TimestampsView.svelte'
	import AlgorandRoundsView from '$/views/AlgorandRoundsView.svelte'
	import AlgorandTransactionsView from '$/views/AlgorandTransactionsView.svelte'
	import AlgorandAccountsView from '$/views/AlgorandAccountsView.svelte'
	import AlgorandAssetsView from '$/views/AlgorandAssetsView.svelte'
	import AlgorandApplicationsView from '$/views/AlgorandApplicationsView.svelte'
	import AlgorandTealProgramsView from '$/views/AlgorandTealProgramsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandNetwork}>
			{#snippet Pending()}
				{title || 'algorand network'}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-algorand-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'algorand-chain-observations',
							label: 'Observations',
						},
						{
							id: 'algorand-chain-rounds',
							label: 'Rounds',
						},
						{
							id: 'algorand-chain-transactions',
							label: 'Transactions',
						},
					]
				}
				data-card
				class='network-view-collapsible-chain-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAlgorandChainObservations({ id, label, open })}
					<AlgorandNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAlgorandChainRounds({ id, label, open })}
					<AlgorandRoundsView
						selection={
							selection.$$rounds({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand rounds.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAlgorandChainTransactions({ id, label, open })}
					<AlgorandTransactionsView
						selection={
							selection.$$transactions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-algorand-accounts-assets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'algorand-accounts',
							label: 'Accounts',
						},
						{
							id: 'algorand-assets',
							label: 'Assets',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-assets'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and assets</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAlgorandAccounts({ id, label, open })}
					<AlgorandAccountsView
						selection={
							selection.$$accounts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAlgorandAssets({ id, label, open })}
					<AlgorandAssetsView
						selection={
							selection.$$assets({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand assets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-algorand-applications'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'algorand-application-list',
							label: 'Applications',
						},
						{
							id: 'algorand-teal-programs',
							label: 'TEAL programs',
						},
					]
				}
				data-card
				class='network-view-collapsible-applications'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Applications</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAlgorandApplicationList({ id, label, open })}
					<AlgorandApplicationsView
						selection={
							selection.$$applications({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand applications.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAlgorandTealPrograms({ id, label, open })}
					<AlgorandTealProgramsView
						selection={
							selection.$$tealPrograms({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Algorand TEAL programs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
