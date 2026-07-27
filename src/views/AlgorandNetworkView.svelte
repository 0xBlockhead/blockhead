<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandNetwork> = $props()

	const titleFallback = 'algorand network'
	const viewDomId = $derived('algorand-network-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand network
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandChainObservations({ id, label, open })}
				<AlgorandNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandChainRounds({ id, label, open })}
				<AlgorandRoundsView
					selection={selection.$$rounds}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandChainTransactions({ id, label, open })}
				<AlgorandTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand transactions.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts and assets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandAccounts({ id, label, open })}
				<AlgorandAccountsView
					selection={selection.$$accounts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand accounts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandAssets({ id, label, open })}
				<AlgorandAssetsView
					selection={selection.$$assets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand assets.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Applications</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandApplicationList({ id, label, open })}
				<AlgorandApplicationsView
					selection={selection.$$applications}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand applications.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandTealPrograms({ id, label, open })}
				<AlgorandTealProgramsView
					selection={selection.$$tealPrograms}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand TEAL programs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
